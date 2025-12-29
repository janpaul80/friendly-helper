"use client";
import Link from 'next/link';
import { Zap, ArrowLeft, Globe } from 'lucide-react';
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30">
            <Header />

            <main className="pt-40 pb-20 px-6 max-w-4xl mx-auto relative z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/5 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />

                <h1 className="text-5xl md:text-6xl font-black mb-8 tracking-tighter bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">
                    About HEFTCoder
                </h1>

                <div className="space-y-12">
                    <p className="text-xl text-gray-400 leading-relaxed font-light">
                        HEFTCoder is the AI-powered development engine that transforms the way software is built.
                        We believe that creating applications should be as natural as describing them.
                    </p>

                    <div className="bg-[#121212] border border-white/5 rounded-3xl p-8 md:p-12 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Our Vision</h2>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            We're building the future where anyone with an idea can bring it to life through simple conversation.
                            No coding expertise required. Just describe what you want, and watch as AI transforms your vision into
                            fully functional applications — in minutes, not months.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-[#111] border border-white/5 rounded-3xl p-8 hover:border-orange-500/20 transition-all group">
                            <h3 className="text-xl font-bold text-white mb-6 group-hover:text-orange-500 transition-colors">What We Do</h3>
                            <ul className="space-y-4 text-gray-400">
                                {[
                                    'AI-powered vibe coding that understands natural language',
                                    'Instant app creation from simple descriptions',
                                    'Intelligent agents that write, test, and deploy code',
                                    'Seamless collaboration between humans and AI'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Zap className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" fill="currentColor" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-[#111] border border-white/5 rounded-3xl p-8 hover:border-orange-500/20 transition-all group">
                            <h3 className="text-xl font-bold text-white mb-6 group-hover:text-orange-500 transition-colors">Our Technology</h3>
                            <ul className="space-y-4 text-gray-400">
                                {[
                                    'Multi-model AI architecture (Claude, GPT, Gemini, Qwen)',
                                    'Real-time code generation and preview',
                                    'Secure cloud execution and deployment',
                                    'Enterprise-grade security and compliance'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <Zap className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" fill="currentColor" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-600/20 to-transparent border border-orange-500/20 rounded-3xl p-8 md:p-12">
                        <h2 className="text-2xl font-bold text-white mb-8">Leadership</h2>
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            <div className="h-24 w-24 bg-orange-600 rounded-2xl flex items-center justify-center text-4xl font-black text-white shadow-2xl">
                                JP
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Jean-Paul Hartmann</h3>
                                <p className="text-orange-500 font-bold mb-4 uppercase tracking-[0.2em] text-xs">CEO & Founder</p>
                                <p className="text-gray-400 leading-relaxed">
                                    A visionary technologist with a passion for democratizing software creation.
                                    Jean-Paul founded HEFTCoder with the belief that the future of development lies in
                                    the seamless collaboration between human creativity and artificial intelligence.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-12">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Globe size={28} className="text-orange-600" />
                            Global Presence
                        </h2>
                        <p className="text-gray-400 mb-8 max-w-xl">
                            HEFTCoder operates globally with strategic headquarters serving our users across continents.
                        </p>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-5xl">🇩🇪</span>
                                <div>
                                    <p className="text-white font-bold text-lg">Germany</p>
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">European Operations</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-5xl">🇪🇨</span>
                                <div>
                                    <p className="text-white font-bold text-lg">Ecuador</p>
                                    <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Americas Operations</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center py-12">
                        <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Ready to Build?</h2>
                        <p className="text-gray-500 mb-10 max-w-md mx-auto">
                            Join thousands of innovators who are already creating with HEFTCoder.
                        </p>
                        <Link
                            href="/login?mode=signup"
                            className="inline-flex items-center gap-3 bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(234,88,12,0.3)]"
                        >
                            Start Building Now
                            <Zap size={22} fill="currentColor" />
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
