import "server-only";
import mongoose, { Schema } from "mongoose";
import { connectDB } from "../config/db";
import { ApiError } from "../utils/api-error";

/**
 * Fixed-window rate limit stored in MongoDB. On Vercel every request can land on a
 * different serverless instance, so an in-memory counter (like express-rate-limit's
 * default store) would reset constantly; a shared store is required.
 * Each window gets its own document, which MongoDB deletes automatically when it expires.
 */
type Hit = { key: string; count: number; expiresAt: Date };

const hitSchema = new Schema<Hit>({
  key: { type: String, required: true, unique: true },
  count: { type: Number, required: true, default: 0 },
  expiresAt: { type: Date, required: true, expires: 0 },
});

const RateLimitHit = (mongoose.models.RateLimitHit as mongoose.Model<Hit>) ?? mongoose.model<Hit>("RateLimitHit", hitSchema);

/**
 * Client IP. On Vercel `x-forwarded-for` is set by the platform and can't be spoofed;
 * behind another proxy, make sure it overwrites this header.
 */
export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

export async function rateLimit(request: Request, name: string, { limit = 10, windowMs = 15 * 60 * 1000 } = {}) {
  await connectDB();
  const windowStart = Math.floor(Date.now() / windowMs) * windowMs;
  const key = `${name}:${clientIp(request)}:${windowStart}`;
  const update = { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(windowStart + windowMs) } };

  let hit: Hit | null;
  try {
    hit = await RateLimitHit.findOneAndUpdate({ key }, update, { upsert: true, returnDocument: "after" }).lean();
  } catch (error) {
    // Two requests created the same window document at once; the retry just increments it.
    if ((error as { code?: number }).code !== 11000) throw error;
    hit = await RateLimitHit.findOneAndUpdate({ key }, update, { returnDocument: "after" }).lean();
  }
  if (hit && hit.count > limit) throw ApiError.tooMany("Too many attempts. Please wait 15 minutes and try again.");
}
