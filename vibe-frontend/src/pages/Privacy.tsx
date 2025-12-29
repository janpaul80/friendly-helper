import { Link } from 'react-router-dom';
import { Zap, ArrowLeft } from 'lucide-react';

export default function Privacy() {
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
                <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
                <p className="text-gray-400 mb-8">Last updated: December 2025</p>

                <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
                        <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
                        <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
                        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
                        <p>If you have questions about this Privacy Policy, please contact us at privacy@heftcoder.icu</p>
                    </section>
                </div>
            </main>
        </div>
    );
}
