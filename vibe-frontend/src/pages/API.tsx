import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, Code, Terminal, Database, Server } from 'lucide-react';

export default function API() {
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

            <main className="max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">API Reference</h1>
                <p className="text-xl text-gray-400 text-center mb-16">Integrate HEFTCoder into your applications</p>

                <div className="bg-[#121212] border border-white/5 rounded-xl p-6 mb-8">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Terminal size={20} className="text-orange-500" /> Base URL
                    </h3>
                    <code className="block bg-black/50 p-4 rounded-lg text-green-400 font-mono text-sm">
                        https://heftcoder.icu/api/v1
                    </code>
                </div>

                <div className="space-y-6">
                    {[
                        { method: 'POST', endpoint: '/agent/run', desc: 'Execute an AI agent task' },
                        { method: 'GET', endpoint: '/projects', desc: 'List all projects' },
                        { method: 'POST', endpoint: '/projects', desc: 'Create a new project' },
                        { method: 'GET', endpoint: '/projects/:id', desc: 'Get project details' },
                    ].map((api) => (
                        <div key={api.endpoint} className="p-4 bg-[#121212] border border-white/5 rounded-xl">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${api.method === 'GET' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {api.method}
                                </span>
                                <code className="text-orange-400 font-mono">{api.endpoint}</code>
                            </div>
                            <p className="text-gray-400 text-sm">{api.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
