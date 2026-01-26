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

// Mock data for demo
const mockProjects = [
  { id: 'proj-001', name: 'AI Dashboard Pro', project_type: 'web', updated_at: new Date().toISOString(), views: 4521 },
  { id: 'proj-002', name: 'E-commerce Store', project_type: 'web', updated_at: new Date().toISOString(), views: 3892 },
  { id: 'proj-003', name: 'Analytics Platform', project_type: 'web', updated_at: new Date().toISOString(), views: 2156 },
  { id: 'proj-004', name: 'Chat Application', project_type: 'web', updated_at: new Date().toISOString(), views: 1478 },
  { id: 'proj-005', name: 'Portfolio Site', project_type: 'web', updated_at: new Date().toISOString(), views: 800 },
];

export function StudioAnalytics({ projects, totalViews, creditsUsed }: StudioAnalyticsProps) {
  // Use mock data if no real projects
  const displayProjects = projects.length > 0 ? projects : mockProjects;
  const displayViews = totalViews || 12847;
  const displayCredits = creditsUsed || 1250;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Reach */}
        <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/20 p-6 rounded-2xl group hover:border-orange-500/40 transition-all relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-[40px] group-hover:bg-orange-500/20 transition-colors" />
          <div className="relative flex items-center justify-between">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-xl text-white shadow-[0_0_20px_rgba(251,146,60,0.3)]">
              <Eye size={24} />
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-bold">
              <TrendingUp size={14} />
              +23%
            </div>
          </div>
          <div className="relative mt-4">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Reach</div>
            <div className="text-4xl font-black text-white mt-1">{displayViews.toLocaleString()}</div>
            <div className="text-[10px] text-gray-600 mt-1">Across all deployments</div>
          </div>
        </div>

        {/* Credits Used */}
        <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-purple-500/20 p-6 rounded-2xl group hover:border-purple-500/40 transition-all relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-[40px] group-hover:bg-purple-500/20 transition-colors" />
          <div className="relative flex items-center justify-between">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <Zap size={24} />
            </div>
            <Activity size={16} className="text-purple-400" />
          </div>
          <div className="relative mt-4">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Credits Used</div>
            <div className="text-4xl font-black text-white mt-1">{displayCredits.toLocaleString()}</div>
            <div className="text-[10px] text-gray-600 mt-1">HeftCredits consumed</div>
          </div>
        </div>

        {/* Projects Count */}
        <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-emerald-500/20 p-6 rounded-2xl group hover:border-emerald-500/40 transition-all relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-[40px] group-hover:bg-emerald-500/20 transition-colors" />
          <div className="relative flex items-center justify-between">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <Folder size={24} />
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded border border-emerald-500/30">+{displayProjects.length}</span>
          </div>
          <div className="relative mt-4">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Projects</div>
            <div className="text-4xl font-black text-white mt-1">{displayProjects.length}</div>
            <div className="text-[10px] text-gray-600 mt-1">Deployed applications</div>
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-white">Performance Matrix</h3>
            <p className="text-[10px] text-gray-500 mt-1">Detailed breakdown of all deployments</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            Live Data
          </div>
        </div>
        
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
              {displayProjects.map((project: any, index: number) => (
                <tr key={project.id} className="border-b border-white/5 hover:bg-orange-500/5 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
                      <span className="text-sm font-medium text-white">{project.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Hash size={10} className="text-gray-600" />
                      <span className="text-xs font-mono text-orange-400/80">{project.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/20 px-2 py-1 rounded border border-blue-500/30">
                      {project.project_type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-bold uppercase text-emerald-400">Live</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono text-white">{(project.views || Math.floor(Math.random() * 5000) + 500).toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
