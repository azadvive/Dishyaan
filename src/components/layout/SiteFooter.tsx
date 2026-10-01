import { Container } from "@/components/common/primitives";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { openAIAssistant } from "@/components/ai/AIAssistant";
import {
  Instagram,
  Linkedin,
  MessageCircle,
  Youtube,
} from "lucide-react";
import { Link } from "react-router";

const COLUMNS: Array<{ title: string; links: Array<{ label: string; to: string }> }> = [
  {
    title: "Explore",
    links: [
      { label: "Programmes", to: "/catalog" },
      { label: "Mentors", to: "/mentors" },
      { label: "Plans & pricing", to: "/plans" },
      { label: "About Us", to: "/about" },
    ],
  },
  {
    title: "Students",
    links: [
      { label: "Path Finder", to: "/pathfinder" },
      { label: "Course & exam catalogue", to: "/catalog" },
      { label: "Ways to ask a mentor", to: "/mentors" },
      { label: "My dashboard", to: "/dashboard" },
    ],
  },
  {
    title: "Parents",
    links: [
      { label: "Parent guide", to: "/plans" },
      { label: "Progress visibility", to: "/about" },
      { label: "Talk to a mentor", to: "/mentors" },
      { label: "Fees & payment", to: "/plans" },
    ],
  },
  {
    title: "Institutions",
    links: [
      { label: "Schools", to: "/partners" },
      { label: "Colleges", to: "/partners" },
      { label: "Coaching centres", to: "/partners" },
      { label: "Partner with us", to: "/partners" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Dishayaan", to: "/about" },
      { label: "Requirement form", to: "/#demand" },
      { label: "Contact", to: "/partners" },
      { label: "Careers", to: "/about" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/about" },
      { label: "Terms", to: "/about" },
      { label: "Refund policy", to: "/plans" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-ink bg-ink pb-24 text-white lg:pb-0">
      <Container className="py-14">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center border-2 border-white bg-neo-yellow text-base font-black text-ink">
                D
              </span>
              <span className="font-display text-lg font-bold uppercase tracking-[0.16em]">
                Dishayaan
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/70">
              Your future is bigger than your syllabus. Dishayaan helps students
              of Class 6–12 explore emerging technology, prepare for real goals and
              learn from mentors who have walked the path.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <MentorConnectButton
                variant="neo-yellow"
                size="sm"
                source="footer"
              >
                Talk to a Mentor
              </MentorConnectButton>
              <button
                type="button"
                onClick={openAIAssistant}
                className="border-2 border-white px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-white hover:text-ink"
              >
                Ask Dishayaan AI
              </button>
            </div>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
                { icon: MessageCircle, label: "WhatsApp" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  aria-label={`${label} (link published with the first cohort)`}
                  title={`${label} — link published soon`}
                  className="flex size-9 items-center justify-center border-2 border-white/60 text-white/70"
                >
                  <Icon className="size-4" />
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-neo-cyan">
                  {column.title}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      {link.to.startsWith("/#") ? (
                        <a
                          href={link.to}
                          className="text-sm text-white/75 hover:text-white hover:underline"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          to={link.to}
                          className="text-sm text-white/75 hover:text-white hover:underline"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t-2 border-white/20 pt-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Dishayaan. Built for students, parents and
            mentors.
          </p>
          <p>
            Mentor profiles, testimonials and student stories publish only after
            verification and consent.
          </p>
        </div>
      </Container>
    </footer>
  );
}
