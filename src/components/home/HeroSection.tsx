import { Button } from "@/components/ui/button";
import { Container, Eyebrow, staggerChild, staggerParent } from "@/components/common/primitives";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { openAIAssistant } from "@/components/ai/AIAssistant";
import { NETWORK_NODES } from "@/components/3d/FutureNetwork";
import { track } from "@/lib/analytics";
import { motion, useReducedMotion } from "framer-motion";
import { Suspense, lazy, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";

const FutureNetwork = lazy(() =>
  import("@/components/3d/FutureNetwork").then((m) => ({
    default: m.FutureNetwork,
  })),
);

const TRUST_LINE = [
  "Guidance for students",
  "Visibility for parents",
  "Perspective from mentors",
];

export function HeroSection() {
  const reduce = useReducedMotion();
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <section className="relative overflow-hidden border-b-2 border-ink bg-deep">
      <div className="pointer-events-none absolute inset-0 neo-grid opacity-70" />
      <Container className="relative py-12 sm:py-16 lg:py-20">
        <motion.div
          variants={reduce ? undefined : staggerParent(0.05)}
          initial={reduce ? undefined : "hidden"}
          animate={reduce ? undefined : "show"}
          className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]"
        >
          <div>
            <motion.div variants={reduce ? undefined : staggerChild}>
              <Eyebrow tone="violet">
                Mentorship × Technology × Career × Exams
              </Eyebrow>
            </motion.div>

            <motion.h1
              variants={reduce ? undefined : staggerChild}
              className="mt-6 text-[2.15rem] font-bold leading-[1.02] sm:text-5xl lg:text-[3.6rem]"
            >
              Your Future Is
              <br />
              <span className="relative inline-block">
                <span
                  aria-hidden
                  className="absolute bottom-1 left-0 h-3 w-full bg-neo-yellow"
                />
                <span className="relative">Bigger Than</span>
              </span>{" "}
              Your Syllabus.
            </motion.h1>

            <motion.p
              variants={reduce ? undefined : staggerChild}
              className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              DishaYaaN is a mentorship programme for students of Class 6–12:
              one-to-one counselling, emerging technology, real projects and honest
              guidance from mentors who have walked the path.
            </motion.p>

            <motion.div
              variants={reduce ? undefined : staggerChild}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Button asChild variant="neo-blue" size="lg" className="font-bold">
                <Link
                  to="/pathfinder"
                  onClick={() => track("hero_cta_click", { cta: "discover_path" })}
                >
                  Discover Your Path
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="neo-dark" size="lg" className="font-bold">
                <Link
                  to="/mentors"
                  onClick={() => track("hero_cta_click", { cta: "meet_mentors" })}
                >
                  Meet Our Mentors
                </Link>
              </Button>
              <Button
                variant="neo"
                size="lg"
                className="font-bold"
                onClick={() => {
                  openAIAssistant();
                  track("hero_cta_click", { cta: "ask_ai" });
                }}
              >
                <Sparkles className="size-4" />
                Ask DishaYaaN AI
              </Button>
            </motion.div>

            <motion.div
              variants={reduce ? undefined : staggerChild}
              className="mt-8 grid gap-2 border-t-2 border-dashed border-ink/30 pt-5 sm:grid-cols-3"
            >
              {TRUST_LINE.map((item) => (
                <p
                  key={item}
                  className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                >
                  {item}
                </p>
              ))}
            </motion.div>

            <motion.div
              variants={reduce ? undefined : staggerChild}
              className="mt-6 flex flex-wrap items-center gap-3"
            >
              <MentorConnectButton source="hero" variant="neo-green" size="sm" />
              <Link
                to="/book"
                onClick={() => track("hero_cta_click", { cta: "book_session" })}
                className="border-2 border-ink px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-colors hover:bg-neo-cyan hover:text-deep"
              >
                Book a one-to-one session →
              </Link>
            </motion.div>

            {activeNode ? (
              <p className="mt-4 text-xs font-semibold text-muted-foreground">
                Exploring: <span className="text-ink">{activeNode}</span> — read the
                details beside the network.
              </p>
            ) : null}
          </div>

          <div className="relative">
            <div className="mb-4 flex items-center justify-between gap-3 font-mono">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-neo-cyan">
                Future path network — hover a node
              </p>
              <span className="border-2 border-ink bg-invert px-2 py-0.5 font-mono text-[10px] font-bold text-deep">
                {NETWORK_NODES.length} paths
              </span>
            </div>
            <div className="border-2 border-ink bg-paper p-2">
              <Suspense fallback={<NetworkSkeleton />}>
                <FutureNetwork
                  className="w-full"
                  onHover={(node) =>
                    setActiveNode(node ? `${node.label} — ${node.subs.join(" · ")}` : null)
                  }
                />
              </Suspense>
            </div>
            <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">
              Every node is a real DishaYaaN track. Hover to see the skills and
              projects inside it. On phones and low-power devices this renders as a
              lighter 2D map so the page stays fast.
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function NetworkSkeleton() {
  return (
    <div className="flex h-[300px] items-center justify-center border-2 border-dashed border-ink/30 sm:h-[420px] lg:h-[520px]">
      <div className="text-center">
        <div className="mx-auto size-16 animate-pulse border-2 border-ink bg-neo-cyan/40" />
        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Loading 3D network…
        </p>
      </div>
    </div>
  );
}
