import { notFoundHandler } from "@/lib/server/common/middleware/error.middleware";

/** JSON 404 for any /api/* URL that has no route (instead of the HTML 404 page). */
export const GET = notFoundHandler;
export const POST = notFoundHandler;
export const PUT = notFoundHandler;
export const PATCH = notFoundHandler;
export const DELETE = notFoundHandler;
