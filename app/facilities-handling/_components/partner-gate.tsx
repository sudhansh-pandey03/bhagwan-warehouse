"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, LoaderCircle, LockKeyhole, UserRound } from "lucide-react";
import { openPartnerSignIn, usePartner, type Partner } from "./partner-session";
import "./facilities.css";

/** Shows the page only to someone who has filled the Service Partner form on this device. */
export function PartnerGate({ children }: { children: (partner: Partner) => ReactNode }) {
  const partner = usePartner();

  if (partner === undefined) return <div className="fh-shell fh-center"><LoaderCircle className="fh-spin" size={28} aria-label="Loading" /></div>;

  if (!partner) return <div className="fh-shell fh-center">
    <div className="fh-gate">
      <span className="fh-gate-icon" aria-hidden="true"><LockKeyhole size={24} /></span>
      <p className="fh-kicker">Service Partners only</p>
      <h1>Sign in to open<br /><em>Facilities Handling.</em></h1>
      <p>Use the Service Partner card to share your details. You will come straight back here.</p>
      <div className="fh-gate-actions">
        <button type="button" className="fh-btn fh-btn-gold" onClick={openPartnerSignIn}><UserRound size={17} aria-hidden="true" /> Service Partner sign in</button>
        <Link className="fh-btn fh-btn-glass" href="/"><ArrowLeft size={17} aria-hidden="true" /> Back to home</Link>
      </div>
    </div>
  </div>;

  return <>{children(partner)}</>;
}
