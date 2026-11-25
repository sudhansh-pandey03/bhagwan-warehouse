-- Database tables for sign-in. The app creates these automatically on its first request
-- (see lib/server/common/config/db.ts); this file is for reference or manual setup in the Neon SQL editor.

CREATE TABLE IF NOT EXISTS users (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                   varchar(50)  NOT NULL CHECK (char_length(name) BETWEEN 2 AND 50),
  email                  varchar(254) NOT NULL UNIQUE CHECK (email = lower(email)),
  password               text         NOT NULL,                 -- bcrypt hash, never the password itself
  role                   varchar(20)  NOT NULL DEFAULT 'partner' CHECK (role IN ('partner', 'admin')),
  is_verified            boolean      NOT NULL DEFAULT false,
  verification_token     text,                                  -- SHA-256 of the emailed token
  verification_expires   timestamptz,
  refresh_token          text,                                  -- SHA-256 of the current refresh token
  reset_password_token   text,                                  -- SHA-256 of the emailed token
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

-- Make someone an admin (there is no way to do this from the website):
--   UPDATE users SET role = 'admin', updated_at = now() WHERE email = 'owner@example.com';
