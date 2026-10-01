import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Container,
  Eyebrow,
  Section,
  SectionHeader,
} from "@/components/common/primitives";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { PlanCard } from "@/components/cards";
import { PLANS, inr } from "@/data/plans";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useAction } from "convex/react";
import { useSeo } from "@/hooks/use-seo";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { Plan } from "@/types";
import { useState } from "react";
import { CheckCircle2, CreditCard, Loader2, ShieldCheck } from "lucide-react";

interface RazorpayInstance {
  open: () => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
  }
}

type PaymentStep = "details" | "processing" | "manual" | "paid" | "error";

const COMPARISON_ROWS: Array<{ label: string; key: keyof Plan | "mentorship" | "ai" }> = [
  { label: "Mentorship", key: "mentorship" },
  { label: "AI access", key: "ai" },
  { label: "Projects", key: "features" },
  { label: "Progress tracking", key: "features" },
  { label: "Parent visibility", key: "features" },
];

export default function Plans() {
  const [selected, setSelected] = useState<Plan | null>(null);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<PaymentStep>("details");
  const [studentName, setStudentName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingPaymentId, setPendingPaymentId] = useState<Id<"payments"> | null>(
    null,
  );

  const createOrder = useAction(api.payments.createOrder);
  const verify = useAction(api.payments.verify);

  useSeo({
    title: "Plans & pricing",
    description:
      "Dishayaan plans: Explore, Mentorship, Specialized Projects, Exam Preparation and the one-time Goal Sprint. Monthly billing with mentor sessions, AI credits, projects and parent visibility included.",
    path: "/plans",
    keywords: [
      "student mentorship pricing",
      "robotics course fees",
      "AI course fees India",
      "JEE mentorship plan",
      "online mentorship subscription for students",
    ],
  });

  const choosePlan = (plan: Plan) => {
    setSelected(plan);
    setStep("details");
    setError(null);
    setOpen(true);
    track("checkout_start", { plan: plan.slug, amount: plan.priceInr });
  };

  const loadRazorpay = () =>
    new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePay = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    setStep("processing");
    setError(null);

    try {
      const result = await createOrder({
        planSlug: selected.slug,
        planName: selected.name,
        amount: selected.priceInr,
        billingPeriod: selected.billingPeriod,
        studentName,
        whatsapp,
        email: email || undefined,
      });

      if (!result.ok) {
        // Honest fallback: the request is captured server-side and a human
        // confirms the enrolment. No fake "payment successful" screen.
        setPendingPaymentId(result.paymentId);
        setStep("manual");
        return;
      }

      setPendingPaymentId(result.paymentId);
      const ready = await loadRazorpay();
      if (!ready || !window.Razorpay) {
        setStep("manual");
        return;
      }

      const checkout = new window.Razorpay({
        key: result.keyId,
        order_id: result.orderId,
        amount: result.amount,
        currency: result.currency,
        name: "Dishayaan",
        description: `${selected.name} plan`,
        prefill: { name: studentName, contact: whatsapp, email },
        theme: { color: "#2563eb" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verification = await verify({
            paymentId: result.paymentId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          });
          if (verification.ok) {
            setStep("paid");
            track("checkout_complete", { plan: selected.slug });
          } else {
            setStep("error");
            setError(
              "We could not verify that payment. Nothing will be charged twice — send us a message and we will fix it manually.",
            );
          }
        },
        modal: {
          ondismiss: () => setStep("details"),
        },
      });
      checkout.open();
    } catch (err) {
      setStep("error");
      setError(
        err instanceof Error
          ? err.message.replace(/^.*Uncaught Error: /, "")
          : "Checkout could not start. Please try again or request a callback.",
      );
    }
  };

  return (
    <>
      <Section tone="white" className="border-b-2 border-ink py-12 sm:py-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-end">
            <SectionHeader
              eyebrow="Plans"
              eyebrowTone="green"
              title="Premium guidance, priced without games."
              lead="One fee covers the mentor time, the AI credits, the projects and the parent view. No hidden material charges. Cancel or switch whenever the plan stops fitting."
            />
            <div className="border-2 border-ink bg-paper p-5">
              <p className="flex items-center gap-2 text-sm font-bold">
                <ShieldCheck className="size-4 text-neo-green" /> Pay online in
                seconds
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Card, UPI and netbanking are processed by our payment gateway. You
                receive a receipt immediately and the first seven days are fully
                refundable.
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                Prefer to talk first? Every plan has an "ask a mentor before paying"
                option. Institutions can request a custom quotation.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="paper" className="py-12 sm:py-16">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {PLANS.map((plan) => (
              <PlanCard key={plan.id} plan={plan} onChoose={choosePlan} />
            ))}
            <article className="flex h-full flex-col border-2 border-dashed border-ink/50 bg-white p-5">
              <Eyebrow tone="ink">Institutions</Eyebrow>
              <h3 className="mt-4 text-xl font-bold">
                Custom quotation for schools, colleges and centres
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Cohort pricing depends on group size, weekly hours, equipment and the
                reporting your team needs. We scope a paid pilot before any annual
                commitment.
              </p>
              <div className="mt-auto space-y-3 pt-6">
                <Button asChild variant="neo-dark" className="w-full font-bold">
                  <a href="/partners">Request a quotation</a>
                </Button>
                <p className="text-xs text-muted-foreground">
                  No prices invented here — you get a written quote with what is
                  included.
                </p>
              </div>
            </article>
          </div>

          <div className="mt-12 border-2 border-ink bg-white">
            <div className="border-b-2 border-ink bg-ink px-5 py-3 text-white">
              <p className="text-sm font-bold uppercase tracking-[0.14em]">
                What every plan includes
              </p>
            </div>
            <div className="grid gap-px bg-ink sm:grid-cols-2">
              {[
                ["Mentorship", "1–6 live mentor sessions per month, matched by domain, language and schedule."],
                ["Dishayaan AI", "100–500 exploration credits per month, stored server-side."],
                ["Projects", "Project briefs with mentor review; two portfolio projects per term on Specialized."],
                ["Progress tracking", "Weekly plan adherence, skills gained and mentor notes."],
                ["Parent visibility", "A parent view of attendance, projects and the next recommended step."],
                ["Materials", "Digital materials included. Hardware kits are arranged separately at cost."],
              ].map(([title, body]) => (
                <div key={title} className="bg-white p-5">
                  <p className="text-sm font-bold">{title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <SectionHeader
              eyebrow="Billing questions"
              title="No fine print traps."
              lead="If something here is unclear, ask a mentor or the AI before paying."
            />
            <Accordion type="single" collapsible className="border-2 border-ink bg-white">
              {[
                {
                  q: "How is billing handled?",
                  a: "Plans are billed monthly, except the Goal Sprint which is a single one-time payment for the 12-week project. Nothing renews silently without your knowledge — we tell you before any renewal.",
                },
                {
                  q: "Is a refund possible?",
                  a: "Yes. Tell us within the first seven days of a period and we refund that period in full. After that we will still fix a genuine mismatch instead of holding a fee that is not earning its place.",
                },
                {
                  q: "Can we switch plans?",
                  a: "Any time. Move up and we charge the difference for the remainder of the period; move down and the unused amount carries to the next period.",
                },
                {
                  q: "Are hardware kits included?",
                  a: "Digital content, mentor time and reviews are included. For robotics and drones the kit is arranged at cost, and we tell you the exact amount before you order anything.",
                },
              ].map((item, i) => (
                <AccordionItem
                  key={item.q}
                  value={`plan-faq-${i}`}
                  className="border-b-2 border-ink px-5 last:border-b-0"
                >
                  <AccordionTrigger className="text-left text-sm font-bold hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </Section>

      <Section tone="ink" className="py-14">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Still deciding? Talk to a mentor first.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
                Twenty free minutes with someone who works in the field. They will
                tell you which plan fits — including "none of them yet".
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <MentorConnectButton
                variant="neo-blue"
                size="lg"
                source="plans_footer"
                context="Comparing plans and wants guidance before paying."
                className="font-bold"
              >
                Connect with a mentor
              </MentorConnectButton>
              <p className="text-xs text-white/60">
                Looking for the comparison table?{" "}
                <span className="text-white">
                  {PLANS.map((p) => p.name).join(" · ")}
                </span>
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto border-2 border-ink p-0 sm:max-w-[520px]">
          <div className="border-b-2 border-ink bg-neo-blue px-6 py-4 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">
                {step === "paid"
                  ? "Payment confirmed."
                  : step === "manual"
                    ? "Request recorded."
                    : selected
                      ? `Start the ${selected.name} plan`
                      : "Start a plan"}
              </DialogTitle>
              <DialogDescription className="text-sm font-medium text-white/85">
                {selected
                  ? `${inr(selected.priceInr)} ${selected.billingPeriod === "project" ? "one-time" : "per month"} · refundable in the first 7 days`
                  : ""}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="px-6 py-6">
            {step === "details" || step === "processing" ? (
              <form onSubmit={handlePay} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pay-name">Student name</Label>
                  <Input
                    id="pay-name"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="border-2 border-ink"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pay-whatsapp">WhatsApp number</Label>
                  <Input
                    id="pay-whatsapp"
                    required
                    inputMode="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="border-2 border-ink"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pay-email">Email for the receipt (optional)</Label>
                  <Input
                    id="pay-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-2 border-ink"
                  />
                </div>

                <div className="border-2 border-dashed border-ink/40 bg-paper p-4 text-xs leading-relaxed text-muted-foreground">
                  Payments are created server-side and verified with a signature
                  check. Card details never touch Dishayaan's servers.
                </div>

                <Button
                  type="submit"
                  variant="neo-blue"
                  size="lg"
                  className="w-full font-bold"
                  disabled={step === "processing"}
                >
                  {step === "processing" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CreditCard className="size-4" />
                  )}
                  {step === "processing"
                    ? "Opening secure checkout"
                    : `Pay ${selected ? inr(selected.priceInr) : ""}`}
                </Button>
              </form>
            ) : null}

            {step === "manual" ? (
              <div className="space-y-4 text-center">
                <CheckCircle2 className="mx-auto size-12 text-neo-green" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Online card checkout is not live yet, so we recorded your request
                  against{" "}
                  <span className="font-bold text-ink">
                    {selected?.name} · {selected ? inr(selected.priceInr) : ""}
                  </span>{" "}
                  instead of showing a fake success screen. A mentor will confirm the
                  payment link on WhatsApp within one working day.
                </p>
                {pendingPaymentId ? (
                  <p className="text-[11px] text-muted-foreground">
                    Reference: {pendingPaymentId}
                  </p>
                ) : null}
                <MentorConnectButton
                  variant="neo-dark"
                  className="w-full font-bold"
                  source="checkout_manual"
                  context={`Requested enrolment in ${selected?.name ?? "a plan"}.`}
                >
                  Talk to a mentor now instead
                </MentorConnectButton>
              </div>
            ) : null}

            {step === "paid" ? (
              <div className="space-y-4 text-center">
                <CheckCircle2 className="mx-auto size-12 text-neo-green" />
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Your {selected?.name} plan is active. Check WhatsApp and your email
                  for the receipt and the mentor-matching steps.
                </p>
                <Button
                  variant="neo-dark"
                  className="w-full font-bold"
                  onClick={() => setOpen(false)}
                >
                  Done
                </Button>
              </div>
            ) : null}

            {step === "error" ? (
              <div className="space-y-4">
                <p className="border-2 border-ink bg-destructive/10 p-3 text-sm font-medium text-destructive">
                  {error ?? "Something went wrong."}
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="neo"
                    className="font-bold"
                    onClick={() => setStep("details")}
                  >
                    Try again
                  </Button>
                  <MentorConnectButton
                    variant="neo-blue"
                    className="font-bold"
                    source="checkout_error"
                    context={`Checkout failed for ${selected?.name ?? "a plan"}.`}
                  >
                    Ask a mentor to complete it manually
                  </MentorConnectButton>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
