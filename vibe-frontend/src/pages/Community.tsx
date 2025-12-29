import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, MessageSquare, Users, Github } from 'lucide-react';

export default function Community() {
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
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Community</h1>
                <p className="text-xl text-gray-400 text-center mb-16">Connect with fellow builders</p>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { icon: MessageSquare, title: 'Discord', desc: 'Join our Discord server for real-time chat', link: 'https://discord.gg/heftcoder', color: 'bg-indigo-500' },
                        { icon: Github, title: 'GitHub', desc: 'Contribute to open-source projects', link: 'https://github.com/heftcoder', color: 'bg-gray-600' },
                        { icon: Users, title: 'Forum', desc: 'Discuss ideas and get help', link: '#', color: 'bg-orange-500' },
                    ].map((item) => (
                        <a key={item.title} href={item.link} target="_blank" rel="noopener noreferrer" className="p-6 bg-[#121212] border border-white/5 rounded-xl hover:border-orange-500/30 transition-all text-center">
                            <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                                <item.icon size={28} className="text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.desc}</p>
                        </a>
                    ))}
                </div>
            </main>
        </div>
    );
}
