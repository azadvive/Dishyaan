import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { AI_CHIPS, AI_STARTERS } from "@/data/site";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation, useQuery } from "convex/react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, CornerDownLeft, Loader2, Sparkles, X } from "lucide-react";
import { track } from "@/lib/analytics";
import { getSessionId } from "@/lib/session";
import { cn } from "@/lib/utils";

export const OPEN_AI_EVENT = "dishayaan:open-ai";

export function openAIAssistant() {
  window.dispatchEvent(new CustomEvent(OPEN_AI_EVENT));
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function AIAssistant() {
  const reduce = useReducedMotion();
  const sessionId = getSessionId();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [mode, setMode] = useState<"live" | "guided" | null>(null);
  const [localCredits, setLocalCredits] = useState<number | null>(null);
  const scroller = useRef<HTMLDivElement | null>(null);

  const account = useQuery(api.aiData.getAccount, { sessionId });
  const ensureAccount = useMutation(api.aiData.ensureAccount);
  const chat = useAction(api.ai.chat);

  const credits = localCredits ?? account?.credits ?? 10;
  const conversationCount = account?.conversationCount ?? 0;

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener(OPEN_AI_EVENT, handler);
    return () => window.removeEventListener(OPEN_AI_EVENT, handler);
  }, []);

  // Bootstrap the wallet the first time the panel is opened.
  useEffect(() => {
    if (isOpen && account === null) {
      void ensureAccount({ sessionId }).catch(() => undefined);
    }
  }, [isOpen, account, ensureAccount, sessionId]);

  useEffect(() => {
    if (isOpen) track("ai_open", { credits });
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (scroller.current) {
      scroller.current.scrollTop = scroller.current.scrollHeight;
    }
  }, [messages, isSending]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;
      setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
      setInput("");
      setIsSending(true);
      track("ai_question", { length: trimmed.length });
      try {
        const result = (await chat({ sessionId, message: trimmed })) as {
          reply: string;
          credits: number;
          mode: "live" | "guided" | "exhausted";
        };
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.reply },
        ]);
        setLocalCredits(result.credits);
        if (result.mode !== "exhausted") setMode(result.mode);
        track("ai_credit_used", { remaining: result.credits });
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I could not reach the DishaYaaN service just now. You can still explore the catalogue or ask a mentor directly — a human conversation is always the better final step.",
          },
        ]);
      } finally {
        setIsSending(false);
      }
    },
    [chat, isSending, sessionId],
  );

  const exhausted = credits <= 0;

  return (
    <>
      {/* Floating launcher */}
      <AnimatePresence>
        {!isOpen ? (
          <motion.button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="Open DishaYaaN AI assistant"
            initial={reduce ? undefined : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: 12 }}
            className="fixed bottom-20 right-4 z-40 flex items-center gap-2 border-2 border-ink bg-neo-cyan px-4 py-3 font-mono text-sm font-bold text-deep shadow-neo transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
          >
            <Sparkles className="size-4" />
            <span className="hidden sm:inline">ASK DISHAAYAAN AI</span>
            <span className="sm:hidden">ASK AI</span>
            <span className="border-2 border-ink bg-invert px-1.5 py-0.5 font-mono text-[10px] font-bold text-deep">
              {credits}
            </span>
          </motion.button>
        ) : null}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            role="dialog"
            aria-label="DishaYaaN AI"
            initial={reduce ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-20 right-3 z-50 flex w-[min(94vw,400px)] flex-col border-2 border-ink bg-card shadow-neo-lg sm:bottom-6 sm:right-6"
            style={{ maxHeight: "min(78vh, 640px)" }}
          >
            <header className="flex items-start justify-between gap-3 border-b-2 border-ink bg-panel-2 px-4 py-3 text-ink">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold">
                  <Bot className="size-4 text-neo-cyan" />
                  DishaYaaN AI
                  <span className="border border-ink/40 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider">
                    {mode === "live" ? "Live" : mode === "guided" ? "Guided" : "Ready"}
                  </span>
                </p>
                <p className="mt-1 text-xs text-ink/60">
                  Your first guide to what comes next.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="whitespace-nowrap border-2 border-ink/60 px-2 py-1 font-mono text-[10px] font-bold">
                  {credits} free left
                </span>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close DishaYaaN AI"
                  className="border-2 border-ink/60 p-1 hover:bg-ink/10"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </header>

            <div
              ref={scroller}
              className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm"
            >
              {messages.length === 0 ? (
                <div className="space-y-3">
                  <p className="font-bold">
                    Hi! I'm DishaYaaN AI. What would you like to explore?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {AI_STARTERS.map((starter) => (
                      <button
                        key={starter}
                        type="button"
                        onClick={() => void send(starter)}
                        className="border-2 border-ink bg-paper px-2.5 py-1.5 text-left text-xs font-semibold transition-colors hover:bg-neo-yellow hover:text-deep"
                      >
                        {starter}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    You have {credits} free exploration questions. I will ask about
                    your class and interests so my suggestions are useful, and I
                    am never a replacement for a human mentor.
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((m, i) => (
                    <div
                      key={`${m.role}-${i}`}
                      className={cn(
                        "border-2 border-ink p-3 leading-relaxed whitespace-pre-line",
                        m.role === "user"
                          ? "ml-6 bg-neo-blue text-white"
                          : "mr-2 bg-paper",
                      )}
                    >
                      {m.content}
                    </div>
                  ))}
                  {messages.length > 0 && !exhausted ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {AI_CHIPS.slice(0, 3).map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => void send(chip)}
                          className="border-2 border-ink bg-card px-2.5 py-1 text-xs font-semibold hover:bg-neo-cyan"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </>
              )}

              {isSending ? (
                <p className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" /> Thinking about your
                  class and goal…
                </p>
              ) : null}
            </div>

            <div className="border-t-2 border-ink bg-paper px-4 py-3">
              {exhausted ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold leading-relaxed">
                    You've explored the first layer. Ready for deeper guidance?
                  </p>
                  <MentorConnectButton
                    source="ai_exhausted"
                    context={`Used all 10 free AI questions (${conversationCount} exchanges).`}
                    variant="neo-blue"
                    className="w-full"
                    onClick={() => track("ai_handoff", { from: "exhausted" })}
                  >
                    Connect me with a mentor
                  </MentorConnectButton>
                </div>
              ) : (
                <>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void send(input);
                    }}
                    className="flex items-center gap-2"
                  >
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about a domain, exam or plan…"
                      aria-label="Message DishaYaaN AI"
                      className="border-2 border-ink"
                    />
                    <Button
                      type="submit"
                      size="icon"
                      variant="neo-dark"
                      disabled={isSending || !input.trim()}
                      aria-label="Send message"
                    >
                      <CornerDownLeft className="size-4" />
                    </Button>
                  </form>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-[11px] leading-tight text-muted-foreground">
                      Exploration only. Not a prediction of your future.
                    </p>
                    <MentorConnectButton
                      source="ai_panel"
                      context={`AI conversation so far, ${conversationCount} exchanges.`}
                      variant="neo"
                      size="sm"
                      icon={false}
                      className="whitespace-nowrap text-xs"
                      onClick={() => track("ai_handoff", { from: "panel" })}
                    >
                      Talk to a human mentor
                    </MentorConnectButton>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
