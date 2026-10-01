/**
 * Privacy-conscious, first-party analytics.
 *
 * No third-party script, no cookies, no personal data. Events are kept in
 * memory and mirrored to `window.dataLayer` so a proper provider (or the Convex
 * `analytics` table, once added) can pick them up without touching call sites.
 */
export type AnalyticsEvent =
  | "page_view"
  | "hero_cta_click"
  | "student_selected"
  | "parent_selected"
  | "ai_open"
  | "ai_question"
  | "ai_credit_used"
  | "ai_handoff"
  | "pathfinder_start"
  | "pathfinder_complete"
  | "program_view"
  | "mentor_view"
  | "mentor_video_play"
  | "mentor_connect_open"
  | "mentor_connect_submit"
  | "mentor_connect_prompt_shown"
  | "lead_form_start"
  | "lead_form_submit"
  | "partner_form_submit"
  | "whatsapp_click"
  | "plan_view"
  | "checkout_start"
  | "checkout_complete"
  | "track_explore"
  | "booking_form_start"
  | "booking_create"
  | "community_view"
  | "community_post_create"
  | "community_post_delete"
  | "community_comment_add"
  | "admin_view"
  | "admin_status_change"
  | "admin_moderate_post";

type Props = Record<string, string | number | boolean | undefined>;

interface TrackedEvent {
  event: AnalyticsEvent;
  props: Props;
  at: number;
}

const buffer: TrackedEvent[] = [];

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function track(event: AnalyticsEvent, props: Props = {}) {
  const entry: TrackedEvent = { event, props, at: Date.now() };
  buffer.push(entry);
  if (buffer.length > 200) buffer.shift();

  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...props });
  }

  if (import.meta.env.DEV) {
    console.debug("[dishayaan]", event, props);
  }
}

export function getTrackedEvents(): TrackedEvent[] {
  return [...buffer];
}
