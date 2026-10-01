/** Shared domain types for Dishayaan v1. */

export type Accent =
  | "blue"
  | "violet"
  | "cyan"
  | "green"
  | "orange"
  | "pink"
  | "yellow";

/** The strategic layers Dishayaan organises every offering into. */
export type OfferingLayer = "goal" | "future" | "direction";

export type ExploreTrackId =
  | "ai-ml"
  | "robotics"
  | "drones"
  | "computer-science"
  | "stock-market"
  | "biotechnology"
  | "physics"
  | "engineering"
  | "research"
  | "entrepreneurship";

export interface ExploreTrack {
  id: ExploreTrackId;
  name: string;
  short: string;
  tagline: string;
  accent: Accent;
  icon: string;
  summary: string;
  skills: string[];
  projects: string[];
  pathways: string[];
  classRange: string;
}

export type ProgramKind = "future" | "goal" | "direction";

export interface Program {
  id: string;
  slug: string;
  title: string;
  kind: ProgramKind;
  trackId?: ExploreTrackId;
  examCode?: string;
  summary: string;
  accent: Accent;
  classRange: string;
  durationWeeks: number;
  sessionsPerWeek: number;
  mode: "Online" | "Offline" | "Hybrid";
  skills: string[];
  projects: string[];
  outcomes: string[];
  /** null => pricing is confirmed on a call rather than shown publicly. */
  priceInr: number | null;
  goalOriented: boolean;
}

export interface Plan {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  bestFor: string;
  priceInr: number;
  billingPeriod: "monthly" | "quarterly" | "project";
  features: string[];
  mentorSessionsPerMonth: number;
  aiCreditsPerMonth: number;
  accent: Accent;
  popular?: boolean;
}

/**
 * Mentor roster entries are *seats*, not invented people. Until a real mentor
 * completes verification we publish the domain, coverage and availability only.
 */
export type MentorStatus = "verifying" | "verified";

export interface Mentor {
  id: string;
  slug: string;
  code: string;
  role: string;
  domain: ExploreTrackId;
  institution: string | null;
  status: MentorStatus;
  expertise: string[];
  helpsWith: string[];
  languages: string[];
  availability: string;
  format: string;
  bio: string;
  videoUrl: string | null;
  videoDuration: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  context: string;
  placeholder: boolean;
}

export interface PartnerType {
  id: string;
  name: string;
  line: string;
  detail: string;
  icon: string;
  accent: Accent;
}

export interface StudentProject {
  id: string;
  title: string;
  student: string;
  studentClass: string;
  problem: string;
  solution: string;
  stack: string[];
  mentor: string;
  learned: string;
  accent: Accent;
  isExample: true;
}

/** Result of a Path Finder / goal-setting run. */
export interface PathfinderProfile {
  technology: number;
  problemSolving: number;
  research: number;
  engineering: number;
  markets: number;
  peopleAndBusiness: number;
}

export interface PathfinderResult {
  profile: PathfinderProfile;
  tracks: ExploreTrackId[];
  nextSteps: string[];
}

export type LeadRole = "student" | "parent" | "educator";

export interface EnquiryInput {
  role: LeadRole;
  name: string;
  whatsapp: string;
  email?: string;
  studentName?: string;
  studentClass?: string;
  board?: string;
  city?: string;
  state?: string;
  language?: string;
  clarity?: string;
  outsideSchool?: string;
  difficulty?: string;
  interests: string[];
  goal?: string;
  learningPreference?: string;
  trustFactors: string[];
  preferredTime?: string;
  message?: string;
  consent: boolean;
  source: string;
}
