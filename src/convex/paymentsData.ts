import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./roles";

export const PLAN_ARGS = {
  planSlug: v.string(),
  planName: v.string(),
  amount: v.number(), // whole rupees
  billingPeriod: v.string(),
  studentName: v.string(),
  whatsapp: v.string(),
  email: v.optional(v.string()),
  userId: v.optional(v.id("users")),
};

export const record = internalMutation({
  args: {
    ...PLAN_ARGS,
    provider: v.string(),
    status: v.union(
      v.literal("created"),
      v.literal("awaiting_manual"),
      v.literal("paid"),
      v.literal("failed"),
    ),
    providerOrderId: v.optional(v.string()),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("payments", {
      ...args,
      currency: "INR",
    });
  },
});

export const markPaid = internalMutation({
  args: {
    paymentId: v.id("payments"),
    providerPaymentId: v.string(),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment) throw new Error("Payment record not found.");
    if (payment.status === "paid") return payment._id;

    await ctx.db.patch(args.paymentId, {
      status: "paid",
      providerPaymentId: args.providerPaymentId,
    });

    await ctx.db.insert("enrollments", {
      planSlug: payment.planSlug,
      planName: payment.planName,
      amount: payment.amount,
      currency: payment.currency,
      billingPeriod: payment.billingPeriod,
      studentName: payment.studentName,
      whatsapp: payment.whatsapp,
      email: payment.email,
      userId: payment.userId,
      status: "active",
      paymentId: args.paymentId,
    });

    return args.paymentId;
  },
});

export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.query("payments").order("desc").take(args.limit ?? 50);
  },
});

export const enrollments = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("enrollments")
      .order("desc")
      .take(args.limit ?? 50);
  },
});
