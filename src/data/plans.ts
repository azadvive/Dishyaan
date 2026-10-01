import type { Plan } from "../types";

/**
 * v1 launch pricing. These are the only numbers a student or parent ever sees,
 * and every plan can be paid for online from /plans. Update this file (or move
 * the same shape into Convex) to change pricing without touching UI code.
 */
export const PLANS: Plan[] = [
  {
    id: "plan-explore",
    slug: "explore",
    name: "Explore",
    tagline: "Start looking around properly.",
    bestFor:
      "Students beginning their journey who want to explore technology domains and understand where their interests point.",
    priceInr: 1499,
    billingPeriod: "monthly",
    mentorSessionsPerMonth: 1,
    aiCreditsPerMonth: 100,
    accent: "blue",
    features: [
      "Full course & exam catalogue access",
      "Guided track for one exploration domain",
      "Monthly Path Finder re-run with a written profile",
      "100 DishaYaaN AI credits per month",
      "1 group mentor session every month",
      "Project library with starter briefs",
    ],
  },
  {
    id: "plan-mentorship",
    slug: "mentorship",
    name: "Mentorship",
    tagline: "A human who checks in every single week.",
    bestFor:
      "Students who need consistent personal guidance, accountability and a roadmap that adapts.",
    priceInr: 4999,
    billingPeriod: "monthly",
    mentorSessionsPerMonth: 4,
    aiCreditsPerMonth: 300,
    accent: "violet",
    popular: true,
    features: [
      "Everything in Explore",
      "4 one-to-one mentor sessions every month",
      "Personal 90-day goal charter and weekly proof log",
      "Matched mentor by domain, language and schedule",
      "Parent progress dashboard access",
      "Priority doubt clinics",
    ],
  },
  {
    id: "plan-specialized",
    slug: "specialized",
    name: "Specialized Projects",
    tagline: "Build the thing you keep talking about.",
    bestFor:
      "Students going deep in AI, machine learning, robotics, drone technology or markets who want supervised builds.",
    priceInr: 7499,
    billingPeriod: "monthly",
    mentorSessionsPerMonth: 6,
    aiCreditsPerMonth: 500,
    accent: "cyan",
    features: [
      "Everything in Mentorship",
      "6 project-review sessions every month",
      "Hardware or data lab support as required",
      "Two portfolio-grade projects per term",
      "Demo Day presentation with mentor feedback",
      "Build log and documentation review",
    ],
  },
  {
    id: "plan-exam",
    slug: "exam-preparation",
    name: "Exam Preparation",
    tagline: "A plan, a mentor and proof you are on track.",
    bestFor:
      "Students targeting JEE, NEET, NDA, CS, CMA or another competitive examination.",
    priceInr: 6499,
    billingPeriod: "monthly",
    mentorSessionsPerMonth: 5,
    aiCreditsPerMonth: 250,
    accent: "green",
    features: [
      "Everything in Mentorship",
      "Subject mentorship plus an exam-strategy mentor",
      "Chapter map built to your exam calendar",
      "Weekly mock analysis and error journal review",
      "Concept clinics on demand",
      "Parent visibility on progress and attendance",
    ],
  },
  {
    id: "plan-goal-sprint",
    slug: "goal-sprint",
    name: "Goal Sprint",
    tagline: "One goal. Twelve weeks. Finished.",
    bestFor:
      "Students who want to prove they can finish something real before committing to a longer plan.",
    priceInr: 3499,
    billingPeriod: "project",
    mentorSessionsPerMonth: 3,
    aiCreditsPerMonth: 120,
    accent: "yellow",
    features: [
      "Single 12-week goal charter with your mentor",
      "3 review sessions across the sprint",
      "Weekly proof log and milestone checks",
      "Final demo and written reflection",
      "₹3,499 one-time — no subscription",
      "Upgrade credit toward any annual plan",
    ],
  },
];

export const planBySlug = (slug: string) => PLANS.find((p) => p.slug === slug);

export const inr = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

export const billingLabel = (period: Plan["billingPeriod"]) =>
  period === "monthly" ? "/month" : period === "quarterly" ? "/quarter" : " one-time";
