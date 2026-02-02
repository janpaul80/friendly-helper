import { useState } from 'react';
import { Gift, Copy, Check, Users, Zap, Loader2, TrendingUp, Clock, Award } from 'lucide-react';
import { toast } from 'sonner';
import { useReferrals } from '../../hooks/useReferrals';

interface StudioReferralsProps {
  userId: string;
}

export function StudioReferrals({ userId }: StudioReferralsProps) {
  const [copied, setCopied] = useState(false);
  const { stats, referrals, loading } = useReferrals(userId);

  const referralLink = `https://heftcoder.icu/signup?ref=${stats.referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#0a0a0f] via-[#0f0f18] to-[#0a0a0f] border border-orange-500/20 rounded-2xl p-6 md:p-8 relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-orange-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px]" />
        
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Left - Info */}
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl shadow-[0_0_40px_rgba(251,146,60,0.4)]">
                <Gift size={32} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
                  Invite & Earn
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/20 px-3 py-1 rounded-full">
                    500 Credits
                  </span>
                </h2>
                <p className="text-gray-400 mt-2 max-w-md">
                  Get <span className="text-orange-400 font-bold">500 HeftCredits</span> for each friend who subscribes. 
                  They also get <span className="text-orange-400 font-bold">500 bonus credits</span> on their first subscription!
                </p>
              </div>
            </div>

            {/* Right - Stats */}
            <div className="flex items-center gap-8 bg-black/30 rounded-xl px-6 py-4 border border-white/5">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-3xl font-black text-white">
                  <Users size={24} className="text-gray-500" />
                  <span>{stats.totalReferrals}</span>
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Referrals</p>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-3xl font-black text-orange-400">
                  <Zap size={24} fill="currentColor" />
                  <span>{stats.totalEarnings.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Earned</p>
              </div>
            </div>
          </div>

          {/* Referral Link */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-4 flex items-center gap-3">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold whitespace-nowrap">Your Link</span>
              <input
                type="text"
                value={referralLink}
                readOnly
                className="flex-1 bg-transparent text-sm font-mono text-gray-300 outline-none min-w-0"
              />
            </div>
            <button
              onClick={handleCopy}
              className={`px-8 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                copied 
                  ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]' 
                  : 'bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-500 hover:to-orange-400 shadow-[0_0_20px_rgba(251,146,60,0.3)]'
              }`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/10 rounded-xl p-5 relative overflow-hidden group hover:border-orange-500/30 transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-4">
            <div className="bg-emerald-500/20 p-3 rounded-xl">
              <Award size={24} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Completed</p>
              <p className="text-2xl font-black text-white mt-1">{stats.completedReferrals}</p>
              <p className="text-[10px] text-emerald-400 mt-1">Subscribed & credited</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/10 rounded-xl p-5 relative overflow-hidden group hover:border-orange-500/30 transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-4">
            <div className="bg-yellow-500/20 p-3 rounded-xl">
              <Clock size={24} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pending</p>
              <p className="text-2xl font-black text-white mt-1">{stats.pendingReferrals}</p>
              <p className="text-[10px] text-yellow-400 mt-1">Awaiting subscription</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/10 rounded-xl p-5 relative overflow-hidden group hover:border-orange-500/30 transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-4">
            <div className="bg-orange-500/20 p-3 rounded-xl">
              <TrendingUp size={24} className="text-orange-400" />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Conversion</p>
              <p className="text-2xl font-black text-white mt-1">
                {stats.totalReferrals > 0 
                  ? Math.round((stats.completedReferrals / stats.totalReferrals) * 100) 
                  : 0}%
              </p>
              <p className="text-[10px] text-orange-400 mt-1">Success rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500 font-black text-lg">
              1
            </div>
            <h4 className="font-bold text-white mb-2">Share Your Link</h4>
            <p className="text-sm text-gray-500">
              Copy your unique referral link and share it with friends and colleagues.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500 font-black text-lg">
              2
            </div>
            <h4 className="font-bold text-white mb-2">They Subscribe</h4>
            <p className="text-sm text-gray-500">
              Your friend signs up using your link and subscribes to any paid plan.
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-500 font-black text-lg">
              3
            </div>
            <h4 className="font-bold text-white mb-2">You Both Earn</h4>
            <p className="text-sm text-gray-500">
              Both you and your friend receive 500 HeftCredits instantly!
            </p>
          </div>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-white/5 rounded-2xl p-6">
        <h3 className="text-lg font-black text-white mb-6 uppercase tracking-widest">Recent Referrals</h3>
        
        {referrals.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
            <Users size={40} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No referrals yet</p>
            <p className="text-sm text-gray-600 mt-1">Share your link to start earning credits!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map((referral) => (
              <div 
                key={referral.id}
                className="flex items-center justify-between bg-black/30 rounded-xl px-4 py-3 border border-white/5"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    referral.status === 'credited' ? 'bg-emerald-500' :
                    referral.status === 'subscribed' ? 'bg-blue-500' :
                    referral.status === 'signed_up' ? 'bg-yellow-500' :
                    'bg-gray-500'
                  }`} />
                  <div>
                    <p className="text-sm text-white font-medium">
                      {referral.status === 'credited' ? 'Referral Completed' :
                       referral.status === 'subscribed' ? 'Awaiting Credit' :
                       referral.status === 'signed_up' ? 'Signed Up' :
                       'Pending Signup'}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {referral.status === 'credited' ? (
                    <span className="text-emerald-400 font-bold">+{referral.creditsEarned}</span>
                  ) : (
                    <span className="text-gray-500 text-sm">Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
