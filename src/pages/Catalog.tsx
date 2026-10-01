import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Container,
  Eyebrow,
  Section,
  SectionHeader,
} from "@/components/common/primitives";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { ProgramCard, TrackCard, accentBg } from "@/components/cards";
import { EXAM_PROGRAMS, EXPLORE_TRACKS, PROGRAMS, CLASS_OPTIONS } from "@/data/catalog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSeo } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { Link } from "react-router";

type Layer = "all" | "future" | "goal" | "direction";

export default function Catalog() {
  const [layer, setLayer] = useState<Layer>("all");
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("");

  useSeo({
    title: "Course & exam catalogue",
    description:
      "The complete Dishayaan catalogue: AI and machine learning, robotics, drone technology, computer science, stock market literacy and more — plus JEE, NEET, NDA, CS and CMA preparation pathways.",
    path: "/catalog",
    keywords: [
      "AI course for school students",
      "robotics course India",
      "drone technology course for students",
      "stock market course for students",
      "JEE NEET NDA CS CMA preparation",
    ],
  });

  const programs = useMemo(() => {
    const byLayer = PROGRAMS.filter((p) => layer === "all" || p.kind === layer);
    const q = query.trim().toLowerCase();
    return byLayer.filter((p) => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.skills.some((s) => s.toLowerCase().includes(q));
      const matchesClass =
        !classFilter || p.classRange.includes(classFilter.replace("Class ", ""));
      return matchesQuery && matchesClass;
    });
  }, [layer, query, classFilter]);

  const showExams = layer === "all" || layer === "goal";

  return (
    <>
      <Section tone="white" className="border-b-2 border-ink py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <SectionHeader
              eyebrow="Course & exam catalogue"
              eyebrowTone="blue"
              title="Everything Dishayaan runs, in one place."
              lead="Organised in three layers so you always know whether you are exploring, preparing for a goal, or working out what to aim at."
            />
            <div className="border-2 border-ink bg-paper p-5">
              <p className="text-sm font-bold">Built for Class 6–12.</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Exploration tracks start at Class 6, technology labs from Class 7–8,
                and exam pathways from Class 9 upwards. Every programme lists its
                sessions, projects and what you will be able to do at the end.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <MentorConnectButton
                  variant="neo-blue"
                  size="sm"
                  source="catalog_header"
                  context="Browsing the catalogue and wants a shortlist."
                >
                  Get a shortlist from a mentor
                </MentorConnectButton>
                <Button asChild variant="neo" size="sm" className="font-bold">
                  <Link to="/pathfinder">Run Path Finder first</Link>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="paper" className="py-12 sm:py-16">
        <Container>
          <div className="flex flex-col gap-4 border-2 border-ink bg-white p-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["all", "All programmes"],
                  ["future", "1 · Explore the future"],
                  ["goal", "2 · Prepare for a goal"],
                  ["direction", "3 · Find your direction"],
                ] as Array<[Layer, string]>
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setLayer(value)}
                  aria-pressed={layer === value}
                  className={cn(
                    "border-2 border-ink px-3 py-2 text-sm font-bold transition-colors",
                    layer === value ? "bg-ink text-white" : "bg-white hover:bg-paper",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:w-[440px]">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search programmes, skills…"
                aria-label="Search programmes"
                className="border-2 border-ink"
              />
              <Select value={classFilter} onValueChange={setClassFilter}>
                <SelectTrigger className="border-2 border-ink">
                  <SelectValue placeholder="Any class" />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_OPTIONS.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {programs.map((program) => (
              <ProgramCard key={program.id} program={program} />
            ))}
          </div>

          {programs.length === 0 ? (
            <p className="mt-6 border-2 border-dashed border-ink/40 bg-white p-8 text-center text-sm text-muted-foreground">
              Nothing matches that filter yet. Clear the search or ask a mentor what
              fits — we will tell you honestly if we do not run it.
            </p>
          ) : null}

          {showExams ? (
            <div className="mt-14">
              <Eyebrow tone="green">Exam preparation</Eyebrow>
              <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
                Prepare for what matters.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                No rank guarantees, no selection promises. What we offer is a plan, a
                mentor and evidence that you are on track.
              </p>
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {EXAM_PROGRAMS.map((exam) => (
                  <article
                    key={exam.code}
                    className="flex h-full flex-col border-2 border-ink bg-white"
                  >
                    <div className={cn("border-b-2 border-ink px-5 py-3", accentBg[exam.accent])}>
                      <h3 className="text-lg font-bold">{exam.name}</h3>
                    </div>
                    <dl className="flex-1 space-y-3 p-5 text-sm">
                      {[
                        ["Who it's for", exam.whoFor],
                        ["Approach", exam.approach],
                        ["Mentorship", exam.mentorship],
                        ["Planning", exam.planning],
                        ["Support", exam.conceptSupport],
                        ["Monitoring", exam.monitoring],
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
                        source={`catalog_exam:${exam.code}`}
                        context={`Interested in ${exam.name}.`}
                        className="w-full font-bold"
                      >
                        Talk to a {exam.code} mentor
                      </MentorConnectButton>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : null}
        </Container>
      </Section>

      <Section tone="white" className="border-t-2 border-ink py-12 sm:py-16">
        <Container>
          <SectionHeader
            eyebrow="Exploration tracks"
            eyebrowTone="violet"
            title="What each field actually contains."
            lead="Skills, projects and pathways for every domain — so 'I want to do AI' becomes a plan."
          />
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {EXPLORE_TRACKS.map((track) => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
