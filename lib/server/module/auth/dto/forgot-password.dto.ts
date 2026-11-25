import Joi from "joi";
import { BaseDto } from "../../../common/dto/base.dto";
import { emailRule } from "./rules";

export type EmailInput = { email: string };

/** Used by both /forgot-password and /resend-verification: just an email. */
export class ForgotPasswordDto extends BaseDto {
  static schema = Joi.object<EmailInput>({ email: emailRule });
}
