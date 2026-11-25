"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, KeyRound, LoaderCircle, LockKeyhole, Mail, MailCheck, ShieldCheck, ShieldX, UserRound } from "lucide-react";
import { FloatingField } from "@/components/home/floating-field";
import { ApiRequestError, authApi, safeNextPath } from "@/lib/auth-client/api";
import { useAuth } from "./auth-provider";
import "@/app/facilities-handling/_components/facilities.css";
import "@/components/home/service-partner.css";
import "./auth.css";

/* ---------- shared pieces ---------- */

const PASSWORD_HINT = "At least 8 characters, with one uppercase letter and one number.";
const passwordProblem = (value: string) =>
  value.length < 8 ? "Password must be at least 8 characters." : !/(?=.*[A-Z])(?=.*\d)/.test(value) ? "Password must contain at least one uppercase letter and one digit." : undefined;
const errorText = (error: unknown) => (error instanceof Error ? error.message : "Something went wrong, please try again.");

function AuthShell({ children }: { children: ReactNode }) {
  return <div className="fh-shell fh-center auth-shell"><div className="sp-card auth-card">{children}</div></div>;
}

function Head({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle: ReactNode }) {
  return <div className="sp-head">
    <span className="sp-badge" aria-hidden="true">{icon}</span>
    <h1 className="sp-title">{title}</h1>
    <p className="sp-subtitle">{subtitle}</p>
  </div>;
}

function Submit({ busy, children }: { busy: boolean; children: ReactNode }) {
  return <button className="sp-primary" type="submit" disabled={busy}>
    {busy ? <><LoaderCircle className="sp-spinner" size={18} aria-hidden="true" />Please wait…</> : <>{children} <ArrowRight className="sp-primary-arrow" size={18} aria-hidden="true" /></>}
  </button>;
}

function FormError({ message }: { message: string }) {
  return message ? <p className="sp-form-error" role="alert">{message}</p> : null;
}

