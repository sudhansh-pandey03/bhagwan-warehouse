import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import { env } from "./env";

let transporter: Transporter | undefined;

function getTransporter(): Transporter {
  if (!transporter) {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = env();
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // 465 = TLS from the start; 587 upgrades with STARTTLS
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

/** Names come from the sign-up form, so escape them before putting them in HTML. */
const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]!);

function layout(heading: string, body: string, buttonLabel: string, url: string, footnote: string) {
  return `<!doctype html><html><body style="margin:0;padding:24px;background:#f5f0e6;font-family:Arial,Helvetica,sans-serif;color:#13263a">
  <table role="presentation" width="100%" style="max-width:520px;margin:auto;background:#ffffff;border-radius:14px;padding:28px">
    <tr><td>
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.12em;color:#8a6a2c">BHAGWAN WAREHOUSING &amp; DISPATCH</p>
      <h1 style="margin:0 0 14px;font-size:22px">${heading}</h1>
      <p style="margin:0 0 22px;line-height:1.6">${body}</p>
      <p style="margin:0 0 22px"><a href="${url}" style="display:inline-block;padding:12px 22px;border-radius:10px;background:#d6a84f;color:#13263a;font-weight:bold;text-decoration:none">${buttonLabel}</a></p>
      <p style="margin:0 0 8px;font-size:13px;color:#5b6b7a">Or open this link:<br><a href="${url}" style="color:#13263a;word-break:break-all">${url}</a></p>
      <p style="margin:16px 0 0;font-size:12px;color:#8a97a3">${footnote}</p>
    </td></tr>
  </table></body></html>`;
}

async function send(to: string, subject: string, text: string, html: string) {
  const { SMTP_FROM_NAME, SMTP_FROM_EMAIL } = env();
  await getTransporter().sendMail({ from: { name: SMTP_FROM_NAME, address: SMTP_FROM_EMAIL }, to, subject, text, html });
}

export async function sendVerificationEmail(to: string, name: string, url: string) {
  const safeName = escapeHtml(name);
  await send(
    to,
    "Verify your email · Bhagwan Warehousing",
    `Namaste ${name},\n\nConfirm your email to open Facilities Handling:\n${url}\n\nThis link expires in 24 hours. If you didn't sign up, ignore this email.`,
    layout(`Namaste ${safeName}, confirm your email`, "Tap the button below to verify your email and open Facilities Handling.", "Verify email", url,
      "This link expires in 24 hours. If you didn't sign up, you can ignore this email."),
  );
}

export async function sendResetPasswordEmail(to: string, name: string, url: string) {
  const safeName = escapeHtml(name);
  await send(
    to,
    "Reset your password · Bhagwan Warehousing",
    `Namaste ${name},\n\nReset your password here:\n${url}\n\nThis link expires in 15 minutes. If you didn't ask for this, ignore this email; your password stays the same.`,
    layout(`Reset your password, ${safeName}`, "Someone (hopefully you) asked to reset the password for this account.", "Choose a new password", url,
      "This link expires in 15 minutes. If you didn't ask for this, ignore this email; your password stays the same."),
  );
}
