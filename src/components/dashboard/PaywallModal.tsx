import { X, Lock, Zap, ArrowRight, Sparkles, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export function PaywallModal({ isOpen, onClose, onUpgrade }: PaywallModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/30 rounded-2xl w-full max-w-md shadow-[0_0_80px_rgba(251,146,60,0.15)] relative overflow-hidden"
          >
            {/* Glow effects */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-orange-500/10 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-orange-500/5 rounded-full blur-[80px]" />

            {/* Header */}
            <div className="relative p-5 flex justify-between items-center border-b border-orange-500/20">
              <h2 className="text-lg font-black text-white flex items-center gap-3">
                <div className="h-10 w-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_25px_rgba(251,146,60,0.5)]">
                  <Lock size={20} />
                </div>
                Workspace Locked
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="relative p-6 space-y-6">
              <div className="text-center space-y-4">
                <div className="h-24 w-24 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-2xl flex items-center justify-center mx-auto border border-orange-500/30 shadow-[0_0_40px_rgba(251,146,60,0.2)]">
                  <Crown size={48} className="text-orange-500" />
                </div>
                <h3 className="text-white font-black text-2xl">Unlock HeftCoder</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto">
                  Subscribe to access the AI-powered workspace and start building production-ready applications.
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-black/40 border border-orange-500/10 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Zap size={16} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">Unlimited AI Generations</p>
                    <p className="text-gray-500 text-xs">Use credits to build anything</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                    <Sparkles size={16} className="text-orange-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-bold">Full Workspace Access</p>
                    <p className="text-gray-500 text-xs">Code editor, preview, deployment</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={onUpgrade}
                className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-[0_0_30px_rgba(251,146,60,0.4)] text-base active:scale-[0.98]"
              >
                <span>Subscribe Now</span>
                <ArrowRight size={18} />
              </button>

              <p className="text-center text-gray-600 text-xs">
                Plans start at $19/month • Cancel anytime
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
