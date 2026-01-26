import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ChevronDown, ChevronUp, Shield, BarChart3, Target, Settings2 } from 'lucide-react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const COOKIE_CONSENT_KEY = 'heftcoder_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'heftcoder_cookie_preferences';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setIsVisible(false);
    
    // Dispatch custom event for analytics integration
    window.dispatchEvent(new CustomEvent('cookieConsentUpdated', { detail: prefs }));
  };

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    saveConsent(allAccepted);
  };

  const handleAcceptSelected = () => {
    saveConsent(preferences);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setPreferences(onlyNecessary);
    saveConsent(onlyNecessary);
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return; // Can't toggle necessary cookies
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const cookieCategories = [
    {
      key: 'necessary' as const,
      icon: Shield,
      title: 'Strictly Necessary',
      description: 'Essential for the website to function. Cannot be disabled.',
      required: true,
    },
    {
      key: 'analytics' as const,
      icon: BarChart3,
      title: 'Analytics',
      description: 'Help us understand how visitors interact with our website.',
      required: false,
    },
    {
      key: 'marketing' as const,
      icon: Target,
      title: 'Marketing',
      description: 'Used to deliver personalized advertisements.',
      required: false,
    },
    {
      key: 'preferences' as const,
      icon: Settings2,
      title: 'Preferences',
      description: 'Remember your settings and preferences for a better experience.',
      required: false,
    },
  ];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4 md:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-consent-title"
          aria-describedby="cookie-consent-description"
        >
          <div className="max-w-4xl mx-auto bg-[#0a0a0f] border border-orange-500/20 rounded-2xl shadow-[0_0_60px_rgba(251,146,60,0.1)] overflow-hidden">
            {/* Main Banner */}
            <div className="p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Cookie Icon */}
                <div className="flex-shrink-0 p-2 sm:p-3 bg-orange-500/10 rounded-xl">
                  <Cookie className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                <h2 
                  id="cookie-consent-title" 
                  className="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2"
                >
                  We value your privacy
                </h2>
                  <p 
                    id="cookie-consent-description" 
                    className="text-xs sm:text-sm text-gray-400 leading-relaxed"
                  >
                    We use cookies to enhance your browsing experience, serve personalized content, 
                    and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                    <button
                      onClick={() => setShowDetails(!showDetails)}
                      className="inline-flex items-center gap-1 ml-1 text-orange-400 hover:text-orange-300 transition-colors"
                      aria-expanded={showDetails}
                    >
                      {showDetails ? 'Hide' : 'Learn more'}
                      {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </p>
                </div>

                {/* Close Button (mobile) */}
                <button
                  onClick={handleRejectAll}
                  className="sm:hidden flex-shrink-0 p-1.5 text-gray-500 hover:text-white transition-colors"
                  aria-label="Reject all cookies"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Action Buttons - Desktop */}
              <div className="hidden sm:flex items-center justify-end gap-3 mt-4">
                <button
                  onClick={handleRejectAll}
                  className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  Reject All
                </button>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Customize
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg hover:from-orange-500 hover:to-orange-400 transition-all shadow-[0_0_20px_rgba(251,146,60,0.3)]"
                >
                  Accept All
                </button>
              </div>

              {/* Action Buttons - Mobile */}
              <div className="flex sm:hidden flex-col gap-2 mt-4">
                <button
                  onClick={handleAcceptAll}
                  className="w-full px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg hover:from-orange-500 hover:to-orange-400 transition-all shadow-[0_0_20px_rgba(251,146,60,0.3)]"
                >
                  Accept All
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="flex-1 px-4 py-2 text-xs font-medium text-gray-300 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Customize
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 px-4 py-2 text-xs font-medium text-gray-400 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Reject All
                  </button>
                </div>
              </div>
            </div>

            {/* Cookie Details Panel */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/10 p-4 sm:p-6 bg-black/30">
                    <h3 className="text-sm font-bold text-white mb-4">Manage Cookie Preferences</h3>
                    
                    <div className="space-y-3">
                      {cookieCategories.map((category) => {
                        const Icon = category.icon;
                        const isEnabled = preferences[category.key];
                        
                        return (
                          <div
                            key={category.key}
                            className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5"
                          >
                            <div className="flex-shrink-0 p-2 bg-orange-500/10 rounded-lg">
                              <Icon className="w-4 h-4 text-orange-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4 className="text-sm font-semibold text-white">{category.title}</h4>
                                {category.required ? (
                                  <span className="text-[10px] px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full font-medium">
                                    Required
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => togglePreference(category.key)}
                                    className={`relative w-10 h-5 rounded-full transition-colors ${
                                      isEnabled ? 'bg-orange-500' : 'bg-white/10'
                                    }`}
                                    role="switch"
                                    aria-checked={isEnabled}
                                    aria-label={`Toggle ${category.title} cookies`}
                                  >
                                    <span
                                      className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                                        isEnabled ? 'translate-x-5' : 'translate-x-0'
                                      }`}
                                    />
                                  </button>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Save Preferences Button */}
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={handleAcceptSelected}
                        className="px-5 py-2 text-sm font-bold text-white bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg hover:from-orange-500 hover:to-orange-400 transition-all shadow-[0_0_20px_rgba(251,146,60,0.3)]"
                      >
                        Save Preferences
                      </button>
                    </div>

                    {/* Privacy Links */}
                    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-4 pt-4 border-t border-white/5">
                      <a 
                        href="/privacy" 
                        className="text-xs text-gray-500 hover:text-orange-400 transition-colors"
                      >
                        Privacy Policy
                      </a>
                      <span className="text-gray-700">•</span>
                      <a 
                        href="/terms" 
                        className="text-xs text-gray-500 hover:text-orange-400 transition-colors"
                      >
                        Terms of Service
                      </a>
                      <span className="text-gray-700 hidden sm:inline">•</span>
                      <span className="text-[10px] text-gray-600 w-full sm:w-auto text-center mt-1 sm:mt-0">
                        WCAG 2.2 • GPC Supported
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Hook to check cookie preferences anywhere in the app
export function useCookiePreferences(): CookiePreferences | null {
  const [prefs, setPrefs] = useState<CookiePreferences | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY);
    if (stored) {
      try {
        setPrefs(JSON.parse(stored));
      } catch {
        setPrefs(null);
      }
    }

    const handler = (e: CustomEvent<CookiePreferences>) => {
      setPrefs(e.detail);
    };

    window.addEventListener('cookieConsentUpdated', handler as EventListener);
    return () => window.removeEventListener('cookieConsentUpdated', handler as EventListener);
  }, []);

  return prefs;
}
