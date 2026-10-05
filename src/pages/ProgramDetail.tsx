import { Button } from "@/components/ui/button";
import {
  Container,
  Eyebrow,
  Section,
  SectionHeader,
} from "@/components/common/primitives";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { openAIAssistant } from "@/components/ai/AIAssistant";
import { MentorCard, accentBg } from "@/components/cards";
import { EXAM_PROGRAMS, PROGRAMS, programBySlug, trackById } from "@/data/catalog";
import { MENTORS } from "@/data/mentors";
import { inr } from "@/data/plans";
import { useSeo } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Link, useParams } from "react-router";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  Clock,
  Layers,
  Sparkles,
  Users,
} from "lucide-react";
import { track as trackEvent } from "@/lib/analytics";

const KIND_LABEL: Record<string, string> = {
  future: "Explore the future",
  goal: "Prepare for your goal",
  direction: "Find your direction",
};

export default function ProgramDetail() {
  const { slug = "" } = useParams();
  const program = programBySlug(slug);
  const track = program?.trackId ? trackById(program.trackId) : undefined;
  const exam = program?.examCode
    ? EXAM_PROGRAMS.find((e) => e.code === program.examCode)
    : undefined;

  useSeo({
    title: program ? program.title : "Programme",
    description: program
      ? `${program.title} for ${program.classRange} at DishaYaaN — ${program.summary}`
      : "DishaYaaN programme details.",
    path: `/program/${slug}`,
    keywords: program
      ? [program.title, program.classRange, ...program.skills.slice(0, 4)]
      : undefined,
  });

  useEffect(() => {
    if (program) {
      trackEvent("program_view", { slug: program.slug, kind: program.kind });
    }
  }, [program]);

  if (!program) {
    return (
      <Section tone="paper" className="py-24">
        <Container>
          <div className="rounded-xl border border-line bg-card p-10 text-center">
            <h1 className="text-2xl font-bold">
              That programme is not in the catalogue.
            </h1>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Programmes are added and retired as the cohorts change. Browse what is
              running now.
            </p>
            <Button asChild variant="neo-dark" className="mt-6 font-bold">
              <Link to="/catalog">Back to the catalogue</Link>
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  const domainMentors = MENTORS.filter((m) => m.domain === program.trackId).slice(0, 2);
  const related = PROGRAMS.filter(
    (p) => p.id !== program.id && (p.kind === program.kind || p.trackId === program.trackId),
  ).slice(0, 3);

  return (
    <>
      <Section tone="white" className="border-b border-line py-10 sm:py-14">
        <Container>
          <Link
            to="/catalog"
            className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground hover:text-neo-blue"
          >
            ← Course & exam catalogue
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "rounded-xl border border-line px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider",
                    accentBg[program.accent],
                  )}
                >
                  {KIND_LABEL[program.kind]}
                </span>
                {program.examCode ? (
                  <span className="rounded-xl border border-line bg-invert px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-deep">
                    {program.examCode}
                  </span>
                ) : null}
                <span className="rounded-xl border border-line bg-card px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider">
                  {program.mode}
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-bold leading-[1.05] sm:text-4xl">
                {program.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                {program.summary}
              </p>

              <dl className="mt-7 grid gap-3 sm:grid-cols-3">
                {[
                  [Clock, "Classes", program.classRange],
                  [Layers, "Length", `${program.durationWeeks} weeks`],
                  [CalendarClock, "Sessions", `${program.sessionsPerWeek} per week`],
                ].map(([Icon, label, value]) => {
                  const Component = Icon as typeof Clock;
                  return (
                    <div key={String(label)} className="rounded-xl border border-line bg-paper p-4">
                      <dt className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        <Component className="size-3.5" />
                        {label as string}
                      </dt>
                      <dd className="mt-1.5 text-sm font-semibold">{value as string}</dd>
                    </div>
                  );
                })}
              </dl>

              <div className="mt-9 grid gap-7 sm:grid-cols-2">
                <div>
                  <Eyebrow tone="cyan">What you will be able to do</Eyebrow>
                  <ul className="mt-4 space-y-2">
                    {program.outcomes.map((outcome) => (
                      <li key={outcome} className="flex gap-3 text-sm">
                        <span className="mt-1.5 size-2.5 shrink-0 rounded-xl border border-line bg-neo-cyan" />
                        <span className="leading-snug">{outcome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Eyebrow tone="violet">Skills you build</Eyebrow>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {program.skills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-xl border border-line bg-card px-2.5 py-1 font-mono text-xs font-semibold"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-7">
                <Eyebrow tone="green">Projects in this programme</Eyebrow>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {program.projects.map((project) => (
                    <li
                      key={project}
                      className="flex items-center gap-2 rounded-xl border border-line bg-paper px-3 py-2 text-sm font-medium"
                    >
                      <BookOpen className="size-4 shrink-0 text-emerald-700" />
                      {project}
                    </li>
                  ))}
                </ul>
              </div>

              {exam ? (
                <div className="mt-7 rounded-xl border border-line bg-paper p-5">
                  <Eyebrow tone="ink">{exam.name} pathway</Eyebrow>
                  <dl className="mt-4 space-y-3 text-sm">
                    {[
                      ["Who it is for", exam.whoFor],
                      ["Learning approach", exam.approach],
                      ["Mentorship", exam.mentorship],
                      ["Planning", exam.planning],
                      ["Concept support", exam.conceptSupport],
                      ["Progress monitoring", exam.monitoring],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                          {label}
                        </dt>
                        <dd className="mt-0.5 leading-snug">{value}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="mt-4 border-t border-dashed border-line/25 pt-3 text-xs leading-relaxed text-muted-foreground">
                    We publish no rank claims, selection counts or success percentages
                    for any examination.
                  </p>
                </div>
              ) : null}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-xl border border-line bg-card p-5 shadow-neo-cyan">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Fee
                </p>
                <p className="mt-2 font-display text-3xl font-bold">
                  {program.priceInr === null ? (
                    <span className="text-xl">Confirmed on a call</span>
                  ) : (
                    <>
                      {inr(program.priceInr)}
                      <span className="ml-1 font-mono text-xs font-semibold text-muted-foreground">
                        launch fee
                      </span>
                    </>
                  )}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Mentor time, project reviews, materials and the parent view are
                  included. Hardware is arranged at cost and quoted before you commit.
                </p>
                <div className="mt-5 grid gap-2">
                  <Button asChild variant="neo-blue" className="w-full font-bold">
                    <Link to="/plans">
                      Pay & enrol
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="neo-dark" className="w-full font-bold">
                    <Link to={`/book?programme=${program.slug}`}>
                      <CalendarClock className="size-4" />
                      Book a free session
                    </Link>
                  </Button>
                  <MentorConnectButton
                    variant="neo"
                    size="sm"
                    source={`program:${program.slug}`}
                    domain={program.trackId}
                    context={`Opened the ${program.title} programme page.`}
                    className="w-full font-bold"
                  >
                    Talk to a mentor first
                  </MentorConnectButton>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full font-bold"
                    onClick={openAIAssistant}
                  >
                    <Sparkles className="size-4" />
                    Ask DishaYaaN AI
                  </Button>
                </div>
                <p className="mt-4 border-t border-dashed border-line/25 pt-3 text-[11px] leading-relaxed text-muted-foreground">
                  Every fee is refundable within the first seven days.
                </p>
              </div>

              {track ? (
                <div className="rounded-xl border border-line bg-paper p-5">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    Part of
                  </p>
                  <p className="mt-1.5 text-sm font-bold">{track.name}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {track.tagline}
                  </p>
                  <Link
                    to="/catalog"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-neo-blue hover:underline"
                  >
                    All {track.short} programmes <ArrowRight className="size-3" />
                  </Link>
                </div>
              ) : null}
            </aside>
          </div>
        </Container>
      </Section>

      {domainMentors.length > 0 ? (
        <Section tone="paper" className="py-12 sm:py-16">
          <Container>
            <SectionHeader
              eyebrow="Mentors for this programme"
              eyebrowTone="violet"
              title="Who would actually guide you."
              lead="Mentor seats are matched by domain, language and schedule. Profiles publish with a two-minute introduction video once verification is complete."
            />
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {domainMentors.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="neo-dark" className="font-bold">
                <Link to="/mentors">
                  <Users className="size-4" />
                  See every mentor seat
                </Link>
              </Button>
              <Button asChild variant="neo" className="font-bold">
                <Link to="/book">Book a free session</Link>
              </Button>
            </div>
          </Container>
        </Section>
      ) : null}

      {related.length > 0 ? (
        <Section tone="white" className="py-12 sm:py-16">
          <Container>
            <SectionHeader
              eyebrow="Next in the catalogue"
              eyebrowTone="blue"
              title="Programmes that follow on from this one."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id}
                  to={`/program/${item.slug}`}
                  className="rounded-xl border border-line bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-neo"
                >
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    {KIND_LABEL[item.kind]}
                  </p>
                  <p className="mt-2 text-sm font-bold leading-snug">{item.title}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{item.classRange}</p>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      ) : null}
    </>
  );
}
