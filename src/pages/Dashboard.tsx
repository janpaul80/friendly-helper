import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RefreshCw, Grid, Terminal, Zap, Package, Gift } from 'lucide-react';
import { useClerkUser } from '../hooks/useClerkUser';
import { supabase } from '../lib/supabase';
import { openExternalUrl, preopenExternalWindow } from '../lib/openExternal';
import { useCreditBalance, LOW_BALANCE_THRESHOLD } from '../hooks/useCreditBalance';
import { toast } from 'sonner';

// Components
import { WorkspaceUnavailableModal } from '../components/dashboard/WorkspaceUnavailableModal';
import { CreateProjectModal } from '../components/dashboard/CreateProjectModal';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { UserHUD } from '../components/dashboard/UserHUD';
import { ProjectCard } from '../components/dashboard/ProjectCard';
import { NewProjectCard } from '../components/dashboard/NewProjectCard';
import { StudioAnalytics } from '../components/dashboard/StudioAnalytics';
import { StudioReferrals } from '../components/dashboard/StudioReferrals';
import { DeveloperUtilities } from '../components/dashboard/DeveloperUtilities';
import { SavedArchives } from '../components/dashboard/SavedArchives';
import { ReferralWidget } from '../components/dashboard/ReferralWidget';
import { TrialPrompt } from '../components/dashboard/TrialPrompt';
import { PaywallModal } from '../components/dashboard/PaywallModal';
import { LowBalanceModal } from '../components/dashboard/LowBalanceModal';
import { APIMarketplace } from '../components/marketplace/APIMarketplace';
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
  const [searchParams] = useSearchParams();
  const { user, isLoaded, isSignedIn, signOut } = useClerkUser();
  const [projects, setProjects] = useState<Project[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recents');
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [showLowBalanceModal, setShowLowBalanceModal] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [pendingWorkspaceUrl, setPendingWorkspaceUrl] = useState('');

  // Use the credit balance hook - pass both ID and email for legacy record lookup
  const {
    credits,
    creditsSpent,
    subscriptionTier,
    subscriptionStatus,
    trialEndDate,
    isLowBalance,
    refetch: refetchCredits,
  } = useCreditBalance(user?.id ?? null, user?.email ?? null);

  // Calculate quick stats from real data
  const totalViews = (projects?.length || 0) * 1000 + credits; // Estimated reach

  // Check for top-up success/cancel in URL params
  useEffect(() => {
    const topupStatus = searchParams.get('topup');
    const topupCredits = searchParams.get('credits');
    
    if (topupStatus === 'success' && topupCredits) {
      toast.success(`Successfully added ${parseInt(topupCredits).toLocaleString()} credits!`);
      refetchCredits();
      // Clean up URL
      window.history.replaceState({}, '', '/dashboard');
    } else if (topupStatus === 'canceled') {
      toast.info('Top-up canceled');
      window.history.replaceState({}, '', '/dashboard');
    }
  }, [searchParams, refetchCredits]);

  // Show low balance modal when credits are low
  useEffect(() => {
    if (isLowBalance && subscriptionStatus === 'active') {
      setShowLowBalanceModal(true);
    }
  }, [isLowBalance, subscriptionStatus]);

  // Redirect to auth if not signed in with Clerk
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/auth');
    }
  }, [isLoaded, isSignedIn, navigate]);

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
    await signOut();
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

  // Open external workspace (always go to home to avoid 404)
  const handleOpenWorkspace = useCallback(() => {
    // Require active subscription or trial to access workspace
    if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trial') {
      setShowPaywallModal(true);
      return;
    }
    // Open workspace home (no deep-link to avoid 404)
    window.location.href = WORKSPACE_BASE_URL;
  }, [subscriptionStatus]);

  const handleShowCreateModal = () => {
    // Require active subscription or trial to create project
    if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trial') {
      setShowPaywallModal(true);
      return;
    }
    setShowCreateModal(true);
  };

  const handleCreateProject = async (projectName: string) => {
    if (!user) return;
    
    // Double-check subscription or trial
    if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trial') {
      setShowPaywallModal(true);
      return;
    }
    
    setIsCreatingProject(true);
    
    // Generate a slug from the project name
    const slug = projectName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '') || 'project';
    
    try {
      // project_history table doesn't exist yet - just navigate to workspace
      toast.success('Opening workspace...');
      
      setShowCreateModal(false);
      setIsCreatingProject(false);
      
      // Navigate to workspace with a new project
      window.location.href = `${WORKSPACE_BASE_URL}?new=${encodeURIComponent(projectName)}&slug=${encodeURIComponent(slug)}`;
    } catch (err) {
      console.error('Error creating project:', err);
      toast.error('Failed to create project');
      setIsCreatingProject(false);
    }
  };

  const handleOpenProject = (projectId: string) => {
    if (!user) return;
    
    // Require active subscription or trial
    if (subscriptionStatus !== 'active' && subscriptionStatus !== 'trial') {
      setShowPaywallModal(true);
      return;
    }
    
    // Navigate to workspace home with project param
    window.location.href = `${WORKSPACE_BASE_URL}?project=${projectId}`;
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
        toast.error("Failed to start checkout");
        return;
      }
      
      const data = await response.json();
      if (data?.url) {
        openExternalUrl(data.url, checkoutWindow);
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("Failed to start checkout");
    }
  };

  const handleTopUp = async (packId: string, creditsAmount: number) => {
    const checkoutWindow = preopenExternalWindow();
    try {
      const supabaseUrl = "https://ythuhewbaulqirjrkgly.supabase.co";
      const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aHVoZXdiYXVscWlyanJrZ2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzOTkwMDgsImV4cCI6MjA4NDk3NTAwOH0.lbkprUMf_qkyzQOBqSOboipowjA0K8HZ2yaPglwe8MI";
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        toast.error("Please sign in to top up credits");
        return;
      }
      
      const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          topup: packId,
        }),
      });
      
      if (!response.ok) {
        console.error("Top-up checkout failed");
        toast.error("Failed to start top-up");
        return;
      }
      
      const data = await response.json();
      if (data?.url) {
        openExternalUrl(data.url, checkoutWindow);
        setShowLowBalanceModal(false);
      }
    } catch (error) {
      console.error("Top-up error:", error);
      toast.error("Failed to start top-up");
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

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywallModal}
        onClose={() => setShowPaywallModal(false)}
        onUpgrade={handleUpgrade}
      />

      {/* Low Balance Modal */}
      <LowBalanceModal
        isOpen={showLowBalanceModal}
        onClose={() => setShowLowBalanceModal(false)}
        currentBalance={credits}
        subscriptionTier={subscriptionTier}
        onUpgrade={handleUpgrade}
        onTopUp={handleTopUp}
      />

      {/* Header */}
      <DashboardHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreateProject={handleShowCreateModal}
        onLogout={handleLogout}
        onOpenWorkspace={handleOpenWorkspace}
      />

      <main className="relative z-10 py-8 px-4 md:px-8 max-w-7xl mx-auto space-y-8">
        {/* User HUD - Always visible at top */}
        <UserHUD
          user={user}
          credits={credits}
          subscriptionTier={subscriptionTier || 'none'}
          subscriptionStatus={subscriptionStatus}
          onUpgrade={handleUpgrade}
        />

        {/* Trial Prompt - Show for users without subscription or in trial */}
        {(subscriptionStatus === 'none' || subscriptionStatus === 'trial') && (
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
              <p className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-widest">Credits Spent</p>
              <p className="text-xl sm:text-2xl font-black text-white mt-1">{creditsSpent.toLocaleString()}</p>
              <p className="text-[8px] sm:text-[9px] text-orange-400 mt-1">{credits.toLocaleString()} remaining</p>
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

          {/* Studio Tab - Referrals */}
          {activeTab === 'studio' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                  <Gift size={18} className="text-orange-500" />
                  Referral Program
                </h2>
                <p className="text-xs text-gray-500 mt-1">Invite friends and earn 500 HeftCredits for each subscription</p>
              </div>
              <StudioReferrals userId={user?.id || ''} />
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
              <SavedArchives userId={user?.id || ''} />
            </div>
          )}

          {/* API Marketplace Tab */}
          {activeTab === 'marketplace' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                  <Package size={18} className="text-orange-500" />
                  API Marketplace
                </h2>
                <p className="text-xs text-gray-500 mt-1">Discover, test, and compose 1000+ free APIs</p>
              </div>
              <APIMarketplace userId={user?.id || ''} />
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
