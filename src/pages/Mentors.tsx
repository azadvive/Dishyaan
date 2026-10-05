import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Container,
  Section,
  SectionHeader,
} from "@/components/common/primitives";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { MentorCard } from "@/components/cards";
import { MENTORS, MENTOR_LANGUAGES } from "@/data/mentors";
import { EXPLORE_TRACKS } from "@/data/catalog";
import { useSeo } from "@/hooks/use-seo";
import { useMemo, useState } from "react";
import { Link } from "react-router";

export default function Mentors() {
  const [query, setQuery] = useState("");
  const [domain, setDomain] = useState("");
  const [language, setLanguage] = useState("");
  const [availability, setAvailability] = useState("");
  const [format, setFormat] = useState("");

  useSeo({
    title: "Find a mentor who understands your path",
    description:
      "Browse DishaYaaN mentor seats across AI, machine learning, robotics, drone technology, computer science, markets, life sciences and exam strategy. Matched by domain, language and schedule.",
    path: "/mentors",
    keywords: [
      "student mentor India",
      "robotics mentor",
      "AI mentor for students",
      "JEE mentor",
      "NEET mentor",
      "career mentor for school students",
    ],
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MENTORS.filter((m) => {
      const matchesQuery =
        !q ||
        m.role.toLowerCase().includes(q) ||
        m.expertise.some((e) => e.toLowerCase().includes(q)) ||
        m.helpsWith.some((h) => h.toLowerCase().includes(q));
      const matchesDomain = !domain || m.domain === domain;
      const matchesLanguage = !language || m.languages.includes(language);
      const matchesAvailability =
        !availability || m.availability.includes(availability);
      const matchesFormat =
        !format ||
        m.format.toLowerCase().includes(format.toLowerCase()) ||
        (format === "Hybrid" && m.format.includes("Hybrid"));
      return (
        matchesQuery &&
        matchesDomain &&
        matchesLanguage &&
        matchesAvailability &&
        matchesFormat
      );
    });
  }, [query, domain, language, availability, format]);

  const reset = () => {
    setQuery("");
    setDomain("");
    setLanguage("");
    setAvailability("");
    setFormat("");
  };

  return (
    <>
      <Section tone="white" className="border-b border-line py-12 sm:py-16">
        <Container>
          <SectionHeader
            eyebrow="Mentors"
            eyebrowTone="violet"
            title="Find someone who understands your path."
            lead="Every entry below is a mentor seat in the DishaYaaN network: the domain it covers, what it helps with, and when it is available. Verified mentor profiles publish with a 2-minute introduction video."
          />
          <div className="mt-8 grid gap-4 rounded-xl border border-line bg-paper p-5 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search mentor, skill or goal…"
              aria-label="Search mentors"
              className="rounded-xl border border-line bg-card"
            />
            <Select value={domain} onValueChange={setDomain}>
              <SelectTrigger className="rounded-xl border border-line bg-card">
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                {EXPLORE_TRACKS.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.short}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="rounded-xl border border-line bg-card">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                {MENTOR_LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={availability} onValueChange={setAvailability}>
              <SelectTrigger className="rounded-xl border border-line bg-card">
                <SelectValue placeholder="Availability" />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Weekday evenings",
                  "Weekday mornings",
                  "Daily early mornings",
                  "Daily late evenings",
                  "Weekend mornings",
                  "Weekend afternoons",
                  "Weekend evenings",
                ].map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="rounded-xl border border-line bg-card">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                {["Online", "Hybrid", "Cohort"].map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="font-mono text-xs font-semibold text-muted-foreground">
              {filtered.length} of {MENTORS.length} mentor seats shown
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="font-bold"
              onClick={reset}
            >
              Reset filters
            </Button>
          </div>
        </Container>
      </Section>

      <Section tone="paper" className="py-12 sm:py-16">
        <Container>
          {filtered.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((mentor) => (
                <MentorCard key={mentor.id} mentor={mentor} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-line/40 bg-card p-10 text-center">
              <p className="text-sm font-semibold">
                No seat matches those filters yet.
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Tell us what you need and we will either match you with a mentor in
                the network or be honest that we cannot cover it yet.
              </p>
              <MentorConnectButton
                variant="neo-blue"
                className="mt-5 font-bold"
                source="mentors_empty"
                context="No mentor matched their filters."
              >
                Request a mentor for my requirement
              </MentorConnectButton>
            </div>
          )}

          <div className="mt-12 grid gap-6 rounded-xl border border-line bg-card p-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <h2 className="text-xl font-bold">
                Are you a professional who wants to mentor?
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                DishaYaaN mentors commit to at least one hour a week, follow a
                structured review format, and get paid for their time. Verification
                includes an identity check, a domain conversation and two reference
                calls before your profile goes live.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Mentor applications open with the first cohort. Join the list through
                the partnership form and select "Mentor" as your role in the message.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild variant="neo-dark" size="lg" className="font-bold">
                <Link to="/partners">Apply to mentor</Link>
              </Button>
              <MentorConnectButton
                variant="neo"
                source="mentors_apply"
                context="Wants to become a DishaYaaN mentor."
                className="font-bold"
              >
                Talk to the mentor team
              </MentorConnectButton>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
