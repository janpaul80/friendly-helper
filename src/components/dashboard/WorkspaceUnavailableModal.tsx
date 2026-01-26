import { useState } from 'react';
import { X, Clock, ExternalLink, RefreshCw, Zap, AlertTriangle } from 'lucide-react';

interface WorkspaceUnavailableModalProps {
  onClose: () => void;
  onRetry: () => void;
  onUseFallback?: () => void;
  targetUrl: string;
}

export function WorkspaceUnavailableModal({ onClose, onRetry, onUseFallback, targetUrl }: WorkspaceUnavailableModalProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onRetry();
    setIsRetrying(false);
  };

  const handleForceOpen = () => {
    window.open(targetUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans">
      <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/30 rounded-2xl w-full max-w-md shadow-[0_0_60px_rgba(251,146,60,0.1)] relative overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Glow effects */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-orange-500/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-[60px]" />
        
        {/* Header */}
        <div className="relative p-5 flex justify-between items-center border-b border-orange-500/20">
          <h2 className="text-lg font-black text-white flex items-center gap-3">
            <div className="h-8 w-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white shadow-[0_0_20px_rgba(251,146,60,0.4)]">
              <Clock size={16} />
            </div>
            Workspace Launching
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
            <div className="h-20 w-20 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-2xl flex items-center justify-center mx-auto border border-orange-500/30 shadow-[0_0_30px_rgba(251,146,60,0.2)]">
              <AlertTriangle size={36} className="text-orange-500" />
            </div>
            <h3 className="text-white font-black text-xl">Workspace Loading</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The external workspace is being prepared. You can use the <span className="text-orange-400 font-bold">internal workspace</span> in the meantime, or wait for the external one.
            </p>
          </div>

          <div className="bg-black/50 border border-orange-500/20 rounded-xl p-4 space-y-2">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Target URL</p>
            <code className="text-xs text-orange-400 break-all block font-mono">{targetUrl}</code>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(251,146,60,0.3)] text-sm active:scale-[0.98] disabled:opacity-50"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Checking Availability...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Try Again
                </>
              )}
            </button>
            
            {onUseFallback && (
              <button
                onClick={onUseFallback}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] text-sm active:scale-[0.98]"
              >
                <Zap size={16} />
                Use Internal Workspace
              </button>
            )}

            <button
              onClick={handleForceOpen}
              className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all text-sm border border-white/10 hover:border-orange-500/30"
            >
              <ExternalLink size={16} />
              Open External Anyway
            </button>
          </div>

          <p className="text-[10px] text-gray-600 text-center flex items-center justify-center gap-2">
            <Zap size={10} className="text-orange-500" />
            You'll be redirected automatically once the workspace is live
          </p>
        </div>
      </div>
    </div>
  );
}
