import { Container, Eyebrow, Section, SectionHeader } from "@/components/common/primitives";
import { HeroSection } from "@/components/home/HeroSection";
import {
  AudienceSection,
  CatalogueSection,
  TracksSection,
} from "@/components/home/SectionsA";
import {
  FaqSection,
  FinalCtaSection,
  JourneySection,
  MentorPreviewSection,
  ParentSection,
  PartnerSection,
  ProjectsSection,
  VoicesSection,
} from "@/components/home/SectionsB";
import { EnquiryForm } from "@/components/forms/Forms";
import { openAIAssistant } from "@/components/ai/AIAssistant";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";
import { useI18n } from "@/i18n";
import { useState } from "react";
import { Sparkles } from "lucide-react";

type Audience = "student" | "parent" | null;

export default function Home() {
  const [audience, setAudience] = useState<Audience>(null);

  useSeo({
    title: "DishaYaaN — mentorship, technology and career guidance for Class 6–12",
    description:
      "DishaYaaN helps students of Class 6–12 explore emerging technology, prepare for JEE, NEET, NDA, CS and CMA, and build real projects with human mentors. Your future is bigger than your syllabus.",
    path: "/",
    keywords: [
      "student mentorship India",
      "career guidance Class 6-12",
      "robotics for students",
      "drone technology course",
      "AI and machine learning for school students",
      "stock market for students",
      "JEE guidance",
      "NEET guidance",
      "NDA preparation",
    ],
  });

  return (
    <>
      <HeroSection />
      <AudienceSection audience={audience} onSelect={setAudience} />
      <TracksSection audience={audience} />
      <CatalogueSection audience={audience} />
      <ProjectsSection />
      <MentorPreviewSection />
      <JourneySection />
      <ParentSection />
      <PartnerSection />
      <VoicesSection />
      <DemandSection />
      <FaqSection />
      <FinalCtaSection />
      <AISection />
    </>
  );
}

function DemandSection() {
  const { t } = useI18n();

  return (
    <Section tone="white" id="demand">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader
              eyebrow={t("home.demand.eyebrow")}
              eyebrowTone="blue"
              title={t("home.demand.title")}
              lead={t("home.demand.lead")}
            />
            <Button
              variant="neo"
              className="mt-6 font-bold"
              onClick={openAIAssistant}
            >
              <Sparkles className="size-4" />
              Ask DishaYaaN AI instead
            </Button>
            <div className="mt-8 border-2 border-ink bg-paper p-5">
              <Eyebrow tone="ink">Privacy</Eyebrow>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                We store what you submit so a real person can respond and so product
                decisions are grounded in evidence. We do not sell data, do not run
                third-party ad trackers, and you can ask us to delete your record at
                any time.
              </p>
            </div>
          </div>
          <EnquiryForm source="home_demand" />
        </div>
      </Container>
    </Section>
  );
}

function AISection() {
  const { t } = useI18n();

  return (
    <Section tone="paper" id="ai">
      <Container>
        <div className="grid gap-8 border-2 border-ink bg-card p-6 shadow-neo-cyan lg:grid-cols-[1.3fr_1fr] lg:p-10">
          <div>
            <Eyebrow tone="cyan">{t("home.ai.eyebrow")}</Eyebrow>
            <h2 className="mt-5 text-3xl font-bold leading-[1.05] sm:text-4xl">
              {t("home.ai.title")}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              {t("home.ai.lead")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="neo-cyan"
                size="lg"
                className="font-bold"
                onClick={openAIAssistant}
              >
                <Sparkles className="size-4" />
                Ask DishaYaaN AI
              </Button>
            </div>
          </div>
          <ul className="space-y-3 text-sm">
            {[
              "Grounded in real DishaYaaN programmes, plans and mentor seats",
              "Credits stored server-side — they survive a reload",
              "Never invents prices, mentors or exam outcomes",
              "Always hands off to a human mentor",
            ].map((line) => (
              <li key={line} className="flex gap-3 border-2 border-ink bg-paper p-3">
                <span className="mt-0.5 size-3 shrink-0 border-2 border-ink bg-neo-cyan" />
                <span className="leading-snug">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
