import { Button } from "@/components/ui/button";
import {
  Container,
  Eyebrow,
  Section,
  SectionHeader,
} from "@/components/common/primitives";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { TrackIcon, accentBg } from "@/components/cards";
import { EXPLORE_TRACKS, trackById } from "@/data/catalog";
import { PLANS, inr } from "@/data/plans";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useSeo } from "@/hooks/use-seo";
import { getSessionId } from "@/lib/session";
import { cn } from "@/lib/utils";
import { useQuery } from "convex/react";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  CircuitBoard,
  LogOut,
  Rocket,
  Sparkles,
  Target,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import type { ExploreTrackId } from "@/types";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const sessionId = getSessionId();

  const pathfinder = useQuery(api.pathfinder.latest, { sessionId });
  const aiAccount = useQuery(api.aiData.getAccount, { sessionId });

  useSeo({
    title: "My workspace",
    description:
      "Your Dishayaan workspace: your goal charter, exploration profile, AI credits and mentor sessions in one place.",
    path: "/dashboard",
  });

  const suggested: ExploreTrackId[] =
    (pathfinder?.trackIds as ExploreTrackId[] | undefined) ?? [
      "ai-ml",
      "robotics",
      "stock-market",
    ];
  const tracks = suggested
    .map((id) => trackById(id))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <Section tone="paper" className="min-h-screen py-10 sm:py-14">
      <Container>
        <div className="flex flex-col gap-4 border-2 border-ink bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Eyebrow tone="ink">Student workspace</Eyebrow>
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
              Welcome{user?.name ? `, ${user.name.split(" ")[0]}` : ""}.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              This is your Dishayaan workspace. Set the goal, follow the plan, keep the
              proof. Everything a mentor sees, you see too.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="neo"
              className="font-bold"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <div className="border-2 border-ink bg-white p-6 lg:col-span-2">
            <div className="flex items-start gap-3">
              <span className="flex size-10 items-center justify-center border-2 border-ink bg-neo-yellow">
                <Target className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold">Your 90-day goal charter</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  One goal, written as evidence. A mentor reviews it in your first
                  session and it becomes the spine of your plan.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {[
                ["Goal", "Not set yet"],
                ["Weekly time", "Not set yet"],
                ["Proof of progress", "Not set yet"],
              ].map(([label, value]) => (
                <div key={label} className="border-2 border-dashed border-ink/40 bg-paper p-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <MentorConnectButton
                variant="neo-blue"
                source="dashboard_goal"
                context="Wants help writing the 90-day goal charter."
              >
                Set my goal with a mentor
              </MentorConnectButton>
              <Button asChild variant="neo" className="font-bold">
                <Link to="/catalog">
                  Browse programmes
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-5">
            <div className="border-2 border-ink bg-white p-6">
              <Eyebrow tone="cyan">Dishayaan AI</Eyebrow>
              <p className="mt-3 font-display text-3xl font-bold">
                {aiAccount?.credits ?? 10}
                <span className="ml-2 text-sm font-semibold text-muted-foreground">
                  credits left
                </span>
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {aiAccount?.conversationCount ?? 0} questions asked so far.
              </p>
              <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <Bot className="size-3.5" /> Open the assistant from the button in the
                corner.
              </p>
            </div>

            <div className="border-2 border-ink bg-white p-6">
              <Eyebrow tone="green">Mentor sessions</Eyebrow>
              <p className="mt-3 flex items-center gap-2 text-sm font-bold">
                <CalendarCheck className="size-4" /> Nothing booked yet
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Sessions appear here as soon as your mentor match is confirmed. Your
                first conversation is free.
              </p>
              <MentorConnectButton
                variant="neo-green"
                size="sm"
                className="mt-4 w-full font-bold"
                source="dashboard_sessions"
                context="Looking for a mentor match."
              >
                Find my mentor
              </MentorConnectButton>
            </div>
          </div>
        </div>

        <div className="mt-6 border-2 border-ink bg-white p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">Suggested next areas</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {pathfinder
                  ? "Based on your Path Finder result. Re-run it whenever your interests shift."
                  : "Run the Path Finder to replace these defaults with your own profile."}
              </p>
            </div>
            <Button asChild variant="neo-dark" className="font-bold">
              <Link to="/pathfinder">
                {pathfinder ? "Re-run Path Finder" : "Run Path Finder"}
              </Link>
            </Button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track) => (
              <div key={track.id} className="border-2 border-ink bg-paper">
                <div className={cn("flex items-center gap-3 border-b-2 border-ink p-4", accentBg[track.accent])}>
                  <TrackIcon icon={track.icon} className="size-5" />
                  <p className="text-sm font-bold">{track.short}</p>
                </div>
                <div className="p-4">
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {track.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {track.projects.slice(0, 2).map((p) => (
                      <span
                        key={p}
                        className="border border-ink/30 bg-white px-2 py-0.5 text-[11px] font-medium"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="border-2 border-ink bg-white p-6">
            <Eyebrow tone="violet">Your plan</Eyebrow>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PLANS.slice(0, 2).map((plan) => (
                <div key={plan.id} className="border-2 border-ink bg-paper p-4">
                  <p className="text-sm font-bold">{plan.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {inr(plan.priceInr)}
                    {plan.billingPeriod === "project" ? " one-time" : " / month"}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {plan.features.slice(0, 3).map((f) => (
                      <li key={f} className="text-[11px] leading-snug">
                        — {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild variant="neo-blue" className="font-bold">
                <Link to="/plans">Compare all plans</Link>
              </Button>
              <Button asChild variant="neo" className="font-bold">
                <Link to="/mentors">Browse mentor seats</Link>
              </Button>
            </div>
          </div>

          <div className="border-2 border-ink bg-ink p-6 text-white">
            <Eyebrow tone="cyan">Explore next</Eyebrow>
            <h2 className="mt-4 text-lg font-bold">
              {EXPLORE_TRACKS.length} fields, one hour a week.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              You do not need to pick a career today. You need to try one thing long
              enough to know whether you like it.
            </p>
            <div className="mt-5 space-y-2">
              <Link
                to="/catalog"
                className="flex items-center justify-between border-2 border-white px-4 py-2.5 text-sm font-bold hover:bg-white hover:text-ink"
              >
                Course & exam catalogue <Rocket className="size-4" />
              </Link>
              <Link
                to="/mentors"
                className="flex items-center justify-between border-2 border-white px-4 py-2.5 text-sm font-bold hover:bg-white hover:text-ink"
              >
                Mentor seats <CircuitBoard className="size-4" />
              </Link>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-white/60">
              <Sparkles className="size-3.5" /> Ask Dishayaan AI from the corner button
              any time.
            </p>
          </div>
        </div>

        <div className="mt-8 border-2 border-dashed border-ink/40 bg-white p-6">
          <SectionHeader
            eyebrow="Coming with the first cohort"
            title="Attendance, project log, mentor feedback and the parent view."
            lead="Your workspace fills up as soon as your mentor match is confirmed: weekly plan, session notes, project reviews and the same progress board your parents see."
          />
        </div>
      </Container>
    </Section>
  );
}
