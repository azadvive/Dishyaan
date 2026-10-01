import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: {
    postId: v.id("posts"),
    authorName: v.string(),
    sessionId: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    if (args.body.trim().length < 2) {
      throw new Error("Write a slightly longer comment.");
    }
    const post = await ctx.db.get(args.postId);
    if (!post || post.hidden) {
      throw new Error("That post is no longer open for comments.");
    }
    const userId = await getAuthUserId(ctx);
    const id = await ctx.db.insert("comments", {
      postId: args.postId,
      authorName: args.authorName.trim() || "DishaYaaN learner",
      sessionId: args.sessionId,
      authorId: userId ?? undefined,
      body: args.body.trim(),
    });
    return { ok: true, id };
  },
});

/** Recent comments for the whole feed; the client groups them by post. */
export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .order("desc")
      .take(args.limit ?? 300);
  },
});

export const listByPost = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.postId))
      .order("asc")
      .take(200);
  },
});
