import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./roles";

const MAX_UPLOAD_BYTES = 6 * 1024 * 1024;

/** Signed-in learners can upload build logs, screenshots and documents. */
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Sign in to publish your work.");
    }
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    authorName: v.string(),
    sessionId: v.string(),
    kind: v.union(
      v.literal("project"),
      v.literal("note"),
      v.literal("question"),
    ),
    title: v.string(),
    body: v.string(),
    tags: v.array(v.string()),
    link: v.optional(v.string()),
    fileId: v.optional(v.id("_storage")),
    fileName: v.optional(v.string()),
    contentType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Sign in to publish your work.");
    }
    if (args.title.trim().length < 4) {
      throw new Error("Give your post a title of at least four characters.");
    }
    if (args.body.trim().length < 10) {
      throw new Error("Tell us a little more in the description.");
    }

    if (args.fileId) {
      const meta = await ctx.db.system.get(args.fileId);
      if (!meta) {
        throw new Error("That upload did not finish. Please try again.");
      }
      if (meta.size > MAX_UPLOAD_BYTES) {
        await ctx.storage.delete(args.fileId);
        throw new Error("Uploads must be 6 MB or smaller.");
      }
    }

    const id = await ctx.db.insert("posts", {
      authorName: args.authorName.trim(),
      sessionId: args.sessionId,
      authorId: userId,
      kind: args.kind,
      title: args.title.trim(),
      body: args.body.trim(),
      tags: args.tags.slice(0, 6),
      link: args.link,
      fileId: args.fileId,
      fileName: args.fileName,
      contentType: args.contentType,
      hidden: false,
    });

    return { ok: true, id };
  },
});

/** Public feed, with signed file URLs resolved per post. */
export const list = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const posts = await ctx.db
      .query("posts")
      .order("desc")
      .take(args.limit ?? 40);

    return await Promise.all(
      posts
        .filter((post) => !post.hidden)
        .map(async (post) => ({
          _id: post._id,
          _creationTime: post._creationTime,
          authorName: post.authorName,
          kind: post.kind,
          title: post.title,
          body: post.body,
          tags: post.tags,
          link: post.link ?? null,
          fileName: post.fileName ?? null,
          contentType: post.contentType ?? null,
          fileUrl: post.fileId ? await ctx.storage.getUrl(post.fileId) : null,
        })),
    );
  },
});

/** A learner's own posts, including any that a moderator hid. */
/** Moderation view: every post, including the ones hidden from the feed. */
export const listForAdmin = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.query("posts").order("desc").take(args.limit ?? 60);
  },
});

/** A learner's own posts, including any that a moderator hid. */
export const listMine = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .order("desc")
      .take(50);
  },
});

export const remove = mutation({
  args: { id: v.id("posts"), sessionId: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) throw new Error("That post no longer exists.");
    if (post.sessionId !== args.sessionId) {
      throw new Error("You can only delete your own posts.");
    }
    if (post.fileId) {
      await ctx.storage.delete(post.fileId);
    }
    await ctx.db.delete(args.id);

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", args.id))
      .collect();
    await Promise.all(comments.map((comment) => ctx.db.delete(comment._id)));

    return { ok: true };
  },
});

export const setHidden = mutation({
  args: { id: v.id("posts"), hidden: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { hidden: args.hidden });
    return { ok: true };
  },
});
