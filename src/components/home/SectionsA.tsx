import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Container,
  Eyebrow,
  Reveal,
  Section,
  SectionHeader,
} from "@/components/common/primitives";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { ProgramCard, TrackCard, TrackIcon, accentBg } from "@/components/cards";
import { EXAM_PROGRAMS, EXPLORE_TRACKS, PROGRAMS } from "@/data/catalog";
import { track } from "@/lib/analytics";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import type { ExploreTrack } from "@/types";
import { ArrowRight, GraduationCap, Users } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

type Audience = "student" | "parent" | null;

export function AudienceSection({
  audience,
  onSelect,
}: {
  audience: Audience;
  onSelect: (a: Audience) => void;
}) {
  const { t } = useI18n();

  return (
    <Section tone="paper" id="audience">
      <Container>
        <SectionHeader
          eyebrow={t("home.audience.eyebrow")}
          title={t("home.audience.title")}
          lead={t("home.audience.lead")}
        />

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div
              className={cn(
                "flex h-full flex-col border-2 border-ink bg-card p-6 transition-all",
                audience === "student" && "shadow-neo",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <Users className="size-5" />
                  <h3 className="text-xl font-bold">Student</h3>
                </span>
                <span className="border-2 border-ink bg-neo-blue px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Class 6–12
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Explore what excites you. Build what you imagine. Discover where it
                can take you — robotics, drones, AI, machine learning, markets,
                research and more.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  variant="neo-blue"
                  className="font-bold"
                  onClick={() => {
                    onSelect("student");
                    track("student_selected", { source: "audience_panel" });
                    document
                      .getElementById("tracks")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore as a Student
                  <ArrowRight className="size-4" />
                </Button>
                <Button asChild variant="neo" className="font-bold">
                  <Link to="/catalog">See the catalogue</Link>
                </Button>
              </div>
              <div className="mt-5 border-t-2 border-dashed border-ink/25 pt-4">
                <MentorConnectButton
                  source="audience_student"
                  variant="neo"
                  size="sm"
                  icon={false}
                  className="text-xs"
                >
                  Not sure where to start? Talk to a mentor
                </MentorConnectButton>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div
              className={cn(
                "flex h-full flex-col border-2 border-ink bg-card p-6 transition-all",
                audience === "parent" && "shadow-neo",
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2">
                  <GraduationCap className="size-5" />
                  <h3 className="text-xl font-bold">Parent</h3>
                </span>
                <span className="border-2 border-ink bg-neo-green px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Progress visible
                </span>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Understand your child's interests, strengths and possible pathways —
                and see what actually happens after school hours.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button
                  variant="neo-dark"
                  className="font-bold"
                  onClick={() => {
                    onSelect("parent");
                    track("parent_selected", { source: "audience_panel" });
                    document
                      .getElementById("parents")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore as a Parent
                  <ArrowRight className="size-4" />
                </Button>
                <Button asChild variant="neo" className="font-bold">
                  <Link to="/plans">See plans & fees</Link>
                </Button>
              </div>
              <div className="mt-5 border-t-2 border-dashed border-ink/25 pt-4">
                <MentorConnectButton
                  source="audience_parent"
                  variant="neo"
                  size="sm"
                  icon={false}
                  className="text-xs"
                >
                  Ask a mentor what suits my child
                </MentorConnectButton>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export function TracksSection({ audience }: { audience: Audience }) {
  const [selected, setSelected] = useState<ExploreTrack>(EXPLORE_TRACKS[0]);
  const { t } = useI18n();

  return (
    <Section tone="white" id="tracks">
      <Container>
        <SectionHeader
          eyebrow={t("home.tracks.eyebrow")}
          eyebrowTone="blue"
          title={
            <>
              {t("home.tracks.title1")}
              <br />
              {t("home.tracks.title2")}
            </>
          }
          lead={t("home.tracks.lead")}
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Reveal className="order-2 lg:order-1">
            <div className="grid gap-3 sm:grid-cols-2">
              {EXPLORE_TRACKS.map((track) => (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => {
                    setSelected(track);
                    track_explore(track.id);
                  }}
                  aria-pressed={selected.id === track.id}
                  className={cn(
                    "flex items-center gap-3 border-2 border-ink px-3 py-3 text-left font-mono transition-colors",
                    selected.id === track.id
                      ? "bg-neo-yellow text-deep"
                      : "bg-paper hover:bg-card",
                  )}
                >
                  <TrackIcon icon={track.icon} className="size-5 shrink-0" />
                  <span className="text-sm font-bold leading-tight">
                    {track.short}
                  </span>
                </button>
              ))}
            </div>
          </Reveal>

          <div className="order-1 lg:order-2">
            <div className="border-2 border-ink bg-card shadow-neo-cyan">
              <div
                className={cn(
                  "flex items-center justify-between gap-3 border-b-2 border-ink p-5",
                  accentBg[selected.accent],
                )}
              >
                <div className="flex items-center gap-3">
                  <TrackIcon icon={selected.icon} className="size-7" />
                  <h3 className="text-lg font-bold leading-tight">
                    {selected.name}
                  </h3>
                </div>
              </div>
              <div className="space-y-4 p-5">
                <p className="text-sm font-semibold">{selected.tagline}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {selected.summary}
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      Skills you build
                    </p>
                    <ul className="mt-2 space-y-1">
                      {selected.skills.map((s) => (
                        <li key={s} className="text-sm">
                          — {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                      Projects
                    </p>
                    <ul className="mt-2 space-y-1">
                      {selected.projects.map((p) => (
                        <li key={p} className="text-sm">
                          — {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="border-t-2 border-dashed border-ink/25 pt-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Possible pathways
                  </p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {selected.pathways.map((p) => (
                      <li
                        key={p}
                        className="border border-ink/40 bg-paper px-2 py-0.5 text-xs font-medium"
                      >
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button asChild variant="neo-dark" className="font-bold">
                    <Link
                      to="/catalog"
                      onClick={() => track("track_explore", { track: selected.id })}
                    >
                      Explore this field
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <MentorConnectButton
                    variant="neo-violet"
                    source="tracks"
                    domain={selected.id}
                    context={`Selected the ${selected.short} track.${audience ? ` Exploring as a ${audience}.` : ""}`}
                    className="font-bold"
                  >
                    Talk to a {selected.short} mentor
                  </MentorConnectButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

function track_explore(trackId: string) {
  track("track_explore", { track: trackId });
}

export function CatalogueSection({ audience }: { audience: Audience }) {
  const future = PROGRAMS.filter((p) => p.kind === "future");
  const goal = PROGRAMS.filter((p) => p.kind === "goal");
  const direction = PROGRAMS.filter((p) => p.kind === "direction");
  const { t } = useI18n();

  return (
    <Section tone="paper" id="catalogue">
      <Container>
        <SectionHeader
          eyebrow={t("home.catalog.eyebrow")}
          eyebrowTone="green"
          title={t("home.catalog.title")}
          lead={t("home.catalog.lead")}
        />

        <Tabs defaultValue="future" className="mt-10">
          <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
            {[
              { value: "future", label: "1 · Explore the future", count: future.length },
              { value: "goal", label: "2 · Prepare for your goal", count: goal.length },
              { value: "direction", label: "3 · Find your direction", count: direction.length },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="border-2 border-ink bg-card px-4 py-2.5 font-mono text-sm font-bold data-[state=active]:bg-invert data-[state=active]:text-deep"
              >
                {tab.label}
                <span className="ml-2 border border-current px-1.5 py-0.5 text-[10px]">
                  {tab.count}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="future" className="mt-6">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {future.slice(0, 6).map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="goal" className="mt-6">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {EXAM_PROGRAMS.map((exam) => (
                <article
                  key={exam.code}
                  className="flex h-full flex-col border-2 border-ink bg-card"
                >
                  <div className={cn("border-b-2 border-ink px-5 py-3", accentBg[exam.accent])}>
                    <h3 className="text-lg font-bold">{exam.name}</h3>
                  </div>
                  <dl className="flex-1 space-y-3 p-5 text-sm">
                    {[
                      ["Who it's for", exam.whoFor],
                      ["Learning approach", exam.approach],
                      ["Mentorship", exam.mentorship],
                      ["Planning", exam.planning],
                      ["Concept support", exam.conceptSupport],
                      ["Progress monitoring", exam.monitoring],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          {label}
                        </dt>
                        <dd className="mt-0.5 leading-snug">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="border-t-2 border-ink p-5">
                    <MentorConnectButton
                      variant="neo"
                      size="sm"
                      source={`exam:${exam.code}`}
                      context={`Asked about the ${exam.name} pathway.`}
                      className="w-full font-bold"
                    >
                      Talk to a {exam.code} mentor
                    </MentorConnectButton>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-5 border-2 border-dashed border-ink/30 bg-card p-4 text-xs leading-relaxed text-muted-foreground">
              We do not publish rank claims, selection counts or success
              percentages. When a cohort completes, real numbers with methodology
              will appear here — not before.
            </p>
          </TabsContent>

          <TabsContent value="direction" className="mt-6">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {direction.map((program) => (
                <ProgramCard key={program.id} program={program} />
              ))}
              <article className="flex h-full flex-col justify-between border-2 border-ink bg-neo-yellow p-5 text-deep">
                <div>
                  <Eyebrow tone="ink">Path Finder</Eyebrow>
                  <h3 className="mt-4 text-lg font-bold">
                    Not sure which layer fits?
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed">
                    Answer eleven short questions and get an exploration profile with
                    areas worth trying — then take it to a mentor.
                  </p>
                </div>
                <Button asChild variant="neo-dark" className="mt-6 w-full font-bold">
                  <Link to="/pathfinder">
                    Find your path
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </article>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild variant="neo-dark" className="font-bold">
            <Link to="/catalog">
              Open the full catalogue
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <MentorConnectButton
            variant="neo-blue"
            source="catalogue"
            context={`Browsing the catalogue${audience ? ` as a ${audience}` : ""}.`}
            className="font-bold"
          >
            Ask a mentor to shortlist for me
          </MentorConnectButton>
        </div>
      </Container>
    </Section>
  );
}
