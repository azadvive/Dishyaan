import '@vly-ai/integrations';
import { I18nProvider } from "@/i18n";
import { installQuietResizeObserver } from "@/lib/quiet-resize-observer";
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";

// Lazy load route components for better code splitting
const SiteLayout = lazy(() =>
  import("./components/layout/SiteLayout.tsx").then((m) => ({
    default: m.SiteLayout,
  })),
);
const Home = lazy(() => import("./pages/Home.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Plans = lazy(() => import("./pages/Plans.tsx"));
const Mentors = lazy(() => import("./pages/Mentors.tsx"));
const MentorDetail = lazy(() => import("./pages/MentorDetail.tsx"));
const Catalog = lazy(() => import("./pages/Catalog.tsx"));
const ProgramDetail = lazy(() => import("./pages/ProgramDetail.tsx"));
const PathFinder = lazy(() => import("./pages/PathFinder.tsx"));
const Partners = lazy(() => import("./pages/Partners.tsx"));
const Book = lazy(() => import("./pages/Book.tsx"));
const Community = lazy(() => import("./pages/Community.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <div className="border-2 border-ink bg-card px-5 py-3 font-mono text-sm font-bold uppercase tracking-[0.2em]">
        Loading DishaYaaN
      </div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in the browser runtime). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[Preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-paper p-6 text-ink">
          <div className="max-w-lg border-2 border-ink bg-card p-6 text-center">
            <p className="text-sm font-bold uppercase tracking-wider">
              Preview runtime error
            </p>
            <p className="mt-2 break-words text-xs text-muted-foreground">
              {this.state.message}
            </p>
            {this.state.stack ? (
              <pre className="mt-3 max-h-40 overflow-auto border-2 border-ink/40 p-2 text-left text-[10px] leading-4 text-muted-foreground">
                {this.state.stack}
              </pre>
            ) : null}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Must run before React mounts: keeps third-party resize observers from
// triggering Chromium's "ResizeObserver loop" notification.
installQuietResizeObserver();

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <I18nProvider>
          <BrowserRouter>
          <RouteSyncer />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route element={<SiteLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/plans" element={<Plans />} />
                <Route path="/mentors" element={<Mentors />} />
                <Route path="/mentor/:slug" element={<MentorDetail />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/program/:slug" element={<ProgramDetail />} />
                <Route path="/pathfinder" element={<PathFinder />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/book" element={<Book />} />
                <Route path="/community" element={<Community />} />
                <Route path="/admin" element={<Admin />} />
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth
                      title="Sign in to open your workspace"
                      description="Your goal charter, exploration profile and mentor sessions live behind your login."
                    >
                      <Dashboard />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Route>
              <Route
                path="/auth"
                element={<AuthPage redirectAfterAuth="/dashboard" />}
              />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <Toaster />
        </I18nProvider>
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
