"use client";
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { MessageSquare, Users, Github, Zap, ExternalLink, Globe } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30">
            <Header />

            <main className="pt-40 pb-24 px-6 max-w-5xl mx-auto relative z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
                        Community
                    </h1>
                    <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
                        Connect with fellow builders and help shape the future of HEFTCoder.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {[
                        { icon: MessageSquare, title: 'Discord', desc: 'Join our vibrant server for real-time support and chat.', link: 'https://discord.gg/heftcoder', color: 'bg-indigo-600' },
                        { icon: Github, title: 'GitHub', desc: 'Contribute to open-source tools and view our examples.', link: 'https://github.com/heftcoder', color: 'bg-gray-800' },
                        { icon: Users, title: 'Forum', desc: 'Deep-dive into discussions, feature requests, and help.', link: '#', color: 'bg-orange-600' },
                    ].map((item) => (
                        <a
                            key={item.title}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-8 bg-[#111] border border-white/5 rounded-3xl hover:border-orange-500/30 transition-all shadow-xl hover:translate-y-[-4px] text-center"
                        >
                            <div className={`w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform`}>
                                <item.icon size={32} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{item.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.desc}</p>
                            <div className="flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-orange-500">
                                Join Now <ExternalLink size={14} />
                            </div>
                        </a>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center bg-[#121212] border border-white/5 rounded-3xl p-8 md:p-12 overflow-hidden relative">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-orange-600/5 blur-[80px] rounded-full -mr-32 -mt-32" />
                    <div>
                        <h2 className="text-3xl font-black text-white mb-6 tracking-tight">VIBE Coding Hackathon</h2>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            Every month we host a build-off where innovators compete to create the most impressive apps using HEFTCoder agents. $10,000 in credits up for grabs.
                        </p>
                        <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold border border-white/10 transition-all">
                            Register for Jan 2025 <ChevronRight size={18} />
                        </button>
                    </div>
                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-500 blur-[40px] opacity-20 animate-pulse" />
                            <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-2xl relative">
                                <Zap size={80} className="text-orange-500" fill="currentColor" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
