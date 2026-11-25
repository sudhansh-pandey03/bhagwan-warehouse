import type { ObjectSchema } from "joi";

/** Each DTO sets a static Joi `schema`; `validate()` returns every error at once and strips unknown fields. */
export class BaseDto {
  static schema: ObjectSchema;

  static validate<T = Record<string, unknown>>(data: unknown): { errors: string[] | null; value: T } {
    const { error, value } = this.schema.validate(data, { abortEarly: false, stripUnknown: true });
    return { errors: error ? error.details.map((detail) => detail.message) : null, value: value as T };
  }
}
