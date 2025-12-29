import { Link } from 'react-router-dom';
import { Zap, ArrowLeft } from 'lucide-react';

export default function Terms() {
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

            <main className="max-w-3xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
                <p className="text-gray-400 mb-8">Last updated: December 2025</p>

                <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>By accessing and using HEFTCoder, you accept and agree to be bound by these Terms of Service.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. Use of Service</h2>
                        <p>You may use our services only as permitted by law and in accordance with these Terms. You are responsible for all activity that occurs under your account.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Intellectual Property</h2>
                        <p>You retain ownership of any code and content you create using HEFTCoder. We do not claim ownership of your projects.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Termination</h2>
                        <p>We may terminate or suspend your account at any time for violations of these Terms or for any other reason at our discretion.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">5. Contact</h2>
                        <p>For questions about these Terms, please contact us at legal@heftcoder.icu</p>
                    </section>
                </div>
            </main>
        </div>
    );
}
