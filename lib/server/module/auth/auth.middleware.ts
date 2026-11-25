import "server-only";
import { ApiError } from "../../common/utils/api-error";
import { verifyAccessToken } from "../../common/utils/jwt.utils";
import { findForAuth } from "./auth.model";
import type { Role } from "./auth.roles";

export type AuthUser = { id: string; role: Role; name: string; email: string };

/**
 * Next.js version of Express `authenticate`: reads `Authorization: Bearer <accessToken>`,
 * verifies it, and makes sure the user still exists. Returns what Express would put on `req.user`.
 */
export async function authenticate(request: Request): Promise<AuthUser> {
  const header = request.headers.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) throw ApiError.unauthorized("Please sign in to continue");

  const payload = verifyAccessToken(token); // throws JWT errors -> 401
  const user = await findForAuth(payload.id);
  if (!user) throw ApiError.unauthorized("This account no longer exists");
  if (user.passwordChangedAt && (payload.iat ?? 0) < Math.floor(user.passwordChangedAt.getTime() / 1000)) {
    throw ApiError.unauthorized("Your password was changed, please sign in again");
  }
  return { id: user.id, role: user.role, name: user.name, email: user.email };
}

/** Usage: `const user = await authenticate(request); authorize(user, "admin");` */
export function authorize(user: AuthUser, ...roles: Role[]): void {
  if (!roles.includes(user.role)) throw ApiError.forbidden("You do not have permission to perform this action");
}
