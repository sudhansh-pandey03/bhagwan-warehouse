"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiRequestError, authApi, hasSessionHint, onSessionExpired, refreshSession, setAccessToken, type AuthUser } from "@/lib/auth-client/api";

type Status = "loading" | "authenticated" | "anonymous";

type AuthContextValue = {
  status: Status;
  user: AuthUser | null;
  /** True right after the user pressed Sign out (protected pages then go home instead of to /login). */
  signedOutByUser: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  /** Asks the server whether the session is still good (refreshing it if needed). */
  revalidate: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ status: Status; user: AuthUser | null; signedOutByUser: boolean }>({ status: "loading", user: null, signedOutByUser: false });
  const signedIn = (user: AuthUser) => setState({ status: "authenticated", user, signedOutByUser: false });
  const signedOut = useCallback((byUser = false) => { setAccessToken(null); setState({ status: "anonymous", user: null, signedOutByUser: byUser }); }, []);

  // On load, silently restore the session from the refresh cookie (only if this browser signed in before).
  useEffect(() => {
    let cancelled = false;
    (hasSessionHint() ? refreshSession() : Promise.resolve(null)).then((user) => {
      if (cancelled) return;
      if (user) signedIn(user); else signedOut();
    });
    return () => { cancelled = true; };
  }, [signedOut]);

  useEffect(() => onSessionExpired(() => signedOut()), [signedOut]);

  // One-time cleanup of the old browser-only "sign in" (name/email/mobile) and its unscoped chats.
  useEffect(() => {
    try {
      window.localStorage.removeItem("bw-partner");
      for (const key of Object.keys(window.localStorage)) if (/^bw-chat:[a-z]+$/.test(key)) window.localStorage.removeItem(key);
    } catch { /* storage blocked */ }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await authApi<{ user: AuthUser; accessToken: string }>("/login", { method: "POST", body: { email, password } });
    setAccessToken(data.accessToken);
    signedIn(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try { await authApi("/logout", { method: "POST" }); } catch { /* still sign out locally */ }
    signedOut(true);
  }, [signedOut]);

  const revalidate = useCallback(async () => {
    try {
      const { data } = await authApi<{ user: AuthUser }>("/me");
      signedIn(data.user);
      return data.user;
    } catch (error) {
      // Only a real "no longer valid" answer signs you out; a network blip keeps the current session.
      if (error instanceof ApiRequestError && [401, 403, 404].includes(error.status)) signedOut();
      return null;
    }
  }, [signedOut]);

  const value = useMemo(() => ({ ...state, login, logout, revalidate }), [state, login, logout, revalidate]);
  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}

export const firstName = (user: Pick<AuthUser, "name">) => user.name.trim().split(/\s+/)[0];
