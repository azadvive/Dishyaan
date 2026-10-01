import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

// DishaYaaN domain validators
export const leadRoleValidator = v.union(
  v.literal("student"),
  v.literal("parent"),
  v.literal("educator"),
);
export type LeadRoleValue = Infer<typeof leadRoleValidator>;

export const leadStatusValidator = v.union(
  v.literal("new"),
  v.literal("contacted"),
  v.literal("closed"),
);
export type LeadStatusValue = Infer<typeof leadStatusValidator>;

export const bookingStatusValidator = v.union(
  v.literal("requested"),
  v.literal("confirmed"),
  v.literal("completed"),
  v.literal("cancelled"),
);
export type BookingStatusValue = Infer<typeof bookingStatusValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      isAnonymous: v.optional(v.boolean()), // is the user anonymous. do not remove

      role: v.optional(roleValidator), // role of the user. do not remove
    }).index("email", ["email"]), // index for the email. do not remove or modify

    // ── DishaYaaN tables ────────────────────────────────────────────────

    /** Enquiries captured by the "Tell us what you need" demand-discovery form. */
    leads: defineTable({
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
      status: leadStatusValidator,
    }).index("by_status", ["status"]),

    /** School / college / coaching centre / NGO partnership requests. */
    partnerEnquiries: defineTable({
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
      status: leadStatusValidator,
    }),

    /** "Connect me with a mentor" requests, carrying AI / Path Finder context. */
    mentorRequests: defineTable({
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
      status: leadStatusValidator,
    }),

    /** Paid / pending subscription records created from the Plans page. */
    enrollments: defineTable({
      planSlug: v.string(),
      planName: v.string(),
      amount: v.number(),
      currency: v.string(),
      billingPeriod: v.string(),
      studentName: v.string(),
      whatsapp: v.string(),
      email: v.optional(v.string()),
      userId: v.optional(v.id("users")),
      status: v.union(
        v.literal("pending"),
        v.literal("active"),
        v.literal("refunded"),
      ),
      paymentId: v.optional(v.id("payments")),
    }),

    /** Payment intents. Orders are created server-side only; keys never ship. */
    payments: defineTable({
      planSlug: v.string(),
      planName: v.string(),
      amount: v.number(),
      currency: v.string(),
      billingPeriod: v.string(),
      provider: v.string(),
      providerOrderId: v.optional(v.string()),
      providerPaymentId: v.optional(v.string()),
      status: v.union(
        v.literal("created"),
        v.literal("awaiting_manual"),
        v.literal("paid"),
        v.literal("failed"),
      ),
      studentName: v.string(),
      whatsapp: v.string(),
      email: v.optional(v.string()),
      userId: v.optional(v.id("users")),
      note: v.optional(v.string()),
    }),

    /** Saved Path Finder runs so a mentor can see what the student answered. */
    pathfinderResults: defineTable({
      sessionId: v.string(),
      studentClass: v.optional(v.string()),
      answers: v.any(),
      profile: v.object({
        technology: v.number(),
        problemSolving: v.number(),
        research: v.number(),
        engineering: v.number(),
        markets: v.number(),
        peopleAndBusiness: v.number(),
      }),
      trackIds: v.array(v.string()),
    }).index("by_session", ["sessionId"]),

    /** DishaYaaN AI conversation log + credit accounting per browser session. */
    aiConversations: defineTable({
      sessionId: v.string(),
      messages: v.array(
        v.object({
          role: v.union(v.literal("user"), v.literal("assistant")),
          content: v.string(),
          at: v.number(),
        }),
      ),
      creditsUsed: v.number(),
    }).index("by_session", ["sessionId"]),

    /** Credit wallet. Real, server-side, survives reloads and devices. */
    aiAccounts: defineTable({
      sessionId: v.string(),
      credits: v.number(),
      conversationCount: v.number(),
      lastCreditReset: v.number(),
      plan: v.string(),
      referralCredits: v.number(),
      usageHistory: v.array(
        v.object({
          at: v.number(),
          topic: v.string(),
          credits: v.number(),
        }),
      ),
    }).index("by_session", ["sessionId"]),

    /** One-to-one session bookings against a domain or a specific mentor seat. */
    bookings: defineTable({
      reference: v.string(),
      name: v.string(),
      whatsapp: v.string(),
      email: v.optional(v.string()),
      bookerRole: leadRoleValidator,
      studentClass: v.optional(v.string()),
      domain: v.string(),
      mentorSlug: v.optional(v.string()),
      date: v.string(),
      slot: v.string(),
      mode: v.string(),
      language: v.optional(v.string()),
      goal: v.optional(v.string()),
      note: v.optional(v.string()),
      sessionId: v.string(),
      userId: v.optional(v.id("users")),
      status: v.union(
        v.literal("requested"),
        v.literal("confirmed"),
        v.literal("completed"),
        v.literal("cancelled"),
      ),
    })
      .index("by_session", ["sessionId"])
      .index("by_status", ["status"]),

    /** Community posts. Students publish their own work; anyone can read. */
    posts: defineTable({
      authorName: v.string(),
      sessionId: v.string(),
      authorId: v.optional(v.id("users")),
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
      hidden: v.boolean(),
    }).index("by_session", ["sessionId"]),

    /** Comments on community posts. */
    comments: defineTable({
      postId: v.id("posts"),
      authorName: v.string(),
      sessionId: v.string(),
      authorId: v.optional(v.id("users")),
      body: v.string(),
    }).index("by_post", ["postId"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;
