import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Phone, ArrowLeft, Loader2, MessageCircle } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { SEO } from "../components/SEO";
import { events } from "../lib/analytics";

export default function Auth() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
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

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits except +
    const cleaned = value.replace(/[^\d+]/g, '');
    // Ensure it starts with +
    if (cleaned && !cleaned.startsWith('+')) {
      return '+' + cleaned;
    }
    return cleaned;
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phone);
      
      if (!formattedPhone || formattedPhone.length < 10) {
        throw new Error("Please enter a valid phone number with country code (e.g., +1234567890)");
      }

      // Call our custom WhatsApp OTP edge function
      const { data, error } = await supabase.functions.invoke('send-whatsapp-otp', {
        body: { phone: formattedPhone }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setStep("otp");
      setInfo("We've sent a 6-digit code to your WhatsApp. Enter it below to sign in.");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send verification code";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phone);
      
      // Call our custom verify edge function
      const { data, error } = await supabase.functions.invoke('verify-whatsapp-otp', {
        body: { phone: formattedPhone, code: otp }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      if (data?.session) {
        // Set the session in Supabase client
        await supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        });
        
        events.login('whatsapp');
        navigate("/dashboard");
      } else if (data?.verified) {
        // Session wasn't returned but user is verified
        setInfo("Verified! Redirecting...");
        // Try to check session again
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate("/dashboard");
        } else {
          setError("Verified but session not found. Please try again.");
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Invalid verification code";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <SEO
        title="Sign In"
        description="Sign in to your HeftCoder account with WhatsApp verification."
        url="/auth"
        noindex={true}
      />
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => step === "otp" ? setStep("phone") : navigate("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          {step === "otp" ? "Change phone number" : "Back to home"}
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
            {step === "phone" ? "Welcome" : "Verify your phone"}
          </h1>
          <p className="text-gray-400 text-center mb-8">
            {step === "phone" 
              ? "Enter your phone number to sign in or create an account" 
              : `Enter the code sent to ${phone}`}
          </p>

          {step === "phone" ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
                    placeholder="+1 234 567 8900"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>
                <p className="text-gray-500 text-xs mt-2">Include your country code (e.g., +1 for US)</p>
              </div>

              {/* WhatsApp notice */}
              <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <MessageCircle className="text-green-500 flex-shrink-0" size={20} />
                <p className="text-green-400 text-sm">
                  We'll send your verification code via WhatsApp
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {info && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300 text-sm">
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
                    Sending code...
                  </>
                ) : (
                  <>
                    <MessageCircle size={18} />
                    Send WhatsApp code
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  required
                  maxLength={6}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-3 px-4 text-white text-center text-2xl tracking-[0.5em] placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

              {info && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300 text-sm">
                  {info}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-bold transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(234,88,12,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Verifying...
                  </>
                ) : (
                  "Verify & Sign In"
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSendOTP({ preventDefault: () => {} } as React.FormEvent)}
                disabled={loading}
                className="w-full text-gray-400 hover:text-white py-2 text-sm transition-colors"
              >
                Didn't receive code? Resend
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
