import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { bookingStatusValidator, leadRoleValidator } from "./schema";
import { requireAdmin } from "./roles";

function makeReference() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const noise = Math.floor(Math.random() * 900 + 100);
  return `DY-${stamp}-${noise}`;
}

/** One-to-one counselling request. A human confirms the slot afterwards. */
export const create = mutation({
  args: {
    name: v.string(),
    whatsapp: v.string(),
    email: v.optional(v.string()),
    bookerRole: leadRoleValidator,
    studentClass: v.optional(v.string()),
    domain: v.string(),
    mentorSlug: v.optional(v.string()),
    date: v.string(),
    slot: v.string(),
    mode: v.string(),
    language: v.optional(v.string()),
    goal: v.optional(v.string()),
    note: v.optional(v.string()),
    sessionId: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.name.trim().length < 2) {
      throw new Error("Please tell us who the session is for.");
    }
    if (args.whatsapp.replace(/\D/g, "").length < 10) {
      throw new Error("Please enter a valid WhatsApp number.");
    }
    if (!args.date || !args.slot) {
      throw new Error("Choose a date and a time slot.");
    }

    const userId = await getAuthUserId(ctx);
    const reference = makeReference();

    const id = await ctx.db.insert("bookings", {
      reference,
      name: args.name,
      whatsapp: args.whatsapp,
      email: args.email,
      bookerRole: args.bookerRole,
      studentClass: args.studentClass,
      domain: args.domain,
      mentorSlug: args.mentorSlug,
      date: args.date,
      slot: args.slot,
      mode: args.mode,
      language: args.language,
      goal: args.goal,
      note: args.note,
      sessionId: args.sessionId,
      userId: userId ?? undefined,
      status: "requested",
    });

    return { ok: true, id, reference };
  },
});

/** A learner's own bookings, shown in their workspace. */
export const listMine = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .take(50);
  },
});

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.query("bookings").order("desc").take(args.limit ?? 100);
  },
});

export const setStatus = mutation({
  args: { id: v.id("bookings"), status: bookingStatusValidator },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
    return { ok: true };
  },
});
