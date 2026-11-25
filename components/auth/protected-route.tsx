"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, ShieldAlert } from "lucide-react";
import type { AuthUser } from "@/lib/auth-client/api";
import { useAuth } from "./auth-provider";
import "@/app/facilities-handling/_components/facilities.css";

/**
 * Shows `children` only to a signed-in user (and, if `roles` is given, only to those roles).
 * Anyone else is sent to /login and brought back here afterwards.
 *
 * This guards the screen; the real protection is on the server: every API that returns
 * private data must call `authenticate()` (and `authorize()` for roles).
 */
export function ProtectedRoute({ roles, children }: { roles?: AuthUser["role"][]; children: (user: AuthUser) => ReactNode }) {
  const { status, user, signedOutByUser, revalidate } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const checked = useRef(false);

  useEffect(() => {
    if (status === "anonymous") {
      if (signedOutByUser) router.replace("/");
      else router.replace(`/login?next=${encodeURIComponent(pathname + window.location.search)}`);
    }
    // Confirm with the server once per visit (catches a password reset or a deleted account).
    if (status === "authenticated" && !checked.current) {
      checked.current = true;
      void revalidate();
    }
  }, [status, signedOutByUser, pathname, router, revalidate]);

  if (status !== "authenticated" || !user) {
    return <div className="fh-shell fh-center"><LoaderCircle className="fh-spin" size={28} aria-label={status === "anonymous" ? "Taking you to sign in" : "Loading"} /></div>;
  }

  if (roles && !roles.includes(user.role)) {
    return <div className="fh-shell fh-center">
      <div className="fh-gate">
        <span className="fh-gate-icon" aria-hidden="true"><ShieldAlert size={24} /></span>
        <p className="fh-kicker">No access</p>
        <h1>This area isn&apos;t<br /><em>open to you.</em></h1>
        <p>You do not have permission to view this page.</p>
        <div className="fh-gate-actions"><Link className="fh-btn fh-btn-glass" href="/"><ArrowLeft size={17} aria-hidden="true" /> Back to home</Link></div>
      </div>
    </div>;
  }

  return <>{children(user)}</>;
}
