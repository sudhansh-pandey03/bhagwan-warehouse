import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Sign in", description: "Service Partner sign in for Bhagwan Warehousing & Dispatch.", robots: { index: false, follow: false } };

/** Reads ?next= on the client, so it sits inside <Suspense> (required with Cache Components). */
export default function LoginPage() {
  return <Suspense fallback={<div className="fh-shell" aria-busy="true" />}><LoginForm /></Suspense>;
}
