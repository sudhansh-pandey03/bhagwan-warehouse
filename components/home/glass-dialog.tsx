"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { X } from "lucide-react";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type GlassDialogProps = {
  state: "open" | "closing";
  onClose: () => void;
  labelledBy: string;
  describedBy: string;
  /** Element to focus again after the dialog closes, usually the button that opened it. */
  returnFocusRef?: RefObject<HTMLElement | null>;
  children: ReactNode;
};

/**
 * Accessible modal shell with the glass look: dark overlay, focus trap, Escape and
 * outside-click to close, background scroll lock, and focus returned to the trigger.
 * Render it in a portal; unmount it after the closing animation.
 */
export function GlassDialog({ state, onClose, labelledBy, describedBy, returnFocusRef, children }: GlassDialogProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; });

  useEffect(() => {
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    const returnFocusTo = returnFocusRef?.current ?? null;
    root.style.overflow = "hidden";
    // Set initial focus here rather than relying on autoFocus alone: in development React runs
    // effects twice, and the first cleanup returns focus to the trigger.
    const card = cardRef.current;
    if (card && !card.contains(document.activeElement)) (card.querySelector<HTMLElement>("input:not([disabled])") ?? card.querySelector<HTMLElement>("button:not([disabled])"))?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onCloseRef.current(); return; }
      if (event.key !== "Tab" || !cardRef.current) return;
      const items = [...cardRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      root.style.overflow = previousOverflow;
      returnFocusTo?.focus();
    };
  }, [returnFocusRef]);

  return <div className="sp-overlay" data-state={state} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div ref={cardRef} className="sp-card" role="dialog" aria-modal="true" aria-labelledby={labelledBy} aria-describedby={describedBy}>
      <button className="sp-close" type="button" aria-label="Close" onClick={onClose}><X size={18} aria-hidden="true" /></button>
      {children}
    </div>
  </div>;
}
