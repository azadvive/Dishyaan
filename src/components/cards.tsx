import { Button } from "@/components/ui/button";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { billingLabel, inr } from "@/data/plans";
import type { Accent, ExploreTrack, Mentor, Plan, Program } from "@/types";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Atom,
  BadgeCheck,
  Bot,
  Brain,
  CircuitBoard,
  Clock,
  Code2,
  Dna,
  Eye,
  FlaskConical,
  Languages,
  Microscope,
  Play,
  Radar,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";
import type { ComponentType } from "react";
import { Link } from "react-router";

export const accentBg: Record<Accent, string> = {
  blue: "bg-neo-blue text-white",
  violet: "bg-neo-violet text-white",
  cyan: "bg-neo-cyan text-deep",
  green: "bg-neo-green text-deep",
  orange: "bg-neo-orange text-deep",
  pink: "bg-neo-pink text-deep",
  yellow: "bg-neo-yellow text-deep",
};

export const accentText: Record<Accent, string> = {
  blue: "text-neo-blue",
  violet: "text-neo-violet",
  cyan: "text-neo-blue",
  green: "text-emerald-700",
  orange: "text-orange-700",
  pink: "text-pink-700",
  yellow: "text-amber-700",
};

export const accentBorder: Record<Accent, string> = {
  blue: "border-t-neo-blue",
  violet: "border-t-neo-violet",
  cyan: "border-t-neo-cyan",
  green: "border-t-neo-green",
  orange: "border-t-neo-orange",
  pink: "border-t-neo-pink",
  yellow: "border-t-neo-yellow",
};

const TRACK_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  brain: Brain,
  bot: Bot,
  drone: Radar,
  code: Code2,
  "trending-up": TrendingUp,
  dna: Dna,
  atom: Atom,
  wrench: Wrench,
  microscope: Microscope,
  rocket: Rocket,
};

export function TrackIcon({
  icon,
  className,
}: {
  icon: string;
  className?: string;
}) {
  const Icon = TRACK_ICONS[icon] ?? CircuitBoard;
  return <Icon className={className} />;
}

export function TrackCard({
  track,
  onExplore,
}: {
  track: ExploreTrack;
  onExplore?: (track: ExploreTrack) => void;
}) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-line bg-card">
      <div className={cn("flex items-start justify-between gap-3 border-b border-line p-4", accentBg[track.accent])}>
        <div className="flex items-center gap-3">
          <TrackIcon icon={track.icon} className="size-6" />
          <h3 className="text-base font-bold leading-tight">{track.short}</h3>
        </div>
        <span className="rounded-xl border border-line bg-invert px-2 py-0.5 font-mono text-[10px] font-bold text-deep">
          {track.classRange}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <p className="text-sm font-semibold">{track.tagline}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {track.summary}
        </p>

        <div className="mt-auto space-y-2 pt-2">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Skills
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {track.skills.slice(0, 4).map((skill) => (
              <li
                key={skill}
                className="rounded-xl border border-line/30 bg-paper px-2 py-0.5 text-[11px] font-medium"
              >
                {skill}
              </li>
            ))}
          </ul>
        </div>

        <button
          type="button"
          onClick={() => onExplore?.(track)}
          className="mt-2 flex items-center justify-between rounded-xl border border-line bg-paper px-3 py-2 font-mono text-sm font-bold transition-colors group-hover:bg-neo-yellow group-hover:text-deep"
        >
          Explore this field
          <ArrowUpRight className="size-4" />
        </button>
      </div>
    </article>
  );
}

