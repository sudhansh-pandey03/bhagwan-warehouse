import "server-only";
import { query } from "../../common/config/db";
import { env } from "../../common/config/env";
import { sendResetPasswordEmail, sendVerificationEmail } from "../../common/config/email";
import { ApiError } from "../../common/utils/api-error";
import { generateAccessToken, generateRandomToken, generateRefreshToken, hashToken, verifyRefreshToken } from "../../common/utils/jwt.utils";
import {
  comparePassword, createUser, emailExists, findForLogin, findPublicById, hashPassword, isUserId,
  PUBLIC_COLUMNS, toPublicUser, type PublicUser,
} from "./auth.model";
import type { LoginInput } from "./dto/login.dto";
import type { RegisterInput } from "./dto/register.dto";

/**
 * All auth business logic. Nothing here knows about requests, responses or cookies:
 * the controller passes plain values in and gets plain values back.
 *
 * Every "check a token, then change the row" step is a single UPDATE … WHERE … RETURNING,
 * so two requests racing with the same token can't both succeed.
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

export type { PublicUser };
export type Session = { user: PublicUser; accessToken: string; refreshToken: string };

const link = (path: string, rawToken: string) => `${env().CLIENT_URL}/${path}/${rawToken}`;

/** Email failures are logged, never thrown: the account change already happened and the user can ask for a new link. */
async function sendSafely(what: string, send: () => Promise<void>) {
  try {
    await send();
  } catch (error) {
    console.error(`[auth] Could not send ${what} email:`, error);
  }
}

function newTokens(user: PublicUser) {
  return { accessToken: generateAccessToken({ id: user.id, role: user.role }), refreshToken: generateRefreshToken({ id: user.id }) };
}

export async function register(input: RegisterInput): Promise<PublicUser> {
  if (await emailExists(input.email)) throw ApiError.conflict("An account with this email already exists");
  const { rawToken, hashedToken } = generateRandomToken();
  // A unique-email race between two requests is caught by the database (23505 -> 409).
  const user = await createUser({
    name: input.name,
    email: input.email,
    passwordHash: await hashPassword(input.password),
    role: input.role,
    verificationToken: hashedToken,
    verificationExpires: new Date(Date.now() + VERIFY_TTL_MS),
  });
  await sendSafely("verification", () => sendVerificationEmail(user.email, user.name, link("verify-email", rawToken)));
  return user;
}

export async function verifyEmail(rawToken: string): Promise<void> {
  const rows = await query(
    `UPDATE users SET is_verified = true, verification_token = NULL, verification_expires = NULL, updated_at = now()
     WHERE verification_token = $1 AND verification_expires > now() RETURNING id`,
    [hashToken(rawToken)],
  );
  if (!rows.length) throw ApiError.badRequest("Invalid or expired verification token");
}

export async function resendVerification(email: string): Promise<void> {
  const { rawToken, hashedToken } = generateRandomToken();
  // Only unverified accounts get a new link; the caller answers the same way either way.
  const [row] = await query<{ email: string; name: string }>(
    `UPDATE users SET verification_token = $2, verification_expires = $3, updated_at = now()
     WHERE email = $1 AND is_verified = false RETURNING email, name`,
    [email, hashedToken, new Date(Date.now() + VERIFY_TTL_MS)],
  );
  if (row) await sendSafely("verification", () => sendVerificationEmail(row.email, row.name, link("verify-email", rawToken)));
}

export async function login({ email, password }: LoginInput): Promise<Session> {
  const user = await findForLogin(email);
  const passwordOk = await comparePassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !passwordOk) throw ApiError.unauthorized(INVALID_LOGIN);
  if (!user.isVerified) throw ApiError.forbidden("Please verify your email before signing in. Check your inbox for the link.");

  const publicUser: PublicUser = { id: user.id, name: user.name, email: user.email, role: user.role, isVerified: user.isVerified, createdAt: user.createdAt, updatedAt: user.updatedAt };
  const tokens = newTokens(publicUser);
  await query(`UPDATE users SET refresh_token = $2, updated_at = now() WHERE id = $1`, [user.id, hashToken(tokens.refreshToken)]);
  return { user: publicUser, ...tokens };
}

/**
 * Rotates the refresh token. The swap only happens if the presented token is the one on file.
 * If it's valid but not on file, it was already used (stolen or replayed), so the stored
 * session is wiped and everyone holding a token for this account has to sign in again.
 */
export async function refresh(rawRefreshToken: string | undefined): Promise<Session> {
  if (!rawRefreshToken) throw ApiError.unauthorized("No session, please sign in");
  const payload = verifyRefreshToken(rawRefreshToken); // throws JWT errors -> 401
  if (!isUserId(payload.id)) throw ApiError.unauthorized("No session, please sign in");

  const current = await findPublicById(payload.id);
  if (!current) throw ApiError.unauthorized("No session, please sign in");

  const tokens = newTokens(current);
  const [row] = await query<Parameters<typeof toPublicUser>[0]>(
    `UPDATE users SET refresh_token = $3, updated_at = now() WHERE id = $1 AND refresh_token = $2 RETURNING ${PUBLIC_COLUMNS}`,
    [payload.id, hashToken(rawRefreshToken), hashToken(tokens.refreshToken)],
  );
  if (!row) {
    await query(`UPDATE users SET refresh_token = NULL, updated_at = now() WHERE id = $1 AND refresh_token IS NOT NULL`, [payload.id]);
    throw ApiError.unauthorized("Your session is no longer valid, please sign in again");
  }
  return { user: toPublicUser(row), ...tokens };
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
  if (!isUserId(payload.id)) return;
  // Only revoke if this is the current token, so a stale cookie can't sign out a newer session.
  await query(`UPDATE users SET refresh_token = NULL, updated_at = now() WHERE id = $1 AND refresh_token = $2`, [payload.id, hashToken(rawRefreshToken)]);
}

export async function forgotPassword(email: string): Promise<void> {
  const { rawToken, hashedToken } = generateRandomToken();
  const [row] = await query<{ email: string; name: string }>(
    `UPDATE users SET reset_password_token = $2, reset_password_expires = $3, updated_at = now()
     WHERE email = $1 RETURNING email, name`,
    [email, hashedToken, new Date(Date.now() + RESET_TTL_MS)],
  );
  if (row) await sendSafely("password reset", () => sendResetPasswordEmail(row.email, row.name, link("reset-password", rawToken)));
}

export async function resetPassword(rawToken: string, password: string): Promise<void> {
  const passwordHash = await hashPassword(password);
  // Also: sign out every session (refresh_token), stop already-issued access tokens (password_changed_at),
  // and mark the email verified, since whoever can read the inbox has proven they own it.
  const rows = await query(
    `UPDATE users SET password = $2, reset_password_token = NULL, reset_password_expires = NULL, refresh_token = NULL,
       password_changed_at = now(), is_verified = true, verification_token = NULL, verification_expires = NULL, updated_at = now()
     WHERE reset_password_token = $1 AND reset_password_expires > now() RETURNING id`,
    [hashToken(rawToken), passwordHash],
  );
  if (!rows.length) throw ApiError.badRequest("Invalid or expired reset token");
}

export async function getProfile(id: string): Promise<PublicUser> {
  const user = await findPublicById(id);
  if (!user) throw ApiError.notFound("User not found");
  return user;
}
