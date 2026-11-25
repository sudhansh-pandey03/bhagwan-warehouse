import "server-only";
import { withErrorHandler } from "../../common/middleware/error.middleware";
import * as controller from "./auth.controller";

/**
 * The route table, like an Express router. Each entry is re-exported by a
 * `app/api/auth/.../route.ts` file, because Next.js maps URLs to folders.
 * Rate limits live in the controller (login, register, forgot-password,
 * resend-verification, reset-password: 10 per 15 min per IP).
 *
 *   POST /api/auth/register
 *   GET  /api/auth/verify-email/:token
 *   POST /api/auth/resend-verification
 *   POST /api/auth/login
 *   POST /api/auth/refresh-token          (refresh cookie)
 *   POST /api/auth/logout                 (refresh cookie)
 *   POST /api/auth/forgot-password
 *   PUT  /api/auth/reset-password/:token
 *   GET  /api/auth/me                     (Bearer access token)
 */
export const authRoutes = {
  register: { POST: withErrorHandler(controller.register) },
  verifyEmail: { GET: withErrorHandler(controller.verifyEmail) },
  resendVerification: { POST: withErrorHandler(controller.resendVerification) },
  login: { POST: withErrorHandler(controller.login) },
  refreshToken: { POST: withErrorHandler(controller.refreshToken) },
  logout: { POST: withErrorHandler(controller.logout) },
  forgotPassword: { POST: withErrorHandler(controller.forgotPassword) },
  resetPassword: { PUT: withErrorHandler(controller.resetPassword) },
  me: { GET: withErrorHandler(controller.me) },
};
