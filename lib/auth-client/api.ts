/**
 * Browser-side client for /api/auth.
 *
 * - The access token lives only in this module's memory (never localStorage), so a script
 *   injected into the page can't read a stored copy, and it disappears when the tab closes.
 * - Every request sends cookies (`credentials: "include"`) so the httpOnly refresh cookie reaches /api/auth.
 * - On a 401 the client refreshes once, retries the request, and reports the session as expired if
 *   the refresh fails. Requests that hit a 401 while a refresh is running wait for that same refresh.
 */

export type AuthUser = { id: string; name: string; email: string; role: "partner" | "admin"; isVerified: boolean; createdAt: string; updatedAt: string };
type Envelope<T> = { success: boolean; message: string; data: T };

export class ApiRequestError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "ApiRequestError";
  }
}

let accessToken: string | null = null;
let refreshing: Promise<AuthUser | null> | null = null;
const expiredListeners = new Set<() => void>();

export const setAccessToken = (token: string | null) => { accessToken = token; };

/** Called when a session can't be recovered (refresh failed), so the UI can send the user to sign in. */
export function onSessionExpired(listener: () => void) {
  expiredListeners.add(listener);
  return () => { expiredListeners.delete(listener); };
}

async function parse<T>(response: Response): Promise<Envelope<T>> {
  try {
    return (await response.json()) as Envelope<T>;
  } catch {
    return { success: false, message: response.ok ? "" : "Something went wrong, please try again", data: null as T };
  }
}

/** Exchanges the refresh cookie for a new access token. Concurrent callers share one request. */
export function refreshSession(): Promise<AuthUser | null> {
  refreshing ??= (async () => {
    try {
      const response = await fetch("/api/auth/refresh-token", { method: "POST", credentials: "include" });
      const body = await parse<{ user: AuthUser; accessToken: string } | null>(response);
      if (!response.ok || !body.data) { setAccessToken(null); return null; }
      setAccessToken(body.data.accessToken);
      return body.data.user;
    } catch {
      return null; // offline: keep whatever token we had
    } finally {
      refreshing = null;
    }
  })();
  return refreshing;
}

type Options = { method?: "GET" | "POST" | "PUT"; body?: unknown };

/** Calls `/api/auth${path}`. Resolves with `{ message, data }` or throws `ApiRequestError`. */
export async function authApi<T = unknown>(path: string, { method = "GET", body }: Options = {}, retried = false): Promise<{ message: string; data: T }> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let response: Response;
  try {
    response = await fetch(`/api/auth${path}`, { method, headers, credentials: "include", body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new ApiRequestError("Network problem. Please check your connection and try again.", 0);
  }

  // Only requests made with an access token are worth refreshing; a wrong password is also a 401.
  if (response.status === 401 && headers.Authorization && !retried) {
    const user = await refreshSession();
    if (user) return authApi<T>(path, { method, body }, true);
    expiredListeners.forEach((listener) => listener());
  }

  const parsed = await parse<T>(response);
  if (!response.ok || !parsed.success) throw new ApiRequestError(parsed.message || "Something went wrong, please try again", response.status);
  return { message: parsed.message, data: parsed.data };
}

/** Set by the server next to the httpOnly refresh cookie. It holds no secret; it just says "try to restore a session". */
export const hasSessionHint = () => typeof document !== "undefined" && /(?:^|;\s*)bw_signed_in=1(?:;|$)/.test(document.cookie);

/** Only same-site paths are allowed as a post-login destination (blocks `//evil.com` and `https://…`). */
export function safeNextPath(value: string | null | undefined, fallback = "/facilities-handling"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
