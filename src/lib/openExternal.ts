/**
 * Stripe Checkout (and some other third-party pages) often refuse to be embedded in an iframe.
 * When running in an iframe, a normal `window.location.href = url` can appear as a blank screen.
 *
 * This helper prefers opening a new tab when inside an iframe.
 */

const isInIframe = () => {
  try {
    return window.self !== window.top;
  } catch {
    // Cross-origin access can throw; if so, assume we're in an iframe.
    return true;
  }
};

export const preopenExternalWindow = (): Window | null => {
  if (!isInIframe()) return null;
  try {
    // Must be called synchronously in the click handler to avoid popup blockers.
    return window.open("about:blank", "_blank", "noopener,noreferrer");
  } catch {
    return null;
  }
};

export const openExternalUrl = (url: string, preopened?: Window | null) => {
  // If we pre-opened a tab, use it (best chance to bypass popup blockers).
  if (preopened && !preopened.closed) {
    try {
      preopened.location.href = url;
      preopened.focus();
      return;
    } catch {
      // fall through
    }
  }

  // If we're in an iframe, prefer a new tab.
  if (isInIframe()) {
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (w) {
      try {
        w.focus();
      } catch {
        // ignore
      }
      return;
    }
  }

  // Fallback
  window.location.href = url;
};
