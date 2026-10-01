import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Scroll reveal — short, subtle, and disabled for reduced-motion users. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 18,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? undefined : { opacity: 0, y }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function staggerParent(delay = 0): Variants {
  return {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: delay } },
  };
}

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export function Eyebrow({
  children,
  className,
  tone = "ink",
}: {
  children: ReactNode;
  className?: string;
  tone?: "ink" | "blue" | "violet" | "green" | "cyan" | "white";
}) {
  const tones: Record<string, string> = {
    ink: "bg-invert text-deep",
    blue: "bg-neo-blue text-white",
    violet: "bg-neo-violet text-white",
    green: "bg-neo-green text-deep",
    cyan: "bg-neo-cyan text-deep",
    white: "bg-invert text-deep",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 border-2 border-ink px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.18em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  eyebrowTone = "ink",
  title,
  lead,
  align = "left",
  className,
  titleClassName,
}: {
  eyebrow?: ReactNode;
  eyebrowTone?: "ink" | "blue" | "violet" | "green" | "cyan" | "white";
  title: ReactNode;
  lead?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow> : null}
      <h2
        className={cn(
          "max-w-4xl text-3xl font-bold leading-[1.05] sm:text-4xl lg:text-5xl",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {lead ? (
        <p
          className={cn(
            "max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}

export function NeoPanel({
  children,
  className,
  accent,
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  accent?: "blue" | "violet" | "cyan" | "green" | "yellow" | "paper" | "ink";
  hover?: boolean;
}) {
  const accents: Record<string, string> = {
    blue: "bg-neo-blue text-white",
    violet: "bg-neo-violet text-white",
    cyan: "bg-neo-cyan text-deep",
    green: "bg-neo-green text-deep",
    yellow: "bg-neo-yellow text-deep",
    paper: "bg-panel text-ink",
    ink: "bg-panel-2 text-ink",
  };
  return (
    <div
      className={cn(
        "border-2 border-ink",
        accent ? accents[accent] : "bg-panel text-ink",
        hover &&
          "transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-neo",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/** Section wrapper with consistent rhythm. */
export function Section({
  children,
  className,
  id,
  tone = "paper",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "paper" | "white" | "ink" | "blue" | "yellow";
}) {
  const tones: Record<string, string> = {
    paper: "bg-paper",
    white: "bg-card",
    ink: "bg-panel-2 text-ink",
    blue: "bg-neo-blue text-white",
    yellow: "bg-neo-yellow text-deep",
  };
  return (
    <section
      id={id}
      className={cn("relative py-16 sm:py-20 lg:py-24", tones[tone], className)}
    >
      {children}
    </section>
  );
}

/** A thin scrolling strip of flat blocks — used as a section divider. */
export function Tape({ items, tone = "ink" }: { items: string[]; tone?: "ink" | "yellow" | "blue" }) {
  const tones: Record<string, string> = {
    ink: "bg-panel-2 text-ink",
    yellow: "bg-neo-yellow text-deep",
    blue: "bg-neo-blue text-white",
  };
  const row = [...items, ...items];
  return (
    <div className={cn("overflow-hidden border-y-2 border-ink py-3", tones[tone])}>
      <div className="flex w-max animate-tape items-center gap-8 pr-8">
        {row.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="flex items-center gap-8 font-mono text-xs font-bold uppercase tracking-[0.22em] whitespace-nowrap"
          >
            {item}
            <span aria-hidden className="text-base leading-none">
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
