import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Grid, Terminal } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';

// Components
import { WorkspaceUnavailableModal } from '../components/dashboard/WorkspaceUnavailableModal';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { UserHUD } from '../components/dashboard/UserHUD';
import { ProjectCard } from '../components/dashboard/ProjectCard';
import { NewProjectCard } from '../components/dashboard/NewProjectCard';
import { StudioAnalytics } from '../components/dashboard/StudioAnalytics';
import { DeveloperUtilities } from '../components/dashboard/DeveloperUtilities';
import { SavedArchives } from '../components/dashboard/SavedArchives';

interface Project {
  id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  project_type: string;
  template_id: string | null;
  preview_html: string | null;
  original_prompt: string;
  user_id: string;
  files: any;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(2500);
  const [subscriptionTier, setSubscriptionTier] = useState('free');
  const [projects, setProjects] = useState<Project[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recents');
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [pendingWorkspaceUrl, setPendingWorkspaceUrl] = useState('');

  // Stats for Studio
  const [totalViews, setTotalViews] = useState(0);
  const [creditsUsed, setCreditsUsed] = useState(0);

  // Archives
  const [savedArchives] = useState<any[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate('/auth');
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const { data: projectsData, error: projectsError } = await supabase
          .from('project_history' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (projectsError) throw projectsError;
        setProjects((projectsData || []) as unknown as Project[]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const WORKSPACE_BASE_URL = 'https://workspace.heftcoder.icu';

  const checkWorkspaceAvailability = useCallback(async (url: string): Promise<boolean> => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      await fetch(url, { 
        method: 'HEAD', 
        mode: 'no-cors',
        signal: controller.signal 
      });
      
      clearTimeout(timeoutId);
      return true;
    } catch (error) {
      console.log('Workspace not yet available:', error);
      return false;
    }
  }, []);

  const handleNavigateToWorkspace = useCallback(async (url: string) => {
    const isAvailable = await checkWorkspaceAvailability(url);
    
    if (isAvailable) {
      window.location.href = url;
    } else {
      setPendingWorkspaceUrl(url);
      setShowUnavailableModal(true);
    }
  }, [checkWorkspaceAvailability]);

  const handleCreateProject = () => {
    if (!user) return;
    
    const userId = user.id.replace(/-/g, '').slice(0, 12);
    const targetUrl = `${WORKSPACE_BASE_URL}/user${userId}`;
    handleNavigateToWorkspace(targetUrl);
  };

  const handleOpenProject = (projectId: string) => {
    if (!user) return;
    
    const userId = user.id.replace(/-/g, '').slice(0, 12);
    const targetUrl = `${WORKSPACE_BASE_URL}/user${userId}?project=${projectId}`;
    handleNavigateToWorkspace(targetUrl);
  };

  const handleRetryWorkspace = () => {
    if (pendingWorkspaceUrl) {
      handleNavigateToWorkspace(pendingWorkspaceUrl);
    }
  };

  const handleUpgrade = async () => {
    try {
      const supabaseUrl = "https://ythuhewbaulqirjrkgly.supabase.co";
      const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aHVoZXdiYXVscWlyanJrZ2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzOTkwMDgsImV4cCI6MjA4NDk3NTAwOH0.lbkprUMf_qkyzQOBqSOboipowjA0K8HZ2yaPglwe8MI";
      
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": session?.access_token ? `Bearer ${session.access_token}` : `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          plan: "Pro",
        }),
      });
      
      if (!response.ok) {
        console.error("Stripe checkout failed");
        return;
      }
      
      const data = await response.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Upgrade error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
          <div className="absolute inset-0 w-8 h-8 bg-orange-500/20 rounded-full blur-xl" />
        </div>
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-gray-600" />
          <span className="text-xs font-mono text-gray-600 uppercase tracking-widest">Initializing Command Center</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">
      {/* Grid Background */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Workspace Unavailable Modal */}
      {showUnavailableModal && (
        <WorkspaceUnavailableModal
          onClose={() => setShowUnavailableModal(false)}
          onRetry={handleRetryWorkspace}
          targetUrl={pendingWorkspaceUrl}
        />
      )}

      {/* Header */}
      <DashboardHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreateProject={handleCreateProject}
        onLogout={handleLogout}
        onOpenWorkspace={handleCreateProject}
      />

      <main className="relative z-10 py-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        {/* User HUD */}
        <UserHUD
          user={user}
          credits={credits}
          subscriptionTier={subscriptionTier}
          onUpgrade={handleUpgrade}
        />

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* Projects Tab */}
          {activeTab === 'recents' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-black uppercase tracking-widest text-white">Command Center</h2>
                  <p className="text-xs text-gray-500 mt-1">Your deployed AI applications</p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-600 font-mono">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  {projects?.length || 0} active
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NewProjectCard onClick={handleCreateProject} />

                {projects === undefined ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="bg-[#0a0a0f] rounded-2xl h-[280px] animate-pulse border border-white/5" />
                  ))
                ) : (
                  projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onOpen={handleOpenProject}
                    />
                  ))
                )}

                {projects?.length === 0 && projects !== undefined && (
                  <div className="col-span-full py-16 flex flex-col items-center justify-center">
                    <Grid size={40} className="text-gray-800 mb-4" />
                    <p className="text-sm uppercase tracking-widest font-black text-gray-600">No projects yet</p>
                    <p className="text-xs text-gray-700 mt-2">Launch your first AI-powered application</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Studio Tab */}
          {activeTab === 'studio' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-black uppercase tracking-widest text-white">Performance Studio</h2>
                <p className="text-xs text-gray-500 mt-1">Analytics and deployment metrics</p>
              </div>
              <StudioAnalytics
                projects={projects || []}
                totalViews={totalViews}
                creditsUsed={creditsUsed}
              />
            </div>
          )}

          {/* Utilities Tab */}
          {activeTab === 'utilities' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-black uppercase tracking-widest text-white">Developer Utilities</h2>
                <p className="text-xs text-gray-500 mt-1">Backend status and referral system</p>
              </div>
              <DeveloperUtilities userId={user?.id || ''} />
            </div>
          )}

          {/* Archives Tab */}
          {activeTab === 'saved' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-black uppercase tracking-widest text-white">Saved Archives</h2>
                <p className="text-xs text-gray-500 mt-1">Bookmarked snippets and templates</p>
              </div>
              <SavedArchives archives={savedArchives} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between text-[10px] text-gray-600 font-mono uppercase tracking-widest">
          <span>© 2025 HeftCoder</span>
          <span>v2.0.0 • Command Center</span>
        </div>
      </footer>
    </div>
  );
}
