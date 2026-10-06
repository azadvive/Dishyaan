import { Button } from "@/components/ui/button";
import { Container, Eyebrow, staggerChild, staggerParent } from "@/components/common/primitives";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { openAIAssistant } from "@/components/ai/AIAssistant";
import { NETWORK_NODES } from "@/components/3d/FutureNetwork";
import { useI18n, type TranslationKey } from "@/i18n";
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

const TRUST_LINE: TranslationKey[] = [
  "hero.trustStudents",
  "hero.trustParents",
  "hero.trustMentors",
];

export function HeroSection() {
  const reduce = useReducedMotion();
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const { t } = useI18n();

  return (
    <section className="home-hero relative isolate overflow-hidden border-b border-ink/10 bg-deep">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_78%_42%,rgba(72,104,219,0.22),transparent),radial-gradient(ellipse_45%_55%_at_14%_92%,rgba(116,214,229,0.08),transparent)]" />
      <div className="pointer-events-none absolute inset-0 neo-grid opacity-60 [mask-image:linear-gradient(90deg,transparent,black)]" />
      <Container className="relative py-16 sm:py-22 lg:py-28">
        <motion.div
          variants={reduce ? undefined : staggerParent(0.05)}
          initial={reduce ? undefined : "hidden"}
          animate={reduce ? undefined : "show"}
          className="grid items-center gap-12 lg:grid-cols-[1.08fr_1fr] lg:gap-16"
        >
          <div>
            <motion.div variants={reduce ? undefined : staggerChild}>
              <Eyebrow tone="violet">{t("hero.eyebrow")}</Eyebrow>
            </motion.div>

            <motion.h1
              variants={reduce ? undefined : staggerChild}
              className="mt-8 max-w-[760px] text-[clamp(2.5rem,5.2vw,4.9rem)] font-semibold leading-[1.09] tracking-[-0.06em]"
            >
              {t("hero.titleTop")}
              <br />
              <span className="relative inline-block">
                <span className="relative bg-gradient-to-r from-neo-cyan via-[#b6dbfb] to-[#a7afff] bg-clip-text text-transparent">{t("hero.titleHighlight")}</span>
              </span>{" "}
              {t("hero.titleBottom")}
            </motion.h1>

            <motion.p
              variants={reduce ? undefined : staggerChild}
              className="mt-7 max-w-xl text-base leading-[1.8] text-muted-foreground sm:text-lg"
            >
              {t("hero.lead")}
            </motion.p>

            <motion.div
              variants={reduce ? undefined : staggerChild}
              className="mt-9 flex flex-wrap gap-3"
            >
              <Button asChild variant="neo-blue" size="lg" className="font-bold">
                <Link
                  to="/pathfinder"
                  onClick={() => track("hero_cta_click", { cta: "discover_path" })}
                >
                  {t("hero.ctaDiscover")}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="neo-dark" size="lg" className="font-bold">
                <Link
                  to="/mentors"
                  onClick={() => track("hero_cta_click", { cta: "meet_mentors" })}
                >
                  {t("hero.ctaMentors")}
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
                {t("nav.askAi")}
              </Button>
            </motion.div>

            <motion.div
              variants={reduce ? undefined : staggerChild}
              className="mt-10 grid gap-3 border-t border-ink/15 pt-6 sm:grid-cols-3"
            >
              {TRUST_LINE.map((key) => (
                <p
                  key={key}
                  className="font-mono text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground"
                >
                  {t(key)}
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
                className="rounded-lg border border-ink/25 px-3 py-2 font-sans text-xs font-bold uppercase tracking-wider transition-colors hover:border-neo-cyan hover:text-neo-cyan"
              >
                {t("hero.bookOneToOne")}
              </Link>
            </motion.div>

            {activeNode ? (
              <p className="mt-4 text-xs font-semibold text-muted-foreground">
                {t("hero.exploring")}{" "}
                <span className="text-ink">{activeNode}</span>{" "}
                {t("hero.exploringHint")}
              </p>
            ) : null}
          </div>

          <div className="relative min-w-0">
            <div className="mb-4 flex items-center justify-between gap-3 font-mono">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-neo-cyan">
                {t("hero.networkLabel")}
              </p>
              <span className="rounded-full border border-ink/20 bg-panel px-3 py-1 font-mono text-[10px] font-bold text-ink">
                {NETWORK_NODES.length} {t("hero.pathsSuffix")}
              </span>
            </div>
            <div className="rounded-[28px] border border-ink/15 bg-panel/60 p-2 shadow-[0_32px_100px_-28px_rgba(37,80,184,0.45)] backdrop-blur-sm">
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
              {t("hero.networkNote")}
            </p>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function NetworkSkeleton() {
  const { t } = useI18n();
  return (
    <div className="flex h-[300px] items-center justify-center border-2 border-dashed border-ink/30 sm:h-[420px] lg:h-[520px]">
      <div className="text-center">
        <div className="mx-auto size-16 animate-pulse border-2 border-ink bg-neo-cyan/40" />
        <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {t("hero.loading3d")}
        </p>
      </div>
    </div>
  );
}
