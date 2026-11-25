import "server-only";
import { query } from "../config/db";
import { ApiError } from "../utils/api-error";

/**
 * Fixed-window rate limit stored in PostgreSQL. On Vercel every request can land on a
 * different serverless instance, so an in-memory counter (like express-rate-limit's
 * default store) would reset constantly; a shared store is required.
 * Each window is one row; a single atomic upsert counts the hit, so parallel requests can't slip past.
 */

/**
 * Client IP. On Vercel `x-forwarded-for` is set by the platform and can't be spoofed;
 * behind another proxy, make sure it overwrites this header.
 */
export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function rateLimit(request: Request, name: string, { limit = 10, windowMs = 15 * 60 * 1000 } = {}) {
  const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
  const key = `${name}:${clientIp(request)}:${windowStart}`;
  const [row] = await query<{ count: number }>(
    `INSERT INTO rate_limit_hits (key, count, expires_at) VALUES ($1, 1, $2)
     ON CONFLICT (key) DO UPDATE SET count = rate_limit_hits.count + 1
     RETURNING count`,
    [key, new Date(windowStart + windowMs)],
  );
  // Now and then, clear out finished windows so the table stays tiny.
  if (Math.random() < 0.02) void query(`DELETE FROM rate_limit_hits WHERE expires_at < now()`).catch(() => {});
  if (row && row.count > limit) throw ApiError.tooMany("Too many attempts. Please wait 15 minutes and try again.");
}
