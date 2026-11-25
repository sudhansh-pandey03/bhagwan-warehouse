import Joi from "joi";

export const emailRule = Joi.string().trim().lowercase().email().max(254).required();

/** bcrypt only uses the first 72 bytes, so longer passwords are rejected rather than silently cut. */
export const passwordRule = Joi.string()
  .min(8)
  .max(72)
  .pattern(/(?=.*[A-Z])(?=.*\d)/)
  .required()
  .messages({ "string.pattern.base": "Password must contain at least one uppercase letter and one digit" });
