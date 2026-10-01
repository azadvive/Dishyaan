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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EXPLORE_TRACKS, CLASS_OPTIONS } from "@/data/catalog";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { motion, useReducedMotion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ArrowRight, CheckCircle2, Loader2, Users } from "lucide-react";
import { track } from "@/lib/analytics";
import { hasSeenPrompt, markPromptSeen } from "@/lib/session";
import { cn } from "@/lib/utils";

interface MentorConnectState {
  isOpen: boolean;
  context: string;
  domain?: string;
  source: string;
}

interface MentorConnectContextValue {
  open: (options?: { source?: string; context?: string; domain?: string }) => void;
  close: () => void;
  openCount: number;
}

const MentorConnectContext = createContext<MentorConnectContextValue | null>(
  null,
);

export function useMentorConnect() {
  const ctx = useContext(MentorConnectContext);
  if (!ctx) {
    throw new Error("useMentorConnect must be used inside MentorConnectProvider");
  }
  return ctx;
}

/** Auto-prompt delay: the second minute on site. */
const AUTO_PROMPT_MS = 120_000;

export function MentorConnectProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MentorConnectState>({
    isOpen: false,
    context: "",
    source: "manual",
  });
  const [openCount, setOpenCount] = useState(0);

  const open = useCallback(
    (options?: { source?: string; context?: string; domain?: string }) => {
      setState((prev) => ({
        isOpen: true,
        source: options?.source ?? prev.source ?? "manual",
        context: options?.context ?? prev.context,
        domain: options?.domain ?? prev.domain,
      }));
      setOpenCount((c) => c + 1);
      track("mentor_connect_open", { source: options?.source ?? "manual" });
    },
    [],
  );

  const close = useCallback(
    () => setState((prev) => ({ ...prev, isOpen: false })),
    [],
  );

  // Pop the offer up once per browser session, two minutes after arrival.
  useEffect(() => {
    if (hasSeenPrompt("mentor-connect-2min")) return;
    const timer = window.setTimeout(() => {
      markPromptSeen("mentor-connect-2min");
      setState((prev) => {
        if (prev.isOpen) return prev;
        return { isOpen: true, source: "auto_2min", context: "" };
      });
      track("mentor_connect_prompt_shown", { after_seconds: 120 });
    }, AUTO_PROMPT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const value = useMemo(
    () => ({ open, close, openCount }),
    [open, close, openCount],
  );

  return (
    <MentorConnectContext.Provider value={value}>
      {children}
      <MentorConnectDialog state={state} close={close} />
    </MentorConnectContext.Provider>
  );
}

/** The single CTA used everywhere a student or parent can ask for a human. */
export function MentorConnectButton({
  children = "Talk to a Mentor",
  variant = "neo",
  size = "default",
  className,
  source = "cta",
  context,
  domain,
  icon = true,
  onClick,
}: {
  children?: ReactNode;
  variant?:
    | "neo"
    | "neo-dark"
    | "neo-blue"
    | "neo-violet"
    | "neo-cyan"
    | "neo-green"
    | "neo-yellow";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  source?: string;
  context?: string;
  domain?: string;
  icon?: boolean;
  onClick?: () => void;
}) {
  const { open } = useMentorConnect();
  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("font-bold", className)}
      onClick={() => {
        onClick?.();
        open({ source, context, domain });
      }}
    >
      {icon ? <Users className="size-4" /> : null}
      {children}
    </Button>
  );
}

