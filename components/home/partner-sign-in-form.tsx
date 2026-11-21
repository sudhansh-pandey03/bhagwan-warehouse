"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Handshake, LoaderCircle, Mail, Phone, UserRound } from "lucide-react";
import { savePartner } from "@/app/facilities-handling/_components/partner-session";
import { FloatingField } from "./floating-field";
import { submitPartnerRequest, type PartnerChannel } from "./partner-api";
import { normalizeIndianMobile, PARTNER_FIELD_ORDER, validatePartner, type PartnerField, type PartnerFields } from "./partner-validation";

type Status = "idle" | "submitting" | "success";

const AFTER_SIGN_IN = "/facilities-handling";
const REDIRECT_DELAY_MS = 2200;

export function PartnerSignInForm({ titleId, descriptionId, onDone }: { titleId: string; descriptionId: string; onDone: () => void }) {
  const [values, setValues] = useState<PartnerFields>({ fullName: "", email: "", mobile: "" });
  const [touched, setTouched] = useState<Partial<Record<PartnerField, boolean>>>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [channel, setChannel] = useState<PartnerChannel>("api");
  const [formError, setFormError] = useState("");
  const [shakes, setShakes] = useState(0);
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const mobileRef = useRef<HTMLInputElement>(null);
  const refs = { fullName: fullNameRef, email: emailRef, mobile: mobileRef };
  const router = useRouter();
  const goToFacilities = () => { onDone(); router.push(AFTER_SIGN_IN); };
  const goRef = useRef(goToFacilities);
  useEffect(() => { goRef.current = goToFacilities; });

  // After a successful sign-in, take the partner to the Facilities Handling pages.
  useEffect(() => {
    if (status !== "success") return;
    const timer = window.setTimeout(() => goRef.current(), REDIRECT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  const errors = validatePartner(values);
  const visibleError = (field: PartnerField) => (attempted || touched[field] ? errors[field] : undefined);
  const update = (field: PartnerField) => (value: string) => setValues((current) => ({ ...current, [field]: value }));
  const markTouched = (field: PartnerField) => () => { if (values[field].trim()) setTouched((current) => ({ ...current, [field]: true })); };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setAttempted(true);
    setFormError("");
    const firstInvalid = PARTNER_FIELD_ORDER.find((field) => errors[field]);
    if (firstInvalid) {
      refs[firstInvalid].current?.focus();
      setShakes((count) => count + 1);
      return;
    }
    setStatus("submitting");
    const request = {
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      mobile: values.mobile.trim() ? normalizeIndianMobile(values.mobile) : null,
    };
    const result = await submitPartnerRequest(request);
    if (result.ok) {
      savePartner(request);
      setChannel(result.channel);
      setStatus("success");
    } else {
      setFormError(result.message);
      setStatus("idle");
    }
  }

  if (status === "success") return <div className="sp-success" role="status">
    <svg className="sp-check" viewBox="0 0 80 80" aria-hidden="true">
      <circle className="sp-check-ring" cx="40" cy="40" r="34" />
      <path className="sp-check-mark" d="M26 41.5 36 51l19-21" />
    </svg>
    <h2 id={titleId} className="sp-title">You&apos;re all set!</h2>
    <p id={descriptionId} className="sp-subtitle">Thank you for connecting with Bhagwan Warehousing &amp; Dispatch. Our team will get in touch with you shortly.</p>
    {channel === "whatsapp" && <p className="sp-note">Your details are ready in WhatsApp. Press <b>Send</b> there to share them with our team.</p>}
    <p className="sp-subtitle sp-redirect">Taking you to Facilities Handling…</p>
    <button className="sp-secondary" type="button" onClick={goToFacilities} autoFocus>Open Facilities Handling</button>
  </div>;

  return <form className="sp-form" onSubmit={submit} noValidate data-shake={shakes ? (shakes % 2 ? "a" : "b") : undefined} aria-busy={status === "submitting"}>
    <div className="sp-head">
      <span className="sp-badge" aria-hidden="true"><Handshake size={22} strokeWidth={1.8} /></span>
      <h2 id={titleId} className="sp-title">Welcome, Service Partner!</h2>
      <p id={descriptionId} className="sp-subtitle">Connect with Bhagwan Warehousing &amp; Dispatch.</p>
    </div>
    <div className="sp-fields">
      <FloatingField ref={fullNameRef} name="fullName" label="Full Name" placeholder="Enter your full name" autoComplete="name" required autoFocus
        icon={<UserRound size={18} />} value={values.fullName} onChange={(e) => update("fullName")(e.target.value)} onBlur={markTouched("fullName")} error={visibleError("fullName")} />
      <FloatingField ref={emailRef} name="email" type="email" inputMode="email" label="Gmail Address" placeholder="Enter your Gmail address" autoComplete="email" required
        icon={<Mail size={18} />} value={values.email} onChange={(e) => update("email")(e.target.value)} onBlur={markTouched("email")} error={visibleError("email")} />
      <FloatingField ref={mobileRef} name="mobile" type="tel" inputMode="tel" label="Mobile Number" optional placeholder="Enter your contact number" autoComplete="tel-national"
        icon={<Phone size={18} />} value={values.mobile} onChange={(e) => update("mobile")(e.target.value)} onBlur={markTouched("mobile")} error={visibleError("mobile")} />
    </div>
    {formError && <p className="sp-form-error" role="alert">{formError}</p>}
    <button className="sp-primary" type="submit" disabled={status === "submitting"}>
      {status === "submitting"
        ? <><LoaderCircle className="sp-spinner" size={18} aria-hidden="true" />Sending…</>
        : <>Continue <ArrowRight className="sp-primary-arrow" size={18} aria-hidden="true" /></>}
    </button>
    <p className="sp-terms">By continuing, you agree to our Terms &amp; Privacy Policy.</p>
  </form>;
}
