import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Container, Eyebrow, Section } from "@/components/common/primitives";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { useSeo } from "@/hooks/use-seo";
import { inr } from "@/data/plans";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import {
  CalendarCheck,
  EyeOff,
  Eye,
  GraduationCap,
  KeyRound,
  Landmark,
  Loader2,
  Lock,
  MessageSquare,
  Receipt,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router";

const LEAD_STATUSES = ["new", "contacted", "closed"] as const;
const BOOKING_STATUSES = ["requested", "confirmed", "completed", "cancelled"] as const;
type LeadStatus = (typeof LEAD_STATUSES)[number];
type BookingStatus = (typeof BOOKING_STATUSES)[number];

const TABS = [
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "leads", label: "Student enquiries", icon: GraduationCap },
  { id: "partners", label: "Institutions", icon: Landmark },
  { id: "mentors", label: "Mentor requests", icon: Users },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "enrolments", label: "Enrolments", icon: Receipt },
  { id: "community", label: "Community", icon: MessageSquare },
] as const;

type TabId = (typeof TABS)[number]["id"];

function when(timestamp: number) {
  return new Date(timestamp).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function whatsappLink(number: string) {
  const digits = number.replace(/\D/g, "");
  const full = digits.length === 10 ? `91${digits}` : digits;
  return `https://wa.me/${full}`;
}

function Fields({ items }: { items: Array<[string, ReactNode]> }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="border-2 border-ink bg-paper p-3">
          <dt className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </dt>
          <dd className="mt-1 break-words text-sm leading-snug">
            {value ?? "—"}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function StatusPicker<T extends string>({
  value,
  options,
  onChange,
  pending,
}: {
  value: T;
  options: readonly T[];
  onChange: (next: T) => void;
  pending: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
        Status
      </span>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          disabled={pending}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
          className={cn(
            "border-2 border-ink px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-60",
            value === option
              ? "bg-neo-yellow text-deep"
              : "bg-card hover:bg-paper",
          )}
        >
          {option}
        </button>
      ))}
      {pending ? <Loader2 className="size-3.5 animate-spin text-muted-foreground" /> : null}
    </div>
  );
}

function RecordCard({
  title,
  meta,
  children,
  footer,
  accent = "paper",
}: {
  title: ReactNode;
  meta?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  accent?: "paper" | "cyan" | "violet" | "green";
}) {
  const accents: Record<string, string> = {
    paper: "bg-paper",
    cyan: "bg-neo-cyan text-deep",
    violet: "bg-neo-violet text-white",
    green: "bg-neo-green text-deep",
  };
  return (
    <article className="border-2 border-ink bg-card">
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-2 border-b-2 border-ink px-4 py-3",
          accents[accent],
        )}
      >
        <p className="text-sm font-bold">{title}</p>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
          {meta}
        </p>
      </div>
      <div className="space-y-4 p-4">
        {children}
        {footer ? (
          <div className="border-t-2 border-dashed border-ink/25 pt-3">{footer}</div>
        ) : null}
      </div>
    </article>
  );
}

function Panel({
  title,
  description,
  count,
  children,
}: {
  title: string;
  description: string;
  count?: number;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 border-2 border-ink bg-panel-2 p-5 text-ink">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-ink/70">
            {description}
          </p>
        </div>
        <p className="font-mono text-xs font-bold uppercase tracking-[0.14em]">
          {count === undefined ? "…" : `${count} records`}
        </p>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <p className="border-2 border-dashed border-ink/40 bg-paper p-6 text-center text-sm text-muted-foreground">
      {text}
    </p>
  );
}

function Loading() {
  return (
    <p className="flex items-center gap-2 border-2 border-ink bg-paper p-6 text-sm font-bold">
      <Loader2 className="size-4 animate-spin" /> Reading the queue
    </p>
  );
}

function usePending() {
  const [busyId, setBusyId] = useState<string | null>(null);
  const run = async (id: string, action: () => Promise<unknown>) => {
    setBusyId(id);
    try {
      await action();
    } finally {
      setBusyId(null);
    }
  };
  return { busyId, run };
}

