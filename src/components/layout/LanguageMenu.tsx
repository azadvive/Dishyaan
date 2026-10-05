import { LANGUAGES, useI18n } from "@/i18n";
import { cn } from "@/lib/utils";
import { Check, Globe } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Language switcher for the site chrome. Kept dependency-free (no Radix
 * popper) so it adds no new resize observers to the page.
 */
export function LanguageMenu({
  className,
  align = "right",
}: {
  className?: string;
  align?: "left" | "right";
}) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const current = LANGUAGES.find((language) => language.code === lang) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`${t("lang.label")}: ${current.name}`}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-1.5 rounded-xl border border-line px-2.5 py-1.5 text-sm font-semibold text-ink transition-colors hover:bg-neo-cyan hover:text-deep"
      >
        <Globe className="size-4" aria-hidden />
        <span className="font-mono text-xs font-bold">{current.native}</span>
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={t("lang.label")}
          className={cn(
            "absolute z-50 mt-2 w-56 rounded-xl border border-line bg-panel p-1 shadow-neo",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {LANGUAGES.map((language) => {
            const selected = language.code === lang;
            return (
              <li key={language.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setLang(language.code);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors",
                    selected
                      ? "bg-ink text-white"
                      : "text-ink hover:bg-neo-yellow hover:text-deep",
                  )}
                >
                  <span className="flex flex-col">
                    <span className="text-sm font-bold leading-tight">
                      {language.native}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-wider opacity-70">
                      {language.name}
                    </span>
                  </span>
                  {selected ? <Check className="size-4 shrink-0" aria-hidden /> : null}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
