import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ChipGroup, Field } from "@/components/forms/Forms";
import {
  Container,
  Eyebrow,
  Reveal,
  Section,
  SectionHeader,
} from "@/components/common/primitives";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { api } from "@/convex/_generated/api";
import { CLASS_OPTIONS, EXPLORE_TRACKS, GOALS, programBySlug, trackById } from "@/data/catalog";
import { MENTORS, MENTOR_LANGUAGES, mentorBySlug } from "@/data/mentors";
import { useSeo } from "@/hooks/use-seo";
import { useAuth } from "@/hooks/use-auth";
import { track } from "@/lib/analytics";
import { getSessionId } from "@/lib/session";
import { cn } from "@/lib/utils";
import { useMutation } from "convex/react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BadgeCheck, CalendarClock, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router";
import type { LeadRole } from "@/types";

const SLOTS = [
  "07:00 – 08:00",
  "08:00 – 09:00",
  "16:00 – 17:00",
  "17:00 – 18:00",
  "18:00 – 19:00",
  "19:00 – 20:00",
  "Saturday 10:00 – 11:00",
  "Saturday 11:00 – 12:00",
  "Sunday 10:00 – 11:00",
];

const MODES = ["Video call", "Phone call", "In person at a partner centre"];

const DOMAIN_OPTIONS = [
  ...EXPLORE_TRACKS.map((item) => item.short),
  "Exam strategy (JEE / NEET / NDA)",
  "Commerce & professional courses (CS / CMA)",
  "Not sure yet — help me choose",
];

const ROLES: Array<[LeadRole, string, string]> = [
  ["student", "I am the student", "I want to talk about my own plan"],
  ["parent", "I am a parent", "I want clarity for my child"],
  ["educator", "I am a teacher or counsellor", "I refer students to DishaYaaN"],
];

function todayIso() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function Block({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="rounded-xl border border-line bg-card">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center gap-3 border-b border-line bg-paper px-5 py-3">
        <span className="flex size-7 items-center justify-center rounded-xl border border-line bg-neo-cyan font-mono text-xs font-bold text-deep">
          {step}
        </span>
        <span className="font-mono text-sm font-bold uppercase tracking-[0.12em]">
          {title}
        </span>
      </div>
      <div className="space-y-5 px-5 py-5">{children}</div>
    </fieldset>
  );
}

