import { User, Zap, Crown, Sparkles } from 'lucide-react';

interface UserHUDProps {
  user: any;
  credits: number;
  subscriptionTier: string;
  onUpgrade: () => void;
}

export function UserHUD({ user, credits, subscriptionTier, onUpgrade }: UserHUDProps) {
  const getTierBadge = () => {
    switch (subscriptionTier) {
      case 'pro':
        return { label: 'PRO', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
      case 'studio':
        return { label: 'STUDIO', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
      case 'basic':
        return { label: 'BASIC', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
      default:
        return { label: 'TRIAL', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    }
  };

  const tier = getTierBadge();

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 justify-between p-6 bg-gradient-to-r from-[#0a0a0f] to-[#0f0f18] border border-white/5 rounded-2xl">
      {/* User Identity */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="h-16 w-16 bg-gradient-to-br from-orange-500/20 to-purple-600/20 rounded-2xl flex items-center justify-center p-[2px] ring-2 ring-orange-500/20">
            <div className="h-full w-full bg-[#0a0a0a] rounded-[14px] flex items-center justify-center overflow-hidden">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User size={28} className="text-gray-500" />
              )}
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center">
            <span className="text-[8px] font-bold text-black">✓</span>
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-black tracking-tight text-white">
              {user?.email?.split('@')[0] || 'Innovator'}
            </h2>
            <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-md border ${tier.color}`}>
              {tier.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 font-mono mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Credits & Upgrade */}
      <div className="flex items-center gap-4">
        {/* Credits Display */}
        <div className="flex items-center gap-3 px-5 py-3 bg-[#111118] border border-white/5 rounded-xl">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-orange-500" fill="currentColor" />
            <span className="text-lg font-black text-white">{credits.toLocaleString()}</span>
          </div>
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">HeftCredits</span>
        </div>

        {/* Upgrade Button */}
        {subscriptionTier === 'free' && (
          <button
            onClick={onUpgrade}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-orange-900/30"
          >
            <Crown size={16} />
            <span>Upgrade</span>
          </button>
        )}
      </div>
    </div>
  );
}
