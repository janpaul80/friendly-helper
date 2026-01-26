import { Zap, Sparkles, Clock, ArrowRight } from 'lucide-react';

interface TrialPromptProps {
  onStartTrial: () => void;
  trialEndDate?: string | null;
  subscriptionStatus: string;
}

export function TrialPrompt({ onStartTrial, trialEndDate, subscriptionStatus }: TrialPromptProps) {
  // Don't show if user is already subscribed
  if (subscriptionStatus === 'active') return null;

  // Show trial countdown if in trial
  if (subscriptionStatus === 'trial' && trialEndDate) {
    const endDate = new Date(trialEndDate);
    const now = new Date();
    const daysLeft = Math.max(0, Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

    return (
      <div className="relative overflow-hidden p-4 sm:p-6 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 rounded-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Free Trial Active
              </h3>
              <p className="text-sm text-gray-400">
                {daysLeft} day{daysLeft !== 1 ? 's' : ''} remaining • 2,500 credits available
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-xl">
            <Zap className="w-4 h-4 text-emerald-400" fill="currentColor" />
            <span className="text-sm font-semibold text-emerald-400">Trial ends {endDate.toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    );
  }

  // Show trial CTA for new users with no subscription
  return (
    <div className="relative overflow-hidden p-4 sm:p-6 bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/20 rounded-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[60px]" />
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-500/20 rounded-xl animate-pulse">
            <Zap className="w-6 h-6 text-orange-400" fill="currentColor" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              Start Your Free 7-Day Trial
            </h3>
            <p className="text-sm text-gray-400">
              Get 2,500 credits instantly • No charge for 7 days • Cancel anytime
            </p>
          </div>
        </div>
        <button
          onClick={onStartTrial}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white rounded-xl text-sm font-bold transition-all active:scale-95 shadow-[0_0_25px_rgba(251,146,60,0.4)]"
        >
          <span>Start Free Trial</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
