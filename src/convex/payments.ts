"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";
import crypto from "node:crypto";

/**
 * Payments run entirely server-side. Secret keys never reach the browser: the
 * client only ever receives an order id and the publishable key id.
 *
 * Configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in the project's Keys tab to
 * enable live checkout. Until then orders are recorded as `awaiting_manual` and
 * the learner is routed to a human instead of being shown a fake success screen.
 */

const PLAN_ARGS = {
  planSlug: v.string(),
  planName: v.string(),
  amount: v.number(), // whole rupees
  billingPeriod: v.string(),
  studentName: v.string(),
  whatsapp: v.string(),
  email: v.optional(v.string()),
  userId: v.optional(v.id("users")),
};

export type CreateOrderResult =
  | {
      ok: true;
      paymentId: Id<"payments">;
      orderId: string;
      keyId: string;
      amount: number;
      currency: string;
    }
  | {
      ok: false;
      reason: "not_configured" | "provider_error";
      paymentId: Id<"payments">;
    };

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "signature_mismatch" };

export const createOrder = action({
  args: PLAN_ARGS,
  handler: async (ctx, args): Promise<CreateOrderResult> => {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      const paymentId = await ctx.runMutation(internal.paymentsData.record, {
        ...args,
        provider: "razorpay",
        status: "awaiting_manual",
        note: "Card checkout is not configured yet. Request captured for a team callback.",
      });
      return {
        ok: false as const,
        reason: "not_configured" as const,
        paymentId,
      };
    }

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64"),
      },
      body: JSON.stringify({
        amount: Math.round(args.amount * 100),
        currency: "INR",
        receipt: `dishayaan_${args.planSlug}_${Date.now()}`,
        notes: {
          plan: args.planName,
          student: args.studentName,
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      const paymentId = await ctx.runMutation(internal.paymentsData.record, {
        ...args,
        provider: "razorpay",
        status: "failed",
        note: `Order creation failed: ${response.status} ${detail.slice(0, 300)}`,
      });
      return {
        ok: false as const,
        reason: "provider_error" as const,
        paymentId,
      };
    }

    const order = (await response.json()) as {
      id: string;
      amount: number;
      currency: string;
    };

    const paymentId = await ctx.runMutation(internal.paymentsData.record, {
      ...args,
      provider: "razorpay",
      status: "created",
      providerOrderId: order.id,
    });

    return {
      ok: true as const,
      paymentId,
      orderId: order.id,
      keyId,
      amount: order.amount,
      currency: order.currency,
    };
  },
});

export const verify = action({
  args: {
    paymentId: v.id("payments"),
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.string(),
    razorpaySignature: v.string(),
  },
  handler: async (ctx, args): Promise<VerifyResult> => {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return { ok: false as const, reason: "not_configured" as const };
    }

    const expected = crypto
      .createHmac("sha256", keySecret)
      .update(`${args.razorpayOrderId}|${args.razorpayPaymentId}`)
      .digest("hex");

    if (expected !== args.razorpaySignature) {
      return { ok: false as const, reason: "signature_mismatch" as const };
    }

    await ctx.runMutation(internal.paymentsData.markPaid, {
      paymentId: args.paymentId,
      providerPaymentId: args.razorpayPaymentId,
    });

    return { ok: true as const };
  },
});
