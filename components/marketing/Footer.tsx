"use client";
import Link from "next/link";
import { Zap, Github } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-[#050505] text-gray-500 py-16 px-6">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center mb-6 gap-2">
                        <div className="h-6 w-6 bg-orange-600 rounded flex items-center justify-center text-white">
                            <Zap size={14} fill="currentColor" />
                        </div>
                        <span className="text-white font-bold text-lg tracking-tighter">HeftCoder</span>
                    </div>
                    <p className="text-sm leading-relaxed max-w-xs">
                        Autonomous AI development engine for shipping production-ready apps at the speed of thought.
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Product</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/#features" className="hover:text-orange-500 transition-colors">Features</Link></li>
                        <li><Link href="/#pricing" className="hover:text-orange-500 transition-colors">Pricing</Link></li>
                        <li><Link href="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Resources</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/docs" className="hover:text-orange-500 transition-colors">Documentation</Link></li>
                        <li><Link href="/api-reference" className="hover:text-orange-500 transition-colors">API Reference</Link></li>
                        <li><Link href="/community" className="hover:text-orange-500 transition-colors">Community</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Legal</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
                        <li><Link href="/security" className="hover:text-orange-500 transition-colors">Security</Link></li>
                    </ul>
                </div>
            </div>
            <div className="max-w-6xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                <p>© 2025 HeftCoder. Built for the VIBE era.</p>
                <div className="flex gap-6">
                    <a href="https://github.com/heftcoder" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                        <Github className="w-4 h-4" />
                    </a>
                    <span className="hover:text-white cursor-pointer transition-colors">Twitter / X</span>
                </div>
            </div>
        </footer>
    );
}
