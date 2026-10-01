"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { vly } from "../lib/vly-integrations";
import { AI_KNOWLEDGE, guidedAnswer } from "./knowledge";

/**
 * DishaYaaN AI. Runs as a Node action so the provider key stays server-side.
 * If the model is unavailable we fall back to a grounded, rule-based guide and
 * still answer usefully — we never show a fake "typing" success.
 */
export interface ChatResult {
  reply: string;
  credits: number;
  mode: "live" | "guided" | "exhausted";
  handoff: boolean;
}

export const chat = action({
  args: {
    sessionId: v.string(),
    message: v.string(),
    studentClass: v.optional(v.string()),
    interests: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args): Promise<ChatResult> => {
    const account = await ctx.runMutation(internal.aiData.ensureAccountInternal, {
      sessionId: args.sessionId,
    });

    if (account && account.credits <= 0) {
      return {
        reply:
          "You have used all 10 free exploration questions. The honest next step is a conversation with a person — a mentor can look at everything you explored with me and tell you what to do first.",
        credits: 0,
        mode: "exhausted" as const,
        handoff: true,
      };
    }

    const prompt = [
      AI_KNOWLEDGE,
      args.studentClass ? `Student class: ${args.studentClass}.` : "",
      args.interests?.length
        ? `Interests so far: ${args.interests.join(", ")}.`
        : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    let reply: string | null = null;
    let mode: "live" | "guided" = "guided";

    if (process.env.VLY_INTEGRATION_KEY) {
      try {
        const result = await vly.ai.completion({
          model: "gpt-4o-mini",
          temperature: 0.4,
          maxTokens: 420,
          messages: [
            { role: "system", content: prompt },
            { role: "user", content: args.message },
          ],
        });
        const text = result.data?.choices?.[0]?.message?.content?.trim();
        if (result.success && text) {
          reply = text;
          mode = "live";
        }
      } catch {
        reply = null;
      }
    }

    if (!reply) {
      reply = guidedAnswer(args.message, args.studentClass);
    }

    const { credits } = await ctx.runMutation(internal.aiData.record, {
      sessionId: args.sessionId,
      userMessage: args.message,
      assistantMessage: reply,
      topic: args.message.slice(0, 80),
      chargeCredit: true,
    });

    return { reply, credits, mode, handoff: credits <= 2 };
  },
});
