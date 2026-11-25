"use client";

import Link from "next/link";
import { LayoutGrid, UserRound } from "lucide-react";
import { firstName, useAuth } from "@/components/auth/auth-provider";
import "./service-partner.css";

/**
 * Navbar "Service Partner" button. Signed out: goes to sign in (and back to Facilities Handling after).
 * Signed in: becomes a shortcut to Facilities Handling with the partner's first name.
 */
export function ServicePartner() {
  const { status, user } = useAuth();

  if (status === "authenticated" && user) return <Link className="partner-trigger" href="/facilities-handling" aria-label={`Facilities Handling for ${user.name}`}>
    <span className="partner-trigger-icon" aria-hidden="true"><LayoutGrid size={16} strokeWidth={2.1} /></span>
    <span className="partner-trigger-label">Hi, {firstName(user)}</span>
  </Link>;

  return <Link className="partner-trigger" href="/login?next=%2Ffacilities-handling">
    <span className="partner-trigger-icon" aria-hidden="true"><UserRound size={16} strokeWidth={2.1} /></span>
    <span className="partner-trigger-label">Service Partner</span>
  </Link>;
}
