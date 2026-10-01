import { AIAssistant } from "@/components/ai/AIAssistant";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteNav } from "@/components/layout/SiteNav";
import { MentorConnectProvider } from "@/components/mentors/mentor-connect";
import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { track } from "@/lib/analytics";

export function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    track("page_view", { path: location.pathname });
    // Keep long marketing pages navigable: start each route at the top.
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <MentorConnectProvider>
      <div className="flex min-h-screen flex-col bg-paper">
        <SiteNav />
        <main id="main" className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <AIAssistant />
      </div>
    </MentorConnectProvider>
  );
}
