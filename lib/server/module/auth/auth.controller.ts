import "server-only";
import type { NextRequest } from "next/server";
import { errorResponse } from "../../common/middleware/error.middleware";
import { rateLimit } from "../../common/middleware/rate-limit.middleware";
import { validate } from "../../common/middleware/validate.middleware";
import { ApiError } from "../../common/utils/api-error";
import { ApiResponse } from "../../common/utils/api-response";
import { clearRefreshCookie, REFRESH_COOKIE, setRefreshCookie } from "./auth.cookie";
import { authenticate } from "./auth.middleware";
import * as authService from "./auth.service";
import { ForgotPasswordDto, type EmailInput } from "./dto/forgot-password.dto";
import { LoginDto, type LoginInput } from "./dto/login.dto";
import { RegisterDto, type RegisterInput } from "./dto/register.dto";
import { ResetPasswordDto, type ResetPasswordInput } from "./dto/reset-password.dto";

/** Thin layer: read the request, call the service, shape the response. */

type TokenContext = { params: Promise<{ token: string }> };

/** Tokens are 64 hex characters; anything else can't match, so skip the database. */
async function readToken({ params }: TokenContext, message: string): Promise<string> {
  const { token } = await params;
  if (!/^[a-f0-9]{64}$/.test(token)) throw ApiError.badRequest(message);
  return token;
}

const refreshCookie = (request: NextRequest) => request.cookies.get(REFRESH_COOKIE)?.value;

export async function register(request: NextRequest) {
  await rateLimit(request, "register");
  const input = await validate<RegisterInput>(RegisterDto, request);
  const user = await authService.register(input);
  return ApiResponse.created("Account created. Check your email for a link to verify it.", { user });
}

export async function verifyEmail(_request: NextRequest, context: TokenContext) {
  const token = await readToken(context, "Invalid or expired verification token");
  await authService.verifyEmail(token);
  return ApiResponse.ok("Email verified. You can sign in now.");
}

export async function resendVerification(request: NextRequest) {
  await rateLimit(request, "resend-verification");
  const { email } = await validate<EmailInput>(ForgotPasswordDto, request);
  await authService.resendVerification(email);
  return ApiResponse.ok(authService.RESEND_VERIFICATION_MESSAGE);
}

export async function login(request: NextRequest) {
  await rateLimit(request, "login");
  const input = await validate<LoginInput>(LoginDto, request);
  const { user, accessToken, refreshToken } = await authService.login(input);
  const response = ApiResponse.ok("Signed in", { user, accessToken });
  setRefreshCookie(response, refreshToken);
  return response;
}

export async function refreshToken(request: NextRequest) {
  try {
    const { user, accessToken, refreshToken } = await authService.refresh(refreshCookie(request));
    const response = ApiResponse.ok("Session refreshed", { user, accessToken });
    setRefreshCookie(response, refreshToken);
    return response;
  } catch (error) {
    // A refresh that fails for an auth reason (bad, expired or reused token) also drops the dead cookie.
    const response = errorResponse(error);
    if (response.status === 401) clearRefreshCookie(response);
    return response;
  }
}

export async function logout(request: NextRequest) {
  await authService.logout(refreshCookie(request));
  const response = ApiResponse.ok("Signed out");
  clearRefreshCookie(response);
  return response;
}

export async function forgotPassword(request: NextRequest) {
  await rateLimit(request, "forgot-password");
  const { email } = await validate<EmailInput>(ForgotPasswordDto, request);
  await authService.forgotPassword(email);
  return ApiResponse.ok(authService.FORGOT_PASSWORD_MESSAGE);
}

export async function resetPassword(request: NextRequest, context: TokenContext) {
  await rateLimit(request, "reset-password");
  const token = await readToken(context, "Invalid or expired reset token");
  const { password } = await validate<ResetPasswordInput>(ResetPasswordDto, request);
  await authService.resetPassword(token, password);
  const response = ApiResponse.ok("Password updated. Please sign in with your new password.");
  clearRefreshCookie(response); // this browser's old session is dead too
  return response;
}

export async function me(request: NextRequest) {
  const { id } = await authenticate(request);
  const user = await authService.getProfile(id);
  return ApiResponse.ok("Profile", { user });
}
