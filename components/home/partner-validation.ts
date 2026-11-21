export type PartnerFields = { fullName: string; email: string; mobile: string };
export type PartnerField = keyof PartnerFields;
export type PartnerErrors = Partial<Record<PartnerField, string>>;

export const PARTNER_FIELD_ORDER: PartnerField[] = ["fullName", "email", "mobile"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns the 10-digit number for a valid Indian mobile (accepts +91 / 91 / 0 prefixes, spaces and dashes), otherwise null. */
export function normalizeIndianMobile(value: string): string | null {
  const digits = value.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export function validatePartner(fields: PartnerFields): PartnerErrors {
  const errors: PartnerErrors = {};
  const name = fields.fullName.trim();
  const email = fields.email.trim();
  const mobile = fields.mobile.trim();

  if (!name) errors.fullName = "Please enter your full name.";
  else if (name.length < 2) errors.fullName = "That name looks too short.";

  if (!email) errors.email = "Please enter your Gmail address.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address, like name@gmail.com.";

  if (mobile && !normalizeIndianMobile(mobile)) errors.mobile = "Enter a valid 10-digit Indian mobile number.";

  return errors;
}
