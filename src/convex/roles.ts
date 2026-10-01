import { getAuthUserId } from "@convex-dev/auth/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";

type Ctx = QueryCtx | MutationCtx;

export async function currentUser(ctx: Ctx) {
  const userId = await getAuthUserId(ctx);
  if (!userId) return null;
  return await ctx.db.get(userId);
}

/**
 * Admin access is granted in two ways, both server-side:
 *  1. the user's `role` is "admin" in the database, or
 *  2. their email appears in the ADMIN_EMAILS environment variable
 *     (comma-separated), which you can set from the Keys tab.
 */
export async function isAdmin(ctx: Ctx): Promise<boolean> {
  const user = await currentUser(ctx);
  if (!user) return false;
  if (user.role === "admin") return true;
  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(user.email && allowlist.includes(user.email.toLowerCase()));
}

export async function requireAdmin(ctx: Ctx) {
  if (!(await isAdmin(ctx))) {
    throw new Error("Admin access required.");
  }
}
