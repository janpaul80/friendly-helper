import { User, Zap, Crown } from 'lucide-react';

interface UserHUDProps {
  user: any;
  credits: number;
  subscriptionTier: string;
  subscriptionStatus?: string;
  onUpgrade: () => void;
}

export function UserHUD({ user, credits, subscriptionTier, subscriptionStatus = 'none', onUpgrade }: UserHUDProps) {
  const getTierBadge = () => {
    // Priority: show trial badge if in trial, otherwise show tier
    if (subscriptionStatus === 'trial') {
      return { label: 'TRIAL', color: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' };
    }
    
    switch (subscriptionTier?.toLowerCase()) {
      case 'pro':
        return { label: 'PRO', color: 'text-orange-400 bg-orange-500/20 border-orange-500/50 shadow-[0_0_15px_rgba(251,146,60,0.3)]' };
      case 'studio':
        return { label: 'STUDIO', color: 'text-purple-400 bg-purple-500/20 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' };
      case 'basic':
        return { label: 'BASIC', color: 'text-blue-400 bg-blue-500/20 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)]' };
      default:
        return { label: 'FREE', color: 'text-gray-400 bg-gray-500/20 border-gray-500/50' };
    }
  };

  const tier = getTierBadge();
  const showUpgrade = subscriptionStatus === 'none' || subscriptionStatus === 'cancelled';

  return (
    <div className="relative overflow-hidden flex flex-col gap-4 p-4 sm:p-6 bg-gradient-to-r from-[#0a0a0f] via-[#0f0f18] to-[#0a0a0f] border border-orange-500/20 rounded-2xl">
      {/* Glow effects */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[60px]" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-[40px]" />
      
      {/* Top Row: User Identity */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-br from-orange-500/30 to-orange-600/20 rounded-xl sm:rounded-2xl flex items-center justify-center p-[2px] ring-2 ring-orange-500/30 shadow-[0_0_25px_rgba(251,146,60,0.2)]">
              <div className="h-full w-full bg-[#0a0a0a] rounded-[10px] sm:rounded-[14px] flex items-center justify-center overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={24} className="text-orange-500/50" />
                )}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 bg-emerald-500 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.5)]">
              <span className="text-[6px] sm:text-[8px] font-bold text-black">✓</span>
            </div>
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-black tracking-tight text-white truncate">
                {user?.email?.split('@')[0] || 'Innovator'}
              </h2>
              <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[10px] font-black uppercase tracking-widest rounded-md border flex-shrink-0 ${tier.color}`}>
                {tier.label}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 font-mono mt-1 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Credits & Upgrade - Stack on mobile */}
        <div className="relative flex items-center gap-3 flex-wrap">
          {/* Credits Display */}
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 bg-black/50 border border-orange-500/20 rounded-xl shadow-[inset_0_1px_0_rgba(251,146,60,0.1)]">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="relative">
                <Zap size={16} className="text-orange-500 sm:hidden" fill="currentColor" />
                <Zap size={18} className="text-orange-500 hidden sm:block" fill="currentColor" />
                <div className="absolute inset-0 bg-orange-500/50 blur-md" />
              </div>
              <span className="text-base sm:text-lg font-black text-white">{credits.toLocaleString()}</span>
            </div>
            <span className="text-[8px] sm:text-[10px] text-gray-500 uppercase tracking-widest font-bold">HeftCredits</span>
          </div>

          {/* Upgrade Button */}
          {showUpgrade && (
            <button
              onClick={onUpgrade}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-[0_0_25px_rgba(251,146,60,0.4)]"
            >
              <Crown size={14} className="sm:hidden" />
              <Crown size={16} className="hidden sm:block" />
              <span>Upgrade</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
