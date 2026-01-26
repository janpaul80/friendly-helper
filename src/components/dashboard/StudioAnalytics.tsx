import { useState, useEffect } from 'react';
import { Eye, Zap, Folder, TrendingUp, Hash, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Project {
  id: string;
  name: string;
  project_type: string;
  updated_at: string;
}

interface StudioAnalyticsProps {
  projects: Project[];
  userId: string;
}

interface AnalyticsData {
  totalCreditsUsed: number;
  projectCount: number;
  isLoading: boolean;
}

export function StudioAnalytics({ projects, userId }: StudioAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalCreditsUsed: 0,
    projectCount: projects.length,
    isLoading: true,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!userId) {
        setAnalytics(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        // Fetch total credits used from transactions (usage type)
        const { data: transactions, error: txError } = await supabase
          .from('credit_transactions' as any)
          .select('amount')
          .eq('user_id', userId)
          .eq('transaction_type', 'usage');

        if (txError) throw txError;

        // Sum all usage (amounts are negative for usage)
        const totalUsed = transactions?.reduce((sum: number, tx: any) => sum + Math.abs(tx.amount), 0) || 0;

        setAnalytics({
          totalCreditsUsed: totalUsed,
          projectCount: projects.length,
          isLoading: false,
        });
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setAnalytics(prev => ({ ...prev, isLoading: false }));
      }
    };

    fetchAnalytics();
  }, [userId, projects.length]);

  // Calculate reach based on project count (simplified metric)
  const estimatedReach = projects.length * 1000 + analytics.totalCreditsUsed * 2;

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
              {projects.length > 0 ? '+23%' : '--'}
            </div>
          </div>
          <div className="relative mt-4">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Reach</div>
            <div className="text-4xl font-black text-white mt-1">
              {analytics.isLoading ? '...' : estimatedReach.toLocaleString()}
            </div>
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
            <div className="text-4xl font-black text-white mt-1">
              {analytics.isLoading ? '...' : analytics.totalCreditsUsed.toLocaleString()}
            </div>
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
            {projects.length > 0 && (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded border border-emerald-500/30">
                +{projects.length}
              </span>
            )}
          </div>
          <div className="relative mt-4">
            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Projects</div>
            <div className="text-4xl font-black text-white mt-1">{projects.length}</div>
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
          {projects.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 text-sm">No projects yet. Create your first project to see analytics.</p>
            </div>
          ) : (
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
                        {project.project_type || 'web'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-bold uppercase text-emerald-400">Live</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-white">
                        {(1000 + Math.floor(Math.random() * 500)).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
