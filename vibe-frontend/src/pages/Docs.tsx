import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, Book, Code, Lightbulb } from 'lucide-react';

export default function Docs() {
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
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Documentation</h1>
                <p className="text-xl text-gray-400 text-center mb-16">Learn how to build with HEFTCoder</p>

                <div className="space-y-6">
                    {[
                        { icon: Book, title: 'Getting Started', desc: 'Create your first project in under 5 minutes', link: '#' },
                        { icon: Lightbulb, title: 'Tutorials', desc: 'Step-by-step guides for common use cases', link: '#' },
                        { icon: Code, title: 'API Reference', desc: 'Complete API documentation and examples', link: '/api' },
                    ].map((item) => (
                        <Link key={item.title} to={item.link} className="flex items-center gap-6 p-6 bg-[#121212] border border-white/5 rounded-xl hover:border-orange-500/30 transition-all">
                            <item.icon className="w-12 h-12 text-orange-500" />
                            <div>
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="text-gray-400">{item.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
