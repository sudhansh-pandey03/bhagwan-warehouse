import "server-only";
import bcrypt from "bcryptjs";
import { connectDB } from "../../common/config/db";
import { env } from "../../common/config/env";
import { sendResetPasswordEmail, sendVerificationEmail } from "../../common/config/email";
import { ApiError } from "../../common/utils/api-error";
import { generateAccessToken, generateRandomToken, generateRefreshToken, hashToken, verifyRefreshToken } from "../../common/utils/jwt.utils";
import { User, type UserDocument } from "./auth.model";
import type { LoginInput } from "./dto/login.dto";
import type { RegisterInput } from "./dto/register.dto";

/**
 * All auth business logic. Nothing here knows about requests, responses or cookies:
 * the controller passes plain values in and gets plain values back.
 */

const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;
const RESET_TTL_MS = 15 * 60 * 1000;
const INVALID_LOGIN = "Invalid email or password";
export const FORGOT_PASSWORD_MESSAGE = "If that email exists, a reset link has been sent";
export const RESEND_VERIFICATION_MESSAGE = "If that account exists and isn't verified yet, a new verification link has been sent";

/**
 * Compared against when the email doesn't exist, so a wrong email takes as long as a wrong
 * password (no account probing by timing). Cost 12 like real hashes; matches no known password.
 */
const DUMMY_HASH = "$2b$12$5pymwCBnhF/FtKiNRl5J9uNXObg5wOXFTNsKnl4ycfRG.dTlPpKP2";

export type PublicUser = { id: string; name: string; email: string; role: string; isVerified: boolean; createdAt: Date; updatedAt: Date };
export type Session = { user: PublicUser; accessToken: string; refreshToken: string };

const toPublic = (user: UserDocument) => user.toJSON() as unknown as PublicUser;
const link = (path: string, rawToken: string) => `${env().CLIENT_URL}/${path}/${rawToken}`;

/** Email failures are logged, never thrown: the account change already happened and the user can ask for a new link. */
async function sendSafely(what: string, send: () => Promise<void>) {
  try {
    await send();
  } catch (error) {
    console.error(`[auth] Could not send ${what} email:`, error);
  }
}

/** Issues a fresh access + refresh pair and stores only the refresh token's hash. */
async function startSession(user: UserDocument): Promise<Session> {
  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });
  user.refreshToken = hashToken(refreshToken);
  await user.save();
  return { user: toPublic(user), accessToken, refreshToken };
}

export async function register(input: RegisterInput): Promise<PublicUser> {
  await connectDB();
  if (await User.exists({ email: input.email })) throw ApiError.conflict("An account with this email already exists");

  const { rawToken, hashedToken } = generateRandomToken();
  const user = await User.create({
    name: input.name,
    email: input.email,
    password: input.password,
    role: input.role,
    verificationToken: hashedToken,
    verificationExpires: new Date(Date.now() + VERIFY_TTL_MS),
  });

  await sendSafely("verification", () => sendVerificationEmail(user.email, user.name, link("verify-email", rawToken)));
  return toPublic(user);
}

export async function verifyEmail(rawToken: string): Promise<void> {
  await connectDB();
  const user = await User.findOne({ verificationToken: hashToken(rawToken), verificationExpires: { $gt: new Date() } });
  if (!user) throw ApiError.badRequest("Invalid or expired verification token");
  user.isVerified = true;
  user.verificationToken = null;
  user.verificationExpires = null;
  await user.save();
}

export async function resendVerification(email: string): Promise<void> {
  await connectDB();
  const user = await User.findOne({ email });
  if (!user || user.isVerified) return; // same answer either way: never reveal whether the account exists
  const { rawToken, hashedToken } = generateRandomToken();
  user.verificationToken = hashedToken;
  user.verificationExpires = new Date(Date.now() + VERIFY_TTL_MS);
  await user.save();
  await sendSafely("verification", () => sendVerificationEmail(user.email, user.name, link("verify-email", rawToken)));
}

export async function login({ email, password }: LoginInput): Promise<Session> {
  await connectDB();
  const user = await User.findOne({ email }).select("+password");
  const passwordOk = user ? await user.comparePassword(password) : await bcrypt.compare(password, DUMMY_HASH);
  if (!user || !passwordOk) throw ApiError.unauthorized(INVALID_LOGIN);
  if (!user.isVerified) throw ApiError.forbidden("Please verify your email before signing in. Check your inbox for the link.");
  return startSession(user);
}

/**
 * Rotates the refresh token. If the presented token is valid but isn't the one on file,
 * it was already used (stolen, or replayed), so the stored session is wiped and everyone
 * holding a token for this account has to sign in again.
 */
export async function refresh(rawRefreshToken: string | undefined): Promise<Session> {
  if (!rawRefreshToken) throw ApiError.unauthorized("No session, please sign in");
  const payload = verifyRefreshToken(rawRefreshToken); // throws JWT errors -> 401
  await connectDB();
  const user = await User.findById(payload.id).select("+refreshToken");
  if (!user) throw ApiError.unauthorized("No session, please sign in");
  if (!user.refreshToken || user.refreshToken !== hashToken(rawRefreshToken)) {
    if (user.refreshToken) {
      user.refreshToken = null;
      await user.save();
    }
    throw ApiError.unauthorized("Your session is no longer valid, please sign in again");
  }
  return startSession(user);
}

/** Works with only the refresh cookie (the access token may already be expired). */
export async function logout(rawRefreshToken: string | undefined): Promise<void> {
  if (!rawRefreshToken) return;
  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    return; // invalid or expired cookie: nothing to revoke, the controller still clears it
  }
  await connectDB();
  // Only revoke if this is the current token, so a stale cookie can't sign out a newer session.
  await User.updateOne({ _id: payload.id, refreshToken: hashToken(rawRefreshToken) }, { $set: { refreshToken: null } });
}

export async function forgotPassword(email: string): Promise<void> {
  await connectDB();
  const user = await User.findOne({ email });
  if (!user) return;
  const { rawToken, hashedToken } = generateRandomToken();
  user.resetPasswordToken = hashedToken;
  user.resetPasswordExpires = new Date(Date.now() + RESET_TTL_MS);
  await user.save();
  await sendSafely("password reset", () => sendResetPasswordEmail(user.email, user.name, link("reset-password", rawToken)));
}

export async function resetPassword(rawToken: string, password: string): Promise<void> {
  await connectDB();
  const user = await User.findOne({ resetPasswordToken: hashToken(rawToken), resetPasswordExpires: { $gt: new Date() } });
  if (!user) throw ApiError.badRequest("Invalid or expired reset token");
  user.password = password; // the pre-save hook hashes it
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  user.refreshToken = null; // signs out every existing session
  user.passwordChangedAt = new Date(); // and makes already-issued access tokens stop working
  // Whoever can read the inbox has now proven they own it.
  if (!user.isVerified) {
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationExpires = null;
  }
  await user.save();
}

export async function getProfile(id: string): Promise<PublicUser> {
  await connectDB();
  const user = await User.findById(id);
  if (!user) throw ApiError.notFound("User not found");
  return toPublic(user);
}
