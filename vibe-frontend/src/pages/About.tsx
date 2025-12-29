import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, Globe } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-8">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center text-black font-bold">
                            <Zap size={20} fill="currentColor" />
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">HeftCoder</span>
                    </Link>
                </div>
                <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>
            </header>

            {/* Content */}
            <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
                <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    About HEFTCoder
                </h1>

                <div className="prose prose-invert prose-lg max-w-none">
                    <p className="text-xl text-gray-300 mb-12 leading-relaxed">
                        HEFTCoder is the AI-powered development environment that transforms the way software is built.
                        We believe that creating applications should be as natural as describing them.
                    </p>

                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4">Our Vision</h2>
                        <p className="text-gray-400 leading-relaxed">
                            We're building the future where anyone with an idea can bring it to life through simple conversation.
                            No coding expertise required. Just describe what you want, and watch as AI transforms your vision into
                            fully functional applications — in minutes, not months.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        <div className="bg-[#121212] border border-white/10 rounded-2xl p-8">
                            <h3 className="text-xl font-semibold text-white mb-4">What We Do</h3>
                            <ul className="space-y-3 text-gray-400">
                                <li className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                                    <span>AI-powered vibe coding that understands natural language</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                                    <span>Instant app creation from simple descriptions</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                                    <span>Intelligent agents that write, test, and deploy code</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                                    <span>Seamless collaboration between humans and AI</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-[#121212] border border-white/10 rounded-2xl p-8">
                            <h3 className="text-xl font-semibold text-white mb-4">Our Technology</h3>
                            <ul className="space-y-3 text-gray-400">
                                <li className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                                    <span>Multi-model AI architecture (Claude, GPT, Gemini, Qwen)</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                                    <span>Real-time code generation and preview</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                                    <span>Secure cloud execution and deployment</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                                    <span>Enterprise-grade security and compliance</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500/10 to-purple-500/10 border border-orange-500/20 rounded-2xl p-8 mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-6">Leadership</h2>
                        <div className="flex items-start gap-6">
                            <div className="h-20 w-20 bg-orange-500 rounded-full flex items-center justify-center text-3xl font-bold text-black flex-shrink-0">
                                JP
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-white">Jean-Paul Hartmann</h3>
                                <p className="text-orange-400 font-medium mb-3">CEO & Founder</p>
                                <p className="text-gray-400 leading-relaxed">
                                    A visionary technologist with a passion for democratizing software creation.
                                    Jean-Paul founded HEFTCoder with the belief that the future of development lies in
                                    the seamless collaboration between human creativity and artificial intelligence.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-8 mb-12">
                        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-3">
                            <Globe className="text-orange-500" />
                            Global Presence
                        </h2>
                        <p className="text-gray-400 mb-6">
                            HEFTCoder operates globally with headquarters in:
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4">
                                <span className="text-4xl">🇩🇪</span>
                                <div>
                                    <p className="text-white font-semibold">Germany</p>
                                    <p className="text-gray-500 text-sm">European Operations</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-4xl">🇪🇨</span>
                                <div>
                                    <p className="text-white font-semibold">Ecuador</p>
                                    <p className="text-gray-500 text-sm">Americas Operations</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-white mb-4">Ready to Build?</h2>
                        <p className="text-gray-400 mb-8">
                            Join thousands of innovators who are already creating with HEFTCoder.
                        </p>
                        <Link
                            to="/login?mode=signup"
                            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-black px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105"
                        >
                            Start Building Free
                            <Zap size={20} fill="currentColor" />
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t border-white/5 bg-[#050505] text-center py-8 text-sm text-gray-600">
                © 2025 HeftCoder. All rights reserved.
            </footer>
        </div>
    );
}
