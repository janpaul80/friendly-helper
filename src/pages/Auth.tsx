import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Zap, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { openExternalUrl } from "../lib/openExternal";
import { SEO } from "../components/SEO";
import { events } from "../lib/analytics";

const isInIframe = () => {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
};

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [oauthUrl, setOauthUrl] = useState<string | null>(null);
  const [autoStarted, setAutoStarted] = useState(false);

  // Auto-start Google OAuth if ?provider=google is in URL
  useEffect(() => {
    const provider = searchParams.get("provider");
    if (provider === "google" && !autoStarted) {
      setAutoStarted(true);
      // In the Lovable preview the app runs inside an iframe; Google blocks auth screens in iframes.
      // Auto-start would be a non-user gesture (popup blocked), so instead show a hint and wait for a click.
      if (isInIframe()) {
        setInfo("Click ‘Continue with Google’ to open sign-in in a new tab (required in preview).");
        return;
      }
      handleGoogleLogin({ initiatedByUser: false });
    }
  }, [searchParams, autoStarted]);

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          navigate("/dashboard");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleGoogleLogin = async ({ initiatedByUser }: { initiatedByUser: boolean }) => {
    setGoogleLoading(true);
    setError(null);
    setInfo(null);
    setOauthUrl(null);
    try {
      // In preview the app runs in an iframe; open a normal tab first so we can reliably navigate it.
      // (Using noopener here can make the returned window handle unusable in some browsers.)
      const preopened =
        initiatedByUser && isInIframe()
          ? (() => {
              try {
                return window.open("about:blank", "_blank");
              } catch {
                return null;
              }
            })()
          : null;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;

      if (!data?.url) {
        throw new Error("Google sign-in did not return a redirect URL.");
      }

      setOauthUrl(data.url);

      if (initiatedByUser) {
        // Best path: navigate the pre-opened tab.
        if (preopened && !preopened.closed) {
          try {
            preopened.location.replace(data.url);
            preopened.focus();
            events.login('google');
            setGoogleLoading(false);
            setInfo("Finish signing in in the new tab, then come back here.");
            return;
          } catch {
            // fall through to the fallback below
          }
        }

        // Fallback: show a second, synchronous click target that opens the URL.
        if (isInIframe()) {
          setGoogleLoading(false);
          setInfo("Your browser blocked the sign-in tab. Use the button below to open Google sign-in.");
          return;
        }
      }

      // Non-user initiated (e.g. direct navigation outside iframe) fallback.
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Navigate immediately on successful login to avoid any race with
        // other route-level auth checks.
        if (data?.session?.user) {
          events.login('email');
          navigate("/dashboard");
        } else {
          setInfo("Signed in—loading your dashboard...");
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        });
        if (error) throw error;

        events.signUp('email');
        // If email confirmations are enabled, they may need to confirm first.
        setInfo("Account created. If prompted, confirm your email, then return to sign in.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <SEO
        title={isLogin ? "Sign In" : "Sign Up"}
        description="Sign in or create your HeftCoder account to start building production-ready applications with AI."
        url="/auth"
        noindex={true}
      />
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to home
        </button>

        {/* Card */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="h-10 w-10 bg-orange-600 rounded-lg flex items-center justify-center text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]">
              <Zap size={24} fill="currentColor" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">HeftCoder</span>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            {isLogin ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-gray-400 text-center mb-8">
            {isLogin ? "Sign in to continue building" : "Start building amazing apps"}
          </p>

          {/* OAuth Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleGoogleLogin({ initiatedByUser: true })}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 rounded-lg py-3 text-white hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              {googleLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              )}
              Continue with Google
            </button>
          </div>

          {info && (
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300 text-sm mb-6">
              {info}
            </div>
          )}

          {oauthUrl && isInIframe() && (
            <button
              type="button"
              onClick={() => openExternalUrl(oauthUrl)}
              className="w-full mb-6 bg-white/5 border border-white/10 rounded-lg py-3 text-white hover:bg-white/10 transition-colors"
            >
              Open Google sign-in
            </button>
          )}

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-bold transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(234,88,12,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                isLogin ? "Sign in" : "Create account"
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isLogin ? (
                <>
                  Don't have an account? <span className="text-orange-500 font-medium">Sign up</span>
                </>
              ) : (
                <>
                  Already have an account? <span className="text-orange-500 font-medium">Sign in</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
