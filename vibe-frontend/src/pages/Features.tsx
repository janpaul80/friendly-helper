import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, FileText, Cpu, Globe, Shield, Lock, Sparkles, Code, Layers } from 'lucide-react';

export default function Features() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center text-black font-bold">
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <span className="font-bold text-xl">HeftCoder</span>
                </Link>
                <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={18} /> Back to Home
                </Link>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Features</h1>
                <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
                    Everything you need to build production-ready applications with AI
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                        { icon: Sparkles, title: 'AI-Powered Development', desc: 'Build apps through natural conversation with advanced AI agents' },
                        { icon: Code, title: 'Multi-Language Support', desc: 'Python, JavaScript, TypeScript, React, and more' },
                        { icon: Globe, title: 'Instant Deployment', desc: 'Deploy to production with a single click' },
                        { icon: Layers, title: 'Full-Stack Capabilities', desc: 'Frontend, backend, database, and APIs all in one' },
                        { icon: Shield, title: 'Enterprise Security', desc: 'SOC2 compliant with end-to-end encryption' },
                        { icon: Cpu, title: 'Advanced AI Models', desc: 'Access to Claude, GPT, Gemini, and more' },
                    ].map((feature) => (
                        <div key={feature.title} className="p-6 bg-[#121212] border border-white/5 rounded-xl hover:border-orange-500/30 transition-all">
                            <feature.icon className="w-10 h-10 text-orange-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
