import "server-only";
import bcrypt from "bcryptjs";
import mongoose, { Schema, type HydratedDocument, type Model } from "mongoose";
import { DEFAULT_ROLE, ROLES, type Role } from "./auth.roles";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
  isVerified: boolean;
  verificationToken?: string | null;
  verificationExpires?: Date | null;
  refreshToken?: string | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  /** Access tokens issued before this moment are rejected (set on password reset). */
  passwordChangedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

type UserModel = Model<IUser, object, IUserMethods>;
export type UserDocument = HydratedDocument<IUser, IUserMethods>;

/** Never sent to the client, even if a query selects them. */
const SECRET_FIELDS = ["password", "verificationToken", "verificationExpires", "refreshToken", "resetPasswordToken", "resetPasswordExpires", "passwordChangedAt"] as const;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    role: { type: String, enum: ROLES, default: DEFAULT_ROLE },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, select: false },
    verificationExpires: { type: Date, select: false },
    refreshToken: { type: String, select: false },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    passwordChangedAt: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        for (const field of SECRET_FIELDS) delete ret[field];
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

// Hash only when the password itself changed, so saving other fields doesn't double-hash it.
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.method("comparePassword", function (this: UserDocument, candidate: string) {
  return bcrypt.compare(candidate, this.password);
});

export const User = (mongoose.models.User as UserModel) ?? mongoose.model<IUser, UserModel>("User", userSchema);
