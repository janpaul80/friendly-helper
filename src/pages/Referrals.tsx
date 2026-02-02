import { Link } from "react-router-dom";
import { Gift, Users, Zap, ArrowRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Header } from "../components/marketing/Header";
import { Footer } from "../components/marketing/Footer";
import { SEO } from "../components/SEO";

export default function Referrals() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://app.heftcoder.icu/?ref=YOUR_CODE");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SEO
        title="Referrals"
        description="Earn 500 HeftCredits for every friend you refer to HeftCoder. Share your unique referral link and grow together."
        url="/referrals"
      />
      <Header />

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-600/20 rounded-full px-4 py-2 mb-6 sm:mb-8">
            <Gift className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-orange-400 font-medium">Referral Program</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Give <span className="text-orange-500">500 Credits</span>,<br />
            Get <span className="text-orange-500">500 Credits</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8 sm:mb-10 px-2">
            Share HeftCoder with friends and colleagues. When they sign up and make their first payment, 
            you both receive 500 HeftCredits to build amazing projects.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(234,88,12,0.3)]"
          >
            Get Your Referral Link
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-16">How It Works</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Copy className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">1. Share Your Link</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Get your unique referral link from your dashboard and share it with friends.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Users className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">2. They Sign Up</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Your friend creates an account and subscribes to any paid plan.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 text-center sm:col-span-2 md:col-span-1">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-orange-500" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">3. You Both Earn</h3>
              <p className="text-gray-400 text-sm sm:text-base">
                Both you and your friend receive 500 HeftCredits instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Referral Link */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6">Your Referral Link</h2>
          <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8 px-2">
            Sign in to get your personalized referral link and start earning credits.
          </p>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            <code className="text-xs sm:text-sm text-gray-300 truncate flex-1 text-left p-2 sm:p-0">
              https://app.heftcoder.icu/?ref=HEFT-XXXXX
            </code>
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-all shrink-0"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-4">
            <Link to="/auth" className="text-orange-500 hover:underline">Sign in</Link> to access your actual referral code.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Ready to Start Earning?</h2>
          <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-8 px-2">
            Join thousands of developers who are already earning credits through referrals.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(234,88,12,0.3)]"
          >
            Get Started
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
