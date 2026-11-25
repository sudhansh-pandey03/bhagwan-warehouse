import "server-only";
import { Pool, type QueryResultRow } from "pg";
import { env } from "./env";

/**
 * PostgreSQL (Neon) connection pool, shared by every request a server instance handles.
 * Kept on globalThis so dev hot-reloads don't open a new pool on every save.
 *
 * Every query goes through `query(text, params)` with `$1, $2…` placeholders:
 * values are sent separately from the SQL, so user input can never change the query.
 */
const globalForDb = globalThis as typeof globalThis & { __bwPool?: Pool; __bwSchema?: Promise<void> };

function pool(): Pool {
  if (!globalForDb.__bwPool) {
    globalForDb.__bwPool = new Pool({
      connectionString: env().DATABASE_URL,
      max: 5, // serverless: few connections per instance; use Neon's "-pooler" URL for many instances
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 10_000,
    });
    globalForDb.__bwPool.on("error", (error) => console.error("[db] Idle client error:", error));
  }
  return globalForDb.__bwPool;
}

/** Creates the tables if they don't exist yet. Safe to run many times. Also in `lib/server/schema.sql`. */
const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                   varchar(50)  NOT NULL CHECK (char_length(name) BETWEEN 2 AND 50),
  email                  varchar(254) NOT NULL UNIQUE CHECK (email = lower(email)),
  password               text         NOT NULL,
  role                   varchar(20)  NOT NULL DEFAULT 'partner' CHECK (role IN ('partner', 'admin')),
  is_verified            boolean      NOT NULL DEFAULT false,
  verification_token     text,
  verification_expires   timestamptz,
  refresh_token          text,
  reset_password_token   text,
  reset_password_expires timestamptz,
  password_changed_at    timestamptz,
  created_at             timestamptz  NOT NULL DEFAULT now(),
  updated_at             timestamptz  NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS users_verification_token_idx ON users (verification_token) WHERE verification_token IS NOT NULL;
CREATE INDEX IF NOT EXISTS users_reset_password_token_idx ON users (reset_password_token) WHERE reset_password_token IS NOT NULL;
CREATE TABLE IF NOT EXISTS rate_limit_hits (
  key        text        PRIMARY KEY,
  count      integer     NOT NULL,
  expires_at timestamptz NOT NULL
);
`;

function ensureSchema(): Promise<void> {
  globalForDb.__bwSchema ??= (async () => {
    try {
      await pool().query(SCHEMA);
    } catch (error) {
      // Two cold instances creating the same table at once can collide; the second try sees it exists.
      if ((error as { code?: string }).code !== "23505") throw error;
      await pool().query(SCHEMA);
    }
  })().catch((error) => {
    globalForDb.__bwSchema = undefined; // let the next request try again
    throw error;
  });
  return globalForDb.__bwSchema;
}

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, params: unknown[] = []): Promise<T[]> {
  await ensureSchema();
  const result = await pool().query<T>(text, params);
  return result.rows;
}
