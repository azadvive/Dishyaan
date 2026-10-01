import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
} from "./_generated/server";
import { v } from "convex/values";

/** New visitors get 10 free exploration questions. */
export const FREE_CREDITS = 10;

/** Shared wallet bootstrap so the public and internal paths cannot drift. */
async function openAccount(ctx: MutationCtx, sessionId: string) {
  const existing = await ctx.db
    .query("aiAccounts")
    .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
    .first();
  if (existing) return existing;

  const id = await ctx.db.insert("aiAccounts", {
    sessionId,
    credits: FREE_CREDITS,
    conversationCount: 0,
    lastCreditReset: Date.now(),
    plan: "free",
    referralCredits: 0,
    usageHistory: [],
  });
  return await ctx.db.get(id);
}

/** Credit wallet lives server-side, so it survives reloads and devices. */
export const ensureAccount = mutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await openAccount(ctx, args.sessionId);
  },
});

/** Used by the chat action, which runs in the Node runtime. */
export const ensureAccountInternal = internalMutation({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await openAccount(ctx, args.sessionId);
  },
});

export const getAccount = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiAccounts")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();
  },
});

export const conversation = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("aiConversations")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();
  },
});

export const record = internalMutation({
  args: {
    sessionId: v.string(),
    userMessage: v.string(),
    assistantMessage: v.string(),
    topic: v.string(),
    chargeCredit: v.boolean(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const convo = await ctx.db
      .query("aiConversations")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    const newMessages = [
      { role: "user" as const, content: args.userMessage, at: now },
      { role: "assistant" as const, content: args.assistantMessage, at: now },
    ];

    if (convo) {
      await ctx.db.patch(convo._id, {
        messages: [...convo.messages, ...newMessages],
        creditsUsed: convo.creditsUsed + (args.chargeCredit ? 1 : 0),
      });
    } else {
      await ctx.db.insert("aiConversations", {
        sessionId: args.sessionId,
        messages: newMessages,
        creditsUsed: args.chargeCredit ? 1 : 0,
      });
    }

    const account = await ctx.db
      .query("aiAccounts")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .first();

    if (!account) {
      return { credits: args.chargeCredit ? FREE_CREDITS - 1 : FREE_CREDITS };
    }

    const nextCredits = args.chargeCredit
      ? Math.max(0, account.credits - 1)
      : account.credits;

    await ctx.db.patch(account._id, {
      credits: nextCredits,
      conversationCount: account.conversationCount + 1,
      usageHistory: [
        ...account.usageHistory.slice(-49),
        { at: now, topic: args.topic, credits: args.chargeCredit ? 1 : 0 },
      ],
    });

    return { credits: nextCredits };
  },
});
