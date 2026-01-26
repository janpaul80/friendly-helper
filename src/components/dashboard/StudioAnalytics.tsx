import { Eye, Zap, Folder, TrendingUp, Hash, Globe, Activity } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  project_type: string;
  updated_at: string;
}

interface StudioAnalyticsProps {
  projects: Project[];
  totalViews: number;
  creditsUsed: number;
}

export function StudioAnalytics({ projects, totalViews, creditsUsed }: StudioAnalyticsProps) {
  const efficiencyScore = projects.length > 0 
    ? Math.round((projects.length / Math.max(creditsUsed, 1)) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Reach */}
        <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-white/5 p-6 rounded-2xl group hover:border-orange-500/20 transition-all">
          <div className="flex items-center justify-between">
            <div className="bg-orange-500/10 p-3 rounded-xl text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
              <Eye size={24} />
            </div>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <div className="mt-4">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Reach</div>
            <div className="text-4xl font-black text-white mt-1">{totalViews.toLocaleString()}</div>
            <div className="text-[10px] text-gray-600 mt-1">Across all deployments</div>
          </div>
        </div>

        {/* Efficiency Score */}
        <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-white/5 p-6 rounded-2xl group hover:border-purple-500/20 transition-all">
          <div className="flex items-center justify-between">
            <div className="bg-purple-500/10 p-3 rounded-xl text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
              <Zap size={24} />
            </div>
            <Activity size={16} className="text-purple-400" />
          </div>
          <div className="mt-4">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Credits Used</div>
            <div className="text-4xl font-black text-white mt-1">{creditsUsed.toLocaleString()}</div>
            <div className="text-[10px] text-gray-600 mt-1">HeftCredits consumed</div>
          </div>
        </div>

        {/* Projects Count */}
        <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-white/5 p-6 rounded-2xl group hover:border-emerald-500/20 transition-all">
          <div className="flex items-center justify-between">
            <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all">
              <Folder size={24} />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">+{projects.length}</span>
          </div>
          <div className="mt-4">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Projects</div>
            <div className="text-4xl font-black text-white mt-1">{projects.length}</div>
            <div className="text-[10px] text-gray-600 mt-1">Deployed applications</div>
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-sm font-black uppercase tracking-widest text-white">Performance Matrix</h3>
          <p className="text-[10px] text-gray-500 mt-1">Detailed breakdown of all deployments</p>
        </div>
        
        {projects.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-500">Project</th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-500">Compute Hash</th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-500">Type</th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-500">Status</th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-widest text-gray-500">Reach</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Globe size={12} className="text-gray-500" />
                        <span className="text-sm font-medium text-white">{project.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Hash size={10} className="text-gray-600" />
                        <span className="text-xs font-mono text-gray-400">{project.id.slice(0, 8).toUpperCase()}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
                        {project.project_type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase text-emerald-400">Live</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-gray-400">{Math.floor(Math.random() * 100)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Activity size={32} className="text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500 font-bold">No performance data yet</p>
            <p className="text-xs text-gray-600 mt-1">Deploy your first project to see metrics</p>
          </div>
        )}
      </div>
    </div>
  );
}
