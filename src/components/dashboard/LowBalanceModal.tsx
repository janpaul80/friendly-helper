import { useState } from 'react';
import { Zap, ArrowRight, X, CreditCard, TrendingUp } from 'lucide-react';

interface CreditPack {
  credits: number;
  priceId: string;
  price: string;
  popular?: boolean;
}

const CREDIT_PACKS: CreditPack[] = [
  { credits: 2500, priceId: 'topup_2500', price: '$9' },
  { credits: 10000, priceId: 'topup_10000', price: '$29', popular: true },
  { credits: 50000, priceId: 'topup_50000', price: '$99' },
];

interface LowBalanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  subscriptionTier: string | null;
  onUpgrade: () => void;
  onTopUp: (packId: string, credits: number) => void;
}

export function LowBalanceModal({
  isOpen,
  onClose,
  currentBalance,
  subscriptionTier,
  onUpgrade,
  onTopUp,
}: LowBalanceModalProps) {
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleTopUp = async (pack: CreditPack) => {
    setSelectedPack(pack.priceId);
    setIsLoading(true);
    try {
      await onTopUp(pack.priceId, pack.credits);
    } finally {
      setIsLoading(false);
      setSelectedPack(null);
    }
  };

  const canUpgrade = !subscriptionTier || subscriptionTier === 'Basic';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-gradient-to-br from-[#0a0a0f] to-[#12121a] border border-orange-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-orange-500/10">
        {/* Header */}
        <div className="relative p-6 border-b border-orange-500/10">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-500/10 rounded-xl">
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider text-white">
                Low on Credits
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Top up to continue building
              </p>
            </div>
          </div>
        </div>

        {/* Current Balance */}
        <div className="p-6 border-b border-orange-500/10 bg-gradient-to-r from-orange-500/5 to-transparent">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Current Balance</span>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-orange-500" />
              <span className="text-2xl font-black text-white">
                {currentBalance.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 uppercase">credits</span>
            </div>
          </div>
        </div>

        {/* Credit Packs */}
        <div className="p-6 space-y-3">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Quick Top-Up
          </p>

          {CREDIT_PACKS.map((pack) => (
            <button
              key={pack.priceId}
              onClick={() => handleTopUp(pack)}
              disabled={isLoading}
              className={`w-full p-4 rounded-xl border transition-all relative group ${
                pack.popular
                  ? 'border-orange-500/40 bg-gradient-to-r from-orange-500/10 to-transparent hover:border-orange-500/60'
                  : 'border-white/10 bg-white/[0.02] hover:border-orange-500/30 hover:bg-white/[0.04]'
              } ${isLoading && selectedPack === pack.priceId ? 'opacity-50' : ''}`}
            >
              {pack.popular && (
                <span className="absolute -top-2 right-4 px-2 py-0.5 bg-orange-500 text-[9px] font-black uppercase tracking-wider rounded-full text-white">
                  Popular
                </span>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${pack.popular ? 'bg-orange-500/20' : 'bg-white/5'}`}>
                    <CreditCard size={18} className={pack.popular ? 'text-orange-500' : 'text-gray-400'} />
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-black text-white">
                      {pack.credits.toLocaleString()} Credits
                    </p>
                    <p className="text-xs text-gray-500">
                      {(pack.credits / parseInt(pack.price.replace('$', ''))).toFixed(0)} credits per $1
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-orange-500">{pack.price}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Upgrade Option */}
        {canUpgrade && (
          <div className="p-6 border-t border-orange-500/10 bg-gradient-to-r from-purple-500/5 to-transparent">
            <button
              onClick={onUpgrade}
              className="w-full p-4 rounded-xl border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <TrendingUp size={18} className="text-purple-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">Upgrade to {subscriptionTier === 'Basic' ? 'Pro' : 'Basic'}</p>
                    <p className="text-xs text-gray-500">Get more monthly credits & features</p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-purple-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-black/30 border-t border-white/5">
          <p className="text-[10px] text-gray-600 text-center">
            Credits are added instantly after payment • Unused credits roll over
          </p>
        </div>
      </div>
    </div>
  );
}
