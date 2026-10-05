/**
 * Chromium reports "ResizeObserver loop completed with undelivered
 * notifications." whenever an observer callback changes the size of a measured
 * element inside the same delivery cycle. Radix (floating-ui), framer-motion
 * and charting libraries all do this occasionally. The page keeps rendering,
 * but the platform's error reporter surfaces the notification as a build error.
 *
 * Running every observer callback on the next animation frame keeps layout
 * writes out of the delivery cycle, so the loop cannot form in the first place
 * (this is the browser vendors' recommended workaround for the notification).
 * Call this once, before React mounts.
 */
export function installQuietResizeObserver(): void {
  if (typeof window === "undefined" || typeof window.requestAnimationFrame !== "function") {
    return;
  }

  type QuietConstructor = typeof ResizeObserver & { __quietScheduled?: boolean };
  const holder = window as unknown as { ResizeObserver?: QuietConstructor };
  const Native = holder.ResizeObserver;

  // Absent on very old browsers and already wrapped (e.g. dev HMR re-import).
  if (!Native || Native.__quietScheduled) return;

  class QueuedResizeObserver extends Native {
    constructor(callback: ResizeObserverCallback) {
      super((entries, observer) => {
        window.requestAnimationFrame(() => callback(entries, observer));
      });
    }
  }

  (QueuedResizeObserver as unknown as QuietConstructor).__quietScheduled = true;
  holder.ResizeObserver = QueuedResizeObserver as unknown as QuietConstructor;
}
