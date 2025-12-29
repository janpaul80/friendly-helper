import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, Shield, Lock, Eye, Server } from 'lucide-react';

export default function Security() {
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
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Security</h1>
                <p className="text-xl text-gray-400 text-center mb-16">Your data security is our top priority</p>

                <div className="grid md:grid-cols-2 gap-8">
                    {[
                        { icon: Lock, title: 'End-to-End Encryption', desc: 'All data is encrypted in transit and at rest using AES-256 encryption' },
                        { icon: Shield, title: 'SOC 2 Compliant', desc: 'We meet the highest standards for security, availability, and confidentiality' },
                        { icon: Eye, title: 'Privacy First', desc: 'Your code is private by default. We never train on your data without consent' },
                        { icon: Server, title: 'Secure Infrastructure', desc: 'Hosted on enterprise-grade infrastructure with 99.9% uptime guarantee' },
                    ].map((item) => (
                        <div key={item.title} className="p-6 bg-[#121212] border border-white/5 rounded-xl">
                            <item.icon className="w-10 h-10 text-orange-500 mb-4" />
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            <p className="text-gray-400">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-400 mb-4">Have security concerns?</p>
                    <a href="mailto:security@heftcoder.icu" className="text-orange-500 hover:text-orange-400 font-semibold">
                        security@heftcoder.icu
                    </a>
                </div>
            </main>
        </div>
    );
}
