import Joi from "joi";
import { BaseDto } from "../../../common/dto/base.dto";
import { passwordRule } from "./rules";

export type ResetPasswordInput = { password: string };

export class ResetPasswordDto extends BaseDto {
  static schema = Joi.object<ResetPasswordInput>({ password: passwordRule });
}
