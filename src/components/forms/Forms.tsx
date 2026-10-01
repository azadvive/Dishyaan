import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CLASS_OPTIONS, EXPLORE_TRACKS, GOALS } from "@/data/catalog";
import { PARTNER_TYPES } from "@/data/site";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { LeadRole } from "@/types";

const INTERESTS = EXPLORE_TRACKS.map((t) => t.short);
const TRUST_FACTORS = [
  "Mentor credentials",
  "Industry experience",
  "Free session first",
  "Projects",
  "Reviews",
  "Mentor video",
  "Transparent pricing",
];
const LEARNING_PREFERENCES = [
  "1-to-1",
  "Small group",
  "Online",
  "Offline",
  "Hybrid",
];
const CLARITY = [
  "Very clear about my goal",
  "Somewhat clear",
  "Exploring options",
  "Completely confused",
];
const OUTSIDE_SCHOOL = [
  "Nothing structured yet",
  "Coaching or tuition",
  "Sports or fitness",
  "Music or arts",
  "Coding or DIY projects",
  "Reading and self-study",
];
const DIFFICULTY = [
  "Understanding concepts",
  "Remembering what I study",
  "Staying consistent",
  "Not knowing what to study for",
  "Too many options",
  "No one to ask questions",
];
const BOARDS = ["CBSE", "ICSE", "State board", "IB / IGCSE", "Other"];
const LANGUAGES = ["English", "Hindi", "Gujarati", "Marathi", "Bengali"];
const PREFERRED_TIME = ["Morning", "Afternoon", "Evening", "Weekend"];

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label className="font-mono text-xs font-bold uppercase tracking-[0.14em]">
        {label}
      </Label>
      {children}
      {hint ? (
        <p className="text-[11px] leading-snug text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function ChipGroup({
  options,
  selected,
  onToggle,
  columns = 2,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
  columns?: number;
}) {
  return (
    <div
      className={cn(
        "grid gap-2",
        columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3",
      )}
    >
      {options.map((option) => {
        const isOn = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            aria-pressed={isOn}
            onClick={() => onToggle(option)}
            className={cn(
              "border-2 border-ink px-3 py-2 text-left font-mono text-xs font-semibold transition-colors",
              isOn ? "bg-neo-yellow text-deep" : "bg-card hover:bg-paper",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function toggle(list: string[], value: string) {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function FormSection({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="border-2 border-ink bg-card">
      <legend className="sr-only">{title}</legend>
      <div className="flex items-center gap-3 border-b-2 border-ink bg-paper px-5 py-3">
        <span className="flex size-7 items-center justify-center border-2 border-ink bg-neo-blue font-mono text-xs font-bold text-white">
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

export function EnquiryForm({ source = "home" }: { source?: string }) {
  const submit = useMutation(api.leads.submit);
  const reduce = useReducedMotion();

  const [role, setRole] = useState<LeadRole>("student");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [board, setBoard] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [language, setLanguage] = useState("");
  const [clarity, setClarity] = useState("");
  const [outsideSchool, setOutsideSchool] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [goal, setGoal] = useState("");
  const [preference, setPreference] = useState("");
  const [trust, setTrust] = useState<string[]>([]);
  const [preferredTime, setPreferredTime] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const isStudent = role === "student";
  const isEducator = role === "educator";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      await submit({
        role,
        name,
        whatsapp,
        email: email || undefined,
        studentName: studentName || undefined,
        studentClass: studentClass || undefined,
        board: board || undefined,
        city: city || undefined,
        state: state || undefined,
        language: language || undefined,
        clarity: clarity || undefined,
        outsideSchool: outsideSchool || undefined,
        difficulty: difficulty || undefined,
        interests,
        goal: goal || undefined,
        learningPreference: preference || undefined,
        trustFactors: trust,
        preferredTime: preferredTime || undefined,
        message: message || undefined,
        consent,
        source,
      });
      track("lead_form_submit", { role, source, interests: interests.length });
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error
          ? err.message.replace(/^.*Uncaught Error: /, "")
          : "Something went wrong. Please try again.",
      );
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 border-ink bg-card p-8 text-center shadow-neo"
      >
        <CheckCircle2 className="mx-auto size-12 text-neo-green" />
        <h3 className="mt-4 text-xl font-bold">Thank you — this shapes what we build.</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          We read every requirement ourselves. Expect a WhatsApp message within one
          working day with either a next step or an honest "we don't do that yet".
        </p>
        <Button
          variant="neo-dark"
          className="mt-6 font-bold"
          onClick={() => setStatus("idle")}
        >
          Send another
        </Button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocus={() => track("lead_form_start", { role })}
      className="space-y-6"
    >
      <FormSection step="1" title="Who are you?">
        <div className="grid gap-2 sm:grid-cols-3">
          {(
            [
              ["student", "Student", "I want to explore and build"],
              ["parent", "Parent", "I want clarity for my child"],
              ["educator", "Teacher / Counsellor", "I guide students"],
            ] as Array<[LeadRole, string, string]>
          ).map(([value, label, hint]) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setRole(value);
                if (value === "student") track("student_selected", { source });
                if (value === "parent") track("parent_selected", { source });
              }}
              aria-pressed={role === value}
              className={cn(
                "border-2 border-ink p-4 text-left transition-colors",
                role === value ? "bg-neo-yellow text-deep" : "bg-card hover:bg-paper",
              )}
            >
              <span className="block text-sm font-bold">{label}</span>
              <span className="mt-1 block text-[11px] leading-snug text-muted-foreground">
                {hint}
              </span>
            </button>
          ))}
        </div>
      </FormSection>

      <FormSection step="2" title={isStudent ? "About you" : "About the student"}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={isStudent ? "Your name" : "Student name"}>
            <Input
              required
              value={isStudent ? name : studentName}
              onChange={(e) =>
                isStudent ? setName(e.target.value) : setStudentName(e.target.value)
              }
              placeholder="Full name"
              className="border-2 border-ink"
            />
          </Field>
          <Field label="Class">
            <Select value={studentClass} onValueChange={setStudentClass}>
              <SelectTrigger className="border-2 border-ink">
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {CLASS_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Board">
            <Select value={board} onValueChange={setBoard}>
              <SelectTrigger className="border-2 border-ink">
                <SelectValue placeholder="Select board" />
              </SelectTrigger>
              <SelectContent>
                {BOARDS.map((b) => (
                  <SelectItem key={b} value={b}>
                    {b}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Preferred language">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="border-2 border-ink">
                <SelectValue placeholder="Any language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="City">
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              className="border-2 border-ink"
            />
          </Field>
          <Field label="State">
            <Input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              className="border-2 border-ink"
            />
          </Field>
        </div>
      </FormSection>

      <FormSection step="3" title="Current situation">
        <Field label="How clear are you about your future?">
          <Select value={clarity} onValueChange={setClarity}>
            <SelectTrigger className="border-2 border-ink">
              <SelectValue placeholder="Pick the closest answer" />
            </SelectTrigger>
            <SelectContent>
              {CLARITY.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="What are you doing outside school?" hint="Select all that apply.">
          <ChipGroup
            options={OUTSIDE_SCHOOL}
            selected={outsideSchool ? [outsideSchool] : []}
            onToggle={(v) => setOutsideSchool(outsideSchool === v ? "" : v)}
          />
        </Field>
        <Field label="What is difficult about your learning right now?">
          <ChipGroup
            options={DIFFICULTY}
            selected={difficulty ? [difficulty] : []}
            onToggle={(v) => setDifficulty(difficulty === v ? "" : v)}
          />
        </Field>
      </FormSection>

      <FormSection step="4" title="Interests & goal">
        <Field
          label="Which areas interest you?"
          hint="Pick everything that sounds interesting — you do not need to be sure."
        >
          <ChipGroup
            options={INTERESTS}
            selected={interests}
            onToggle={(v) => setInterests((prev) => toggle(prev, v))}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Main goal">
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger className="border-2 border-ink">
                <SelectValue placeholder="Not decided yet" />
              </SelectTrigger>
              <SelectContent>
                {GOALS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Learning preference">
            <Select value={preference} onValueChange={setPreference}>
              <SelectTrigger className="border-2 border-ink">
                <SelectValue placeholder="Any format" />
              </SelectTrigger>
              <SelectContent>
                {LEARNING_PREFERENCES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </div>
        {isEducator ? (
          <Field label="What would you want DishaYaaN to run for your students?">
            <Textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Example: a 6-week robotics lab for Class 8, or a parent orientation on career paths."
              className="border-2 border-ink"
            />
          </Field>
        ) : null}
      </FormSection>

      <FormSection step="5" title="What earns your trust?">
        <Field label="Pick what matters most" hint="This decides what we publish first.">
          <ChipGroup
            options={TRUST_FACTORS}
            selected={trust}
            onToggle={(v) => setTrust((prev) => toggle(prev, v))}
            columns={3}
          />
        </Field>
      </FormSection>

      <FormSection step="6" title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="WhatsApp number" hint="We use this for one follow-up only.">
            <Input
              required
              inputMode="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="10-digit number"
              className="border-2 border-ink"
            />
          </Field>
          <Field label="Email (optional)">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="border-2 border-ink"
            />
          </Field>
          <Field label="Preferred call time">
            <Select value={preferredTime} onValueChange={setPreferredTime}>
              <SelectTrigger className="border-2 border-ink">
                <SelectValue placeholder="No preference" />
              </SelectTrigger>
              <SelectContent>
                {PREFERRED_TIME.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Your name">
            <Input
              required
              value={isStudent ? name : name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Who should we ask for?"
              className="border-2 border-ink"
            />
          </Field>
        </div>

        {!isEducator ? (
          <Field label="Anything else we should know?">
            <Textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Optional. Tell us the specific thing that would make DishaYaaN worth it for you."
              className="border-2 border-ink"
            />
          </Field>
        ) : null}

        <label className="flex gap-3 border-2 border-ink bg-paper p-3">
          <Checkbox
            checked={consent}
            onCheckedChange={(v) => setConsent(v === true)}
            aria-label="Consent to being contacted"
          />
          <span className="text-xs leading-relaxed text-muted-foreground">
            I agree that DishaYaaN may store this enquiry and contact me on WhatsApp
            about it. Checkbox selection and free-text answers are used only to
            improve the platform. We never sell data, and you can ask us to delete
            it at any time.
          </span>
        </label>
      </FormSection>

      {error ? (
        <p className="border-2 border-ink bg-destructive/10 p-3 text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Takes about two minutes. No payment needed to submit.
        </p>
        <Button
          type="submit"
          variant="neo-blue"
          size="lg"
          disabled={status === "sending"}
          className="w-full font-bold sm:w-auto"
        >
          {status === "sending" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowRight className="size-4" />
          )}
          {status === "sending" ? "Sending" : "Send my requirement"}
        </Button>
      </div>
    </form>
  );
}

export function PartnerForm() {
  const submit = useMutation(api.partners.submit);
  const reduce = useReducedMotion();

  const [orgType, setOrgType] = useState("school");
  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactRole, setContactRole] = useState("");
  const [city, setCity] = useState("");
  const [studentCount, setStudentCount] = useState("");
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [requirement, setRequirement] = useState("");
  const [timeline, setTimeline] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      await submit({
        orgType,
        orgName,
        contactName,
        contactRole: contactRole || undefined,
        city: city || undefined,
        studentCount: studentCount || undefined,
        focusAreas,
        requirement,
        timeline: timeline || undefined,
        whatsapp,
        email: email || undefined,
        consent,
      });
      track("partner_form_submit", { orgType, focusAreas: focusAreas.length });
      setStatus("sent");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error
          ? err.message.replace(/^.*Uncaught Error: /, "")
          : "Something went wrong. Please try again.",
      );
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-2 border-ink bg-card p-8 text-center shadow-neo"
      >
        <CheckCircle2 className="mx-auto size-12 text-neo-green" />
        <h3 className="mt-4 text-xl font-bold">Requirement received.</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          We will come back with a scoped proposal: what we deliver, who mentors it,
          how progress is reported to your team, and what it costs. No lock-in
          before a pilot.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Institution type">
          <Select value={orgType} onValueChange={setOrgType}>
            <SelectTrigger className="border-2 border-ink">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PARTNER_TYPES.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="Institution name">
          <Input
            required
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="School / college / centre name"
            className="border-2 border-ink"
          />
        </Field>
        <Field label="Contact person">
          <Input
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Full name"
            className="border-2 border-ink"
          />
        </Field>
        <Field label="Your role">
          <Input
            value={contactRole}
            onChange={(e) => setContactRole(e.target.value)}
            placeholder="Principal, HOD, Director…"
            className="border-2 border-ink"
          />
        </Field>
        <Field label="City">
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City"
            className="border-2 border-ink"
          />
        </Field>
        <Field label="Approximate student count">
          <Select value={studentCount} onValueChange={setStudentCount}>
            <SelectTrigger className="border-2 border-ink">
              <SelectValue placeholder="Select a range" />
            </SelectTrigger>
            <SelectContent>
              {["Under 200", "200–500", "500–1000", "1000–3000", "3000+"].map(
                (c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Field
        label="Focus areas you need"
        hint="Select all that apply. We will send the module outline for what you pick."
      >
        <ChipGroup
          options={[
            ...EXPLORE_TRACKS.map((t) => t.short),
            "Career guidance",
            "Parent sessions",
            "Exam strategy",
          ]}
          selected={focusAreas}
          onToggle={(v) => setFocusAreas((prev) => toggle(prev, v))}
        />
      </Field>

      <Field
        label="What do your students actually need?"
        hint="The more specific this is, the more useful our first reply will be."
      >
        <Textarea
          required
          rows={5}
          value={requirement}
          onChange={(e) => setRequirement(e.target.value)}
          placeholder="Example: 120 students of Class 8–9, two hours per week, robotics and AI exposure, most students do not have kits at home, we need a report for parents each term."
          className="border-2 border-ink"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Timeline">
          <Select value={timeline} onValueChange={setTimeline}>
            <SelectTrigger className="border-2 border-ink">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {[
                "This month",
                "Next term",
                "Next academic year",
                "Just exploring",
              ].map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field label="WhatsApp number">
          <Input
            required
            inputMode="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="10-digit number"
            className="border-2 border-ink"
          />
        </Field>
        <Field label="Email (optional)">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@institution.in"
            className="border-2 border-ink"
          />
        </Field>
      </div>

      <label className="flex gap-3 border-2 border-ink bg-paper p-3">
        <Checkbox
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          aria-label="Consent to being contacted"
        />
        <span className="text-xs leading-relaxed text-muted-foreground">
          I agree that DishaYaaN may store this institutional enquiry and contact me
          about it. Requirements are used to design programmes, not shared publicly.
        </span>
      </label>

      {error ? (
        <p className="border-2 border-ink bg-destructive/10 p-3 text-sm font-medium text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">
          A pilot is scoped before any contract is discussed.
        </p>
        <Button
          type="submit"
          variant="neo-dark"
          size="lg"
          disabled={status === "sending"}
          className="w-full font-bold sm:w-auto"
        >
          {status === "sending" ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowRight className="size-4" />
          )}
          {status === "sending" ? "Sending" : "Send partnership request"}
        </Button>
      </div>
    </form>
  );
}

export { Field, ChipGroup };