export function ProgramCard({ program }: { program: Program }) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-line bg-card">
      <div className="flex items-center justify-between gap-2 border-b border-line bg-paper px-4 py-2.5">
        <span className="text-[11px] font-bold uppercase tracking-[0.16em]">
          {program.examCode ?? "Explore"}
        </span>
        <span className="rounded-xl border border-line px-2 py-0.5 text-[10px] font-bold">
          {program.mode}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <h3 className="text-base font-bold leading-snug">{program.title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {program.summary}
        </p>

        <dl className="grid grid-cols-3 gap-2 border-y border-dashed border-line/25 py-3 text-[11px]">
          <div>
            <dt className="font-bold uppercase tracking-wider text-muted-foreground">
              Classes
            </dt>
            <dd className="mt-0.5 font-semibold">{program.classRange}</dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-wider text-muted-foreground">
              Length
            </dt>
            <dd className="mt-0.5 font-semibold">{program.durationWeeks} weeks</dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-wider text-muted-foreground">
              Sessions
            </dt>
            <dd className="mt-0.5 font-semibold">{program.sessionsPerWeek}/week</dd>
          </div>
        </dl>

        <ul className="space-y-1.5">
          {program.outcomes.slice(0, 3).map((outcome) => (
            <li key={outcome} className="flex gap-2 text-sm">
              <BadgeCheck className={cn("mt-0.5 size-4 shrink-0", accentText[program.accent])} />
              <span className="leading-snug">{outcome}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between gap-2 border-t border-line pt-3">
          <p className="text-sm font-bold">
            {program.priceInr === null ? (
              <>Fee confirmed on call</>
            ) : (
              <>
                {inr(program.priceInr)}
                <span className="ml-1 text-xs font-medium text-muted-foreground">
                  launch fee
                </span>
              </>
            )}
          </p>
          <Button asChild variant="neo" size="sm" className="font-bold">
            <Link to={`/program/${program.slug}`}>View details</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function MentorCard({
  mentor,
  compact = false,
}: {
  mentor: Mentor;
  compact?: boolean;
}) {
  return (
    <article className="group flex h-full flex-col rounded-xl border border-line bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-neo">
      <div className="flex items-start gap-3 border-b border-line p-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-line bg-neo-violet text-lg font-black text-white">
          {mentor.role.slice(0, 1)}
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold leading-snug">{mentor.role}</h3>
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
            <span className="rounded-xl border border-line/30 px-1.5 py-0.5">{mentor.code}</span>
            <span className="inline-flex items-center gap-1">
              {mentor.status === "verified" ? (
                <>
                  <ShieldCheck className="size-3" /> Verified
                </>
              ) : (
                <>
                  <Clock className="size-3" /> Profile in verification
                </>
              )}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="relative flex h-28 items-center justify-center rounded-xl border border-dashed border-line/30 bg-paper">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Play className="size-4" />
            {mentor.videoUrl ? mentor.videoDuration : "2-min intro publishes on verification"}
          </span>
        </div>

        {!compact ? (
          <>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                Helps with
              </p>
              <ul className="mt-1.5 space-y-1">
                {mentor.helpsWith.slice(0, 3).map((h) => (
                  <li key={h} className="text-sm leading-snug">
                    — {h}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {mentor.expertise.slice(0, 4).map((e) => (
                <span
                  key={e}
                  className="rounded-xl border border-line/30 bg-paper px-2 py-0.5 text-[11px] font-medium"
                >
                  {e}
                </span>
              ))}
            </div>
          </>
        ) : null}

        <div className="mt-auto grid gap-2 border-t border-dashed border-line/25 pt-3 text-[11px] font-semibold text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3" /> {mentor.availability}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Languages className="size-3" /> {mentor.languages.join(", ")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="size-3" /> {mentor.format}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button asChild variant="neo" size="sm" className="font-bold">
            <Link to={`/mentor/${mentor.slug}`}>Profile</Link>
          </Button>
          <MentorConnectButton
            variant="neo-blue"
            size="sm"
            source={`mentor_card:${mentor.slug}`}
            domain={mentor.domain}
            context={`Interested in the ${mentor.role} seat.`}
            className="font-bold"
            icon={false}
          >
            Connect
          </MentorConnectButton>
        </div>
      </div>
    </article>
  );
}

export function PlanCard({
  plan,
  onChoose,
}: {
  plan: Plan;
  onChoose: (plan: Plan) => void;
}) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-xl border border-line bg-card",
        plan.popular && "shadow-neo",
      )}
    >
      {plan.popular ? (
        <span className="absolute -top-3 left-4 rounded-xl border border-line bg-neo-yellow px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-deep">
          Most chosen
        </span>
      ) : null}
      <div className={cn("border-b border-line p-5", accentBg[plan.accent])}>
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p className="mt-1 text-sm font-medium opacity-90">{plan.tagline}</p>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="font-display text-3xl font-bold">
            {inr(plan.priceInr)}
            <span className="ml-1 text-sm font-semibold text-muted-foreground">
              {billingLabel(plan.billingPeriod)}
            </span>
          </p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Launch pricing · refundable in 7 days
          </p>
        </div>

        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-bold text-ink">Best for: </span>
          {plan.bestFor}
        </p>

        <ul className="space-y-2">
          {plan.features.map((f) => (
            <li key={f} className="flex gap-2 text-sm leading-snug">
              <BadgeCheck className="mt-0.5 size-4 shrink-0 text-emerald-700" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <dl className="grid grid-cols-2 gap-2 border-y border-dashed border-line/25 py-3 text-center text-[11px]">
          <div>
            <dt className="font-bold uppercase tracking-wider text-muted-foreground">
              Mentor sessions
            </dt>
            <dd className="mt-1 flex items-center justify-center gap-1 font-bold">
              <Users className="size-3.5" /> {plan.mentorSessionsPerMonth}/month
            </dd>
          </div>
          <div>
            <dt className="font-bold uppercase tracking-wider text-muted-foreground">
              AI credits
            </dt>
            <dd className="mt-1 flex items-center justify-center gap-1 font-bold">
              <FlaskConical className="size-3.5" /> {plan.aiCreditsPerMonth}/month
            </dd>
          </div>
        </dl>

        <div className="mt-auto grid gap-2">
          <Button
            variant={plan.popular ? "neo-blue" : "neo-dark"}
            className="w-full font-bold"
            onClick={() => onChoose(plan)}
          >
            Pay & start {plan.name}
          </Button>
          <MentorConnectButton
            variant="neo"
            size="sm"
            source={`plan:${plan.slug}`}
            context={`Asked about the ${plan.name} plan.`}
            className="w-full font-bold"
          >
            Ask a mentor before paying
          </MentorConnectButton>
        </div>
      </div>
    </article>
  );
}
