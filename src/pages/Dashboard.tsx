import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  ArrowUp,
  User,
  CreditCard,
  RefreshCw,
  Eye as EyeIcon,
  Zap,
  Folder,
  Shield,
  Clock,
  Grid,
  BookOpen,
  Share2,
  LogOut
} from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface UserData {
  id: string;
  email: string;
  name?: string;
  credits: number;
  subscription_tier: string;
  image?: string;
}

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
  const [userData, setUserData] = useState<UserData | null>(null);
  const [projects, setProjects] = useState<Project[] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recents' | 'saved' | 'studio'>('recents');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    // Check auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/login');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        // Fetch user's projects from project_history
        const { data: projectsData, error: projectsError } = await supabase
          .from('project_history')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });

        if (projectsError) throw projectsError;
        setProjects(projectsData || []);
        
        // Set basic user data
        setUserData({
          id: user.id,
          email: user.email || '',
          credits: 2500, // Default credits
          subscription_tier: 'free'
        });
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

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !user) return;
    setCreating(true);
    
    try {
      const { data, error } = await supabase
        .from('project_history')
        .insert({
          user_id: user.id,
          name: newProjectName,
          original_prompt: '',
          project_type: 'web',
          files: {}
        })
        .select()
        .single();

      if (error) throw error;
      
      // Navigate to workspace with new project
      navigate(`/workspace/${data.id}`);
    } catch (err) {
      console.error('Error creating project:', err);
    } finally {
      setCreating(false);
      setShowCreateModal(false);
    }
  };

  const getCreditDisplay = () => {
    return `${userData?.credits?.toLocaleString() || 0} HeftCredits`;
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const studioStats = {
    totalViews: 0,
    totalCreditsSpent: 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">
      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">New Project</h2>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Project name..."
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-orange-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateProject}
                disabled={creating || !newProjectName.trim()}
                className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-bold disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus size={16} />}
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 md:space-x-8">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(234,88,12,0.3)]">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight hidden sm:inline">HeftCoder</span>
          </Link>
          <nav className="hidden md:flex space-x-6 text-sm font-medium">
            <button onClick={() => setActiveTab('recents')} className={`transition-colors ${activeTab === 'recents' ? 'text-white' : 'text-gray-500 hover:text-white'}`}>Projects</button>
            <button onClick={() => setActiveTab('studio')} className={`transition-colors ${activeTab === 'studio' ? 'text-white' : 'text-gray-500 hover:text-white'}`}>Studio</button>
          </nav>
        </div>

        <div className="flex items-center space-x-3 md:space-x-4">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-orange-900/10"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">New Project</span>
          </button>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            title="Sign out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
        {/* User Profile Summary */}
        <div className="mb-12 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div className="flex items-center gap-5">
            <div className="h-20 w-20 bg-gradient-to-br from-orange-500 to-purple-600 rounded-3xl flex items-center justify-center p-[2px] shadow-2xl">
              <div className="h-full w-full bg-[#0a0a0a] rounded-[22px] flex items-center justify-center overflow-hidden">
                <User size={32} className="text-gray-500" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                {user?.email?.split('@')[0] || 'Innovator'}
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="bg-orange-600/10 text-orange-500 text-[10px] font-black px-2 py-0.5 rounded border border-orange-500/20 uppercase tracking-widest">
                  {userData?.subscription_tier === 'free' ? 'Trial' : (userData?.subscription_tier || 'Trial')}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                  <Zap size={14} className="text-orange-500" fill="currentColor" />
                  {getCreditDisplay()}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none bg-[#111] hover:bg-[#161616] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-white/5 transition active:scale-95">
              <CreditCard size={14} className="text-gray-500" />
              Invite Friends
            </button>
            <button className="flex-1 sm:flex-none bg-[#111] hover:bg-[#161616] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-white/5 transition active:scale-95">
              <Shield size={14} className="text-gray-500" />
              Backend
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/5 mb-8 overflow-x-auto">
          <div className="flex space-x-8 min-w-max">
            {['recents', 'saved', 'studio'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 px-2 font-bold text-xs uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
              >
                {tab}
                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === 'recents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Create New Project Card */}
              <div
                onClick={() => setShowCreateModal(true)}
                className="group border border-dashed border-white/10 bg-white/2 hover:bg-white/5 rounded-2xl p-6 cursor-pointer hover:border-orange-500/50 transition-all flex flex-col items-center justify-center min-h-[280px]"
              >
                <div className="h-14 w-14 bg-[#1a1a1a] rounded-2xl flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-all group-hover:scale-110 group-hover:rotate-12 duration-300">
                  <Plus size={28} />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest group-hover:text-white transition-colors">Start New Idea</h3>
                <p className="text-[10px] text-gray-500 mt-2 text-center max-w-[180px]">Deploy massive architectures with a single prompt.</p>
              </div>

              {/* Project Cards */}
              {projects === undefined ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="bg-[#111] rounded-2xl h-[280px] animate-pulse border border-white/5" />
                ))
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="group bg-[#0f0f13] border border-white/5 rounded-2xl hover:border-orange-500/40 transition-all h-[280px] flex flex-col relative overflow-hidden">
                    {/* Thumbnail */}
                    <div className="h-32 bg-[#16161e] border-b border-white/5 relative group-hover:bg-[#1c1c24] transition-colors">
                      {project.thumbnail_url ? (
                        <img src={project.thumbnail_url} alt={project.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                          <Folder size={40} className="text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter text-blue-400 border border-blue-500/10">
                        {project.project_type}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-base line-clamp-1">{project.name}</h3>
                        <p className="text-[10px] text-gray-500 font-mono mt-0.5 truncate">{project.description || 'No description'}</p>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase tracking-widest font-bold">
                          <Clock size={12} />
                          {getTimeAgo(project.updated_at)}
                        </div>
                        <Link
                          to={`/workspace/${project.id}`}
                          className="bg-orange-600/10 hover:bg-orange-600 text-orange-500 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-orange-500/20 active:scale-95 flex items-center gap-1.5"
                        >
                          Open <Share2 size={10} />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}

              {projects?.length === 0 && projects !== undefined && (
                <div className="col-span-full py-24 flex flex-col items-center justify-center opacity-30">
                  <Grid size={48} />
                  <p className="mt-4 text-sm uppercase tracking-widest font-black">No projects yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="flex flex-col items-center justify-center py-32">
              <BookOpen size={48} className="text-gray-800 mb-4" />
              <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Archives Empty</p>
              <p className="text-gray-600 text-xs mt-1">Saved snippets and templates will appear here.</p>
            </div>
          )}

          {activeTab === 'studio' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-[#0f0f13] border border-white/5 p-8 rounded-[2rem] flex items-center justify-between group hover:border-orange-500/20 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="bg-orange-600/10 p-4 rounded-2xl text-orange-500">
                      <EyeIcon size={28} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Reach</div>
                      <div className="text-4xl font-black">{studioStats.totalViews}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0f0f13] border border-white/5 p-8 rounded-[2rem] flex items-center justify-between group hover:border-orange-500/20 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="bg-purple-600/10 p-4 rounded-2xl text-purple-500">
                      <Zap size={28} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Credits Used</div>
                      <div className="text-4xl font-black">{studioStats.totalCreditsSpent}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-[#0f0f13] border border-white/5 p-8 rounded-[2rem] flex items-center justify-between group hover:border-orange-500/20 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="bg-green-600/10 p-4 rounded-2xl text-green-500">
                      <Folder size={28} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Projects</div>
                      <div className="text-4xl font-black">{projects?.length || 0}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
