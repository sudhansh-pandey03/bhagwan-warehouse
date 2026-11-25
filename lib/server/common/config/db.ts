import "server-only";
import mongoose from "mongoose";
import { env } from "./env";

/**
 * One shared MongoDB connection. On Vercel each warm function instance reuses it;
 * the promise is kept on globalThis so dev hot-reloads don't open a new pool every save.
 */
const globalForDb = globalThis as typeof globalThis & { __bwMongo?: Promise<typeof mongoose> };

export function connectDB(): Promise<typeof mongoose> {
  if (!globalForDb.__bwMongo) {
    globalForDb.__bwMongo = mongoose
      .connect(env().MONGODB_URI, { serverSelectionTimeoutMS: 8000 })
      .catch((error) => {
        globalForDb.__bwMongo = undefined; // let the next request try again
        throw error;
      });
  }
  return globalForDb.__bwMongo;
}