function BookingsPanel() {
  const rows = useQuery(api.bookings.list, { limit: 100 });
  const setStatus = useMutation(api.bookings.setStatus);
  const { busyId, run } = usePending();

  return (
    <Panel
      title="One-to-one session bookings"
      description="Every counselling request, newest first. Confirm the slot on WhatsApp, then move the status forward. Reference codes are what students quote back to us."
      count={rows?.length}
    >
      {rows === undefined ? <Loading /> : null}
      {rows?.length === 0 ? <Empty text="No sessions requested yet." /> : null}
      {rows?.map((row) => (
        <RecordCard
          key={row._id}
          title={row.reference}
          meta={when(row._creationTime)}
          accent={row.status === "confirmed" ? "green" : "cyan"}
        >
          <Fields
            items={[
              [
                "Requested by",
                `${row.bookerRole === "educator" ? "Teacher / counsellor" : row.bookerRole}`,
              ],
              ["Name", row.name],
              [
                "WhatsApp",
                <a
                  key="wa"
                  href={whatsappLink(row.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-neo-cyan hover:underline"
                >
                  {row.whatsapp}
                </a>,
              ],
              ["Email", row.email],
              ["Class", row.studentClass],
              ["Domain", row.domain],
              ["Mentor seat", row.mentorSlug],
              ["Date", row.date],
              ["Slot", row.slot],
              ["Mode", row.mode],
              ["Language", row.language],
              ["Goal", row.goal],
              ["Note", row.note],
            ]}
          />
          <StatusPicker<BookingStatus>
            value={row.status}
            options={BOOKING_STATUSES}
            pending={busyId === row._id}
            onChange={(next) =>
              void run(row._id, async () => {
                await setStatus({ id: row._id, status: next });
                track("admin_status_change", { entity: "booking", status: next });
              })
            }
          />
        </RecordCard>
      ))}
    </Panel>
  );
}

function LeadsPanel() {
  const rows = useQuery(api.leads.list, { limit: 100 });
  const setStatus = useMutation(api.leads.setStatus);
  const { busyId, run } = usePending();

  return (
    <Panel
      title="Student, parent and teacher enquiries"
      description="Everything submitted through the requirement form. These answers decide which programmes we build next, so read them in batches rather than one by one."
      count={rows?.length}
    >
      {rows === undefined ? <Loading /> : null}
      {rows?.length === 0 ? <Empty text="No enquiries yet." /> : null}
      {rows?.map((row) => (
        <RecordCard
          key={row._id}
          title={`${row.name} · ${row.role}`}
          meta={`${row.source} · ${when(row._creationTime)}`}
        >
          <Fields
            items={[
              [
                "WhatsApp",
                <a
                  key="wa"
                  href={whatsappLink(row.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-neo-cyan hover:underline"
                >
                  {row.whatsapp}
                </a>,
              ],
              ["Email", row.email],
              ["Student", row.studentName],
              ["Class", row.studentClass],
              ["Board", row.board],
              ["City", row.city],
              ["State", row.state],
              ["Language", row.language],
              ["Clarity", row.clarity],
              ["Outside school", row.outsideSchool],
              ["Difficulty", row.difficulty],
              ["Goal", row.goal],
              ["Learning preference", row.learningPreference],
              ["Preferred call time", row.preferredTime],
              ["Interests", row.interests.join(", ")],
              ["Trust factors", row.trustFactors.join(", ")],
              ["Consent", row.consent ? "Given" : "Not given"],
              ["Message", row.message],
            ]}
          />
          <StatusPicker<LeadStatus>
            value={row.status}
            options={LEAD_STATUSES}
            pending={busyId === row._id}
            onChange={(next) =>
              void run(row._id, async () => {
                await setStatus({ id: row._id, status: next });
                track("admin_status_change", { entity: "lead", status: next });
              })
            }
          />
        </RecordCard>
      ))}
    </Panel>
  );
}

function PartnersPanel() {
  const rows = useQuery(api.partners.list, { limit: 100 });
  const setStatus = useMutation(api.partners.setStatus);
  const { busyId, run } = usePending();

  return (
    <Panel
      title="Institution collaboration requests"
      description="Schools, colleges, coaching centres and NGOs that asked for a scoped programme. A pilot is agreed before any contract is discussed."
      count={rows?.length}
    >
      {rows === undefined ? <Loading /> : null}
      {rows?.length === 0 ? <Empty text="No institutional requests yet." /> : null}
      {rows?.map((row) => (
        <RecordCard
          key={row._id}
          title={`${row.orgName} · ${row.orgType}`}
          meta={when(row._creationTime)}
          accent="violet"
        >
          <Fields
            items={[
              ["Contact", row.contactName],
              ["Role", row.contactRole],
              ["City", row.city],
              ["Students", row.studentCount],
              ["Timeline", row.timeline],
              [
                "WhatsApp",
                <a
                  key="wa"
                  href={whatsappLink(row.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-neo-cyan hover:underline"
                >
                  {row.whatsapp}
                </a>,
              ],
              ["Email", row.email],
              ["Focus areas", row.focusAreas.join(", ")],
              ["Requirement", row.requirement],
            ]}
          />
          <StatusPicker<LeadStatus>
            value={row.status}
            options={LEAD_STATUSES}
            pending={busyId === row._id}
            onChange={(next) =>
              void run(row._id, async () => {
                await setStatus({ id: row._id, status: next });
                track("admin_status_change", { entity: "partner", status: next });
              })
            }
          />
        </RecordCard>
      ))}
    </Panel>
  );
}

function MentorRequestsPanel() {
  const rows = useQuery(api.mentorRequests.list, { limit: 100 });
  const setStatus = useMutation(api.mentorRequests.setStatus);
  const { busyId, run } = usePending();

  return (
    <Panel
      title="Mentor connection requests"
      description="Handoffs from the AI assistant, Path Finder and mentor buttons. The context column is what the student had explored before asking for a human — match on it."
      count={rows?.length}
    >
      {rows === undefined ? <Loading /> : null}
      {rows?.length === 0 ? <Empty text="No mentor requests yet." /> : null}
      {rows?.map((row) => (
        <RecordCard
          key={row._id}
          title={row.name}
          meta={`${row.source} · ${when(row._creationTime)}`}
        >
          <Fields
            items={[
              [
                "WhatsApp",
                <a
                  key="wa"
                  href={whatsappLink(row.whatsapp)}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-neo-cyan hover:underline"
                >
                  {row.whatsapp}
                </a>,
              ],
              ["Email", row.email],
              ["Class", row.studentClass],
              ["Domain", row.domain],
              ["Language", row.language],
              ["Availability", row.availability],
              ["Interests", row.interests.join(", ")],
              ["Context", row.context],
            ]}
          />
          <StatusPicker<LeadStatus>
            value={row.status}
            options={LEAD_STATUSES}
            pending={busyId === row._id}
            onChange={(next) =>
              void run(row._id, async () => {
                await setStatus({ id: row._id, status: next });
                track("admin_status_change", { entity: "mentor_request", status: next });
              })
            }
          />
        </RecordCard>
      ))}
    </Panel>
  );
}

function PaymentsPanel() {
  const rows = useQuery(api.paymentsData.list, { limit: 100 });

  return (
    <Panel
      title="Payment intents"
      description="Read-only ledger. “Awaiting manual” means the payment keys are not set yet, so the order was recorded without charging anyone — reconcile these by hand until the gateway is live."
      count={rows?.length}
    >
      {rows === undefined ? <Loading /> : null}
      {rows?.length === 0 ? <Empty text="No payment attempts yet." /> : null}
      {rows?.map((row) => (
        <RecordCard
          key={row._id}
          title={`${row.planName} · ${inr(row.amount)}`}
          meta={when(row._creationTime)}
          accent={row.status === "paid" ? "green" : "paper"}
        >
          <Fields
            items={[
              ["Status", row.status],
              ["Provider", row.provider],
              ["Billing", row.billingPeriod],
              ["Order id", row.providerOrderId],
              ["Payment id", row.providerPaymentId],
              ["Student", row.studentName],
              ["WhatsApp", row.whatsapp],
              ["Email", row.email],
              ["Note", row.note],
              ["Currency", row.currency],
              ["Plan slug", row.planSlug],
            ]}
          />
        </RecordCard>
      ))}
    </Panel>
  );
}

function EnrolmentsPanel() {
  const rows = useQuery(api.paymentsData.enrollments, { limit: 100 });

  return (
    <Panel
      title="Active enrolments"
      description="Created only when a payment is verified as paid. Nothing appears here from a simulated or manual checkout."
      count={rows?.length}
    >
      {rows === undefined ? <Loading /> : null}
      {rows?.length === 0 ? (
        <Empty text="No verified enrolments yet." />
      ) : null}
      {rows?.map((row) => (
        <RecordCard
          key={row._id}
          title={`${row.studentName} · ${row.planName}`}
          meta={`${row.status} · ${when(row._creationTime)}`}
          accent="green"
        >
          <Fields
            items={[
              ["Amount", inr(row.amount)],
              ["Billing", row.billingPeriod],
              ["WhatsApp", row.whatsapp],
              ["Email", row.email],
              ["Plan slug", row.planSlug],
              ["Currency", row.currency],
            ]}
          />
        </RecordCard>
      ))}
    </Panel>
  );
}

function CommunityPanel() {
  const rows = useQuery(api.posts.listForAdmin, { limit: 100 });
  const setHidden = useMutation(api.posts.setHidden);
  const { busyId, run } = usePending();
  const [query, setQuery] = useState("");

  const needle = query.trim().toLowerCase();
  const visibleRows = (rows ?? []).filter((row) =>
    needle
      ? [row.title, row.body, row.authorName, ...row.tags]
          .join(" ")
          .toLowerCase()
          .includes(needle)
      : true,
  );

  return (
    <Panel
      title="Community moderation"
      description="Hide rather than delete: hiding keeps the audit trail and the author keeps their own copy. Students can always delete their own posts."
      count={rows?.length}
    >
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search titles, authors and tags"
        className="border-2 border-ink"
        aria-label="Search posts for moderation"
      />
      {rows === undefined ? <Loading /> : null}
      {rows?.length === 0 ? (
        <Empty text="Nothing has been published to the community yet." />
      ) : null}
      {visibleRows.map((row) => (
        <RecordCard
          key={row._id}
          title={row.title}
          meta={`${row.kind} · ${row.authorName} · ${when(row._creationTime)}`}
          accent={row.hidden ? "paper" : "cyan"}
        >
          <Fields
            items={[
              ["Hidden", row.hidden ? "Hidden from the feed" : "Live"],
              ["Tags", row.tags.join(", ")],
              ["File", row.fileName],
              ["Link", row.link],
              ["Body", row.body],
            ]}
          />
          <Button
            type="button"
            variant={row.hidden ? "neo-green" : "neo"}
            size="sm"
            className="font-bold"
            disabled={busyId === row._id}
            onClick={() =>
              void run(row._id, async () => {
                await setHidden({ id: row._id, hidden: !row.hidden });
                track("admin_moderate_post", { hidden: !row.hidden });
              })
            }
          >
            {row.hidden ? (
              <>
                <Eye className="size-3.5" /> Return to the feed
              </>
            ) : (
              <>
                <EyeOff className="size-3.5" /> Hide from the feed
              </>
            )}
          </Button>
        </RecordCard>
      ))}
    </Panel>
  );
}

export default function Admin() {
  const whoami = useQuery(api.admin.whoami);
  const claim = useMutation(api.admin.claimFirstAdmin);
  const { isLoading } = useAuth();
  const [tab, setTab] = useState<TabId>("bookings");
  const [claimState, setClaimState] = useState<"idle" | "working" | "error">("idle");
  const [claimError, setClaimError] = useState<string | null>(null);

  useSeo({
    title: "Operations console",
    description:
      "The DishaYaaN operations console: session bookings, student enquiries, institutional requests, payments, enrolments and community moderation.",
    path: "/admin",
  });

  const isAdmin = whoami?.isAdmin ?? false;

  useEffect(() => {
    if (isAdmin) track("admin_view");
  }, [isAdmin]);

  const handleClaim = async () => {
    setClaimState("working");
    setClaimError(null);
    try {
      await claim({});
      setClaimState("idle");
    } catch (err) {
      setClaimState("error");
      setClaimError(
        err instanceof Error
          ? err.message.replace(/^.*Uncaught Error: /, "")
          : "That did not work.",
      );
    }
  };

  return (
    <Section tone="paper" className="min-h-screen py-10 sm:py-14">
      <Container>
        <div className="flex flex-col gap-4 border-2 border-ink bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Eyebrow tone="violet">Operations console</Eyebrow>
            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
              Everything the team has to answer.
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Bookings, enquiries, institutional requests, payments and the
              community feed in one place. Visibility here is enforced on the server —
              the queries refuse to run for anyone who is not an operator.
            </p>
          </div>
          {whoami?.signedIn ? (
            <div className="border-2 border-ink bg-paper p-4 text-xs">
              <p className="font-mono font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Signed in as
              </p>
              <p className="mt-1 font-bold">{whoami.name ?? "Unnamed account"}</p>
              <p className="text-muted-foreground">{whoami.email ?? "No email on file"}</p>
              <p
                className={cn(
                  "mt-2 inline-flex items-center gap-1.5 border-2 border-ink px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider",
                  isAdmin ? "bg-neo-green text-deep" : "bg-neo-orange text-deep",
                )}
              >
                {isAdmin ? (
                  <>
                    <ShieldCheck className="size-3" /> Operator
                  </>
                ) : (
                  <>
                    <Lock className="size-3" /> No access
                  </>
                )}
              </p>
            </div>
          ) : null}
        </div>

        {isLoading || whoami === undefined ? (
          <p className="mt-6 flex items-center gap-2 border-2 border-ink bg-paper p-6 text-sm font-bold">
            <Loader2 className="size-4 animate-spin" /> Checking your access
          </p>
        ) : null}

        {whoami && !whoami.signedIn ? (
          <div className="mt-6 border-2 border-ink bg-panel-2 p-8 text-ink">
            <Eyebrow tone="cyan">Sign in required</Eyebrow>
            <h2 className="mt-4 text-xl font-bold">
              This area is for DishaYaaN operators.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/70">
              Sign in with the email the team set up for you. Access is checked on
              every request, not just on this screen.
            </p>
            <Button asChild variant="neo-cyan" className="mt-5 font-bold">
              <Link to="/auth?returnTo=/admin">Sign in to continue</Link>
            </Button>
          </div>
        ) : null}

        {whoami && whoami.signedIn && !whoami.isAdmin ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <div className="border-2 border-ink bg-card p-6">
              <h2 className="text-lg font-bold">Your account has no access yet.</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Operators are added in two ways: their email is listed in the
                <span className="font-mono text-ink"> ADMIN_EMAILS </span>
                environment variable, or their user record carries the
                <span className="font-mono text-ink"> admin </span> role. Ask the
                workspace owner to add you.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild variant="neo" className="font-bold">
                  <Link to="/dashboard">Back to my workspace</Link>
                </Button>
                <Button asChild variant="neo-dark" className="font-bold">
                  <Link to="/">Return home</Link>
                </Button>
              </div>
            </div>

            <div className="border-2 border-ink bg-card p-6">
              <Eyebrow tone="green">Founder bootstrap</Eyebrow>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                If this deployment has no operator at all yet, the first signed-in
                account can claim the role once. After that the door closes for good.
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {whoami.hasAdmin
                  ? "An operator already exists for this workspace, so the bootstrap is closed."
                  : "No operator exists yet. Claim it now if this is your deployment."}
              </p>
              {!whoami.hasAdmin ? (
                <Button
                  variant="neo-green"
                  className="mt-5 font-bold"
                  disabled={claimState === "working"}
                  onClick={() => void handleClaim()}
                >
                  {claimState === "working" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <KeyRound className="size-4" />
                  )}
                  Claim operator access
                </Button>
              ) : null}
              {claimError ? (
                <p className="mt-3 border-2 border-ink bg-destructive/10 p-3 text-xs font-medium text-destructive">
                  {claimError}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        {isAdmin ? (
          <>
            <div className="mt-6 flex flex-wrap gap-2">
              {TABS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={tab === item.id}
                    onClick={() => setTab(item.id)}
                    className={cn(
                      "inline-flex items-center gap-2 border-2 border-ink px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors",
                      tab === item.id
                        ? "bg-neo-violet text-white"
                        : "bg-card hover:bg-paper",
                    )}
                  >
                    <Icon className="size-3.5" />
                    {item.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-6">
              {tab === "bookings" ? <BookingsPanel /> : null}
              {tab === "leads" ? <LeadsPanel /> : null}
              {tab === "partners" ? <PartnersPanel /> : null}
              {tab === "mentors" ? <MentorRequestsPanel /> : null}
              {tab === "payments" ? <PaymentsPanel /> : null}
              {tab === "enrolments" ? <EnrolmentsPanel /> : null}
              {tab === "community" ? <CommunityPanel /> : null}
            </div>
          </>
        ) : null}
      </Container>
    </Section>
  );
}