/** Shown after a request that sent an email. Offers a rate-limited resend. */
function ResendVerification({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");
  async function resend() {
    setState("sending"); setError("");
    try { await authApi("/resend-verification", { method: "POST", body: { email } }); setState("sent"); }
    catch (e) { setError(errorText(e)); setState("idle"); }
  }
  if (state === "sent") return <p className="sp-note" role="status">A new link is on its way to <b>{email}</b>.</p>;
  return <>
    <p className="auth-links auth-links-center"><span className="auth-muted">No email?</span><button type="button" className="auth-link" onClick={resend} disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send the link again"}</button></p>
    <FormError message={error} />
  </>;
}

/* ---------- Login ---------- */

export function LoginForm() {
  const { login, status } = useAuth();
  const router = useRouter();
  const next = safeNextPath(useSearchParams().get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [unverified, setUnverified] = useState(false);

  // Already signed in (e.g. opened /login in a new tab): go straight on.
  useEffect(() => { if (status === "authenticated") router.replace(next); }, [status, next, router]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError(""); setUnverified(false);
    if (!email.trim() || !password) { setError("Enter your email and password."); return; }
    setBusy(true);
    try {
      await login(email.trim(), password);
      router.replace(next);
    } catch (e) {
      setError(errorText(e));
      setUnverified(e instanceof ApiRequestError && e.status === 403);
      setBusy(false);
    }
  }

  return <AuthShell>
    <form className="sp-form" onSubmit={submit} noValidate aria-busy={busy}>
      <Head icon={<LockKeyhole size={22} strokeWidth={1.8} />} title="Service Partner sign in" subtitle="Sign in to open Facilities Handling." />
      <div className="sp-fields">
        <FloatingField name="email" type="email" inputMode="email" autoComplete="email" label="Email" placeholder="you@example.com" required autoFocus
          icon={<Mail size={18} />} value={email} onChange={(e) => setEmail(e.target.value)} />
        <FloatingField name="password" type="password" autoComplete="current-password" label="Password" placeholder="Your password" required
          icon={<KeyRound size={18} />} value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <p className="auth-row-end"><Link className="auth-link" href="/forgot-password">Forgot password?</Link></p>
      <FormError message={error} />
      {unverified && <ResendVerification email={email.trim()} />}
      <Submit busy={busy}>Sign in</Submit>
      <p className="auth-links auth-links-center"><span className="auth-muted">New Service Partner?</span><Link className="auth-link" href={`/register${next !== "/facilities-handling" ? `?next=${encodeURIComponent(next)}` : ""}`}>Create an account</Link></p>
    </form>
  </AuthShell>;
}

/* ---------- Register ---------- */

export function RegisterForm() {
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [doneFor, setDoneFor] = useState("");
  const set = (field: keyof typeof values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [field]: e.target.value }));

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    const name = values.name.trim();
    const email = values.email.trim();
    const problem = name.length < 2 ? "Please enter your full name." : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? "Enter a valid email address." : passwordProblem(values.password);
    if (problem) { setError(problem); return; }
    setBusy(true); setError("");
    try {
      await authApi("/register", { method: "POST", body: { name, email, password: values.password } });
      setDoneFor(email);
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  if (doneFor) return <AuthShell>
    <div className="auth-done" role="status">
      <Head icon={<MailCheck size={22} strokeWidth={1.8} />} title="Check your email" subtitle={<>We sent a verification link to <b>{doneFor}</b>. Open it to activate your account. It expires in 24 hours.</>} />
      <ResendVerification email={doneFor} />
      <Link className="sp-secondary" href="/login">Go to sign in</Link>
    </div>
  </AuthShell>;

  return <AuthShell>
    <form className="sp-form" onSubmit={submit} noValidate aria-busy={busy}>
      <Head icon={<UserRound size={22} strokeWidth={1.8} />} title="Create your account" subtitle="Service Partners get access to Facilities Handling." />
      <div className="sp-fields">
        <FloatingField name="name" autoComplete="name" label="Full name" placeholder="Your full name" required autoFocus maxLength={50}
          icon={<UserRound size={18} />} value={values.name} onChange={set("name")} />
        <FloatingField name="email" type="email" inputMode="email" autoComplete="email" label="Email" placeholder="you@example.com" required
          icon={<Mail size={18} />} value={values.email} onChange={set("email")} />
        <div>
          <FloatingField name="password" type="password" autoComplete="new-password" label="Password" placeholder="Choose a password" required maxLength={72}
            icon={<KeyRound size={18} />} value={values.password} onChange={set("password")} />
          <p className="auth-hint">{PASSWORD_HINT}</p>
        </div>
      </div>
      <FormError message={error} />
      <Submit busy={busy}>Create account</Submit>
      <p className="auth-links auth-links-center"><span className="auth-muted">Already have an account?</span><Link className="auth-link" href="/login">Sign in</Link></p>
    </form>
  </AuthShell>;
}

/* ---------- Verify email ---------- */

/**
 * The token works once, so the request is shared per token: React's development double-run
 * (and a quick remount) reuse the first answer instead of seeing "already used".
 */
const verifyRequests = new Map<string, Promise<string>>();
function verifyOnce(token: string) {
  if (!verifyRequests.has(token)) verifyRequests.set(token, authApi(`/verify-email/${encodeURIComponent(token)}`).then((r) => r.message));
  return verifyRequests.get(token)!;
}

export function VerifyEmail({ token }: { token: string }) {
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  useEffect(() => {
    let live = true;
    verifyOnce(token).then(
      (message) => { if (live) setResult({ ok: true, message }); },
      (error) => { if (live) setResult({ ok: false, message: errorText(error) }); },
    );
    return () => { live = false; };
  }, [token]);

  return <AuthShell>
    <div className="auth-done" role="status" aria-live="polite">
      {!result && <Head icon={<LoaderCircle className="sp-spinner" size={22} />} title="Verifying your email…" subtitle="This takes a second." />}
      {result?.ok && <>
        <Head icon={<ShieldCheck size={22} strokeWidth={1.8} />} title="Email verified" subtitle={result.message} />
        <Link className="sp-primary" href="/login">Sign in <ArrowRight className="sp-primary-arrow" size={18} aria-hidden="true" /></Link>
      </>}
      {result && !result.ok && <>
        <Head icon={<ShieldX size={22} strokeWidth={1.8} />} title="Link not valid" subtitle={`${result.message}. Links work once and expire after 24 hours. Sign in to request a new one.`} />
        <Link className="sp-secondary" href="/login">Go to sign in</Link>
      </>}
    </div>
  </AuthShell>;
}

/* ---------- Forgot password ---------- */

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) { setError("Enter a valid email address."); return; }
    setBusy(true); setError("");
    try { setMessage((await authApi("/forgot-password", { method: "POST", body: { email: email.trim() } })).message); }
    catch (e) { setError(errorText(e)); }
    finally { setBusy(false); }
  }

  if (message) return <AuthShell>
    <div className="auth-done" role="status">
      <Head icon={<MailCheck size={22} strokeWidth={1.8} />} title="Check your email" subtitle={`${message}. The link expires in 15 minutes.`} />
      <Link className="sp-secondary" href="/login">Back to sign in</Link>
    </div>
  </AuthShell>;

  return <AuthShell>
    <form className="sp-form" onSubmit={submit} noValidate aria-busy={busy}>
      <Head icon={<KeyRound size={22} strokeWidth={1.8} />} title="Forgot your password?" subtitle="Enter your email and we'll send you a link to choose a new one." />
      <div className="sp-fields">
        <FloatingField name="email" type="email" inputMode="email" autoComplete="email" label="Email" placeholder="you@example.com" required autoFocus
          icon={<Mail size={18} />} value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <FormError message={error} />
      <Submit busy={busy}>Send reset link</Submit>
      <p className="auth-links auth-links-center"><Link className="auth-link" href="/login">Back to sign in</Link></p>
    </form>
  </AuthShell>;
}

