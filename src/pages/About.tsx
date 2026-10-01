import { Button } from "@/components/ui/button";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import {
  Container,
  Eyebrow,
  Reveal,
  Section,
  SectionHeader,
  Tape,
} from "@/components/common/primitives";
import { EXPLORE_TRACKS } from "@/data/catalog";
import { useSeo } from "@/hooks/use-seo";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

const PRINCIPLES = [
  {
    title: "We do not invent proof",
    body: "No fake testimonials, no borrowed logos, no rank claims. Anything on this site is either true today or explicitly marked as a placeholder.",
  },
  {
    title: "Mentors are people, not content",
    body: "A mentor's job is to look at your specific situation and tell you the truth, including when your current plan is wrong.",
  },
  {
    title: "AI assists; humans decide",
    body: "Dishayaan AI narrows the field quickly. A person then helps you choose a direction and stay with it.",
  },
  {
    title: "Parents are partners",
    body: "A parent who can see the plan can support it. Visibility is a feature, not a privilege.",
  },
];

const AUDIENCE_THINKING = [
  {
    title: "How we think about students",
    body: "You are not a syllabus to be covered. You are someone with curiosity, limited time and real pressure from school. Dishayaan tries to make exploration cheap — one hour a week that widens what you think is possible for yourself.",
    accent: "bg-neo-blue text-white",
  },
  {
    title: "How we think about parents",
    body: "You deserve to know what happens after school hours without interrogating your child. You get the same roadmap, attendance and mentor notes they do, in plain language.",
    accent: "bg-neo-green text-white",
  },
  {
    title: "How we think about mentors",
    body: "Mentors are paid professionals with limited hours. We protect that time with clear formats, real context before each session and honest feedback channels.",
    accent: "bg-neo-violet text-white",
  },
];

export default function About() {
  useSeo({
    title: "Why Dishayaan exists",
    description:
      "Dishayaan bridges the gap between academics and the real world for students of Class 6–12: exposure, mentorship, technology awareness, projects, career guidance and decision-making.",
    path: "/about",
    keywords: [
      "why mentorship matters for students",
      "future readiness for students",
      "career awareness Class 10",
      "education platform India",
    ],
  });

  return (
    <>
      <Section tone="white" className="border-b-2 border-ink py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <SectionHeader
                eyebrow="About Dishayaan"
                eyebrowTone="violet"
                title="Why Dishayaan exists."
                lead="Traditional academics matter — and they are not enough on their own. A student can score well and still have no idea what they enjoy, what they are good at, or what the world they are stepping into actually looks like."
              />
            </div>
            <div className="border-2 border-ink bg-paper p-6">
              <Eyebrow tone="ink">The gap we work on</Eyebrow>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  "Exposure to emerging fields",
                  "A human who has done the work",
                  "Technology awareness that is current",
                  "Projects that prove capability",
                  "Career awareness beyond two or three famous jobs",
                  "Decision-making practice",
                  "Real-world context for what is studied",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1.5 size-2.5 shrink-0 border-2 border-ink bg-neo-yellow" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t-2 border-dashed border-ink/30 pt-4 text-sm leading-relaxed text-muted-foreground">
                Dishayaan exists to close that gap without pretending school does not
                matter.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="paper" className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="h-full border-2 border-ink bg-white p-6">
                <Eyebrow tone="blue">Our vision</Eyebrow>
                <h2 className="mt-4 text-2xl font-bold leading-tight">
                  Every student should be able to name three futures they would
                  genuinely want — before they are asked to choose one.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Not by predicting anything, and not by selling reassurance. By
                  giving students real exposure, real mentors and real projects, then
                  helping them build a plan they can defend.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="h-full border-2 border-ink bg-white p-6">
                <Eyebrow tone="ink">The problem</Eyebrow>
                <div className="mt-4 space-y-4 text-sm leading-relaxed text-muted-foreground">
                  <p>
                    Most students in Class 6–12 receive two inputs: a syllabus and exam
                    pressure. Exposure to technology, careers and research usually
                    arrives either too late or only for students with well-connected
                    families.
                  </p>
                  <p>
                    Meanwhile the fields that will shape their twenties — AI, machine
                    learning, robotics, drones, biotech, financial markets — are either
                    invisible in school or reduced to a single computer period.
                  </p>
                  <p className="font-semibold text-ink">
                    The result is bright students choosing a path by elimination
                    rather than by desire.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Section tone="white" className="py-14 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Our approach"
            eyebrowTone="green"
            title="Discover. Learn. Build. Achieve."
            lead="Four verbs, in that order. Discovery before curriculum, projects before certificates, and a plan before any payment."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "Discover",
                body: "Interests, subjects and what you actually enjoy doing after school hours.",
              },
              {
                step: "Learn",
                body: "A structured path with a mentor who reviews your week, not just your test score.",
              },
              {
                step: "Build",
                body: "Something real in every track: a robot, a model, a drone mission, a research note, a portfolio.",
              },
              {
                step: "Achieve",
                body: "Progress reviewed against your goal charter, with the roadmap updated as you grow.",
              },
            ].map((item) => (
              <div key={item.step} className="border-2 border-ink bg-paper p-5">
                <p className="font-display text-lg font-bold">{item.step}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Tape
        tone="blue"
        items={EXPLORE_TRACKS.map((t) => t.short).concat([
          "Mentorship",
          "Projects",
          "Parent visibility",
        ])}
      />

      <Section tone="paper" className="py-14 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Our philosophy"
            title="How we operate, stated plainly."
            lead="These are commitments, not slogans. They are the reason some sections of this site currently look empty — the real ones come later."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <Reveal key={p.title}>
                <div className="h-full border-2 border-ink bg-white p-6">
                  <h3 className="text-lg font-bold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="white" className="py-14 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Three audiences"
            eyebrowTone="violet"
            title="Students, parents and mentors are treated as three different products."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {AUDIENCE_THINKING.map((item) => (
              <div key={item.title} className="border-2 border-ink bg-white">
                <div className={`border-b-2 border-ink p-5 ${item.accent}`}>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                </div>
                <p className="p-5 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="ink" className="py-14 sm:py-20">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <Eyebrow tone="cyan">The future of learning</Eyebrow>
              <h2 className="mt-5 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
                The digital campus for the future.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70">
                Students explore. Mentors guide. AI assists. Projects demonstrate.
                Parents understand. Careers become clearer. That is the whole
                architecture — and v1 is the first honest slice of it, built around
                the six domains students actually asked for: AI, machine learning,
                robotics, drone technology, computer science and financial markets.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="neo-yellow" size="lg" className="font-bold">
                  <Link to="/catalog">
                    See the catalogue
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <MentorConnectButton
                  variant="neo-blue"
                  size="lg"
                  source="about"
                  context="Read the About page."
                  className="font-bold"
                >
                  Connect with a mentor
                </MentorConnectButton>
              </div>
            </div>
            <div className="border-2 border-white bg-midnight p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-neo-cyan">
                Founder story
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                This section publishes when the founding team is ready to be named
                publicly, with their own words — not a marketing paragraph written for
                them. Nothing is written here on their behalf until then.
              </p>
              <p className="mt-4 text-xs text-white/50">
                Require further detail? Ask through the partnership or enquiry form and
                we will answer directly.
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
