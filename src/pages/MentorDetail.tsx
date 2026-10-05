import { Button } from "@/components/ui/button";
import {
  Container,
  Eyebrow,
  Section,
  SectionHeader,
} from "@/components/common/primitives";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { accentBg } from "@/components/cards";
import { MENTORS, mentorBySlug } from "@/data/mentors";
import { trackById } from "@/data/catalog";
import { useSeo } from "@/hooks/use-seo";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Link, useParams } from "react-router";
import {
  CalendarClock,
  Clock,
  Languages,
  Play,
  ShieldCheck,
  Users,
} from "lucide-react";
import { track } from "@/lib/analytics";

export default function MentorDetail() {
  const { slug = "" } = useParams();
  const mentor = mentorBySlug(slug);
  const domain = mentor ? trackById(mentor.domain) : undefined;

  useSeo({
    title: mentor ? mentor.role : "Mentor profile",
    description: mentor
      ? `${mentor.role} at DishaYaaN — covers ${mentor.expertise.join(", ")}. Availability: ${mentor.availability}.`
      : "DishaYaaN mentor profile.",
    path: `/mentor/${slug}`,
  });

  useEffect(() => {
    if (mentor) track("mentor_view", { slug: mentor.slug, domain: mentor.domain });
  }, [mentor]);

  if (!mentor) {
    return (
      <Section tone="paper" className="py-24">
        <Container>
          <div className="rounded-xl border border-line bg-card p-10 text-center">
            <h1 className="text-2xl font-bold">That mentor seat does not exist.</h1>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
              Mentor seats are added and retired as the network changes. Browse the
              current roster instead.
            </p>
            <Button asChild variant="neo-dark" className="mt-6 font-bold">
              <Link to="/mentors">Back to mentors</Link>
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  const others = MENTORS.filter((m) => m.slug !== mentor.slug).slice(0, 3);

  return (
    <>
      <Section tone="white" className="border-b border-line py-10 sm:py-14">
        <Container>
          <Link
            to="/mentors"
            className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground hover:text-ink"
          >
            ← All mentor seats
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    "flex size-14 items-center justify-center rounded-xl border border-line text-xl font-black",
                    domain ? accentBg[domain.accent] : "bg-neo-violet text-white",
                  )}
                >
                  {mentor.role.slice(0, 1)}
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                    {mentor.code} · {domain?.short ?? "Mentorship"}
                  </p>
                  <h1 className="text-2xl font-bold leading-tight sm:text-3xl">
                    {mentor.role}
                  </h1>
                </div>
              </div>

              <p className="mt-6 flex flex-wrap items-center gap-3 text-xs font-semibold">
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-paper px-2 py-1">
                  {mentor.status === "verified" ? (
                    <>
                      <ShieldCheck className="size-3.5 text-emerald-700" /> Verified
                    </>
                  ) : (
                    <>
                      <Clock className="size-3.5" /> Profile in verification
                    </>
                  )}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-paper px-2 py-1">
                  <Languages className="size-3.5" /> {mentor.languages.join(", ")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-paper px-2 py-1">
                  <Users className="size-3.5" /> {mentor.format}
                </span>
              </p>

              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {mentor.bio}
              </p>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <Eyebrow tone="ink">Expertise</Eyebrow>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {mentor.expertise.map((e) => (
                      <li
                        key={e}
                        className="rounded-xl border border-line bg-card px-2.5 py-1 text-xs font-semibold"
                      >
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <Eyebrow tone="ink">What this seat helps with</Eyebrow>
                  <ul className="mt-3 space-y-2">
                    {mentor.helpsWith.map((h) => (
                      <li key={h} className="flex gap-2 text-sm">
                        <span className="mt-1.5 size-2.5 shrink-0 rounded-xl border border-line bg-neo-violet" />
                        <span className="leading-snug">{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <Eyebrow tone="ink">Areas mentored</Eyebrow>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {domain?.skills.map((skill) => (
                    <p
                      key={skill}
                      className="rounded-xl border border-line bg-paper px-3 py-2 text-sm font-medium"
                    >
                      {skill}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
              <div className="flex h-52 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line/40 bg-paper">
                <span className="flex size-14 items-center justify-center rounded-xl border border-line bg-card">
                  <Play className="size-6" />
                </span>
                <p className="max-w-[220px] text-center text-xs font-semibold leading-snug text-muted-foreground">
                  {mentor.videoUrl
                    ? `Meet your mentor — ${mentor.videoDuration}`
                    : "The 2-minute introduction video publishes as soon as this mentor is verified."}
                </p>
                <Button
                  variant="neo"
                  size="sm"
                  className="font-bold"
                  disabled={!mentor.videoUrl}
                  onClick={() => track("mentor_video_play", { slug: mentor.slug })}
                >
                  {mentor.videoUrl ? "Play introduction" : "Video pending"}
                </Button>
              </div>

              <div className="rounded-xl border border-line bg-card p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Institution
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {mentor.institution ?? "Publishes after verification"}
                </p>
                <p className="mt-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  <CalendarClock className="size-3.5" /> Availability
                </p>
                <p className="mt-1 text-sm font-semibold">{mentor.availability}</p>
              </div>

              <div className="rounded-xl border border-line bg-neo-yellow p-5 text-deep">
                <p className="text-sm font-bold">
                  Booking opens with the first cohort.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-deep/80">
                  Leave your requirement now and we will confirm a slot in this
                  domain, in your language, at a time that works.
                </p>
                <MentorConnectButton
                  variant="neo-dark"
                  className="mt-4 w-full font-bold"
                  source={`mentor_detail:${mentor.slug}`}
                  domain={mentor.domain}
                  context={`Requested a booking with the ${mentor.role} seat (${mentor.code}).`}
                >
                  Request a session
                </MentorConnectButton>
              </div>

              <div className="rounded-xl border border-dashed border-line/40 bg-paper p-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  Student reviews
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Reviews appear here only after real sessions, from students and
                  parents who consent to being quoted. We do not seed this section.
                </p>
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section tone="paper" className="py-12 sm:py-16">
        <Container>
          <SectionHeader
            eyebrow="Other mentor seats"
            eyebrowTone="violet"
            title="Keep looking until the fit is right."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {others.map((other) => (
              <Link
                key={other.id}
                to={`/mentor/${other.slug}`}
                className="rounded-xl border border-line bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-neo"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  {other.code}
                </p>
                <p className="mt-2 text-sm font-bold leading-snug">{other.role}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {other.availability}
                </p>
              </Link>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
