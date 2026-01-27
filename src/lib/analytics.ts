// Analytics & Tracking Library
// Integrates GA4 and Microsoft Clarity with cookie consent

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
    clarity: ((...args: unknown[]) => void) & { q?: unknown[][] };
  }
}

const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || '';
const CLARITY_ID = import.meta.env.VITE_CLARITY_PROJECT_ID || '';

let isInitialized = false;
let analyticsConsented = false;

// Check if analytics cookies are consented
function checkCookieConsent(): boolean {
  try {
    const prefs = localStorage.getItem('heftcoder_cookie_preferences');
    if (prefs) {
      const parsed = JSON.parse(prefs);
      return parsed.analytics === true;
    }
  } catch {
    // If parsing fails, default to false
  }
  return false;
}

// Initialize Google Analytics 4
function initGA4() {
  if (!GA4_ID || typeof window === 'undefined') return;

  // Create gtag script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID, {
    page_path: window.location.pathname,
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });

  console.log('[Analytics] GA4 initialized');
}

// Initialize Microsoft Clarity
function initClarity() {
  if (!CLARITY_ID || typeof window === 'undefined') return;

  // Clarity snippet - using explicit typing
  const clarityFn = function(...args: unknown[]) {
    const q = (window.clarity as { q?: unknown[][] }).q || [];
    q.push(args);
    (window.clarity as { q?: unknown[][] }).q = q;
  };
  
  window.clarity = clarityFn as typeof window.clarity;
  
  const t = document.createElement('script');
  t.async = true;
  t.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
  const y = document.getElementsByTagName('script')[0];
  y.parentNode?.insertBefore(t, y);

  console.log('[Analytics] Clarity initialized');
}

// Initialize all analytics (called after consent)
export function initAnalytics() {
  if (isInitialized) return;
  
  analyticsConsented = checkCookieConsent();
  
  if (!analyticsConsented) {
    console.log('[Analytics] Waiting for cookie consent');
    return;
  }

  initGA4();
  initClarity();
  isInitialized = true;
}

// Track page view
export function trackPageView(path?: string) {
  if (!analyticsConsented || !window.gtag) return;
  
  const pagePath = path || window.location.pathname;
  window.gtag('event', 'page_view', {
    page_path: pagePath,
    page_title: document.title,
    page_location: window.location.href,
  });
}

// Track custom events
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>
) {
  if (!analyticsConsented || !window.gtag) return;

  window.gtag('event', eventName, params);
  console.log(`[Analytics] Event: ${eventName}`, params);
}

// Pre-defined event trackers for common actions
export const events = {
  // Signup & Auth
  signUp: (method: string) => trackEvent('sign_up', { method }),
  login: (method: string) => trackEvent('login', { method }),
  logout: () => trackEvent('logout'),

  // Conversions
  startTrial: () => trackEvent('start_trial'),
  subscribe: (plan: string, value: number) => 
    trackEvent('purchase', { 
      currency: 'USD', 
      value,
      plan_name: plan,
    }),
  
  // Engagement
  ctaClick: (ctaName: string, location: string) => 
    trackEvent('cta_click', { cta_name: ctaName, location }),
  
  projectCreated: (projectType: string) => 
    trackEvent('project_created', { project_type: projectType }),
  
  featureUsed: (featureName: string) => 
    trackEvent('feature_used', { feature_name: featureName }),
  
  referralShared: (platform: string) => 
    trackEvent('referral_shared', { platform }),
  
  // Errors
  error: (errorType: string, errorMessage: string) => 
    trackEvent('error', { error_type: errorType, error_message: errorMessage }),
};

// Listen for cookie consent changes
if (typeof window !== 'undefined') {
  window.addEventListener('cookieConsentUpdated', (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail?.analytics && !isInitialized) {
      initAnalytics();
    }
  });
  
  // Check consent on load
  if (checkCookieConsent()) {
    // Delay slightly to ensure DOM is ready
    setTimeout(initAnalytics, 100);
  }
}

// Export for direct usage
export default {
  init: initAnalytics,
  trackPageView,
  trackEvent,
  events,
};
