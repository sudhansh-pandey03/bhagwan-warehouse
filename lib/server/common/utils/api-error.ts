/** An error that is safe to show the client: its message and status code go straight into the response. */
export class ApiError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }

  static badRequest(message = "Bad request") { return new ApiError(400, message); }
  static unauthorized(message = "Unauthorized") { return new ApiError(401, message); }
  static forbidden(message = "Forbidden") { return new ApiError(403, message); }
  static notFound(message = "Not found") { return new ApiError(404, message); }
  static conflict(message = "Conflict") { return new ApiError(409, message); }
  static tooMany(message = "Too many requests, please try again later") { return new ApiError(429, message); }
  static internal(message = "Something went wrong") { return new ApiError(500, message); }
}
