import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Grid, Terminal, Zap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Session, AuthChangeEvent } from '@supabase/supabase-js';
import { openExternalUrl, preopenExternalWindow } from '../lib/openExternal';

// Components
import { WorkspaceUnavailableModal } from '../components/dashboard/WorkspaceUnavailableModal';
import { CreateProjectModal } from '../components/dashboard/CreateProjectModal';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { UserHUD } from '../components/dashboard/UserHUD';
import { ProjectCard } from '../components/dashboard/ProjectCard';
import { NewProjectCard } from '../components/dashboard/NewProjectCard';
import { StudioAnalytics } from '../components/dashboard/StudioAnalytics';
import { DeveloperUtilities } from '../components/dashboard/DeveloperUtilities';
import { SavedArchives } from '../components/dashboard/SavedArchives';
import { ReferralWidget } from '../components/dashboard/ReferralWidget';
import { TrialPrompt } from '../components/dashboard/TrialPrompt';

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
  const [credits, setCredits] = useState(0);
  const [subscriptionTier, setSubscriptionTier] = useState('none');
  const [subscriptionStatus, setSubscriptionStatus] = useState('none');
  const [trialEndDate, setTrialEndDate] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recents');
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [pendingWorkspaceUrl, setPendingWorkspaceUrl] = useState('');

  // Mock Stats for Studio (demo data)
  const [totalViews] = useState(12847);
  const [creditsUsed] = useState(1250);

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
        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('project_history' as any)
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (projectsError) throw projectsError;
        setProjects((projectsData || []) as unknown as Project[]);

        // Fetch user credits
        const { data: creditsData, error: creditsError } = await supabase
          .from('user_credits' as any)
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (creditsError && creditsError.code !== 'PGRST116') {
          console.error('Error fetching credits:', creditsError);
        }

        if (creditsData) {
          setCredits(creditsData.credits || 0);
          setSubscriptionTier(creditsData.subscription_tier || 'none');
          setSubscriptionStatus(creditsData.subscription_status || 'none');
          setTrialEndDate(creditsData.trial_end_date);
        } else {
          // Create initial credits row for new user
          await supabase
            .from('user_credits' as any)
            .insert({ user_id: user.id, credits: 0, subscription_status: 'none' });
        }
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

  const handleShowCreateModal = () => {
    setShowCreateModal(true);
  };

  const handleCreateProject = async (projectName: string) => {
    if (!user) return;
    
    setIsCreatingProject(true);
    
    // Generate a slug from the project name
    const slug = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'project';
    
    const userId = user.id.replace(/-/g, '').slice(0, 12);
    // External workspace expects /user/:id (not /user{id})
    const externalUrl = `${WORKSPACE_BASE_URL}/user/${userId}?new=${encodeURIComponent(projectName)}&slug=${encodeURIComponent(slug)}`;
    
    // Check if external workspace is available
    const isExternalAvailable = await checkWorkspaceAvailability(externalUrl);
    
    setShowCreateModal(false);
    setIsCreatingProject(false);
    
    if (isExternalAvailable) {
      window.location.href = externalUrl;
    } else {
      // Fallback to internal workspace
      navigate(`/workspace/new?name=${encodeURIComponent(projectName)}&slug=${encodeURIComponent(slug)}`);
    }
  };

  const handleOpenProject = (projectId: string) => {
    if (!user) return;
    
    const userId = user.id.replace(/-/g, '').slice(0, 12);
    const targetUrl = `${WORKSPACE_BASE_URL}/user/${userId}?project=${projectId}`;
    handleNavigateToWorkspace(targetUrl);
  };

  const handleRetryWorkspace = () => {
    if (pendingWorkspaceUrl) {
      handleNavigateToWorkspace(pendingWorkspaceUrl);
    }
  };

  const handleUpgrade = async () => {
    const checkoutWindow = preopenExternalWindow();
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
        openExternalUrl(data.url, checkoutWindow);
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
          <div className="absolute inset-0 w-8 h-8 bg-orange-500/30 rounded-full blur-xl animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-orange-500/50" />
          <span className="text-xs font-mono text-orange-500/50 uppercase tracking-widest">Initializing Command Center</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">
      {/* Ambient Glow Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-600/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-[120px]" />
      </div>
      
      {/* Grid Background */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(rgba(251,146,60,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(251,146,60,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Workspace Unavailable Modal */}
      {showUnavailableModal && (
        <WorkspaceUnavailableModal
          onClose={() => setShowUnavailableModal(false)}
          onRetry={handleRetryWorkspace}
          onUseFallback={() => {
            setShowUnavailableModal(false);
            navigate('/workspace/new');
          }}
          targetUrl={pendingWorkspaceUrl}
        />
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProject}
          isLoading={isCreatingProject}
        />
      )}

      {/* Header */}
      <DashboardHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreateProject={handleShowCreateModal}
        onLogout={handleLogout}
        onOpenWorkspace={handleShowCreateModal}
      />

      <main className="relative z-10 py-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        {/* User HUD - Always visible at top */}
        <UserHUD
          user={user}
          credits={credits}
          subscriptionTier={subscriptionTier}
          subscriptionStatus={subscriptionStatus}
          onUpgrade={handleUpgrade}
        />

        {/* Trial Prompt - Show for users without subscription */}
        {subscriptionStatus !== 'active' && (
          <TrialPrompt
            onStartTrial={handleUpgrade}
            trialEndDate={trialEndDate}
            subscriptionStatus={subscriptionStatus}
          />
        )}

        {/* Quick Stats Bar - 2x2 on mobile, 4 cols on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/10 rounded-xl p-3 sm:p-4 relative overflow-hidden group hover:border-orange-500/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <p className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Reach</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">{totalViews.toLocaleString()}</p>
              <p className="text-[8px] sm:text-[9px] text-emerald-400 mt-1">↑ 23% this week</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/10 rounded-xl p-3 sm:p-4 relative overflow-hidden group hover:border-orange-500/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <p className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest">Credits Used</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">{creditsUsed.toLocaleString()}</p>
              <p className="text-[8px] sm:text-[9px] text-orange-400 mt-1">of {credits.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/10 rounded-xl p-3 sm:p-4 relative overflow-hidden group hover:border-orange-500/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <p className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Projects</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">{projects?.length || 0}</p>
              <p className="text-[8px] sm:text-[9px] text-emerald-400 mt-1 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                All systems live
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/10 rounded-xl p-3 sm:p-4 relative overflow-hidden group hover:border-orange-500/30 transition-all">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <p className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest">Efficiency</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">94%</p>
              <p className="text-[8px] sm:text-[9px] text-purple-400 mt-1">Agent performance</p>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {/* Projects Tab */}
          {activeTab === 'recents' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Command Center */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
                  <div>
                    <h2 className="text-base sm:text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                      <Terminal size={16} className="text-orange-500 sm:hidden" />
                      <Terminal size={18} className="text-orange-500 hidden sm:block" />
                      Command Center
                    </h2>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Your deployed AI applications</p>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 self-start">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    {projects?.length || 0} active
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <NewProjectCard onClick={handleShowCreateModal} />

                  {projects === undefined ? (
                    [1, 2, 3].map(i => (
                      <div key={i} className="bg-[#0a0a0f] rounded-2xl h-[280px] animate-pulse border border-orange-500/5" />
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
                    <div className="col-span-full py-16 flex flex-col items-center justify-center border border-dashed border-orange-500/20 rounded-2xl bg-gradient-to-br from-orange-500/5 to-transparent">
                      <div className="relative">
                        <Grid size={40} className="text-orange-500/30" />
                        <div className="absolute inset-0 bg-orange-500/20 blur-xl" />
                      </div>
                      <p className="text-sm uppercase tracking-widest font-black text-gray-400 mt-4">No projects yet</p>
                      <p className="text-xs text-gray-600 mt-2">Launch your first AI-powered application</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Referral Widget - Always visible on main tab */}
              <ReferralWidget userId={user?.id || ''} />
            </div>
          )}

          {/* Studio Tab */}
          {activeTab === 'studio' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                  <Zap size={18} className="text-orange-500" />
                  Performance Studio
                </h2>
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
                <h2 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                  <Terminal size={18} className="text-orange-500" />
                  Developer Utilities
                </h2>
                <p className="text-xs text-gray-500 mt-1">Backend status and referral system</p>
              </div>
              <DeveloperUtilities userId={user?.id || ''} />
            </div>
          )}

          {/* Archives Tab */}
          {activeTab === 'saved' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                  <Grid size={18} className="text-orange-500" />
                  Saved Archives
                </h2>
                <p className="text-xs text-gray-500 mt-1">Bookmarked snippets and templates</p>
              </div>
              <SavedArchives archives={savedArchives} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-orange-500/10 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between text-[10px] text-gray-600 font-mono uppercase tracking-widest">
          <span>© 2025 HeftCoder</span>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>v2.0.0 • Command Center</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
