import "server-only";

/**
 * Auth configuration, read from environment variables.
 *
 * `env()` throws on first use if anything required is missing, so a misconfigured
 * deploy fails loudly on the first auth request instead of half-working.
 * `instrumentation.ts` also runs `missingEnv()` once at server startup and logs the result.
 * The marketing pages never import this, so they stay up even if auth isn't configured yet.
 */
const REQUIRED = [
  "DATABASE_URL",
  "CLIENT_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "SMTP_HOST",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM_EMAIL",
] as const;

export type Env = {
  NODE_ENV: string;
  isProduction: boolean;
  DATABASE_URL: string;
  CLIENT_URL: string;
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
  COOKIE_SAMESITE: "strict" | "lax" | "none";
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASS: string;
  SMTP_FROM_NAME: string;
  SMTP_FROM_EMAIL: string;
};

/** Every problem with the current environment, as readable messages. Empty when all is well. */
export function missingEnv(): string[] {
  const problems: string[] = REQUIRED.filter((name) => !process.env[name]?.trim()).map((name) => `${name} is not set`);
  const access = process.env.JWT_ACCESS_SECRET ?? "";
  const refresh = process.env.JWT_REFRESH_SECRET ?? "";
  if (access && access.length < 32) problems.push("JWT_ACCESS_SECRET must be at least 32 characters");
  if (refresh && refresh.length < 32) problems.push("JWT_REFRESH_SECRET must be at least 32 characters");
  if (access && access === refresh) problems.push("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different");
  const sameSite = process.env.COOKIE_SAMESITE;
  if (sameSite && !["strict", "lax", "none"].includes(sameSite)) problems.push('COOKIE_SAMESITE must be "strict", "lax" or "none"');
  if (sameSite === "none" && process.env.NODE_ENV !== "production") problems.push('COOKIE_SAMESITE="none" needs HTTPS (secure cookies), which is only on in production');
  return problems;
}

let cached: Env | undefined;

export function env(): Env {
  if (cached) return cached;
  const problems = missingEnv();
  if (problems.length) throw new Error(`Auth is not configured: ${problems.join("; ")}. See .env.example.`);
  const NODE_ENV = process.env.NODE_ENV ?? "development";
  cached = {
    NODE_ENV,
    isProduction: NODE_ENV === "production",
    DATABASE_URL: process.env.DATABASE_URL!,
    CLIENT_URL: process.env.CLIENT_URL!.replace(/\/+$/, ""),
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "15m",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || "7d",
    COOKIE_SAMESITE: (process.env.COOKIE_SAMESITE as Env["COOKIE_SAMESITE"]) || "strict",
    SMTP_HOST: process.env.SMTP_HOST!,
    SMTP_PORT: Number(process.env.SMTP_PORT) || 587,
    SMTP_USER: process.env.SMTP_USER!,
    SMTP_PASS: process.env.SMTP_PASS!,
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || "Bhagwan Warehousing",
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL!,
  };
  return cached;
}
