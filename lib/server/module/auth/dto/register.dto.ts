import Joi from "joi";
import { BaseDto } from "../../../common/dto/base.dto";
import { DEFAULT_ROLE, SELF_SELECTABLE_ROLES, type Role } from "../auth.roles";
import { emailRule, passwordRule } from "./rules";

export type RegisterInput = { name: string; email: string; password: string; role: Role };

export class RegisterDto extends BaseDto {
  static schema = Joi.object<RegisterInput>({
    name: Joi.string().trim().min(2).max(50).required(),
    email: emailRule,
    password: passwordRule,
    role: Joi.string().valid(...SELF_SELECTABLE_ROLES).default(DEFAULT_ROLE),
  });
}
