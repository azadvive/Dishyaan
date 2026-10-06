import { Button } from "@/components/ui/button";
import { LanguageMenu } from "@/components/layout/LanguageMenu";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { openAIAssistant } from "@/components/ai/AIAssistant";
import { NAV_LINKS, SECONDARY_LINKS } from "@/data/site";
import { useAuth } from "@/hooks/use-auth";
import { useI18n, type TranslationKey } from "@/i18n";
import { cn } from "@/lib/utils";
import { track } from "@/lib/analytics";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";

/** Labels are looked up by route so data/site.ts stays the single source of
 *  truth for link order and destinations. */
const NAV_LABEL_KEYS: Record<string, TranslationKey> = {
  "/": "nav.home",
  "/catalog": "nav.catalog",
  "/mentors": "nav.mentors",
  "/community": "nav.community",
  "/plans": "nav.plans",
};

const SECONDARY_LABEL_KEYS: Record<string, TranslationKey> = {
  "/book": "nav.bookSession",
  "/pathfinder": "nav.pathfinder",
  "/about": "nav.about",
  "/partners": "nav.partners",
};

function BrandMark({ compact }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className="flex items-center gap-3"
      aria-label="DishaYaaN home"
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-neo-cyan font-display text-sm font-extrabold text-deep shadow-neo-cyan">
        D
      </span>
      <span
        className={cn(
          "font-display font-bold tracking-[-0.06em] transition-all",
          compact ? "text-lg" : "text-xl",
        )}
      >
        Disha<span className="text-neo-cyan">YaaN</span>
      </span>
    </Link>
  );
}

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user, signOut } = useAuth();
  const location = useLocation();
  const reduce = useReducedMotion();
  const { t } = useI18n();

  const label = (
    keys: Record<string, TranslationKey>,
    to: string,
    fallback: string,
  ) => {
    const key = keys[to];
    return key ? t(key) : fallback;
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMobileOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-ink/10 bg-deep/85 backdrop-blur-xl transition-all duration-200",
        scrolled && "border-ink/20 shadow-[0_16px_40px_-28px_rgba(0,3,13,0.95)]",
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-[1248px] items-center justify-between gap-4 px-5 transition-all duration-200 sm:px-8 lg:px-10",
          scrolled ? "py-2.5" : "py-4",
        )}
      >
        <BrandMark compact={scrolled} />

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 xl:flex"
        >
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-ink/10 text-neo-cyan"
                    : "text-ink/75 hover:bg-ink/5 hover:text-ink",
                )
              }
            >
              {label(NAV_LABEL_KEYS, link.to, link.label)}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 xl:flex">
          <Button
            variant="neo"
            size="sm"
            className="font-bold"
            onClick={() => {
              openAIAssistant();
              track("hero_cta_click", { cta: "nav_ai" });
            }}
          >
            <Sparkles className="size-4" />
            {t("nav.askAi")}
          </Button>
          <MentorConnectButton size="sm" variant="neo-blue" source="nav">
            {t("nav.talkToMentor")}
          </MentorConnectButton>
          <LanguageMenu />
          {isAuthenticated ? (
            <Button
              variant="ghost"
              size="sm"
              className="font-semibold"
              onClick={async () => {
                await signOut();
              }}
            >
              {user?.name ? user.name.split(" ")[0] : t("nav.account")}
            </Button>
          ) : (
            <Button asChild variant="ghost" size="sm" className="font-semibold">
              <Link to="/auth?returnTo=%2Fdashboard">{t("nav.login")}</Link>
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <LanguageMenu />
          <Button
            variant="neo"
            size="icon-sm"
            aria-label={t("nav.askAi")}
            onClick={() => {
              openAIAssistant();
              track("hero_cta_click", { cta: "mobile_nav_ai" });
            }}
          >
            <Sparkles className="size-4" />
          </Button>
          <Button
            variant="neo"
            size="icon-sm"
            aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={reduce ? undefined : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-ink/20 bg-paper xl:hidden"
          >
            <div className="mx-auto w-full max-w-[1248px] px-5 py-4 sm:px-8">
              <nav aria-label="Mobile" className="grid gap-2">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "border-2 px-3 py-2.5 text-sm font-bold",
                        isActive
                          ? "border-ink bg-invert text-deep"
                          : "border-ink bg-card",
                      )
                    }
                  >
                    {label(NAV_LABEL_KEYS, link.to, link.label)}
                  </NavLink>
                ))}
              </nav>
              <div className="mt-4 border-t-2 border-dashed border-ink/30 pt-4">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {t("nav.more")}
                </p>
                <div className="grid gap-2">
                  {SECONDARY_LINKS.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="border-2 border-ink bg-card px-3 py-2 font-mono text-sm font-semibold"
                    >
                      {label(SECONDARY_LABEL_KEYS, link.to, link.label)}
                    </Link>
                  ))}
                  <Link
                    to={
                      isAuthenticated
                        ? "/dashboard"
                        : "/auth?returnTo=%2Fdashboard"
                    }
                    className="border-2 border-ink bg-card px-3 py-2 font-mono text-sm font-semibold"
                  >
                    {isAuthenticated ? t("nav.dashboard") : t("nav.login")}
                  </Link>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  variant="neo"
                  className="font-bold"
                  onClick={() => {
                    setMobileOpen(false);
                    openAIAssistant();
                  }}
                >
                  {t("nav.askAiShort")}
                </Button>
                <MentorConnectButton
                  variant="neo-blue"
                  source="mobile_menu"
                  className="font-bold"
                >
                  {t("nav.talkToMentor")}
                </MentorConnectButton>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-2 border-t border-ink/20 bg-paper/95 backdrop-blur-xl xl:hidden">
        <button
          type="button"
          onClick={() => {
            openAIAssistant();
            track("hero_cta_click", { cta: "mobile_sticky_ai" });
          }}
          className="flex items-center justify-center gap-2 bg-card py-3.5 font-sans text-sm font-semibold"
        >
          <Sparkles className="size-4" /> {t("nav.askAiShort")}
        </button>
        <MentorConnectButton
          source="mobile_sticky"
          variant="neo-blue"
          className="h-auto w-full border-0 font-bold"
        >
          {t("nav.connectMentor")}
        </MentorConnectButton>
      </div>
    </header>
  );
}
