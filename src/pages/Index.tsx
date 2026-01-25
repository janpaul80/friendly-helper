import { useNavigate } from "react-router-dom";
import { Plus, Sparkles, Zap } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  const handleCreateProject = () => {
    const tempId = `temp-${Date.now()}`;
    navigate(`/workspace/${tempId}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-12 w-12 bg-orange-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.4)]">
            <Zap size={28} fill="currentColor" />
          </div>
          <h1 className="text-5xl font-bold tracking-tight">HeftCoder</h1>
        </div>
        
        <p className="text-xl text-gray-400">
          AI-powered code generation workspace. Build full-stack applications with natural language.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <button 
            onClick={handleCreateProject}
            className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-bold transition-all hover:scale-105 shadow-[0_0_20px_rgba(234,88,12,0.3)]"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
          
          <button 
            className="flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white px-8 py-3 rounded-lg font-medium transition-all hover:bg-white/5"
          >
            <Sparkles className="w-5 h-5" />
            View Templates
          </button>
        </div>
      </div>
    </div>
  );
}
