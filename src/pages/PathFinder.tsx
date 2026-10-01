import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Container,
  Eyebrow,
  Section,
  SectionHeader,
} from "@/components/common/primitives";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { TrackIcon } from "@/components/cards";
import { CLASS_OPTIONS, trackById } from "@/data/catalog";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useSeo } from "@/hooks/use-seo";
import { track } from "@/lib/analytics";
import { getSessionId } from "@/lib/session";
import { cn } from "@/lib/utils";
import type { ExploreTrackId } from "@/types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Info, RefreshCw } from "lucide-react";
import { Link } from "react-router";

type Dimension =
  | "technology"
  | "problemSolving"
  | "research"
  | "engineering"
  | "markets"
  | "peopleAndBusiness";

const DIMENSIONS: Array<{ key: Dimension; label: string }> = [
  { key: "technology", label: "Technology & AI" },
  { key: "problemSolving", label: "Problem solving" },
  { key: "research", label: "Research & science" },
  { key: "engineering", label: "Engineering & making" },
  { key: "markets", label: "Markets & money" },
  { key: "peopleAndBusiness", label: "People & business" },
];

const DIMENSION_TRACKS: Record<Dimension, ExploreTrackId[]> = {
  technology: ["ai-ml", "computer-science"],
  problemSolving: ["computer-science", "physics"],
  research: ["research", "biotechnology", "physics"],
  engineering: ["robotics", "drones", "engineering"],
  markets: ["stock-market", "entrepreneurship"],
  peopleAndBusiness: ["entrepreneurship", "stock-market"],
};

interface Question {
  id: string;
  label: string;
  helper?: string;
  kind?: "class" | "choice";
  options: Array<{ label: string; weights?: Partial<Record<Dimension, number>> }>;
}

const QUESTIONS: Question[] = [
  {
    id: "class",
    label: "Which class are you in?",
    helper: "This only sets the level we suggest — it changes nothing else.",
    kind: "class",
    options: [],
  },
  {
    id: "subjects",
    label: "Which subjects do you actually enjoy?",
    options: [
      { label: "Maths and physics", weights: { problemSolving: 3, engineering: 2, technology: 1 } },
      { label: "Biology and chemistry", weights: { research: 3, engineering: 1 } },
      {
        label: "Commerce, economics and accounts",
        weights: { markets: 3, peopleAndBusiness: 1 },
      },
      {
        label: "Computers and technology",
        weights: { technology: 3, problemSolving: 1 },
      },
      {
        label: "Languages, history and social studies",
        weights: { peopleAndBusiness: 3, research: 1 },
      },
    ],
  },
  {
    id: "afterSchool",
    label: "What do you enjoy doing after school?",
    options: [
      { label: "Taking things apart and building them", weights: { engineering: 3, technology: 1 } },
      { label: "Reading about science or watching documentaries", weights: { research: 3 } },
      { label: "Coding, gaming or exploring software", weights: { technology: 3 } },
      { label: "Tracking business, money or investing", weights: { markets: 3 } },
      { label: "Organising things, debating or leading a group", weights: { peopleAndBusiness: 3 } },
    ],
  },
  {
    id: "tech",
    label: "Which technology excites you most?",
    options: [
      { label: "Artificial intelligence and machine learning", weights: { technology: 3, problemSolving: 1 } },
      { label: "Robotics and machines that move", weights: { engineering: 3, technology: 1 } },
      { label: "Drones and flight systems", weights: { engineering: 2, research: 1 } },
      { label: "Websites, apps and software", weights: { technology: 2, problemSolving: 1 } },
      { label: "Honestly, none of them yet", weights: {} },
    ],
  },
  {
    id: "problems",
    label: "How do you prefer to solve a problem?",
    options: [
      { label: "Work through puzzles and numbers", weights: { problemSolving: 3 } },
      { label: "Try it hands-on and iterate", weights: { engineering: 3 } },
      { label: "Read, research and then decide", weights: { research: 3 } },
      { label: "Look at data and analysis", weights: { markets: 2, problemSolving: 1 } },
      { label: "Talk it through with people", weights: { peopleAndBusiness: 3 } },
    ],
  },
  {
    id: "biology",
    label: "How interested are you in biology and life sciences?",
    options: [
      { label: "Very interested", weights: { research: 3 } },
      { label: "Somewhat interested", weights: { research: 1.5 } },
      { label: "Not really", weights: { engineering: 0.5 } },
    ],
  },
  {
    id: "computers",
    label: "How interested are you in computers and programming?",
    options: [
      { label: "Very interested", weights: { technology: 3, problemSolving: 1 } },
      { label: "Somewhat interested", weights: { technology: 1.5 } },
      { label: "Not really", weights: { peopleAndBusiness: 0.5 } },
    ],
  },
  {
    id: "finance",
    label: "How interested are you in money, business and markets?",
    options: [
      { label: "Very interested", weights: { markets: 3, peopleAndBusiness: 1 } },
      { label: "Somewhat interested", weights: { markets: 1.5 } },
      { label: "Not really", weights: { research: 0.5 } },
    ],
  },
  {
    id: "career",
    label: "Which of these sounds most like you?",
    options: [
      { label: "Building machines or systems that work", weights: { engineering: 3 } },
      { label: "Discovering something no one knew", weights: { research: 3 } },
      { label: "Running my own company or investing", weights: { markets: 2, peopleAndBusiness: 2 } },
      { label: "Teaching, leading or helping people", weights: { peopleAndBusiness: 3 } },
      { label: "I genuinely don't know yet", weights: {} },
    ],
  },
  {
    id: "maths",
    label: "How do you feel about maths?",
    options: [
      { label: "I enjoy it and want more of it", weights: { problemSolving: 3, engineering: 1 } },
      { label: "I'm okay with it", weights: { problemSolving: 1.5 } },
      { label: "I avoid it when I can", weights: { peopleAndBusiness: 1.5, research: 0.5 } },
    ],
  },
  {
    id: "firstBuild",
    label: "If you had a free month, what would you build first?",
    options: [
      { label: "A robot that does something useful", weights: { engineering: 3 } },
      { label: "An AI app that solves a small problem", weights: { technology: 3 } },
      { label: "A science experiment or study", weights: { research: 3 } },
      { label: "A small business or a trading portfolio", weights: { markets: 3 } },
      { label: "A club, event or community", weights: { peopleAndBusiness: 3 } },
    ],
  },
];

