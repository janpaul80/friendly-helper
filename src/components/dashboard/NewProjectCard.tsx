import { Plus, Sparkles, Cpu, Zap } from 'lucide-react';

interface NewProjectCardProps {
  onClick: () => void;
}

export function NewProjectCard({ onClick }: NewProjectCardProps) {
  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onTouchEnd={handleClick}
      className="group border-2 border-dashed border-orange-500/20 bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] hover:from-[#0f0f18] hover:to-[#141420] rounded-2xl cursor-pointer hover:border-orange-500/50 transition-all duration-300 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden w-full text-left active:scale-[0.98]"
    >
      {/* Background Grid Effect with orange tint */}
      <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(rgba(251,146,60,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Corner Glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Center Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-orange-500/20 rounded-full blur-[60px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          <div className="h-16 w-16 bg-gradient-to-br from-[#1a1a24] to-[#0f0f18] rounded-2xl flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 border border-orange-500/20 group-hover:border-orange-500 group-hover:shadow-[0_0_30px_rgba(251,146,60,0.4)]">
            <Plus size={28} className="text-orange-500/50 group-hover:text-white transition-colors" />
          </div>
          <div className="absolute -top-1 -right-1 h-6 w-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-[0_0_15px_rgba(251,146,60,0.5)]">
            <Zap size={12} className="text-white" fill="currentColor" />
          </div>
        </div>
        
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors mt-5">
          Start New Idea
        </h3>
        
        <p className="text-[10px] text-gray-600 group-hover:text-gray-400 mt-2 text-center max-w-[200px] transition-colors">
          Launch the Orchestrator to transform your prompt into production-ready architecture
        </p>

        <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-orange-500/10 px-3 py-1.5 rounded-full border border-orange-500/30">
          <Cpu size={12} className="text-orange-500" />
          <span className="text-[9px] text-orange-400 font-mono uppercase tracking-widest font-bold">AI-Powered</span>
        </div>
      </div>
    </button>
  );
}
