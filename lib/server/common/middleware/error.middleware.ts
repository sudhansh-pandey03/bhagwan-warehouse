import "server-only";
import { connection, NextResponse, type NextRequest } from "next/server";
import { ApiError } from "../utils/api-error";

const fail = (statusCode: number, message: string) => NextResponse.json({ success: false, message }, { status: statusCode });

/** Turns any thrown error into `{ success: false, message }`. Real details are logged, never sent. */
export function errorResponse(error: unknown): NextResponse {
  if (error instanceof ApiError) return fail(error.statusCode, error.message);

  const name = (error as { name?: string })?.name;
  if (name === "TokenExpiredError") return fail(401, "Your session has expired, please sign in again");
  if (name === "JsonWebTokenError" || name === "NotBeforeError") return fail(401, "Invalid token");
  if ((error as { code?: number })?.code === 11000) return fail(409, "An account with this email already exists");

  console.error("[api] Unhandled error:", error);
  return fail(500, "Something went wrong, please try again");
}

type Handler<C> = (request: NextRequest, context: C) => Promise<Response>;

/** Wraps a route handler so every error goes through `errorResponse` (the Next.js version of Express's global error handler). */
export function withErrorHandler<C>(handler: Handler<C>): Handler<C> {
  return async (request, context) => {
    await connection(); // auth responses are per-request; never prerender or cache them
    try {
      return await handler(request, context);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

/** JSON 404 for unknown `/api/*` routes. */
export function notFoundHandler(request: NextRequest) {
  return errorResponse(ApiError.notFound(`Route ${request.nextUrl.pathname} not found`));
}
