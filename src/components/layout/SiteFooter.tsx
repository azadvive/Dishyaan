import { Container } from "@/components/common/primitives";
import { LanguageMenu } from "@/components/layout/LanguageMenu";
import { MentorConnectButton } from "@/components/mentors/mentor-connect";
import { openAIAssistant } from "@/components/ai/AIAssistant";
import { useI18n, type TranslationKey } from "@/i18n";
import {
  Instagram,
  Linkedin,
  MessageCircle,
  Youtube,
} from "lucide-react";
import { Link } from "react-router";

const COLUMNS: Array<{
  titleKey: TranslationKey;
  links: Array<{ labelKey: TranslationKey; to: string }>;
}> = [
  {
    titleKey: "footer.colExplore",
    links: [
      { labelKey: "footer.linkProgrammes", to: "/catalog" },
      { labelKey: "footer.linkMentors", to: "/mentors" },
      { labelKey: "footer.linkPlans", to: "/plans" },
      { labelKey: "footer.linkAbout", to: "/about" },
    ],
  },
  {
    titleKey: "footer.colStudents",
    links: [
      { labelKey: "footer.linkPathFinder", to: "/pathfinder" },
      { labelKey: "footer.linkCatalog", to: "/catalog" },
      { labelKey: "footer.linkAskMentor", to: "/mentors" },
      { labelKey: "footer.linkDashboard", to: "/dashboard" },
    ],
  },
  {
    titleKey: "footer.colParents",
    links: [
      { labelKey: "footer.linkParentGuide", to: "/plans" },
      { labelKey: "footer.linkProgress", to: "/about" },
      { labelKey: "footer.linkTalkMentor", to: "/mentors" },
      { labelKey: "footer.linkFees", to: "/plans" },
    ],
  },
  {
    titleKey: "footer.colInstitutions",
    links: [
      { labelKey: "footer.linkSchools", to: "/partners" },
      { labelKey: "footer.linkColleges", to: "/partners" },
      { labelKey: "footer.linkCoaching", to: "/partners" },
      { labelKey: "footer.linkPartner", to: "/partners" },
    ],
  },
  {
    titleKey: "footer.colCompany",
    links: [
      { labelKey: "footer.linkAboutBrand", to: "/about" },
      { labelKey: "footer.linkRequirement", to: "/#demand" },
      { labelKey: "footer.linkContact", to: "/partners" },
      { labelKey: "footer.linkCareers", to: "/about" },
    ],
  },
  {
    titleKey: "footer.colLegal",
    links: [
      { labelKey: "footer.linkPrivacy", to: "/about" },
      { labelKey: "footer.linkTerms", to: "/about" },
      { labelKey: "footer.linkRefund", to: "/plans" },
    ],
  },
];

export function SiteFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-line bg-deep pb-24 text-ink lg:pb-0">
      <Container className="py-14">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl border border-line bg-neo-yellow font-mono text-base font-black text-deep">
                D
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                Disha<span className="text-neo-blue">YaaN</span>
              </span>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink/70">
              {t("footer.intro")}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <MentorConnectButton variant="neo-cyan" size="sm" source="footer">
                {t("footer.bookFree")}
              </MentorConnectButton>
              <button
                type="button"
                onClick={openAIAssistant}
                className="rounded-xl border border-line px-4 py-2 font-mono text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-white"
              >
                {t("nav.askAi")}
              </button>
              <LanguageMenu align="left" />
            </div>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Instagram, label: "Instagram" },
                { icon: Youtube, label: "YouTube" },
                { icon: MessageCircle, label: "WhatsApp" },
              ].map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  aria-label={`${label} (link published with the first cohort)`}
                  title={`${label} — link published soon`}
                  className="flex size-9 items-center justify-center rounded-xl border border-line/50 text-ink/70"
                >
                  <Icon className="size-4" />
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.titleKey}>
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-neo-blue">
                  {t(column.titleKey)}
                </p>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.titleKey}-${link.labelKey}`}>
                      {link.to.startsWith("/#") ? (
                        <a
                          href={link.to}
                          className="text-sm text-ink/70 hover:text-neo-blue hover:underline"
                        >
                          {t(link.labelKey)}
                        </a>
                      ) : (
                        <Link
                          to={link.to}
                          className="text-sm text-ink/70 hover:text-neo-blue hover:underline"
                        >
                          {t(link.labelKey)}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line/20 pt-6 font-mono text-xs text-ink/55 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.rights", { year: new Date().getFullYear() })}</p>
          <p>{t("footer.verification")}</p>
        </div>
      </Container>
    </footer>
  );
}
