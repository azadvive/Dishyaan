import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  Container,
  Eyebrow,
  Reveal,
  Section,
  SectionHeader,
  Tape,
} from "@/components/common/primitives";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { MentorCard, accentBg } from "@/components/cards";
import { MENTORS } from "@/data/mentors";
import { JOURNEY_STEPS, PARTNER_TYPES, STUDENT_PROJECTS, TESTIMONIALS, FAQS } from "@/data/site";
import { cn } from "@/lib/utils";
import { ArrowRight, Building2, GraduationCap, HeartHandshake, School } from "lucide-react";
import type { ComponentType } from "react";
import { Link } from "react-router";

const PARTNER_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  school: School,
  "graduation-cap": GraduationCap,
  building: Building2,
  "heart-handshake": HeartHandshake,
};

export function MentorPreviewSection() {
  return (
    <Section tone="white" id="mentors">
      <Container>
        <SectionHeader
          eyebrow="Mentorship"
          eyebrowTone="violet"
          title="Learn from people who've walked the path."
          lead="Mentors are matched by domain, language and schedule. Every seat below lists exactly what it covers — and publishes a 2-minute introduction once the mentor completes verification."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {MENTORS.slice(0, 6).map((mentor) => (
            <MentorCard key={mentor.id} mentor={mentor} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button asChild variant="neo-dark" className="font-bold">
            <Link to="/mentors">
              See all mentor seats
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <MentorConnectButton
            variant="neo-violet"
            source="mentor_preview"
            context="Wants to be matched with a mentor."
            className="font-bold"
          >
            Connect with a mentor
          </MentorConnectButton>
        </div>

        <p className="mt-5 max-w-3xl border-2 border-dashed border-ink/30 bg-paper p-4 text-xs leading-relaxed text-muted-foreground">
          We publish no invented names, colleges, employers, ratings or years of
          experience. Until a mentor clears verification you see the seat, its
          coverage and its availability — nothing more.
        </p>
      </Container>
    </Section>
  );
}

export function ProjectsSection() {
  return (
    <Section tone="ink" id="projects">
      <Container>
        <SectionHeader
          eyebrow="Project-based learning"
          eyebrowTone="cyan"
          title="Don't just learn. Build."
          lead="Every track ends in something that exists. Here is the shape of a DishaYaaN project: a problem, a build, a mentor, and a lesson you keep."
          titleClassName="text-ink"
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {STUDENT_PROJECTS.map((project, i) => (
            <Reveal key={project.id} delay={i * 0.05}>
              <article className="flex h-full flex-col border-2 border-ink bg-panel">
                <div className="flex items-start justify-between gap-3 border-b-2 border-ink p-5">
                  <h3 className="text-lg font-bold text-ink">{project.title}</h3>
                  <span
                    className={cn(
                      "border-2 border-ink px-2 py-0.5 font-mono text-[10px] font-bold whitespace-nowrap",
                      accentBg[project.accent],
                    )}
                  >
                    {project.studentClass}
                  </span>
                </div>
                <div className="flex-1 space-y-4 p-5 text-sm text-ink/70">
                  <p className="inline-block border border-neo-yellow px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neo-yellow">
                    Illustrative example — not a real student claim
                  </p>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">
                      Problem
                    </p>
                    <p className="mt-1 leading-relaxed">{project.problem}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">
                      Solution
                    </p>
                    <p className="mt-1 leading-relaxed">{project.solution}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((s) => (
                      <span
                        key={s}
                        className="border border-ink/40 px-2 py-0.5 font-mono text-[11px] font-medium text-ink/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="border-t border-ink/20 pt-3">
                    <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">
                      Mentor
                    </p>
                    <p className="mt-1">{project.mentor}</p>
                    <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">
                      What was learned
                    </p>
                    <p className="mt-1 italic">{project.learned}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function JourneySection() {
  return (
    <Section tone="paper" id="how">
      <Container>
        <SectionHeader
          eyebrow="How DishaYaaN works"
          title="Six steps, in this order, every time."
          lead="No student is dropped into content. The sequence is the product."
        />

        <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {JOURNEY_STEPS.map((step, i) => (
            <Reveal key={step.id} delay={i * 0.05}>
              <li className="flex h-full flex-col border-2 border-ink bg-card p-5">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl font-bold text-ink/30">
                    {step.id}
                  </span>
                  {i < JOURNEY_STEPS.length - 1 ? (
                    <ArrowRight className="size-5 text-muted-foreground" />
                  ) : (
                    <span className="border-2 border-ink bg-neo-green px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-deep">
                      Grow
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

const PROGRESS_ROWS = [
  { label: "Sessions attended", value: 92, note: "18 of 20 this term" },
  { label: "Project completion", value: 70, note: "Line follower in progress" },
  { label: "Skill growth (mentor rated)", value: 64, note: "Sensors, control logic" },
  { label: "Weekly plan adherence", value: 81, note: "Improving for 3 weeks" },
];

export function ParentSection() {
  return (
    <Section tone="white" id="parents">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow="Parent experience"
              eyebrowTone="green"
              title="Parents shouldn't have to guess what their child is learning."
              lead="You see the same picture your child does: what was attended, what is being built, what the mentor observed, and what comes next."
            />
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Progress and attendance, honestly recorded",
                "Current project and the skills it is building",
                "Mentor feedback after each review session",
                "Next recommended step, written in plain language",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 size-3 shrink-0 border-2 border-ink bg-neo-green" />
                  <span className="leading-snug">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              <MentorConnectButton
                variant="neo-green"
                source="parents"
                context="Parent wants to understand what their child would actually do."
                className="font-bold"
              >
                Talk to a mentor about my child
              </MentorConnectButton>
              <Button asChild variant="neo" className="font-bold">
                <Link to="/plans">See what plans include</Link>
              </Button>
            </div>
          </div>

          <Reveal>
            <div className="border-2 border-ink bg-card shadow-neo">
              <div className="flex items-center justify-between gap-2 border-b-2 border-ink bg-paper px-5 py-3">
                <p className="text-sm font-bold uppercase tracking-[0.12em]">
                  Parent dashboard preview
                </p>
                <span className="border-2 border-ink bg-neo-yellow px-2 py-0.5 text-[10px] font-bold">
                  Prototype
                </span>
              </div>
              <div className="space-y-5 p-5">
                {PROGRESS_ROWS.map((row) => (
                  <div key={row.label}>
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm font-semibold">{row.label}</p>
                      <p className="text-sm font-bold">{row.value}%</p>
                    </div>
                    <Progress value={row.value} className="mt-2 h-2.5" />
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {row.note}
                    </p>
                  </div>
                ))}
                <div className="grid gap-3 border-t-2 border-dashed border-ink/25 pt-4 sm:grid-cols-2">
                  <div className="border-2 border-ink bg-paper p-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Mentor note
                    </p>
                    <p className="mt-1 text-xs leading-snug">
                      Debugging habits have improved. Ready for a vision sensor
                      next.
                    </p>
                  </div>
                  <div className="border-2 border-ink bg-neo-yellow p-3 text-deep">
                    <p className="text-[11px] font-bold uppercase tracking-wider">
                      Next recommended step
                    </p>
                    <p className="mt-1 text-xs leading-snug">
                      Extend the rover project and present at Demo Day.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Illustrative layout. Live values come from the student's real
              attendance, project log and mentor reviews once enrolled.
            </p>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

export function PartnerSection() {
  return (
    <Section tone="paper" id="partners">
      <Container>
        <SectionHeader
          eyebrow="Institution collaboration"
          eyebrowTone="cyan"
          title="Schools, colleges and coaching centres — let's build the layer you don't have."
          lead="DishaYaaN runs alongside your institution: we bring the mentors, labs and future-readiness pathways, you keep your academic strength."
        />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PARTNER_TYPES.map((partner) => {
            const Icon = PARTNER_ICONS[partner.icon] ?? Building2;
            return (
              <Reveal key={partner.id}>
                <article className="flex h-full flex-col border-2 border-ink bg-card">
                  <div className={cn("border-b-2 border-ink p-4", accentBg[partner.accent])}>
                    <Icon className="size-6" />
                    <h3 className="mt-3 text-base font-bold">{partner.name}</h3>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-sm font-semibold">{partner.line}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {partner.detail}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-8 border-2 border-ink bg-card p-6">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <Eyebrow tone="ink">Requirement first</Eyebrow>
              <h3 className="mt-4 text-xl font-bold">
                Tell us what your students need. We build around that.
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                The partnership form asks for the specific problem — number of
                students, weekly time available, equipment reality, reporting you
                need. We reply with a scoped pilot, not a brochure.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild variant="neo-dark" size="lg" className="font-bold">
                <Link to="/partners">
                  Open the partnership form
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="neo" className="font-bold">
                <Link to="/partners#requirement">
                  See student requirement questions
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export function VoicesSection() {
  return (
    <Section tone="white">
      <Container>
        <SectionHeader
          eyebrow="Social proof"
          title="We would rather show nothing than show fake proof."
          lead="DishaYaaN's first cohort is in progress. These slots fill with real, consented voices as soon as we have them."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.author}
              className="flex h-full flex-col border-2 border-dashed border-ink/40 bg-paper p-5"
            >
              <blockquote className="flex-1 text-sm italic leading-relaxed text-muted-foreground">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-4 border-t-2 border-dashed border-ink/25 pt-3">
                <p className="text-sm font-bold">{t.author}</p>
                <p className="text-xs text-muted-foreground">{t.context}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export function FaqSection() {
  return (
    <Section tone="paper" id="faq">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <SectionHeader
            eyebrow="Questions"
            title="Straight answers."
            lead="If your question is not here, ask DishaYaaN AI or a mentor directly."
          />
          <Accordion type="single" collapsible className="border-2 border-ink bg-card">
            {FAQS.map((faq, i) => (
              <AccordionItem
                key={faq.q}
                value={`faq-${i}`}
                className="border-b-2 border-ink px-5 last:border-b-0"
              >
                <AccordionTrigger className="text-left text-sm font-bold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </Section>
  );
}

export function FinalCtaSection() {
  return (
    <>
      <Tape
        tone="yellow"
        items={[
          "Discover",
          "Diagnose",
          "Match",
          "Learn",
          "Build",
          "Achieve",
          "Robotics",
          "Drones",
          "AI & ML",
          "Machine Learning",
          "Stock Market",
          "JEE · NEET · NDA · CS · CMA",
        ]}
      />
      <Section tone="ink" id="start">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <Eyebrow tone="cyan">Your next step</Eyebrow>
              <h2 className="mt-5 text-3xl font-bold leading-[1.05] text-ink sm:text-4xl lg:text-5xl">
                Your next step can start here.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/70">
                Two minutes to tell us what you need. Or skip the form and have a free
                conversation with a mentor who works in the field you are curious
                about.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <MentorConnectButton
                  variant="neo-blue"
                  size="lg"
                  source="final_cta"
                  context="Arrived at the final call to action."
                  className="font-bold"
                >
                  Connect with a mentor
                </MentorConnectButton>
                <Button asChild variant="neo-yellow" size="lg" className="font-bold">
                  <Link to="/plans">
                    Compare plans
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="neo" size="lg" className="font-bold">
                  <Link to="/pathfinder">Run the Path Finder</Link>
                </Button>
              </div>
            </div>
            <div className="border-2 border-ink bg-panel p-6">
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-neo-cyan">
                What happens after you reach out
              </p>
              <ol className="mt-4 space-y-4 text-sm text-ink/75">
                {[
                  "We read what you sent — a person, not an autoresponder.",
                  "A mentor in your domain messages you on WhatsApp within a day.",
                  "You get a free 20-minute conversation before any payment.",
                  "If DishaYaaN is not the right fit, we will say so.",
                ].map((line, i) => (
                  <li key={line} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center border-2 border-neo-cyan text-[11px] font-bold text-neo-cyan">
                      {i + 1}
                    </span>
                    <span className="leading-snug">{line}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
