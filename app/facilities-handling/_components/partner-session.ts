"use client";

import { useMemo, useSyncExternalStore } from "react";

/**
 * The Service Partner "session" lives only in this browser (localStorage).
 * It is not a real login: there is no server account, so anyone on this device
 * who filled the Service Partner form is treated as signed in.
 */
export type Partner = { fullName: string; email: string; mobile: string | null; signedInAt: number };

const KEY = "bw-partner";
const CHANGE_EVENT = "bw:partner-change";
/** Fire this on window to open the Service Partner sign-in card from anywhere. */
export const OPEN_PARTNER_EVENT = "bw:open-partner";

function read(): string | null {
  try { return window.localStorage.getItem(KEY); } catch { return null; }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => { window.removeEventListener("storage", onChange); window.removeEventListener(CHANGE_EVENT, onChange); };
}

export function savePartner(partner: Omit<Partner, "signedInAt">) {
  try { window.localStorage.setItem(KEY, JSON.stringify({ ...partner, signedInAt: Date.now() })); } catch { /* storage blocked */ }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function signOutPartner() {
  try { window.localStorage.removeItem(KEY); } catch { /* storage blocked */ }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function openPartnerSignIn() {
  window.dispatchEvent(new Event(OPEN_PARTNER_EVENT));
}

/** `undefined` while loading (server render and hydration), then the partner or `null`. */
export function usePartner(): Partner | null | undefined {
  const raw = useSyncExternalStore(subscribe, read, () => undefined);
  return useMemo(() => {
    if (raw === undefined) return undefined;
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as Partner;
      return parsed?.fullName ? parsed : null;
    } catch { return null; }
  }, [raw]);
}

export const firstName = (partner: Partner) => partner.fullName.trim().split(/\s+/)[0];
