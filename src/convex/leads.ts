import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { leadRoleValidator, leadStatusValidator } from "./schema";

/**
 * Demand discovery. Who is asking, what they actually need, and what would
 * make them trust us — recorded so the platform is built around real requests.
 */
export const submit = mutation({
  args: {
    role: leadRoleValidator,
    name: v.string(),
    whatsapp: v.string(),
    email: v.optional(v.string()),
    studentName: v.optional(v.string()),
    studentClass: v.optional(v.string()),
    board: v.optional(v.string()),
    city: v.optional(v.string()),
    state: v.optional(v.string()),
    language: v.optional(v.string()),
    clarity: v.optional(v.string()),
    outsideSchool: v.optional(v.string()),
    difficulty: v.optional(v.string()),
    interests: v.array(v.string()),
    goal: v.optional(v.string()),
    learningPreference: v.optional(v.string()),
    trustFactors: v.array(v.string()),
    preferredTime: v.optional(v.string()),
    message: v.optional(v.string()),
    consent: v.boolean(),
    source: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.consent) {
      throw new Error("Consent is required before we can store your enquiry.");
    }
    if (args.name.trim().length < 2) {
      throw new Error("Please tell us your name.");
    }
    if (args.whatsapp.replace(/\D/g, "").length < 10) {
      throw new Error("Please enter a valid WhatsApp number.");
    }
    const id = await ctx.db.insert("leads", {
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
      .query("leads")
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const setStatus = mutation({
  args: { id: v.id("leads"), status: leadStatusValidator },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return { ok: true };
  },
});
