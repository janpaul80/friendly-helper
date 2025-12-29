"use client";
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30">
            <Header />

            <main className="pt-40 pb-24 px-6 max-w-3xl mx-auto relative z-10">
                <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter">Privacy Policy</h1>
                <p className="text-gray-500 mb-12 font-medium uppercase tracking-widest text-xs">Last updated: December 2025</p>

                <div className="prose prose-invert max-w-none space-y-12 text-gray-400">
                    <section className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight outline-none">1. Information We Collect</h2>
                        <p className="leading-relaxed text-lg">
                            We collect information you provide directly to us, such as when you create an account, use our autonomous AI agents, or contact us for support. This includes your name, email address, and any project-specific configurations you provide.
                        </p>
                    </section>

                    <section className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight outline-none">2. How We Use Your Information</h2>
                        <p className="leading-relaxed text-lg">
                            We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you. We utilize aggregated, anonymized data to train our internal routing models, ensuring peak performance for all users.
                        </p>
                    </section>

                    <section className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight outline-none">3. Data Security</h2>
                        <p className="leading-relaxed text-lg">
                            We implement enterprise-grade security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All data is encrypted using AES-256 standard at rest.
                        </p>
                    </section>

                    <section className="text-center py-12">
                        <h2 className="text-2xl font-bold text-white mb-6 outline-none">Contact Us</h2>
                        <p className="mb-4">If you have questions about this Privacy Policy, please contact our legal team:</p>
                        <a href="mailto:privacy@heftcoder.icu" className="text-orange-500 hover:text-orange-400 font-black text-xl tracking-tight transition-colors">
                            privacy@heftcoder.icu
                        </a>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