/* ---------- Reset password ---------- */

export function ResetPasswordForm({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const { status, logout } = useAuth();
  const loggedOutHere = useRef(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    const problem = passwordProblem(password) ?? (password !== confirm ? "The two passwords don't match." : undefined);
    if (problem) { setError(problem); return; }
    setBusy(true); setError("");
    try {
      setDone((await authApi(`/reset-password/${encodeURIComponent(token)}`, { method: "PUT", body: { password } })).message);
      // Every session was ended on the server; end this tab's too.
      if (status === "authenticated" && !loggedOutHere.current) { loggedOutHere.current = true; void logout(); }
    } catch (e) {
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  if (done) return <AuthShell>
    <div className="auth-done" role="status">
      <Head icon={<ShieldCheck size={22} strokeWidth={1.8} />} title="Password updated" subtitle={done} />
      <Link className="sp-primary" href="/login">Sign in <ArrowRight className="sp-primary-arrow" size={18} aria-hidden="true" /></Link>
    </div>
  </AuthShell>;

  return <AuthShell>
    <form className="sp-form" onSubmit={submit} noValidate aria-busy={busy}>
      <Head icon={<KeyRound size={22} strokeWidth={1.8} />} title="Choose a new password" subtitle="You'll be signed out everywhere and can sign in with the new one." />
      <div className="sp-fields">
        <div>
          <FloatingField name="password" type="password" autoComplete="new-password" label="New password" placeholder="New password" required autoFocus maxLength={72}
            icon={<KeyRound size={18} />} value={password} onChange={(e) => setPassword(e.target.value)} />
          <p className="auth-hint">{PASSWORD_HINT}</p>
        </div>
        <FloatingField name="confirm" type="password" autoComplete="new-password" label="Confirm new password" placeholder="Type it again" required maxLength={72}
          icon={<KeyRound size={18} />} value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>
      <FormError message={error} />
      <Submit busy={busy}>Update password</Submit>
      <p className="auth-links auth-links-center"><Link className="auth-link" href="/forgot-password">Need a new link?</Link></p>
    </form>
  </AuthShell>;
}
