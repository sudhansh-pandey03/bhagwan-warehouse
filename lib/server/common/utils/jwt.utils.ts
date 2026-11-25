import "server-only";
import crypto from "node:crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

export type AccessPayload = { id: string; role: string; iat?: number; exp?: number };
export type RefreshPayload = { id: string; jti?: string; iat?: number; exp?: number };

type Expires = SignOptions["expiresIn"];

export function generateAccessToken({ id, role }: { id: string; role: string }): string {
  const { JWT_ACCESS_SECRET, JWT_ACCESS_EXPIRES } = env();
  return jwt.sign({ id, role }, JWT_ACCESS_SECRET, { expiresIn: JWT_ACCESS_EXPIRES as Expires, algorithm: "HS256" });
}

/** A random `jti` makes every refresh token unique, even two issued in the same second. */
export function generateRefreshToken({ id }: { id: string }): string {
  const { JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES } = env();
  return jwt.sign({ id }, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRES as Expires, algorithm: "HS256", jwtid: crypto.randomUUID() });
}

export function verifyAccessToken(token: string): AccessPayload {
  return jwt.verify(token, env().JWT_ACCESS_SECRET, { algorithms: ["HS256"] }) as AccessPayload;
}

export function verifyRefreshToken(token: string): RefreshPayload {
  return jwt.verify(token, env().JWT_REFRESH_SECRET, { algorithms: ["HS256"] }) as RefreshPayload;
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/** The raw token goes in the email; only the hash is stored. */
export function generateRandomToken(): { rawToken: string; hashedToken: string } {
  const rawToken = crypto.randomBytes(32).toString("hex");
  return { rawToken, hashedToken: hashToken(rawToken) };
}