const ZERO_PROFILE: Record<Dimension, number> = {
  technology: 0,
  problemSolving: 0,
  research: 0,
  engineering: 0,
  markets: 0,
  peopleAndBusiness: 0,
};

export default function PathFinder() {
  const reduce = useReducedMotion();
  const save = useMutation(api.pathfinder.save);
  const [step, setStep] = useState(0);
  const [studentClass, setStudentClass] = useState("");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  useSeo({
    title: "Path Finder — explore where your interests point",
    description:
      "An eleven-question exploration tool for students of Class 6–12. See which areas you may want to explore next — AI, robotics, drones, computer science, markets, research — and discuss the result with a mentor.",
    path: "/pathfinder",
    keywords: [
      "career exploration tool for students",
      "which stream should I choose",
      "interest assessment Class 10",
      "technology career quiz India",
    ],
  });

  const current = QUESTIONS[step];
  const total = QUESTIONS.length;

  const profile = useMemo(() => {
    const raw = { ...ZERO_PROFILE };
    QUESTIONS.forEach((q) => {
      const choiceIndex = answers[q.id];
      if (choiceIndex === undefined) return;
      const weights = q.options[choiceIndex]?.weights;
      if (!weights) return;
      Object.entries(weights).forEach(([key, value]) => {
        raw[key as Dimension] += value ?? 0;
      });
    });
    const max = Math.max(...Object.values(raw), 0.0001);
    const scaled = { ...ZERO_PROFILE };
    (Object.keys(raw) as Dimension[]).forEach((key) => {
      scaled[key] = Math.round((raw[key] / max) * 100);
    });
    return scaled;
  }, [answers]);

  const ranked = useMemo(() => {
    return [...DIMENSIONS]
      .map((d) => ({ ...d, value: profile[d.key] }))
      .sort((a, b) => b.value - a.value);
  }, [profile]);

  const suggestedTracks = useMemo(() => {
    const ids: ExploreTrackId[] = [];
    ranked.forEach((dim) => {
      DIMENSION_TRACKS[dim.key].forEach((id) => {
        if (!ids.includes(id)) ids.push(id);
      });
    });
    return ids.slice(0, 4).map((id) => trackById(id)).filter(Boolean);
  }, [ranked]);

  const answeredCount = Object.keys(answers).length;

  const handleChoose = (index: number) => {
    if (current.kind === "class") {
      setStudentClass(CLASS_OPTIONS[index]);
      setAnswers((prev) => ({ ...prev, class: index }));
      setStep((s) => s + 1);
      return;
    }
    setAnswers((prev) => ({ ...prev, [current.id]: index }));
    if (step < total - 1) {
      setStep((s) => s + 1);
    } else {
      void finish({ ...answers, [current.id]: index });
    }
  };

  const finish = async (finalAnswers: Record<string, number>) => {
    setDone(true);
    track("pathfinder_complete", { answered: Object.keys(finalAnswers).length });
    setSaving(true);
    try {
      await save({
        sessionId: getSessionId(),
        studentClass: studentClass || undefined,
        answers: finalAnswers,
        profile: {
          technology: profile.technology,
          problemSolving: profile.problemSolving,
          research: profile.research,
          engineering: profile.engineering,
          markets: profile.markets,
          peopleAndBusiness: profile.peopleAndBusiness,
        },
        trackIds: suggestedTracks
          .map((t) => t?.id)
          .filter((v): v is ExploreTrackId => Boolean(v)),
      });
    } catch {
      // Saving is a convenience for the mentor handoff; the result is still valid
      // on screen if it fails.
    } finally {
      setSaving(false);
    }
  };

  const restart = () => {
    setAnswers({});
    setStudentClass("");
    setStep(0);
    setDone(false);
  };

  const mentorContext = `Path Finder result — Technology ${profile.technology}%, Problem solving ${profile.problemSolving}%, Research ${profile.research}%, Engineering ${profile.engineering}%, Markets ${profile.markets}%, People & business ${profile.peopleAndBusiness}%. Suggested areas: ${suggestedTracks.map((t) => t?.short).join(", ")}.${studentClass ? ` Class: ${studentClass}.` : ""}`;

  return (
    <>
      <Section tone="white" className="border-b-2 border-ink py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <SectionHeader
              eyebrow="Path Finder"
              eyebrowTone="violet"
              title="Not sure where to start? Find out where your interests point."
              lead="Eleven questions about what you actually enjoy — not a test, and definitely not a prediction of your future. It tells you which areas are worth trying next, and gives a mentor something concrete to work with."
            />
            <div className="border-2 border-ink bg-neo-yellow p-5 text-deep">
              <p className="flex items-start gap-2 text-sm font-bold">
                <Info className="mt-0.5 size-4 shrink-0" />
                This is an exploration tool.
              </p>
              <p className="mt-2 text-sm leading-relaxed text-deep/80">
                No result here decides your career, your stream or your worth. Treat it
                as a starting conversation, then take it to a mentor who will tell you
                what it does and does not mean.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="paper" className="py-12 sm:py-16">
        <Container>
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={`q-${step}`}
                initial={reduce ? undefined : { opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? undefined : { opacity: 0, x: -24 }}
                transition={{ duration: 0.22 }}
                className="mx-auto max-w-3xl border-2 border-ink bg-card p-6 sm:p-8"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    Question {step + 1} of {total}
                  </p>
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {answeredCount} answered
                  </p>
                </div>
                <Progress value={((step + 1) / total) * 100} className="mt-3 h-2.5" />

                <h2 className="mt-6 text-xl font-bold sm:text-2xl">
                  {current.label}
                </h2>
                {current.helper ? (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {current.helper}
                  </p>
                ) : null}

                {current.kind === "class" ? (
                  <div className="mt-6 max-w-sm">
                    <Select
                      value={studentClass}
                      onValueChange={(v) => {
                        setStudentClass(v);
                        setAnswers((prev) => ({ ...prev, class: 1 }));
                      }}
                    >
                      <SelectTrigger className="border-2 border-ink">
                        <SelectValue placeholder="Select your class" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASS_OPTIONS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="neo-blue"
                      className="mt-4 w-full font-bold"
                      disabled={!studentClass}
                      onClick={() => {
                        track("pathfinder_start", { studentClass });
                        handleChoose(0);
                      }}
                    >
                      Start the questions
                      <ArrowRight className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="mt-6 grid gap-3">
                    {current.options.map((option, i) => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => handleChoose(i)}
                        className={cn(
                          "flex items-center justify-between gap-4 border-2 border-ink px-4 py-3 text-left text-sm font-semibold transition-colors",
                          answers[current.id] === i
                            ? "bg-neo-yellow text-deep"
                            : "bg-card hover:bg-paper",
                        )}
                      >
                        <span>{option.label}</span>
                        <ArrowRight className="size-4 shrink-0" />
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between gap-3 border-t-2 border-dashed border-ink/25 pt-4">
                  <Button
                    variant="ghost"
                    className="font-bold"
                    disabled={step === 0}
                    onClick={() => setStep((s) => Math.max(0, s - 1))}
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {answeredCount >= total - 1
                      ? "Last few — the result appears next."
                      : "Answer based on what you enjoy, not what looks impressive."}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={reduce ? undefined : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6 lg:grid-cols-[1.1fr_1fr]"
              >
                <div className="border-2 border-ink bg-card p-6">
                  <Eyebrow tone="ink">Your exploration profile</Eyebrow>
                  <h2 className="mt-4 text-2xl font-bold">
                    Where your interests point today
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Relative strengths, not scores. These change as you try things.
                  </p>

                  <div className="mt-6 space-y-4">
                    {ranked.map((dim) => (
                      <div key={dim.key}>
                        <div className="flex items-baseline justify-between gap-3">
                          <p className="text-sm font-semibold">{dim.label}</p>
                          <p className="text-sm font-bold">{dim.value}%</p>
                        </div>
                        <Progress value={dim.value} className="mt-2 h-3" />
                      </div>
                    ))}
                  </div>

                  {saving ? (
                    <p className="mt-4 text-xs text-muted-foreground">
                      Saving this result so your mentor can see it…
                    </p>
                  ) : null}
                </div>

                <div className="space-y-6">
                  <div className="border-2 border-ink bg-card p-6">
                    <Eyebrow tone="blue">Areas you may want to explore</Eyebrow>
                    <div className="mt-4 grid gap-3">
                      {suggestedTracks.map((track) =>
                        track ? (
                          <Link
                            key={track.id}
                            to="/catalog"
                            className="flex items-center gap-3 border-2 border-ink bg-paper px-4 py-3 transition-colors hover:bg-neo-yellow"
                          >
                            <TrackIcon icon={track.icon} className="size-5" />
                            <span className="text-sm font-bold">{track.short}</span>
                            <ArrowRight className="ml-auto size-4" />
                          </Link>
                        ) : null,
                      )}
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                      Start with one. Trying something for four weeks teaches you more
                      than deciding in your head for four months.
                    </p>
                  </div>

                  <div className="border-2 border-ink bg-neo-blue p-6 text-white shadow-neo-blue">
                    <p className="font-mono text-sm font-bold uppercase tracking-wider">
                      Want a real second opinion?
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-white/85">
                      A mentor will read this profile with you and be honest about what
                      it does and does not suggest. Free, twenty minutes, no sales
                      script.
                    </p>
                    <MentorConnectButton
                      variant="neo-yellow"
                      className="mt-4 w-full font-bold"
                      source="pathfinder_result"
                      context={mentorContext}
                      domain={suggestedTracks[0]?.id}
                    >
                      Discuss my results with a mentor
                    </MentorConnectButton>
                  </div>

                  <Button
                    variant="neo"
                    className="w-full font-bold"
                    onClick={restart}
                  >
                    <RefreshCw className="size-4" />
                    Run it again
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </Section>
    </>
  );
}
