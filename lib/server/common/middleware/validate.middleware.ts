import "server-only";
import type { BaseDto } from "../dto/base.dto";
import { ApiError } from "../utils/api-error";

/**
 * Next.js version of the Express `validate(Dto)` middleware: parses the JSON body,
 * runs the DTO, and returns the cleaned value (unknown fields removed) or throws a 400.
 */
export async function validate<T>(Dto: typeof BaseDto, request: Request): Promise<T> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw ApiError.badRequest("Request body must be valid JSON");
  }
  const { errors, value } = Dto.validate<T>(body);
  if (errors) throw ApiError.badRequest(errors.join("; "));
  return value;
}
