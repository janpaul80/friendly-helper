"use client";
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';
import { Shield, Lock, Eye, Server, Zap, CheckCircle } from 'lucide-react';

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30">
            <Header />

            <main className="pt-40 pb-24 px-6 max-w-5xl mx-auto relative z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tighter bg-gradient-to-br from-white to-gray-500 bg-clip-text text-transparent">
                        Enterprise Security
                    </h1>
                    <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
                        Your code and data are protected by industry-leading security protocols.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {[
                        { icon: Lock, title: 'End-to-End Encryption', desc: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We utilize hardware security modules for key management.' },
                        { icon: Shield, title: 'SOC 2 Type II Compliant', desc: 'Our processes and infrastructure are rigorously audited to meet the highest standards for security, availability, and confidentiality.' },
                        { icon: Eye, title: 'Privacy First Architecture', desc: 'Your code is private by default. We operate in a Zero-Knowledge environment where only authorized agents and you have access to source code.' },
                        { icon: Server, title: 'Hardened Infrastructure', desc: 'Isolated container execution for all AI agent tasks ensures that your build environments are clean, secure, and ephemeral.' },
                    ].map((item) => (
                        <div key={item.title} className="p-10 bg-[#111] border border-white/5 rounded-3xl hover:border-orange-500/20 transition-all shadow-xl">
                            <item.icon className="w-12 h-12 text-orange-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-4 tracking-tight">{item.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-[#121212] border border-white/10 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-transparent opacity-50" />
                    <div className="relative z-10">
                        <CheckCircle size={64} className="text-orange-500 mx-auto mb-8" />
                        <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Vulnerability Disclosure</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
                            We value the contribution of security researchers. If you believe you have found a security vulnerability in HEFTCoder, please report it immediately to our security team.
                        </p>
                        <a href="mailto:security@heftcoder.icu" className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-10 py-5 rounded-2xl font-black text-lg border border-white/10 transition-all">
                            security@heftcoder.icu
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
