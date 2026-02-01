import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Zap, Phone, ArrowLeft, Loader2, MessageCircle, ChevronDown } from "lucide-react";
import { supabase } from "../lib/supabase";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { SEO } from "../components/SEO";
import { events } from "../lib/analytics";

const COUNTRY_CODES = [
  { code: "+593", country: "Ecuador", flag: "🇪🇨" },
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+51", country: "Peru", flag: "🇵🇪" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+56", country: "Chile", flag: "🇨🇱" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
];

export default function Auth() {
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("+593");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const fullPhone = `${countryCode}${phoneNumber.replace(/^0+/, '')}`;
  const selectedCountry = COUNTRY_CODES.find(c => c.code === countryCode);

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

  const formatLocalNumber = (value: string) => {
    // Remove all non-digits
    return value.replace(/\D/g, '');
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    try {
      if (!phoneNumber || phoneNumber.length < 6) {
        throw new Error("Please enter a valid phone number");
      }

      // Call our custom WhatsApp OTP edge function
      const { data, error } = await supabase.functions.invoke('send-whatsapp-otp', {
        body: { phone: fullPhone }
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
      // Call our custom verify edge function
      const { data, error } = await supabase.functions.invoke('verify-whatsapp-otp', {
        body: { phone: fullPhone, code: otp }
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
              : `Enter the code sent to ${fullPhone}`}
          </p>

          {step === "phone" ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Phone Number</label>
                <div className="flex gap-2">
                  {/* Country Code Selector */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                      className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg py-3 px-3 text-white hover:border-orange-500/50 transition-colors min-w-[100px]"
                    >
                      <span className="text-lg">{selectedCountry?.flag}</span>
                      <span className="text-sm">{countryCode}</span>
                      <ChevronDown size={14} className="text-gray-400" />
                    </button>
                    
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                        {COUNTRY_CODES.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setCountryCode(country.code);
                              setShowCountryDropdown(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-white/10 transition-colors ${
                              countryCode === country.code ? 'bg-orange-500/20 text-orange-400' : 'text-white'
                            }`}
                          >
                            <span className="text-lg">{country.flag}</span>
                            <span className="text-sm flex-1">{country.country}</span>
                            <span className="text-gray-400 text-sm">{country.code}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Phone Number Input */}
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(formatLocalNumber(e.target.value))}
                      placeholder="987654321"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>
                </div>
                <p className="text-gray-500 text-xs mt-2">Select your country and enter your number without leading zeros</p>
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
