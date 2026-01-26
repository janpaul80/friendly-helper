import { useState } from 'react';
import { X, Plus, Loader2, Rocket, Zap } from 'lucide-react';

interface CreateProjectModalProps {
  onClose: () => void;
  onSubmit: (projectName: string) => void;
  isLoading?: boolean;
}

export function CreateProjectModal({ onClose, onSubmit, isLoading = false }: CreateProjectModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a project name');
      return;
    }
    if (name.trim().length < 2) {
      setError('Project name must be at least 2 characters');
      return;
    }
    setError('');
    onSubmit(name.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/20 rounded-2xl w-full max-w-md shadow-2xl shadow-orange-900/20 relative overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="h-full w-full" style={{
            backgroundImage: 'linear-gradient(rgba(251,146,60,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.2) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Header */}
        <div className="p-5 flex justify-between items-center border-b border-orange-500/10 relative">
          <h2 className="text-lg font-black text-white flex items-center gap-3 uppercase tracking-wider">
            <div className="h-10 w-10 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-900/30">
              <Rocket size={20} />
            </div>
            Launch New Project
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 relative">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl font-mono">
              <span className="text-red-500 mr-2">ERROR:</span>{error}
            </div>
          )}

          <div className="space-y-3">
            <label htmlFor="projectName" className="block text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
              Project Codename
            </label>
            <input
              type="text"
              id="projectName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., nova-dashboard, ai-assistant..."
              className="w-full bg-black/50 border border-orange-500/20 rounded-xl px-4 py-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all font-mono"
              disabled={isLoading}
              autoFocus
            />
            <p className="text-[10px] text-gray-600 font-mono">
              This will be your project identifier in the workspace
            </p>
          </div>

          <div className="pt-2 space-y-4">
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-orange-900/30 text-sm uppercase tracking-widest active:scale-[0.98] group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Initializing Workspace...</span>
                </>
              ) : (
                <>
                  <Zap size={18} className="group-hover:animate-pulse" fill="currentColor" />
                  <span>Launch Project</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[9px] text-gray-600 font-mono uppercase tracking-[0.15em]">
              <div className="h-1 w-1 rounded-full bg-orange-500/50" />
              <span>Opens in HeftCoder Workspace</span>
              <div className="h-1 w-1 rounded-full bg-orange-500/50" />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