function MentorConnectDialog({
  state,
  close,
}: {
  state: MentorConnectState;
  close: () => void;
}) {
  const submit = useMutation(api.mentorRequests.submit);
  const reduce = useReducedMotion();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [domain, setDomain] = useState<string>(state.domain ?? "");
  const [classValue, setClassValue] = useState<string>("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [language, setLanguage] = useState("English");
  const [availability, setAvailability] = useState("Weekday evenings");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (state.isOpen) {
      setStatus("idle");
      setError(null);
      if (state.domain) setDomain(state.domain);
    }
  }, [state.isOpen, state.domain]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setError(null);
    try {
      await submit({
        name,
        whatsapp,
        studentClass: classValue || undefined,
        domain: domain || undefined,
        interests: domain ? [domain] : [],
        language,
        availability,
        context: [state.context, note].filter(Boolean).join(" | ") || undefined,
        source: state.source,
      });
      track("mentor_connect_submit", { source: state.source, domain });
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

  const isAutoPrompt = state.source === "auto_2min";

  return (
    <Dialog open={state.isOpen} onOpenChange={(o) => !o && close()}>
      <DialogContent className="max-h-[92vh] overflow-y-auto border-2 border-ink p-0 sm:max-w-[560px]">
        <div className="border-b-2 border-ink bg-neo-yellow px-6 py-4 text-deep">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {status === "sent"
                ? "Request received."
                : isAutoPrompt
                  ? "Still exploring? Talk to a real mentor."
                  : "Connect with a mentor"}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-deep/80">
              {status === "sent"
                ? "A mentor from the matching domain will reach out on WhatsApp."
                : "Free 20-minute conversation. No fees, no pressure, no sales script."}
            </DialogDescription>
          </DialogHeader>
        </div>

        {status === "sent" ? (
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 px-6 py-10 text-center"
          >
            <CheckCircle2 className="size-12 text-neo-green" />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              We have your context: {state.context ? "your exploration results, " : ""}
              your class, interests and preferred slot. The mentor will message
              you on WhatsApp within one working day.
            </p>
            <Button variant="neo-dark" className="font-bold" onClick={close}>
              Back to exploring
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
            {state.context ? (
              <div className="border-2 border-ink bg-paper p-3 text-xs leading-relaxed text-muted-foreground">
                <span className="font-bold text-ink">Context passed on:</span>{" "}
                {state.context}
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="mc-name">Your name</Label>
                <Input
                  id="mc-name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Student or parent name"
                  className="border-2 border-ink"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mc-whatsapp">WhatsApp number</Label>
                <Input
                  id="mc-whatsapp"
                  required
                  inputMode="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="10-digit number"
                  className="border-2 border-ink"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Class</Label>
                <Select value={classValue} onValueChange={setClassValue}>
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
              </div>
              <div className="space-y-2">
                <Label>Domain you want</Label>
                <Select value={domain} onValueChange={setDomain}>
                  <SelectTrigger className="border-2 border-ink">
                    <SelectValue placeholder="Not sure yet" />
                  </SelectTrigger>
                  <SelectContent>
                    {EXPLORE_TRACKS.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.short}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="border-2 border-ink">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["English", "Hindi", "Gujarati", "Marathi", "Bengali"].map(
                      (l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Preferred slot</Label>
                <Select value={availability} onValueChange={setAvailability}>
                  <SelectTrigger className="border-2 border-ink">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Weekday evenings",
                      "Weekday mornings",
                      "Weekend mornings",
                      "Weekend afternoons",
                    ].map((a) => (
                      <SelectItem key={a} value={a}>
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mc-note">What should the mentor look at first?</Label>
              <Textarea
                id="mc-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional. Example: I am in Class 9 and want to start robotics but have no kit yet."
                className="border-2 border-ink"
              />
            </div>

            {error ? (
              <p className="border-2 border-ink bg-destructive/10 p-3 text-sm font-medium text-destructive">
                {error}
              </p>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-muted-foreground">
                By sending this you agree we may contact you on WhatsApp about
                this request only.
              </p>
              <Button
                type="submit"
                variant="neo-blue"
                disabled={status === "sending"}
                className="w-full font-bold sm:w-auto"
              >
                {status === "sending" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ArrowRight className="size-4" />
                )}
                {status === "sending" ? "Sending" : "Request mentor"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
