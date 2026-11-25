/** Every role in the system. "admin" is only ever set by hand in the database. */
export const ROLES = ["partner", "admin"] as const;
export type Role = (typeof ROLES)[number];

/** Roles someone may pick when registering. Everything else is admin-assigned only. */
export const SELF_SELECTABLE_ROLES = ["partner"] as const satisfies readonly Role[];

export const DEFAULT_ROLE: Role = "partner";
