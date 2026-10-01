const SESSION_KEY = "dishayaan.session";

/**
 * Stable anonymous id used for AI credits and Path Finder saves before sign-in.
 * Not a tracking identifier: it never leaves the app except as the key on the
 * learner's own record.
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return "server";
  try {
    const existing = window.localStorage.getItem(SESSION_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `s_${Math.random().toString(36).slice(2)}${Date.now()}`;
    window.localStorage.setItem(SESSION_KEY, id);
    return id;
  } catch {
    return "anonymous";
  }
}

export function hasSeenPrompt(key: string): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.sessionStorage.getItem(`dishayaan.prompt.${key}`) === "1";
  } catch {
    return true;
  }
}

export function markPromptSeen(key: string) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(`dishayaan.prompt.${key}`, "1");
  } catch {
    /* storage unavailable — prompt simply shows again next time */
  }
}
