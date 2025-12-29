"use client";
import React, { useState } from 'react';
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
    Lock,
    Share2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserButton, useUser, useClerk } from "@clerk/nextjs";
import { CreateProjectModal } from '@/components/dashboard/CreateProjectModal';
import { InviteModal } from '@/components/dashboard/InviteModal';
import { BackendUsageModal } from '@/components/dashboard/BackendUsageModal';

export default function Dashboard() {
    const router = useRouter();
    const { user: clerkUser } = useUser();

    const [userData, setUserData] = useState<any>(null);
    const [projects, setProjects] = useState<any[] | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState<'recents' | 'saved' | 'studio'>('recents');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showBackendUsageModal, setShowBackendUsageModal] = useState(false);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

    useEffect(() => {
        if (!clerkUser) return;

        const fetchData = async () => {
            try {
                // Sync user with Supabase (handles creation and credit top-up)
                const { syncUserWithSupabase } = await import('@/lib/actions/auth');
                const user: any = await syncUserWithSupabase();
                if (!user || user.error) throw new Error(user?.error || "Could not sync user");
                setUserData(user);

                // Fetch Projects
                const { data: projectsData, error: projectsError } = await supabase
                    .from('projects')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                if (projectsError) throw projectsError;
                setProjects(projectsData || []);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [clerkUser]);

    const handleUpgrade = async (plan: string = 'Pro') => {
        setLoadingPlan(plan);
        try {
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    plan,
                    userId: userData?.id,
                    userEmail: clerkUser?.emailAddresses[0].emailAddress,
                }),
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Upgrade error:", error);
        } finally {
            setLoadingPlan(null);
        }
    };

    const getCreditDisplay = () => {
        return `${userData?.credits?.toLocaleString() || 0} HeftCredits`;
    };

    const getTimeAgo = (timestamp: number) => {
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
        totalViews: projects?.reduce((acc, p) => acc + (p.views || 0), 0) || 0,
        totalCreditsSpent: projects?.reduce((acc, p) => acc + (p.creditsSpent || 0), 0) || 0,
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">
            {/* Header */}
            <header className="border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-40 px-4 md:px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4 md:space-x-8">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(234,88,12,0.3)]">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight hidden sm:inline">HeftCoder</span>
                    </Link>
                    <nav className="hidden md:flex space-x-6 text-sm font-medium">
                        <button onClick={() => setActiveTab('recents')} className={`transition-colors ${activeTab === 'recents' ? 'text-white' : 'text-gray-500 hover:text-white'}`}>Projects</button>
                        <button onClick={() => setActiveTab('studio')} className={`transition-colors ${activeTab === 'studio' ? 'text-white' : 'text-gray-500 hover:text-white'}`}>Studio</button>
                        {projects && projects.length > 0 && (
                            <Link href={`/workspace/${projects[0].id}`} className="text-gray-500 hover:text-white transition-colors">Workspace</Link>
                        )}
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
                        onClick={() => handleUpgrade('Pro')}
                        disabled={!!loadingPlan}
                        className="bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg text-sm font-bold transition-all hidden sm:flex items-center gap-2"
                    >
                        {loadingPlan ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ArrowUp size={16} className="text-orange-500" />}
                        Upgrade
                    </button>

                    <div className="h-8 w-[1px] bg-white/10 mx-2 hidden sm:block" />

                    <UserButton
                        afterSignOutUrl="/"
                    />
                </div>
            </header>

            <main className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
                {/* User Profile Summary */}
                <div className="mb-12 flex flex-col md:flex-row items-start md:items-center gap-6 justify-between animate-in fade-in slide-in-from-top duration-500">
                    <div className="flex items-center gap-5">
                        <div className="h-20 w-20 bg-gradient-to-br from-orange-500 to-purple-600 rounded-3xl flex items-center justify-center p-[2px] shadow-2xl">
                            <div className="h-full w-full bg-[#0a0a0a] rounded-[22px] flex items-center justify-center overflow-hidden">
                                {clerkUser?.imageUrl ? (
                                    <img src={clerkUser.imageUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <User size={32} className="text-gray-500" />
                                )}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">
                                {clerkUser?.username || clerkUser?.emailAddresses[0].emailAddress.split('@')[0] || 'Innovator'}
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
                        <button
                            onClick={() => setShowInviteModal(true)}
                            className="flex-1 sm:flex-none bg-[#111] hover:bg-[#161616] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-white/5 transition active:scale-95"
                        >
                            <CreditCard size={14} className="text-gray-500" />
                            Invite Friends
                        </button>
                        <button
                            onClick={() => setShowBackendUsageModal(true)}
                            className="flex-1 sm:flex-none bg-[#111] hover:bg-[#161616] px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-white/5 transition active:scale-95"
                        >
                            <Shield size={14} className="text-gray-500" />
                            Backend
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-white/5 mb-8 overflow-x-auto scroller-hidden">
                    <div className="flex space-x-8 min-w-max">
                        {['recents', 'saved', 'studio'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`pb-4 px-2 font-bold text-xs uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-white' : 'text-gray-600 hover:text-gray-400'}`}
                            >
                                {tab}
                                {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 animate-in fade-in duration-300" />}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[400px]">
                    {activeTab === 'recents' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                                projects.map((project: any) => (
                                    <div key={project.id} className="group bg-[#0f0f13] border border-white/5 rounded-2xl hover:border-orange-500/40 transition-all h-[280px] flex flex-col relative overflow-hidden">
                                        {/* Thumbnail / Preview Area */}
                                        <div className="h-32 bg-[#16161e] border-b border-white/5 relative group-hover:bg-[#1c1c24] transition-colors">
                                            {project.thumbnail ? (
                                                <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center opacity-20">
                                                    <Folder size={40} className="text-gray-400" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[8px] font-black uppercase tracking-tighter text-blue-400 border border-blue-500/10">Public</div>
                                        </div>

                                        <div className="p-5 flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-base line-clamp-1">{project.name}</h3>
                                                <p className="text-[10px] text-gray-500 font-mono mt-0.5 truncate">{project.subdomain}.heftcoder.icu</p>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-2 text-[9px] text-gray-500 uppercase tracking-widest font-bold">
                                                    <Clock size={12} />
                                                    {getTimeAgo(project.lastModified)}
                                                </div>
                                                <Link
                                                    href={`/workspace/${project.id}`}
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
                                    <p className="mt-4 text-sm uppercase tracking-widest font-black">No active deployments</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'saved' && (
                        <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-500">
                            <BookOpen size={48} className="text-gray-800 mb-4" />
                            <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Archives Empty</p>
                            <p className="text-gray-600 text-xs mt-1">Saved snippets and templates will appear here.</p>
                        </div>
                    )}

                    {activeTab === 'studio' && (
                        <div className="animate-in fade-in duration-500 space-y-10">
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
                                <div className="bg-[#0f0f13] border border-white/5 p-8 rounded-[2rem] flex items-center justify-between group hover:border-purple-500/20 transition-all">
                                    <div className="flex items-center gap-6">
                                        <div className="bg-purple-600/10 p-4 rounded-2xl text-purple-500">
                                            <Zap size={28} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Efficiency</div>
                                            <div className="text-4xl font-black">{studioStats.totalCreditsSpent.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    onClick={() => setShowInviteModal(true)}
                                    className="bg-[#0f0f13] border border-white/5 p-8 rounded-[2rem] flex items-center justify-between group hover:border-blue-500/20 transition-all cursor-pointer"
                                >
                                    <div className="flex items-center gap-6">
                                        <div className="bg-blue-600/10 p-4 rounded-2xl text-blue-500">
                                            <Share2 size={28} />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Referrals</div>
                                            <div className="text-sm font-bold text-gray-300">Earn 200 credits / paid signup</div>
                                        </div>
                                    </div>
                                    <Plus className="text-gray-600 group-hover:text-white transition-colors" />
                                </div>
                            </div>

                            <div className="bg-[#0f0f13] border border-white/5 rounded-[2rem] overflow-hidden">
                                <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                                    <h3 className="font-bold uppercase tracking-widest text-xs">Project Performance Matrix</h3>
                                    <button className="text-[10px] text-orange-500 font-bold hover:underline">Export CSV</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="text-[10px] font-black text-gray-600 uppercase tracking-widest border-b border-white/5">
                                            <tr>
                                                <th className="px-8 py-4">Title</th>
                                                <th className="px-8 py-4">Compute Hash</th>
                                                <th className="px-8 py-4">Status</th>
                                                <th className="px-8 py-4 text-right">Reach</th>
                                                <th className="px-8 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {projects?.map((p: any) => (
                                                <tr key={p.id} className="hover:bg-white/[0.01] transition-colors">
                                                    <td className="px-8 py-4 font-bold text-gray-300">{p.name}</td>
                                                    <td className="px-8 py-4 font-mono text-[10px] text-gray-500">{p.id.slice(0, 12)}</td>
                                                    <td className="px-8 py-4">
                                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-400">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                            Live
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-4 text-right font-black text-white">{p.views || 0}</td>
                                                    <td className="px-8 py-4 text-right">
                                                        <Link href={`/workspace/${p.id}`} className="text-orange-500 hover:text-orange-400 font-bold text-xs uppercase tracking-widest">Connect Editor</Link>
                                                    </td>
                                                </tr>
                                            ))}
                                            {projects?.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-8 py-12 text-center text-gray-600 text-xs italic">Initialization required...</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Modals */}
            {showCreateModal && <CreateProjectModal onClose={() => setShowCreateModal(false)} userData={userData} />}
            {showInviteModal && <InviteModal onClose={() => setShowInviteModal(false)} inviteCode={userData?.referral_code || ''} />}
            {showBackendUsageModal && <BackendUsageModal onClose={() => setShowBackendUsageModal(false)} />}

            {/* Footer */}
            <footer className="py-12 border-t border-white/5 text-center mt-20 opacity-30">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Zap size={16} fill="currentColor" className="text-orange-500" />
                    <span className="font-bold text-sm tracking-tighter">HEFTCODER ENGINE v2.1</span>
                </div>
                <p className="text-[10px] font-mono">ENCRYPT_SESSION: OK | AUTH_TOKEN: ACTIVE</p>
            </footer>
        </div>
    );
}
