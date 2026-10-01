import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { leadStatusValidator } from "./schema";

/** Institution collaboration requests — schools, colleges, coaching centres, NGOs. */
export const submit = mutation({
  args: {
    orgType: v.string(),
    orgName: v.string(),
    contactName: v.string(),
    contactRole: v.optional(v.string()),
    city: v.optional(v.string()),
    studentCount: v.optional(v.string()),
    focusAreas: v.array(v.string()),
    requirement: v.string(),
    timeline: v.optional(v.string()),
    whatsapp: v.string(),
    email: v.optional(v.string()),
    consent: v.boolean(),
  },
  handler: async (ctx, args) => {
    if (!args.consent) {
      throw new Error("Consent is required before we can store this request.");
    }
    if (args.orgName.trim().length < 2 || args.contactName.trim().length < 2) {
      throw new Error("Please tell us the institution and contact name.");
    }
    if (args.whatsapp.replace(/\D/g, "").length < 10) {
      throw new Error("Please enter a valid contact number.");
    }
    if (args.requirement.trim().length < 10) {
      throw new Error("A short description of the requirement helps us scope it.");
    }
    const id = await ctx.db.insert("partnerEnquiries", {
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
      .query("partnerEnquiries")
      .order("desc")
      .take(args.limit ?? 50);
  },
});

export const setStatus = mutation({
  args: { id: v.id("partnerEnquiries"), status: leadStatusValidator },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
    return { ok: true };
  },
});
