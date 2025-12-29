import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Home, Grid, BookOpen, Plus, ArrowUp, User, CreditCard, LogOut, ChevronDown, Play, Download, Share2, RefreshCw, Eye as EyeIcon, Zap } from 'lucide-react';
import { CreateProjectModal } from '../components/CreateProjectModal';
import { InviteModal } from '../components/InviteModal';
import { BackendUsageModal } from '../components/BackendUsageModal';
import { CommunityFeed } from '../components/CommunityFeed';
import { supabase } from '../lib/supabase';
import { STRIPE_CONFIG } from '../lib/stripeConfig';

interface Project {
    id: string;
    name: string;
    thumbnail?: string;
    updatedAt: string;
    createdAt: string;
    creditsSpent?: number;
    views?: number;
    saves?: number;
    incentive?: number;
    timeUsed?: string;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState<'recents' | 'saved' | 'studio' | 'backend'>('recents');
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showBackendUsageModal, setShowBackendUsageModal] = useState(false);
    const [studioTab, setStudioTab] = useState<'dashboard' | 'monetization'>('dashboard');
    const [studioStats, setStudioStats] = useState({
        totalViews: 0,
        totalCreditsSpent: 0,
        totalIncentive: 0.00
    });

    // Updated: Redirect to the most recent project if available
    const handleWorkspaceClick = () => {
        const lastProjectId = localStorage.getItem('last_project_id');
        if (lastProjectId) {
            navigate(`/workspace/${lastProjectId}`);
        } else if (projects.length > 0) {
            navigate(`/workspace/${projects[0].id}`);
        } else {
            navigate('/workspace');
        }
    };

    const handleProjectClick = (projectId: string) => {
        localStorage.setItem('last_project_id', projectId);
        navigate(`/workspace/${projectId}`);
    };

    const handleUpgrade = async () => {
        try {
            const { data: { user: supabaseUser } } = await supabase.auth.getUser();
            if (!supabaseUser) {
                navigate('/login');
                return;
            }
            const response = await fetch('/api/payment/create-checkout-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceId: STRIPE_CONFIG.prices.pro.priceId,
                    userId: supabaseUser.id,
                    successUrl: window.location.origin + '/dashboard?upgrade=success',
                    cancelUrl: window.location.origin + '/dashboard',
                }),
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error(data.error || 'Failed to create checkout session');
            }
        } catch (e: any) {
            console.error('Upgrade error:', e);
            alert('Failed to start checkout. Please try again.');
        }
    };

    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);

    const fetchProjects = async () => {
        setIsLoadingProjects(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setProjects([]);
                return;
            }
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if (error) {
                console.error('[DASHBOARD] Error fetching projects:', error);
                setProjects([]);
            } else {
                const mappedProjects = (data || []).map(p => ({
                    id: p.id,
                    name: p.name,
                    thumbnail: p.thumbnail,
                    updatedAt: p.updated_at,
                    createdAt: p.created_at,
                    creditsSpent: p.credits_spent || 0,
                    views: p.views || 0,
                    saves: p.saves || 0,
                    incentive: Number(p.incentive) || 0,
                    timeUsed: p.time_used
                }));
                setProjects(mappedProjects);

                // Track the latest project ID for the Workspace button
                if (mappedProjects.length > 0) {
                    localStorage.setItem('last_project_id', mappedProjects[0].id);
                }

                const stats = (data || []).reduce((acc, p) => ({
                    totalViews: acc.totalViews + (p.views || 0),
                    totalCreditsSpent: acc.totalCreditsSpent + (p.credits_spent || 0),
                    totalIncentive: acc.totalIncentive + (Number(p.incentive) || 0)
                }), { totalViews: 0, totalCreditsSpent: 0, totalIncentive: 0 });
                setStudioStats(stats);
            }
        } catch (err) {
            console.error('[DASHBOARD] Failed to fetch projects:', err);
            setProjects([]);
        } finally {
            setIsLoadingProjects(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const [user, setUser] = useState({
        username: 'Loading...',
        email: '',
        credits: 2500 as string | number,
        plan: 'Trial',
        inviteCode: '',
        referredBy: null as string | null,
        referralCredits: 0
    });
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isAuthChecking, setIsAuthChecking] = useState(true);

    const fetchUser = async (retryCount = 0) => {
        try {
            setIsLoadingUser(true);
            const { data: { user: supabaseUser }, error } = await supabase.auth.getUser();
            if (error || !supabaseUser) {
                if (retryCount < 2) {
                    setTimeout(() => fetchUser(retryCount + 1), 1000);
                    return;
                }
                setIsAuthChecking(false);
                setIsLoadingUser(false);
                navigate('/login');
                return;
            }
            const email = supabaseUser.email || '';
            const username = email.split('@')[0] || 'User';
            let credits = 2500;
            let tier = 'Trial';
            let inviteCode = '';
            let referredBy = null;
            let referralCredits = 0;
            try {
                const { data: profileList, error: dbError } = await supabase
                    .from('profiles')
                    .select('credits, tier, invite_code, referred_by, referral_credits')
                    .eq('id', supabaseUser.id);
                const profile = profileList && profileList.length > 0 ? profileList[0] : null;
                if (profile) {
                    credits = profile.credits ?? 2500;
                    tier = profile.tier || 'Trial';
                    inviteCode = profile.invite_code || '';
                    referredBy = profile.referred_by || null;
                    referralCredits = profile.referral_credits || 0;
                    const localReferralCode = localStorage.getItem('referralCode');
                    if (localReferralCode && !profile.referred_by) {
                        try {
                            const refResponse = await fetch('/api/payment/process-referral', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    referralCode: localReferralCode,
                                    newUserId: supabaseUser.id
                                })
                            });
                            if (refResponse.ok) {
                                localStorage.removeItem('referralCode');
                            } else if (refResponse.status === 400 || refResponse.status === 404) {
                                localStorage.removeItem('referralCode');
                            }
                        } catch (refErr) {
                            console.error('[REFERRAL] Network error:', refErr);
                        }
                    }
                } else {
                    // No profile yet, create a default one (Trial)
                    console.log('[AUTH] Creating profile for new user...');
                    const initialCredits = 2500;
                    const initialTier = 'Trial';
                    const newInviteCode = Math.random().toString(36).substring(2, 10).toUpperCase();

                    const { error: insertError } = await supabase
                        .from('profiles')
                        .insert({
                            id: supabaseUser.id,
                            email: email,
                            credits: initialCredits,
                            tier: initialTier,
                            invite_code: newInviteCode,
                            subscription_status: 'trialing'
                        });

                    if (insertError) {
                        console.error('[AUTH ERROR] Profile creation failed:', insertError);
                    } else {
                        console.log('[AUTH] Profile created successfully');
                        credits = initialCredits;
                        tier = initialTier;
                        inviteCode = newInviteCode;
                    }
                }
            } catch (profileErr) {
                console.error('[AUTH DEBUG] profiles exception:', profileErr);
            }
            setUser({
                username,
                email,
                credits,
                plan: tier,
                inviteCode,
                referredBy,
                referralCredits
            });
            setIsAuthChecking(false);
        } catch (err) {
            console.error('[AUTH DEBUG] fetchUser: Exception', err);
            setIsAuthChecking(false);
        } finally {
            setIsLoadingUser(false);
        }
    };

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const isOAuthCallback = hashParams.get('access_token') || window.location.search.includes('code=');
        const params = new URLSearchParams(window.location.search);
        const isPaymentReturn = params.get('session_id');

        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                await fetchUser();
                // Clear OAuth params if present
                if (isOAuthCallback) {
                    window.history.replaceState({}, '', window.location.pathname);
                }
            } else if (!isOAuthCallback) {
                // Not logged in and not an OAuth return, go to login
                setIsAuthChecking(false);
                navigate('/login');
            } else {
                // We are in an OAuth callback, wait for onAuthStateChange to fire
                console.log('[DASHBOARD] Waiting for OAuth session...');
            }
        };

        if (isPaymentReturn) {
            setTimeout(() => {
                fetchUser();
                window.history.replaceState({}, '', window.location.pathname);
            }, 500);
        } else {
            initAuth();
        }

        if (searchParams.get('create') === 'true') {
            setShowCreateModal(true);
            window.history.replaceState({}, '', window.location.pathname);
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                navigate('/');
            } else if (event === 'SIGNED_IN' && session) {
                fetchUser();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [searchParams, navigate]);

    const getCreditDisplay = () => {
        if (user.plan === 'Pro' || user.credits === 'Unlimited') return 'Unlimited HeftCredits';
        const formattedCredits = typeof user.credits === 'number' ? user.credits.toLocaleString() : user.credits;
        return `${formattedCredits} HeftCredits`;
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (seconds < 60) return 'just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
        const months = Math.floor(days / 30);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    };

    const handleDownload = async (e: React.MouseEvent, project: Project) => {
        e.stopPropagation();
        try {
            const button = e.currentTarget as HTMLButtonElement;
            const originalContent = button.innerHTML;
            button.innerHTML = '<span class="animate-spin">↻</span>';
            const response = await fetch(`/api/projects/${project.id}/download`).catch(() => null);
            if (response && response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${project.name.replace(/\s+/g, '_')}.zip`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } else {
                const content = `# ${project.name}
Project ID: ${project.id}
Created: ${project.createdAt}
Last Updated: ${project.updatedAt}
Visit https://app.heftcoder.icu/workspace/${project.id} to edit this project.`;
                const blob = new Blob([content], { type: 'text/plain' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${project.name.replace(/\s+/g, '_')}_info.txt`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }
            button.innerHTML = originalContent;
        } catch (error) {
            console.error('Download failed:', error);
            alert('Download failed. Please try again.');
        }
    };

    const handleShare = async (e: React.MouseEvent, project: Project) => {
        e.stopPropagation();
        const shareUrl = `https://app.heftcoder.icu/workspace/${project.id}`;
        if (navigator.share) {
            try {
                await navigator.share({ title: `Check out my project: ${project.name}`, text: `I built "${project.name}" with HEFTCoder AI! Check it out:`, url: shareUrl });
                return;
            } catch (err) { }
        }
        try {
            await navigator.clipboard.writeText(shareUrl);
            const shareOptions = window.confirm(
                `Link copied to clipboard!\nShare on social media?\nClick OK to open sharing options, or Cancel to close.`
            );
            if (shareOptions) {
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`I built "${project.name}" with HEFTCoder AI! Check it out:`)}&url=${encodeURIComponent(shareUrl)}`;
                window.open(twitterUrl, '_blank', 'width=600,height=400');
            }
        } catch (err) {
            prompt('Copy this link to share:', shareUrl);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <header className="border-b border-gray-800 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 md:space-x-8">
                    <div className="flex items-center gap-2">
                        <div className="h-7 w-7 md:h-8 md:w-8 bg-orange-500 rounded-lg flex items-center justify-center text-black font-bold">
                            <Zap size={16} className="md:hidden" fill="currentColor" />
                            <Zap size={20} className="hidden md:block" fill="currentColor" />
                        </div>
                        <span className="text-white font-bold text-lg md:text-xl tracking-tight">HeftCoder</span>
                    </div>
                    <nav className="hidden md:flex space-x-6 text-sm">
                        <Link to="/dashboard" className="hover:text-purple-400 transition-colors">My Projects</Link>
                        <Link to="/explore" className="hover:text-purple-400 transition-colors">Explore</Link>
                        <Link to="/tutorials" className="hover:text-purple-400 transition-colors">Tutorials</Link>
                        <Link to="/blog" className="hover:text-purple-400 transition-colors">Blog</Link>
                    </nav>
                </div>
                <div className="flex items-center space-x-2 md:space-x-4">
                    {/* UPDATED BUTTON: Redirects to /workspace */}
                    <button
                        onClick={handleWorkspaceClick}
                        className="hidden sm:flex bg-transparent border border-gray-700 hover:border-gray-500 hover:text-white text-gray-400 px-3 md:px-4 py-2 rounded-md text-sm transition-colors items-center gap-2"
                    >
                        <BookOpen size={16} />
                        <span className="hidden md:inline">Workspace</span>
                    </button>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-gray-800 hover:bg-gray-700 px-3 md:px-4 py-2 rounded-md text-sm transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        <span className="hidden sm:inline">Create</span>
                    </button>
                    <button
                        onClick={handleUpgrade}
                        className="bg-yellow-600 hover:bg-yellow-700 px-2 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors"
                    >
                        Upgrade
                    </button>
                    <div className="relative">
                        <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
                            <ChevronDown size={16} />
                        </button>
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-72 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50">
                                <div className="p-4 border-b border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
                                        <div>
                                            <div className="font-medium">{user.username}</div>
                                            <div className="text-xs text-gray-400">{user.email}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-gray-400">Plan</span>
                                        <span className="text-sm font-medium">{user.plan}</span>
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-gray-400">Credits</span>
                                        <span className="text-sm font-medium">{getCreditDisplay()}</span>
                                    </div>
                                    <button
                                        onClick={() => setShowBackendUsageModal(true)}
                                        className="w-full flex items-center justify-between mb-4 hover:bg-gray-800 rounded px-1 -mx-1 py-1 transition-colors group"
                                    >
                                        <span className="text-sm text-gray-400 group-hover:text-white transition-colors">Backend usage</span>
                                        <span className="text-sm font-medium hover:text-white transition-colors">0/1</span>
                                    </button>
                                    <div className="space-y-2 mt-4">
                                        <button
                                            onClick={() => {
                                                setShowProfileMenu(false);
                                                setShowInviteModal(true);
                                            }}
                                            className="w-full flex items-center gap-2 text-sm p-2 hover:bg-gray-800 rounded text-left transition-colors group"
                                        >
                                            <CreditCard size={16} className="text-gray-400 group-hover:text-white" />
                                            <div>
                                                <div className="font-medium">Get free credits</div>
                                                <div className="text-[10px] text-gray-500">Share products to earn 200 credits</div>
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('recents')}
                                            className="w-full flex items-center gap-2 text-sm p-2 hover:bg-gray-800 rounded text-left transition-colors text-gray-300"
                                        >
                                            <Home size={16} className="text-gray-400" /> My Project
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('studio')}
                                            className="w-full flex items-center gap-2 text-sm p-2 hover:bg-gray-800 rounded text-left transition-colors text-gray-300"
                                        >
                                            <User size={16} className="text-gray-400" /> Creator Studio
                                        </button>
                                        <button className="w-full flex items-center gap-2 text-sm p-2 hover:bg-gray-800 rounded text-left transition-colors text-red-400 hover:text-red-300">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="py-6 md:py-8 px-4 md:px-6 max-w-7xl mx-auto">
                <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="h-12 w-12 md:h-16 md:w-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-900/20">
                            <User size={24} className="md:hidden" />
                            <User size={32} className="hidden md:block" />
                        </div>
                        <div>
                            <div className="text-xl md:text-2xl font-bold">{user.username}</div>
                            <div className="text-xs md:text-sm text-gray-400 flex items-center gap-1">
                                <Zap size={14} className="text-orange-500" fill="currentColor" />
                                {getCreditDisplay()}
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => setActiveTab('studio')}
                            className="flex-1 sm:flex-none bg-gray-800 hover:bg-gray-700 px-3 md:px-4 py-2 rounded-md text-xs md:text-sm flex items-center justify-center gap-2 border border-gray-700 transition"
                        >
                            <User size={14} className="md:hidden" />
                            <User size={16} className="hidden md:inline" />
                            <span className="hidden sm:inline">Creator Studio</span>
                            <span className="sm:hidden">Studio</span>
                        </button>
                        <button className="flex-1 sm:flex-none bg-gray-800 hover:bg-gray-700 px-3 md:px-4 py-2 rounded-md text-xs md:text-sm flex items-center justify-center gap-2 border border-gray-700 transition">
                            <RefreshCw size={14} className="md:hidden" />
                            <RefreshCw size={16} className="hidden md:inline" />
                            Rewind
                        </button>
                    </div>
                </div>

                <div className="border-b border-gray-800 mb-6 md:mb-8 overflow-x-auto">
                    <div className="flex space-x-4 md:space-x-8 min-w-max">
                        <button
                            onClick={() => setActiveTab('recents')}
                            className={`pb-3 md:pb-4 px-1 md:px-2 font-medium text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'recents' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Recents
                        </button>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`pb-3 md:pb-4 px-1 md:px-2 font-medium text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'saved' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Saved
                        </button>
                        <button
                            onClick={() => setActiveTab('studio')}
                            className={`pb-3 md:pb-4 px-1 md:px-2 font-medium text-xs md:text-sm transition-all whitespace-nowrap ${activeTab === 'studio' ? 'border-b-2 border-purple-500 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            Creator Studio
                        </button>
                    </div>
                </div>

                {activeTab === 'recents' && (
                    <div className="space-y-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div
                                onClick={() => setShowCreateModal(true)}
                                className="border border-gray-800 bg-gray-900/50 hover:bg-gray-900 rounded-xl p-6 cursor-pointer hover:border-purple-500 transition-all group flex flex-col items-center justify-center min-h-[200px]"
                            >
                                <div className="h-16 w-16 bg-gray-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-500/20 group-hover:text-purple-400 transition-colors">
                                    <Plus size={32} />
                                </div>
                                <h3 className="text-lg font-medium mb-1">Start new project</h3>
                                <p className="text-sm text-gray-500">Describe your idea in plain English</p>
                            </div>
                            {isLoadingProjects ? (
                                <>
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="border border-gray-800 bg-gray-900 rounded-xl overflow-hidden min-h-[280px] animate-pulse">
                                            <div className="h-32 bg-gray-800"></div>
                                            <div className="p-6">
                                                <div className="h-6 bg-gray-800 rounded mb-3 w-3/4"></div>
                                                <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                projects.map((project) => (
                                    <div
                                        key={project.id}
                                        onClick={() => handleProjectClick(project.id)}
                                        className="border border-gray-800 bg-gray-900 rounded-xl overflow-hidden hover:border-gray-600 transition-all hover:shadow-xl hover:shadow-purple-900/10 flex flex-col justify-between min-h-[280px] group cursor-pointer"
                                    >
                                        {project.thumbnail ? (
                                            <div
                                                className="h-32 bg-cover bg-center relative"
                                                style={{ backgroundImage: `url(${project.thumbnail})` }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900"></div>
                                            </div>
                                        ) : (
                                            <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                                <Grid size={40} className="text-gray-600" />
                                            </div>
                                        )}
                                        <div className="p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-3">
                                                    <h3 className="text-lg font-bold group-hover:text-purple-400 transition-colors">{project.name}</h3>
                                                    <div className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">Public</div>
                                                </div>
                                                <p className="text-xs text-gray-500">Edited {getTimeAgo(project.updatedAt)}</p>
                                            </div>
                                            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between text-gray-400">
                                                <span className="text-xs text-gray-500">Project ID: {project.id.slice(0, 8)}</span>
                                                <div className="flex gap-2">
                                                    <button onClick={(e) => { e.stopPropagation(); handleProjectClick(project.id); }} className="p-1.5 hover:bg-gray-700 rounded-md hover:text-white transition-colors" title="Open Project"><Play size={14} /></button>
                                                    <button onClick={(e) => handleDownload(e, project)} className="p-1.5 hover:bg-gray-700 rounded-md hover:text-white transition-colors" title="Download Project"><Download size={14} /></button>
                                                    <button onClick={(e) => handleShare(e, project)} className="p-1.5 hover:bg-gray-700 rounded-md hover:text-white transition-colors" title="Share Project"><Share2 size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'saved' && (
                    <div className="text-center py-20 text-gray-500">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-20" />
                        <p>No saved projects yet.</p>
                    </div>
                )}

                {activeTab === 'studio' && (
                    <div className="bg-[#121212] rounded-2xl p-8 border border-gray-800 font-serif">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-normal">Creator Studio</h2>
                            <button onClick={() => setActiveTab('recents')} className="text-gray-400 hover:text-white">
                                <LogOut size={20} className="rotate-180" />
                            </button>
                        </div>
                        <div className="flex gap-8 mb-8 border-b border-gray-800 pb-2">
                            <button
                                onClick={() => setStudioTab('dashboard')}
                                className={`pb-1 transition-colors ${studioTab === 'dashboard' ? 'text-white font-medium border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Dashboard
                            </button>
                            <button
                                onClick={() => setStudioTab('monetization')}
                                className={`pb-1 transition-colors ${studioTab === 'monetization' ? 'text-white font-medium border-b-2 border-orange-500' : 'text-gray-500 hover:text-gray-300'}`}
                            >
                                Referrals
                            </button>
                        </div>
                        {studioTab === 'dashboard' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                    {[
                                        { icon: EyeIcon, label: 'Total Views', value: studioStats.totalViews.toString() },
                                        { icon: CreditCard, label: 'Total Credits Spent', value: studioStats.totalCreditsSpent.toString() },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white text-black p-6 rounded-2xl flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-gray-200 p-3 rounded-full">
                                                    <stat.icon size={24} className="text-gray-600" />
                                                </div>
                                                <div>
                                                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{stat.label}</div>
                                                    <div className="text-3xl font-bold">{stat.value}</div>
                                                </div>
                                            </div>
                                            <div className="text-gray-300 cursor-pointer hover:text-gray-500">
                                                <div className="border border-current rounded-full w-5 h-5 flex items-center justify-center text-xs">?</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-6">Project details</h3>
                                    <div className="bg-white rounded-xl overflow-hidden text-black">
                                        <div className="grid grid-cols-6 border-b border-gray-200 bg-gray-50 p-4 text-xs font-bold text-gray-500">
                                            <div>Details</div>
                                            <div>Credits Spent</div>
                                            <div>Time Used</div>
                                            <div>Views</div>
                                            <div>Built On</div>
                                            <div>Saves</div>
                                        </div>
                                        {projects.length === 0 ? (
                                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-12">
                                                <RefreshCw size={48} className="opacity-20 mb-4" />
                                                <p>No projects yet. Create your first project!</p>
                                            </div>
                                        ) : (
                                            projects.map((project, idx) => (
                                                <div key={project.id} className={`grid grid-cols-6 p-4 text-sm ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-100`}>
                                                    <div className="font-medium text-gray-900 truncate">{project.name}</div>
                                                    <div className="text-gray-600">{project.creditsSpent || 0}</div>
                                                    <div className="text-gray-600">{project.timeUsed || '00:00:00'}</div>
                                                    <div className="text-gray-600">{project.views || 0}</div>
                                                    <div className="text-gray-600">{new Date(project.createdAt).toLocaleDateString()}</div>
                                                    <div className="text-gray-600">{project.saves || 0}</div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                        {studioTab === 'monetization' && (
                            <div className="space-y-8">
                                <div className="bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl p-8 text-white">
                                    <h3 className="text-2xl font-bold mb-2">Refer & Earn Credits</h3>
                                    <p className="text-white/80 mb-6">Earn 200 credits for every friend who joins HeftCoder using your link.</p>
                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                                            <div className="text-sm text-white/70">Total Earned HeftCredits</div>
                                            <div className="text-3xl font-bold">{user.referralCredits.toLocaleString()}</div>
                                        </div>
                                        <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                                            <div className="text-sm text-white/70">Active Referrals</div>
                                            <div className="text-3xl font-bold">{Math.floor(user.referralCredits / 200)}</div>
                                        </div>
                                        <div className="bg-white/20 rounded-xl p-4 backdrop-blur">
                                            <div className="text-sm text-white/70">Pending Credits</div>
                                            <div className="text-3xl font-bold">0</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-2xl p-6 text-black border border-gray-200">
                                    <h4 className="text-lg font-bold mb-4">Your Referral Link</h4>
                                    <div className="flex gap-4">
                                        <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 truncate">
                                            {user.inviteCode ? `https://heftcoder.icu/invite/${user.inviteCode}` : 'Calculating your link...'}
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (user.inviteCode) {
                                                    navigator.clipboard.writeText(`https://heftcoder.icu/invite/${user.inviteCode}`);
                                                    alert('Referral link copied!');
                                                }
                                            }}
                                            className="bg-orange-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-orange-600 transition-colors"
                                        >
                                            Copy Link
                                        </button>
                                    </div>
                                    <p className="mt-4 text-xs text-gray-500">
                                        Share this link with your community. Credits are added instantly when your friend visits their dashboard.
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-6 text-black border border-gray-100">
                                    <h4 className="text-lg font-bold mb-4">Program Details</h4>
                                    <ul className="space-y-3 text-sm text-gray-600">
                                        <li className="flex items-start gap-2">
                                            <div className="mt-1 w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                                            <span>Referrer receives 200 credits per signup.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="mt-1 w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                                            <span>Credits can be used for building projects and AI generation.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="mt-1 w-1.5 h-1.5 bg-orange-500 rounded-full flex-shrink-0" />
                                            <span>No limit on the number of referrals you can make.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'backend' && (
                    <div className="p-4">
                        <div className="mb-8 bg-white rounded-xl overflow-hidden text-black">
                            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 p-2 rounded">
                                        <Grid size={20} className="text-green-700" />
                                    </div>
                                    <span className="font-bold">0/1 Backend Project</span>
                                </div>
                                <button onClick={handleUpgrade} className="bg-[#4a4a4a] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#333]">
                                    Upgrade
                                </button>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="p-4 font-normal">Project name</th>
                                        <th className="p-4 font-normal">Expired</th>
                                        <th className="p-4 font-normal">Status</th>
                                        <th className="p-4 font-normal">Service</th>
                                        <th className="p-4 font-normal">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-4 text-gray-400" colSpan={5}>• No project available</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mb-2 text-white font-bold text-lg flex items-center gap-2">
                            Paused projects
                            <span className="text-gray-500 text-sm font-normal bg-gray-800 rounded-full w-5 h-5 flex items-center justify-center cursor-help">?</span>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Backend services will be permanently deleted after deadline (including data).</p>
                        <div className="mb-8 bg-white rounded-xl overflow-hidden text-black">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="p-4 font-normal">Project name</th>
                                        <th className="p-4 font-normal">Deadline</th>
                                        <th className="p-4 font-normal">Status</th>
                                        <th className="p-4 font-normal">Service</th>
                                        <th className="p-4 font-normal">Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-4 text-gray-400" colSpan={5}>• No project available</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-white rounded-xl p-6 text-black">
                            <h3 className="font-bold text-lg mb-4">What's HeftCoder Backend?</h3>
                            <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                Make your websites come alive! Instead of just showing static pages, your visitors can now interact, vote, comment, and see real-time updates. It's like turning a poster into a living, breathing app.
                            </p>
                            <h4 className="font-bold text-sm mb-2">What it gives you:</h4>
                            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                                <li>
                                    <span className="font-bold text-black">Database</span> - Remember votes, comments, scores - nothing gets lost when people refresh the page
                                </li>
                                <li>
                                    <span className="font-bold text-black">Edge Functions</span> - Your site can automatically count votes, update rankings, send notifications
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </main>

            {showInviteModal && <InviteModal inviteCode={user.inviteCode} onClose={() => setShowInviteModal(false)} />}
            {showCreateModal && (
                <CreateProjectModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => {
                        fetchProjects();
                        setShowCreateModal(false);
                    }}
                />
            )}
            {showBackendUsageModal && (
                <BackendUsageModal
                    onClose={() => setShowBackendUsageModal(false)}
                    onUpgrade={handleUpgrade}
                />
            )}
        </div>
    );
}