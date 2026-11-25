import { Suspense } from "react";
import type { Metadata } from "next";
import { VerifyEmail } from "@/components/auth/auth-forms";

export const metadata: Metadata = { title: "Verify email", robots: { index: false, follow: false }, referrer: "no-referrer" };

/** One-time email links: render at request time (the shared header reads the URL, which is unknown at build). */
export const instant = false;

type Params = Promise<{ token: string }>;

/** The token is only known at request time; with Cache Components that read must sit inside <Suspense>. */
async function WithToken({ params }: { params: Params }) {
  const { token } = await params;
  return <VerifyEmail token={token} />;
}

export default function VerifyEmailPage({ params }: { params: Params }) {
  return <Suspense fallback={<div className="fh-shell" aria-busy="true" />}><WithToken params={params} /></Suspense>;
}
