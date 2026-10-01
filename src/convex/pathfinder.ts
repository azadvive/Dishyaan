import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const PROFILE = v.object({
  technology: v.number(),
  problemSolving: v.number(),
  research: v.number(),
  engineering: v.number(),
  markets: v.number(),
  peopleAndBusiness: v.number(),
});

/**
 * Path Finder runs are saved so a mentor sees the same answers the student saw,
 * instead of asking them to repeat everything on a call.
 */
export const save = mutation({
  args: {
    sessionId: v.string(),
    studentClass: v.optional(v.string()),
    answers: v.any(),
    profile: PROFILE,
    trackIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pathfinderResults")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        studentClass: args.studentClass,
        answers: args.answers,
        profile: args.profile,
        trackIds: args.trackIds,
      });
      return { ok: true, id: existing._id };
    }

    const id = await ctx.db.insert("pathfinderResults", {
      sessionId: args.sessionId,
      studentClass: args.studentClass,
      answers: args.answers,
      profile: args.profile,
      trackIds: args.trackIds,
    });
    return { ok: true, id };
  },
});

export const latest = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pathfinderResults")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();
  },
});
