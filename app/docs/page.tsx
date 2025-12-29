"use client";
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Book, Lightbulb, Code, Search, Zap, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30">
            <Header />

            <main className="pt-40 pb-24 px-6 max-w-5xl mx-auto relative z-10">
                <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-orange-900/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
                        Documentation
                    </h1>
                    <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
                        Everything you need to build, deploy, and scale with HEFTCoder.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {[
                        { icon: Book, title: 'Getting Started', desc: 'Create your first AI-powered project in under 5 minutes.', link: '#', color: 'text-blue-400' },
                        { icon: Lightbulb, title: 'Tutorials', desc: 'Step-by-step guides for complex enterprise architectures.', link: '#', color: 'text-orange-500' },
                        { icon: Code, title: 'API Reference', desc: 'Complete documentation for the HEFTCoder engine.', link: '/api', color: 'text-purple-400' },
                    ].map((item) => (
                        <Link
                            key={item.title}
                            href={item.link}
                            className="group p-8 bg-[#111] border border-white/5 rounded-3xl hover:border-orange-500/30 transition-all shadow-xl hover:translate-y-[-4px]"
                        >
                            <item.icon className={`w-12 h-12 ${item.color} mb-6 transition-transform group-hover:scale-110`} />
                            <h3 className="text-xl font-bold mb-3 group-hover:text-white transition-colors">{item.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed mb-6">{item.desc}</p>
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-orange-500 group-hover:gap-3 transition-all">
                                Explore Docs <ChevronRight size={14} />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 md:p-12">
                    <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                        <Zap size={24} className="text-orange-500" fill="currentColor" />
                        Quick Start Guide
                    </h2>
                    <div className="space-y-8">
                        {[
                            { step: '01', title: 'Connect your workspace', desc: 'Link your GitHub or local environment to HEFTCoder in seconds.' },
                            { step: '02', title: 'Describe your vision', desc: 'Use natural language to tell our AI agents what you want to build.' },
                            { step: '03', title: 'Orchestrate & Build', desc: 'Watch as our elite models architect, code, and test your app in real-time.' },
                        ].map((s) => (
                            <div key={s.step} className="flex gap-6 items-start">
                                <span className="text-4xl font-black text-white/5 select-none">{s.step}</span>
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-2">{s.title}</h4>
                                    <p className="text-gray-400 leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
