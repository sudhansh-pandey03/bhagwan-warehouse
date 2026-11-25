/**
 * Runs once when the server starts. Checks the auth environment variables and logs
 * every problem up front. It logs instead of crashing so the public website keeps
 * working; the auth API itself refuses to run until the config is fixed (see lib/server/common/config/env.ts).
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  const { missingEnv } = await import("./lib/server/common/config/env");
  const problems = missingEnv();
  if (problems.length) console.error(`\n[auth] Not configured, sign-in will not work:\n  - ${problems.join("\n  - ")}\n  Copy .env.example to .env.local and fill it in.\n`);
}