export default function Book() {
  const [params] = useSearchParams();
  const reduce = useReducedMotion();
  const { user, isAuthenticated } = useAuth();
  const create = useMutation(api.bookings.create);

  const programmeSlug = params.get("programme") ?? "";
  const mentorParam = params.get("mentor") ?? "";
  const programme = programmeSlug ? programBySlug(programmeSlug) : undefined;
  const mentorHint = mentorParam ? mentorBySlug(mentorParam) : undefined;
  const trackHint = programme?.trackId ? trackById(programme.trackId) : undefined;

  useSeo({
    title: "Book a one-to-one session",
    description:
      "Book a free one-to-one counselling session with a DishaYaaN mentor. Pick a date, a time slot and a domain — a human confirms the slot on WhatsApp.",
    path: "/book",
    keywords: [
      "one to one counselling",
      "student mentorship",
      "book a mentor session",
      "career guidance for students",
    ],
  });

  const [role, setRole] = useState<LeadRole>("student");
  const [name, setName] = useState(user?.name ?? "");
  const [bookerName, setBookerName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState(user?.email ?? "");
  const [studentClass, setStudentClass] = useState("");
  const [domain, setDomain] = useState(trackHint?.short ?? "");
  const [mentorSlug, setMentorSlug] = useState(mentorHint?.slug ?? "");
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [mode, setMode] = useState(MODES[0]);
  const [language, setLanguage] = useState(mentorHint?.languages[0] ?? "");
  const [goal, setGoal] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState("");

  const matchingMentors = domain
    ? MENTORS.filter((mentor) => {
        const track = EXPLORE_TRACKS.find((item) => item.short === domain);
        return !track || mentor.domain === track.id;
      })
    : MENTORS;
  const mentorOptions =
    mentorHint && !matchingMentors.some((mentor) => mentor.slug === mentorHint.slug)
      ? [mentorHint, ...matchingMentors]
      : matchingMentors;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      const result = await create({
        name: name.trim() || (user?.name ?? ""),
        whatsapp,
        email: email || undefined,
        bookerRole: role,
        studentClass: studentClass || undefined,
        domain: domain || "Not sure yet — help me choose",
        mentorSlug: mentorSlug || undefined,
        date,
        slot,
        mode,
        language: language || undefined,
        goal: goal || undefined,
        note: [bookerName ? `Booked by ${bookerName}.` : "", note]
          .filter(Boolean)
          .join(" ")
          .trim() || undefined,
        sessionId: getSessionId(),
      });
      track("booking_create", {
        role,
        domain: domain || "unsure",
        mode,
        hasMentorPreference: Boolean(mentorSlug),
      });
      setReference(result.reference);
      setStatus("done");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error
          ? err.message.replace(/^.*Uncaught Error: /, "")
          : "We could not record that booking. Please try again.",
      );
    }
  };

  if (status === "done") {
    return (
      <Section tone="paper" className="py-16 sm:py-24">
        <Container>
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-2xl rounded-xl border border-line bg-card p-8 text-center shadow-neo-cyan sm:p-10"
          >
            <CheckCircle2 className="mx-auto size-14 text-emerald-700" />
            <h1 className="mt-5 text-2xl font-bold sm:text-3xl">
              Your slot is requested.
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Nothing has been charged. A human confirms your slot on WhatsApp —
              usually within one working day — and sends the joining link or the
              centre address.
            </p>
            <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Reference
            </p>
            <p className="mt-1 font-display text-2xl font-bold tracking-tight text-neo-blue">
              {reference}
            </p>
            <dl className="mt-7 grid gap-3 text-left sm:grid-cols-3">
              {[
                ["Counselling for", role === "student" ? "Student" : role === "parent" ? "Parent" : "Educator"],
                ["Preferred date", date],
                ["Time slot", slot],
                ["Mode", mode],
                ["Domain", domain || "To be decided on the call"],
                ["Language", language || "Any"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-line bg-paper p-3">
                  <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              Keep the reference handy. If you need to move the session, reply to our
              WhatsApp message with it and we will reschedule at no cost.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button asChild variant="neo-blue" className="font-bold">
                <Link to="/dashboard">
                  Open my workspace
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="neo-dark" className="font-bold">
                <Link to="/plans">See plans &amp; fees</Link>
              </Button>
              <Button
                variant="neo"
                className="font-bold"
                onClick={() => {
                  setStatus("idle");
                  setReference("");
                }}
              >
                Book another session
              </Button>
            </div>
          </motion.div>
        </Container>
      </Section>
    );
  }

  return (
    <>
      <Section tone="paper" className="border-b border-line pb-12 pt-14 sm:pb-16">
        <Container>
          <SectionHeader
            eyebrow="One-to-one counselling"
            eyebrowTone="cyan"
            title="Talk to a mentor before you commit to anything."
            lead="Pick a date, a time slot and the domain you care about. A DishaYaaN mentor calls you, listens to where you actually are, and leaves you with a written next step. The first session is free."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              "45–60 minutes",
              "Student, parent or teacher",
              "No payment today",
              "English or your regional language",
            ].map((item) => (
              <span
                key={item}
                className="rounded-xl border border-line bg-card px-3 py-1.5 font-mono text-xs font-bold"
              >
                {item}
              </span>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="white" className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
            <form
              onSubmit={handleSubmit}
              onFocus={() => track("booking_form_start", { role })}
              className="space-y-6"
            >
              {programme || mentorHint ? (
                <div className="rounded-xl border border-line bg-neo-yellow p-4 text-deep">
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em]">
                    You came from
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    {mentorHint
                      ? `Mentor seat ${mentorHint.code} — ${mentorHint.role}`
                      : programme?.title}
                  </p>
                  <p className="mt-1 text-xs leading-snug">
                    We have pre-filled what we could. Change anything that is wrong —
                    this is your session.
                  </p>
                </div>
              ) : null}

              <Block step="1" title="Who is this session for?">
                <div className="grid gap-2 sm:grid-cols-3">
                  {ROLES.map(([value, label, hint]) => (
                    <button
                      key={value}
                      type="button"
                      aria-pressed={role === value}
                      onClick={() => setRole(value)}
                      className={cn(
                        "rounded-xl border border-line p-4 text-left transition-colors",
                        role === value
                          ? "bg-neo-cyan text-deep"
                          : "bg-card hover:bg-paper",
                      )}
                    >
                      <span className="block text-sm font-bold">{label}</span>
                      <span className="mt-1 block text-[11px] leading-snug opacity-80">
                        {hint}
                      </span>
                    </button>
                  ))}
                </div>
              </Block>

              <Block step="2" title="Who should we ask for?">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={role === "student" ? "Your name" : "Student name"}>
                    <Input
                      required
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Full name"
                      className="rounded-xl border border-line"
                    />
                  </Field>
                  {role !== "student" ? (
                    <Field label="Your name">
                      <Input
                        value={bookerName}
                        onChange={(event) => setBookerName(event.target.value)}
                        placeholder="Who is booking this session?"
                        className="rounded-xl border border-line"
                      />
                    </Field>
                  ) : null}
                  <Field label="Class">
                    <Select value={studentClass} onValueChange={setStudentClass}>
                      <SelectTrigger className="rounded-xl border border-line">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {CLASS_OPTIONS.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field
                    label="WhatsApp number"
                    hint="We confirm the slot here and nowhere else."
                  >
                    <Input
                      required
                      inputMode="tel"
                      value={whatsapp}
                      onChange={(event) => setWhatsapp(event.target.value)}
                      placeholder="10-digit number"
                      className="rounded-xl border border-line"
                    />
                  </Field>
                  <Field label="Email (optional)">
                    <Input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="name@example.com"
                      className="rounded-xl border border-line"
                    />
                  </Field>
                </div>
              </Block>

              <Block step="3" title="What should the session cover?">
                <Field
                  label="Domain"
                  hint="Not sure? Pick the last option — deciding is part of the call."
                >
                  <Select value={domain} onValueChange={setDomain}>
                    <SelectTrigger className="rounded-xl border border-line">
                      <SelectValue placeholder="Choose a domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOMAIN_OPTIONS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field
                  label="Preferred mentor seat (optional)"
                  hint="Seats are matched by domain and language. Profiles publish as verification completes, so your match may differ from the seat you pick."
                >
                  <Select value={mentorSlug} onValueChange={setMentorSlug}>
                    <SelectTrigger className="rounded-xl border border-line">
                      <SelectValue placeholder="Match me by domain" />
                    </SelectTrigger>
                    <SelectContent>
                      {mentorOptions.map((mentor) => (
                        <SelectItem key={mentor.slug} value={mentor.slug}>
                          {mentor.code} · {mentor.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Main goal">
                  <Select value={goal} onValueChange={setGoal}>
                    <SelectTrigger className="rounded-xl border border-line">
                      <SelectValue placeholder="Not decided yet" />
                    </SelectTrigger>
                    <SelectContent>
                      {GOALS.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field
                  label="What do you want to leave the call with?"
                  hint="One honest sentence is worth more than a paragraph."
                >
                  <Textarea
                    rows={4}
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Example: I am in Class 10, I like robots but I do not know if I should pick science, and I need a study routine that survives school hours."
                    className="rounded-xl border border-line"
                  />
                </Field>
              </Block>

              <Block step="4" title="When should we call?">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Preferred date"
                    hint="Slots are confirmed by a human, so treat this as a preference."
                  >
                    <Input
                      required
                      type="date"
                      min={todayIso()}
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      className="rounded-xl border border-line"
                    />
                  </Field>
                  <Field label="Mode">
                    <Select value={mode} onValueChange={setMode}>
                      <SelectTrigger className="rounded-xl border border-line">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {MODES.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field label="Time slot" hint="Times are shown in Indian Standard Time.">
                  <ChipGroup
                    options={SLOTS}
                    selected={slot ? [slot] : []}
                    onToggle={(value) => setSlot(slot === value ? "" : value)}
                  />
                </Field>

                <Field label="Language you are comfortable in">
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="rounded-xl border border-line">
                      <SelectValue placeholder="Any language" />
                    </SelectTrigger>
                    <SelectContent>
                      {MENTOR_LANGUAGES.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </Block>

              {matchingMentors.length > 0 && domain ? (
                <p className="rounded-xl border border-dashed border-line/40 bg-paper p-4 text-xs leading-relaxed text-muted-foreground">
                  {matchingMentors.length} mentor seat
                  {matchingMentors.length === 1 ? "" : "s"} currently cover{" "}
                  <span className="font-bold text-ink">{domain}</span>. Every seat is
                  labelled &ldquo;profile in verification&rdquo; until a real mentor
                  completes it — we never publish a name we cannot stand behind.
                </p>
              ) : null}

              {error ? (
                <p className="rounded-xl border border-line bg-destructive/10 p-3 text-sm font-medium text-destructive">
                  {error}
                </p>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {isAuthenticated
                    ? "Saved to your workspace as well as our queue."
                    : "You can book as a guest — sign in later to keep the history."}
                </p>
                <Button
                  type="submit"
                  size="lg"
                  variant="neo-cyan"
                  disabled={status === "sending"}
                  className="w-full font-bold sm:w-auto"
                >
                  {status === "sending" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CalendarClock className="size-4" />
                  )}
                  {status === "sending" ? "Requesting" : "Request this session"}
                </Button>
              </div>
            </form>

            <aside className="space-y-4 lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-xl border border-line bg-card p-6 shadow-neo-cyan">
                <Eyebrow tone="cyan">What happens next</Eyebrow>
                <ol className="mt-4 space-y-3">
                  {[
                    "You request a slot — no payment, no card.",
                    "A human confirms the time on WhatsApp within one working day.",
                    "You get a video link or a centre address and a short pre-call checklist.",
                    "After the session you leave with one written next step, and the choice to continue or stop.",
                  ].map((step, index) => (
                    <li key={step} className="flex gap-3 text-sm leading-snug">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-xl border border-line bg-neo-cyan font-mono text-[11px] font-bold text-deep">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="mt-5 grid gap-2 border-t border-dashed border-line/25 pt-4 text-xs font-semibold text-muted-foreground">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="size-3.5 text-emerald-700" /> No invented
                    mentors, ranks or results
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <BadgeCheck className="size-3.5 text-emerald-700" /> Your data is
                    used to match you, nothing else
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-line bg-panel-2 p-6 text-ink">
                <Eyebrow tone="violet">Not ready to book?</Eyebrow>
                <p className="mt-4 text-sm font-semibold">
                  Ask a question first, or run the Path Finder and bring the result
                  into the call.
                </p>
                <div className="mt-5 grid gap-2">
                  <MentorConnectButton
                    variant="neo-blue"
                    size="sm"
                    source="book_sidebar"
                    className="w-full font-bold"
                    context="Wants to ask a question before booking a session."
                  >
                    Ask a mentor a question
                  </MentorConnectButton>
                  <Button asChild variant="neo-dark" size="sm" className="w-full font-bold">
                    <Link to="/pathfinder">Run the Path Finder</Link>
                  </Button>
                  <Button asChild variant="neo" size="sm" className="w-full font-bold">
                    <Link to="/plans">Compare plans &amp; fees</Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-dashed border-line/40 bg-paper p-5">
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  For institutions
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Booking for a whole cohort? Our team runs group counselling blocks
                  for schools, coaching centres and NGOs.
                </p>
                <Reveal className="mt-3">
                  <Button asChild variant="neo" size="sm" className="w-full font-bold">
                    <Link to="/partners">
                      Plan a cohort programme
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </Reveal>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
