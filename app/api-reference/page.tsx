"use client";
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Terminal, Code, Database, Server, Zap, ChevronRight, Copy } from 'lucide-react';
import Link from 'next/link';

export default function APIPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30">
            <Header />

            <main className="pt-40 pb-24 px-6 max-w-4xl mx-auto relative z-10">
                <div className="absolute top-[-10%] left-[1/2] w-[40%] h-[40%] bg-blue-900/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
                        API Reference
                    </h1>
                    <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
                        Powerful programmatic access to the HEFTCoder orchestration engine.
                    </p>
                </div>

                <div className="bg-[#121212] border border-white/10 rounded-3xl p-8 mb-12 shadow-2xl overflow-hidden group">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold flex items-center gap-3">
                            <Terminal size={22} className="text-orange-500" /> Base URL
                        </h3>
                        <button className="text-gray-600 hover:text-white transition-colors p-2 bg-white/5 rounded-lg">
                            <Copy size={16} />
                        </button>
                    </div>
                    <code className="block bg-black/80 p-6 rounded-2xl text-green-400 font-mono text-lg border border-white/5 shadow-inner">
                        https://api.heftcoder.icu/v1
                    </code>
                </div>

                <div className="space-y-6">
                    {[
                        { method: 'POST', endpoint: '/agent/run', desc: 'Execute an autonomous AI agent task with dynamic model routing.' },
                        { method: 'GET', endpoint: '/projects', desc: 'Retrieve a paginated list of all projects in your organization.' },
                        { method: 'POST', endpoint: '/projects', desc: 'Initialize a new project environment with custom boilerplate.' },
                        { method: 'GET', endpoint: '/projects/:id', desc: 'Fetch comprehensive project details, including file trees and state.' },
                    ].map((api) => (
                        <div key={api.endpoint} className="p-8 bg-[#111] border border-white/5 rounded-3xl hover:border-orange-500/20 transition-all hover:bg-[#151515] group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${api.method === 'GET' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                        {api.method}
                                    </span>
                                    <code className="text-orange-400 font-mono text-lg">{api.endpoint}</code>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                                    Auth Required
                                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                </div>
                            </div>
                            <p className="text-gray-500 leading-relaxed">{api.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 p-10 bg-gradient-to-br from-orange-600 to-orange-800 rounded-3xl shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                            <h2 className="text-3xl font-black text-white mb-4">Need an API Key?</h2>
                            <p className="text-white/80 max-w-sm">
                                Standard API access is available for all Pro and Studio plans. Enterprise users get dedicated nodes.
                            </p>
                        </div>
                        <Link href="/dashboard" className="bg-white text-orange-700 px-8 py-4 rounded-xl font-black transition-all hover:scale-105 shadow-2xl whitespace-nowrap">
                            Get Keys →
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
