import "server-only";
import bcrypt from "bcryptjs";
import { query } from "../../common/config/db";
import type { Role } from "./auth.roles";

/**
 * The `users` table (schema in lib/server/schema.sql). Secret columns (password and every
 * token) are only read where a query names them; `PUBLIC_COLUMNS` and `toPublicUser` are what
 * the rest of the app sees, so they can never leak into a response.
 */

export type PublicUser = { id: string; name: string; email: string; role: Role; isVerified: boolean; createdAt: Date; updatedAt: Date };

type PublicRow = { id: string; name: string; email: string; role: Role; is_verified: boolean; created_at: Date; updated_at: Date };

export const PUBLIC_COLUMNS = "id, name, email, role, is_verified, created_at, updated_at";

export const toPublicUser = (row: PublicRow): PublicUser => ({
  id: row.id, name: row.name, email: row.email, role: row.role, isVerified: row.is_verified, createdAt: row.created_at, updatedAt: row.updated_at,
});

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
/** Ids come from verified JWTs, but a malformed one should be "not found", not a database error. */
export const isUserId = (id: unknown): id is string => typeof id === "string" && UUID.test(id);

export const hashPassword = (password: string) => bcrypt.hash(password, 12);
export const comparePassword = (candidate: string, hash: string) => bcrypt.compare(candidate, hash);

export async function findPublicById(id: string): Promise<PublicUser | null> {
  if (!isUserId(id)) return null;
  const [row] = await query<PublicRow>(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE id = $1`, [id]);
  return row ? toPublicUser(row) : null;
}

export async function findPublicByEmail(email: string): Promise<PublicUser | null> {
  const [row] = await query<PublicRow>(`SELECT ${PUBLIC_COLUMNS} FROM users WHERE email = $1`, [email]);
  return row ? toPublicUser(row) : null;
}

/** For login only: the one place the password hash is read. */
export async function findForLogin(email: string): Promise<(PublicUser & { passwordHash: string }) | null> {
  const [row] = await query<PublicRow & { password: string }>(`SELECT ${PUBLIC_COLUMNS}, password FROM users WHERE email = $1`, [email]);
  return row ? { ...toPublicUser(row), passwordHash: row.password } : null;
}

export async function emailExists(email: string): Promise<boolean> {
  return (await query(`SELECT 1 FROM users WHERE email = $1`, [email])).length > 0;
}

export async function createUser(input: { name: string; email: string; passwordHash: string; role: Role; verificationToken: string; verificationExpires: Date }): Promise<PublicUser> {
  const [row] = await query<PublicRow>(
    `INSERT INTO users (name, email, password, role, verification_token, verification_expires)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING ${PUBLIC_COLUMNS}`,
    [input.name, input.email, input.passwordHash, input.role, input.verificationToken, input.verificationExpires],
  );
  return toPublicUser(row);
}

/** Used by `authenticate`: the user's current role and when their password last changed. */
export async function findForAuth(id: string): Promise<(PublicUser & { passwordChangedAt: Date | null }) | null> {
  if (!isUserId(id)) return null;
  const [row] = await query<PublicRow & { password_changed_at: Date | null }>(`SELECT ${PUBLIC_COLUMNS}, password_changed_at FROM users WHERE id = $1`, [id]);
  return row ? { ...toPublicUser(row), passwordChangedAt: row.password_changed_at } : null;
}
