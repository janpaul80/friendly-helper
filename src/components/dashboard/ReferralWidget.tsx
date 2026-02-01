import { useState, useEffect, useCallback } from 'react';
import { Gift, Copy, Check, Users, Zap, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface ReferralWidgetProps {
  userId: string;
}

interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  completedReferrals: number;
  totalEarnings: number;
}

export function ReferralWidget({ userId }: ReferralWidgetProps) {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ReferralStats>({
    referralCode: '',
    totalReferrals: 0,
    completedReferrals: 0,
    totalEarnings: 0,
  });

  const fetchOrCreateReferralCode = useCallback(async () => {
    if (!userId) return;

    try {
      // Use a simple fallback code since referrals table doesn't exist yet
      const fallbackCode = `HEFT-${userId.slice(0, 5).toUpperCase()}`;
      setStats({
        referralCode: fallbackCode,
        totalReferrals: 0,
        completedReferrals: 0,
        totalEarnings: 0,
      });
    } catch (err) {
      console.error('Error with referral code:', err);
      const fallbackCode = `HEFT-${userId.slice(0, 5).toUpperCase()}`;
      setStats(prev => ({ ...prev, referralCode: fallbackCode }));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchOrCreateReferralCode();
  }, [fetchOrCreateReferralCode]);

  const referralLink = `https://heftcoder.icu/signup?ref=${stats.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-[#0a0a0f] via-[#0f0f18] to-[#0a0a0f] border border-orange-500/20 rounded-2xl p-6 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[60px]" />
      
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left side - Info */}
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl shadow-[0_0_30px_rgba(251,146,60,0.3)]">
              <Gift size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                Invite & Earn
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-full">
                  500 Credits
                </span>
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Get <span className="text-orange-400 font-bold">500 HeftCredits</span> for each friend who subscribes
              </p>
            </div>
          </div>

          {/* Right side - Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-black text-white">
                <Users size={18} className="text-gray-500" />
                {loading ? (
                  <Loader2 size={18} className="animate-spin text-gray-500" />
                ) : (
                  <span>{stats.completedReferrals}</span>
                )}
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Referrals</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-2xl font-black text-orange-400">
                <Zap size={18} fill="currentColor" />
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <span>{stats.totalEarnings.toLocaleString()}</span>
                )}
              </div>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Earned</p>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold whitespace-nowrap">Your Link</span>
            <input
              type="text"
              value={loading ? 'Loading...' : referralLink}
              readOnly
              className="flex-1 bg-transparent text-sm font-mono text-gray-300 outline-none min-w-0"
            />
          </div>
          <button
            onClick={handleCopy}
            disabled={loading}
            className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              copied 
                ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                : 'bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-500 hover:to-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.3)]'
            } disabled:opacity-50`}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
      </div>
    </div>
  );
}
