"use client";
import { Header } from '@/components/marketing/Header';
import { Footer } from '@/components/marketing/Footer';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30">
            <Header />

            <main className="pt-40 pb-24 px-6 max-w-3xl mx-auto relative z-10">
                <h1 className="text-4xl md:text-5xl font-black mb-8 tracking-tighter">Terms of Service</h1>
                <p className="text-gray-500 mb-12 font-medium uppercase tracking-widest text-xs">Last updated: December 2025</p>

                <div className="prose prose-invert max-w-none space-y-12 text-gray-400">
                    <section className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl hover:border-white/10 transition-colors">
                        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight outline-none">1. Acceptance of Terms</h2>
                        <p className="leading-relaxed text-lg">
                            By accessing and using HEFTCoder, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, you must not access or use the platform.
                        </p>
                    </section>

                    <section className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl hover:border-white/10 transition-colors">
                        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight outline-none">2. Use of Service</h2>
                        <p className="leading-relaxed text-lg">
                            You may use our services only as permitted by law and in accordance with these Terms. You are responsible for all activity that occurs under your account, including the actions of any AI agents initialized under your session.
                        </p>
                    </section>

                    <section className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl hover:border-white/10 transition-colors">
                        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight outline-none">3. Intellectual Property</h2>
                        <p className="leading-relaxed text-lg">
                            You retain ownership of any code and content you create using HEFTCoder. We do not claim ownership of your projects. However, by using the service, you grant us a limited license to host and process your data to fulfill your requests.
                        </p>
                    </section>

                    <section className="bg-[#111] border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl hover:border-white/10 transition-colors">
                        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight outline-none">4. Credits & Payments</h2>
                        <p className="leading-relaxed text-lg">
                            HeftCredits are consumption-based units required to run AI models. Credits are non-refundable and expire at the end of each billing cycle unless specified otherwise by your plan.
                        </p>
                    </section>

                    <section className="text-center py-12">
                        <h2 className="text-2xl font-bold text-white mb-6 outline-none">Legal Contact</h2>
                        <p className="mb-4">For formal legal inquiries, please contact us at:</p>
                        <a href="mailto:legal@heftcoder.icu" className="text-orange-500 hover:text-orange-400 font-black text-xl tracking-tight transition-colors">
                            legal@heftcoder.icu
                        </a>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
}
