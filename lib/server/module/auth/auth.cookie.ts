import "server-only";
import type { NextResponse } from "next/server";
import { env } from "../../common/config/env";

export const REFRESH_COOKIE = "bw_refresh";
/**
 * Not a secret: just tells the browser "a session probably exists", so the site only tries
 * to restore a session for people who signed in. The refresh cookie itself is httpOnly and
 * scoped to /api/auth, so page JavaScript can't see it.
 */
export const SESSION_HINT_COOKIE = "bw_signed_in";

const MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

/** One shared options object, used to both set and clear, so the browser always matches them up. */
function refreshCookieOptions() {
  const { isProduction, COOKIE_SAMESITE } = env();
  return { httpOnly: true, secure: isProduction, sameSite: COOKIE_SAMESITE, path: "/api/auth", maxAge: MAX_AGE_SECONDS } as const;
}

function hintCookieOptions() {
  const { isProduction, COOKIE_SAMESITE } = env();
  return { httpOnly: false, secure: isProduction, sameSite: COOKIE_SAMESITE, path: "/", maxAge: MAX_AGE_SECONDS } as const;
}

export function setRefreshCookie(response: NextResponse, token: string) {
  response.cookies.set(REFRESH_COOKIE, token, refreshCookieOptions());
  response.cookies.set(SESSION_HINT_COOKIE, "1", hintCookieOptions());
}

export function clearRefreshCookie(response: NextResponse) {
  response.cookies.set(REFRESH_COOKIE, "", { ...refreshCookieOptions(), maxAge: 0 });
  response.cookies.set(SESSION_HINT_COOKIE, "", { ...hintCookieOptions(), maxAge: 0 });
}
