import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { leadStatusValidator } from "./schema";

/**
 * The AI → human handoff. Whatever the student explored (Path Finder result,
 * AI questions, viewed tracks) travels with the request so the mentor arrives
 * already informed instead of starting from zero.
 */
export const submit = mutation({
  args: {
    name: v.string(),
    whatsapp: v.string(),
    email: v.optional(v.string()),
    studentClass: v.optional(v.string()),
    domain: v.optional(v.string()),
    interests: v.array(v.string()),
    language: v.optional(v.string()),
    availability: v.optional(v.string()),
    context: v.optional(v.string()),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.name.trim().length < 2) {
      throw new Error("Please tell us your name.");
    }
    if (args.whatsapp.replace(/\D/g, "").length < 10) {
      throw new Error("Please enter a valid WhatsApp number.");
    }
    const id = await ctx.db.insert("mentorRequests", {
      ...args,
      status: "new",
    });
    return { ok: true, id };
  },
});

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("mentorRequests")
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const setStatus = mutation({
  args: { id: v.id("mentorRequests"), status: leadStatusValidator },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return { ok: true };
  },
});
