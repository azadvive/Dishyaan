import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { PartnerForm } from "@/components/forms/Forms";
import {
  Container,
  Eyebrow,
  Reveal,
  Section,
  SectionHeader,
} from "@/components/common/primitives";
import { accentBg } from "@/components/cards";
import { PARTNER_TYPES } from "@/data/site";
import { useSeo } from "@/hooks/use-seo";
import { Building2, GraduationCap, HeartHandshake, School } from "lucide-react";
import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

const PARTNER_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  school: School,
  "graduation-cap": GraduationCap,
  building: Building2,
  "heart-handshake": HeartHandshake,
};

const DELIVERY_MODELS = [
  {
    title: "Add-on lab",
    body: "One slot a week on your timetable. Dishayaan supplies the mentor, the curriculum and the equipment plan; your faculty supervise.",
  },
  {
    title: "Mentor pool",
    body: "You already teach the subject — we provide domain mentors for project reviews, career sessions and doubt clinics.",
  },
  {
    title: "Future-readiness programme",
    body: "A term-long programme covering exploration, projects, career sessions and parent orientation, with reporting for your team.",
  },
];

const REQUIREMENT_QUESTIONS = [
  "How many students, and which classes, would take part?",
  "How many hours per week can your timetable realistically give?",
  "What equipment do students already have at home or in the lab?",
  "Which domains matter most to your students right now?",
  "What language should sessions be delivered in?",
  "What do your parents ask about most often?",
  "What reporting does your management need each term?",
  "Is there a budget cycle we should fit into?",
  "Would you start with a paid pilot, or a single demonstration session?",
  "Who is accountable on your side for attendance and outcomes?",
];

export default function Partners() {
  useSeo({
    title: "Partner with Dishayaan — schools, colleges and coaching centres",
    description:
      "Dishayaan collaborates with schools, colleges, coaching centres and NGOs to deliver future-readiness labs, mentor pools and project programmes. Submit your student requirement and we will scope a pilot.",
    path: "/partners",
    keywords: [
      "school partnership robotics lab",
      "college industry mentorship programme",
      "coaching centre collaboration",
      "future readiness programme for schools",
      "AI lab for schools India",
    ],
  });

  return (
    <>
      <Section tone="white" className="border-b-2 border-ink py-14 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
            <SectionHeader
              eyebrow="Institution collaboration"
              eyebrowTone="cyan"
              title="We build alongside institutions, not against them."
              lead="Dishayaan is not trying to replace your faculty or your pedagogy. We add the layer that is hardest to staff internally: current technology exposure, industry mentors, project supervision and career guidance."
            />
            <div className="border-2 border-ink bg-paper p-6">
              <Eyebrow tone="ink">What we need from you</Eyebrow>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Not a signed contract — a requirement. Tell us the specific problem
                you face with your students and we will respond with a scoped plan,
                the mentor profile that fits, the reporting format and a cost. A pilot
                comes before any annual commitment.
              </p>
              <div className="mt-5 border-t-2 border-dashed border-ink/30 pt-4">
                <MentorConnectButton
                  variant="neo-dark"
                  source="partners_header"
                  context="Represents an institution and wants to scope a programme."
                  className="font-bold"
                >
                  Speak to the partnership team
                </MentorConnectButton>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="paper" className="py-14 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Who we work with"
            title="Four kinds of collaboration."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {PARTNER_TYPES.map((partner) => {
              const Icon = PARTNER_ICONS[partner.icon] ?? Building2;
              return (
                <Reveal key={partner.id}>
                  <article className="flex h-full flex-col border-2 border-ink bg-white">
                    <div
                      className={cn(
                        "flex items-center gap-3 border-b-2 border-ink p-5",
                        accentBg[partner.accent],
                      )}
                    >
                      <Icon className="size-6" />
                      <h3 className="text-lg font-bold">{partner.name}</h3>
                    </div>
                    <div className="flex-1 p-5">
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
        </Container>
      </Section>

      <Section tone="white" className="py-14 sm:py-20">
        <Container>
          <SectionHeader
            eyebrow="Delivery models"
            eyebrowTone="blue"
            title="Three ways to start, depending on what you already have."
          />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {DELIVERY_MODELS.map((model, i) => (
              <div key={model.title} className="border-2 border-ink bg-paper p-6">
                <span className="font-display text-3xl font-bold text-ink/25">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold">{model.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {model.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="paper" className="py-14 sm:py-20" id="requirement">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <SectionHeader
                eyebrow="Student requirement enquiry"
                eyebrowTone="green"
                title="Tell us what your students need."
                lead="This form exists for our improvement: the requirements we receive decide what Dishayaan builds next. Nothing here is used for marketing."
              />
              <div className="mt-8 border-2 border-ink bg-white p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  We will ask you
                </p>
                <ol className="mt-3 space-y-2">
                  {REQUIREMENT_QUESTIONS.map((q, i) => (
                    <li key={q} className="flex gap-3 text-sm">
                      <span className="font-bold text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="leading-snug">{q}</span>
                    </li>
                  ))}
                </ol>
                <p className="mt-4 border-t-2 border-dashed border-ink/30 pt-4 text-xs leading-relaxed text-muted-foreground">
                  You do not need answers to all of these to submit. Send what you
                  know and we will ask the rest on a call.
                </p>
              </div>
            </div>
            <PartnerForm />
          </div>
        </Container>
      </Section>
    </>
  );
}
