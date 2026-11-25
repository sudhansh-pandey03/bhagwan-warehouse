import Joi from "joi";
import { BaseDto } from "../../../common/dto/base.dto";
import { emailRule } from "./rules";

export type LoginInput = { email: string; password: string };

export class LoginDto extends BaseDto {
  static schema = Joi.object<LoginInput>({
    email: emailRule,
    password: Joi.string().max(72).required(),
  });
}
