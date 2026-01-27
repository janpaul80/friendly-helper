import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook to track page views automatically on route changes
 * Place this in your App component or a layout wrapper
 */
export function usePageTracking() {
  const location = useLocation();

  useEffect(() => {
    // Initialize analytics on mount - dynamic import to avoid build issues
    import('../lib/analytics').then(({ initAnalytics }) => {
      initAnalytics();
    });
  }, []);

  useEffect(() => {
    // Track page view on route change
    import('../lib/analytics').then(({ trackPageView }) => {
      trackPageView(location.pathname);
    });
  }, [location.pathname]);
}

/**
 * Hook to access analytics functions
 */
export function useAnalytics() {
  return {
    trackPageView: (path?: string) => {
      import('../lib/analytics').then(({ trackPageView }) => {
        trackPageView(path);
      });
    },
    trackEvent: (name: string, params?: Record<string, string | number | boolean>) => {
      import('../lib/analytics').then(({ trackEvent }) => {
        trackEvent(name, params);
      });
    },
  };
}
