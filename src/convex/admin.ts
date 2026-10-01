import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { isAdmin } from "./roles";

/** What the current visitor is allowed to see in the admin area. */
export const whoami = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    const user = userId ? await ctx.db.get(userId) : null;
    const sample = await ctx.db.query("users").take(200);
    return {
      signedIn: Boolean(user),
      name: user?.name ?? null,
      email: user?.email ?? null,
      isAdmin: await isAdmin(ctx),
      hasAdmin: sample.some((u) => u.role === "admin"),
    };
  },
});

/**
 * Bootstrap for the very first operator. It only works while no admin exists,
 * so after the founder has claimed access the door closes permanently.
 */
export const claimFirstAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Sign in first, then claim access.");

    const sample = await ctx.db.query("users").take(200);
    if (sample.some((u) => u.role === "admin")) {
      throw new Error("An administrator already exists for this workspace.");
    }

    await ctx.db.patch(userId, { role: "admin" });
    return { ok: true };
  },
});
