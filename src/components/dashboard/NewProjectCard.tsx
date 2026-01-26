import { Plus, Sparkles, Cpu } from 'lucide-react';

interface NewProjectCardProps {
  onClick: () => void;
}

export function NewProjectCard({ onClick }: NewProjectCardProps) {
  return (
    <div
      onClick={onClick}
      className="group border-2 border-dashed border-white/10 bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] hover:bg-[#111118] rounded-2xl cursor-pointer hover:border-orange-500/40 transition-all duration-300 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden"
    >
      {/* Background Grid Effect */}
      <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
      </div>

      {/* Glow Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <div className="relative">
          <div className="h-16 w-16 bg-[#1a1a24] rounded-2xl flex items-center justify-center group-hover:bg-orange-600 group-hover:text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 border border-white/5 group-hover:border-orange-500">
            <Plus size={28} className="text-gray-400 group-hover:text-white transition-colors" />
          </div>
          <div className="absolute -top-1 -right-1 h-6 w-6 bg-orange-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity scale-75 group-hover:scale-100">
            <Sparkles size={12} className="text-white" />
          </div>
        </div>
        
        <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors mt-5">
          Start New Idea
        </h3>
        
        <p className="text-[10px] text-gray-600 group-hover:text-gray-400 mt-2 text-center max-w-[200px] transition-colors">
          Launch the Orchestrator to transform your prompt into production-ready architecture
        </p>

        <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Cpu size={12} className="text-orange-500" />
          <span className="text-[9px] text-orange-500 font-mono uppercase tracking-widest">AI-Powered</span>
        </div>
      </div>
    </div>
  );
}
