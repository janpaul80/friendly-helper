import { useState } from 'react';
import { X, Clock, ExternalLink, RefreshCw } from 'lucide-react';

interface WorkspaceUnavailableModalProps {
  onClose: () => void;
  onRetry: () => void;
  targetUrl: string;
}

export function WorkspaceUnavailableModal({ onClose, onRetry, targetUrl }: WorkspaceUnavailableModalProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    // Small delay for UX feedback
    await new Promise(resolve => setTimeout(resolve, 1000));
    onRetry();
    setIsRetrying(false);
  };

  const handleForceOpen = () => {
    window.open(targetUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans">
      <div className="bg-[#0F1117] border border-white/10 rounded-xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Header */}
        <div className="p-5 flex justify-between items-center bg-[#0F1117] border-b border-white/5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <div className="h-6 w-6 bg-amber-600 rounded-md flex items-center justify-center text-white">
              <Clock size={14} />
            </div>
            Workspace Coming Soon
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 pt-6 space-y-6">
          <div className="text-center space-y-3">
            <div className="h-16 w-16 bg-amber-600/10 rounded-2xl flex items-center justify-center mx-auto">
              <Clock size={32} className="text-amber-500" />
            </div>
            <h3 className="text-white font-bold text-lg">External Workspace Launching Soon</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              The HeftCoder workspace is being deployed and will be available within <span className="text-amber-500 font-semibold">48 hours</span>. 
              Please check back soon!
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-2">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Target URL</p>
            <code className="text-xs text-orange-400 break-all block">{targetUrl}</code>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20 text-sm active:scale-[0.98] disabled:opacity-50"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Checking...
                </>
              ) : (
                <>
                  <RefreshCw size={16} />
                  Try Again
                </>
              )}
            </button>
            
            <button
              onClick={handleForceOpen}
              className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all text-sm border border-white/10"
            >
              <ExternalLink size={16} />
              Open Anyway (New Tab)
            </button>
          </div>

          <p className="text-[10px] text-gray-500 text-center">
            You'll be redirected automatically once the workspace is live.
          </p>
        </div>
      </div>
    </div>
  );
}
