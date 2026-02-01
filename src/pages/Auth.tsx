import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Mail, Lock, ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
import { supabase } from "../integrations/supabase/client";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { SEO } from "../components/SEO";
import { events } from "../lib/analytics";

export default function Auth() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      if (mode === "signup") {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) throw error;
        
        setInfo("Check your email for a confirmation link to complete your registration.");
        events.signUp('email');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        events.login('email');
        navigate("/dashboard");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Authentication failed";
      
      // Handle specific error cases
      if (errorMessage.includes("User already registered")) {
        setError("An account with this email already exists. Please sign in instead.");
      } else if (errorMessage.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.");
      } else if (errorMessage.includes("Email not confirmed")) {
        setError("Please confirm your email before signing in. Check your inbox.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "signup" : "login");
    setError(null);
    setInfo(null);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <SEO
        title={mode === "login" ? "Sign In" : "Sign Up"}
        description="Sign in to your HeftCoder account or create a new one."
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
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h1>
          <p className="text-gray-400 text-center mb-8">
            {mode === "login" 
              ? "Sign in to continue to your dashboard" 
              : "Enter your email to get started"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
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

            {/* Password Input */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {mode === "signup" && (
                <p className="text-gray-500 text-xs mt-2">Must be at least 6 characters</p>
              )}
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            {info && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-emerald-400 text-sm">
                {info}
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
                  {mode === "login" ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                mode === "login" ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={toggleMode}
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              {mode === "login" 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
