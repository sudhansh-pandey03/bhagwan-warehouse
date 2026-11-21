"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { LayoutGrid, UserRound } from "lucide-react";
import { firstName, OPEN_PARTNER_EVENT, usePartner } from "@/app/facilities-handling/_components/partner-session";
import { GlassDialog } from "./glass-dialog";
import { PartnerSignInForm } from "./partner-sign-in-form";
import "./service-partner.css";

const CLOSE_ANIMATION_MS = 240;

/**
 * Navbar "Service Partner" button that opens the glass partner sign-in card.
 * Once the partner has signed in on this device it becomes a link to Facilities Handling.
 */
export function ServicePartner() {
  const [phase, setPhase] = useState<"closed" | "open" | "closing">("closed");
  const closeTimer = useRef<number | undefined>(undefined);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const partner = usePartner();
  const titleId = useId();
  const descriptionId = useId();

  const open = () => { window.clearTimeout(closeTimer.current); setPhase("open"); };
  const close = useCallback(() => {
    setPhase((current) => (current === "open" ? "closing" : current));
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setPhase("closed"), CLOSE_ANIMATION_MS);
  }, []);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);
  // Other pages (e.g. the Facilities Handling sign-in gate) can ask for the card to open.
  useEffect(() => {
    const onOpen = () => { window.clearTimeout(closeTimer.current); setPhase("open"); };
    window.addEventListener(OPEN_PARTNER_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_PARTNER_EVENT, onOpen);
  }, []);

  return <>
    {partner && phase === "closed" ? <Link className="partner-trigger" href="/facilities-handling" aria-label={`Facilities Handling for ${partner.fullName}`}>
      <span className="partner-trigger-icon" aria-hidden="true"><LayoutGrid size={16} strokeWidth={2.1} /></span>
      <span className="partner-trigger-label">Hi, {firstName(partner)}</span>
    </Link> : <button ref={triggerRef} className="partner-trigger" type="button" aria-haspopup="dialog" aria-expanded={phase === "open"} onClick={open}>
      <span className="partner-trigger-icon" aria-hidden="true"><UserRound size={16} strokeWidth={2.1} /></span>
      <span className="partner-trigger-label">Service Partner</span>
    </button>}
    {phase !== "closed" && createPortal(
      <GlassDialog state={phase} onClose={close} labelledBy={titleId} describedBy={descriptionId} returnFocusRef={triggerRef}>
        <PartnerSignInForm titleId={titleId} descriptionId={descriptionId} onDone={close} />
      </GlassDialog>,
      document.body,
    )}
  </>;
}
