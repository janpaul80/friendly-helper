"use client";
import Link from "next/link";
import { Zap, Sparkles } from "lucide-react";
import { useClerk, UserButton, SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs";

export function Header() {
    const { openSignIn, openSignUp } = useClerk();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-8">
                <Link href="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center text-white font-bold shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <span className="text-white font-bold text-xl tracking-tight">HeftCoder</span>
                </Link>
                <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-400">
                    <Link href="/#features" className="hover:text-white transition-colors">Products</Link>
                    <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="/referrals" className="hover:text-white transition-colors">Referrals</Link>
                </nav>
            </div>
            <div className="flex items-center space-x-4">
                <SignedIn>
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </SignedIn>
                <SignedOut>
                    <div className="flex items-center gap-4 text-sm font-medium">
                        <SignInButton mode="modal">
                            <button className="text-gray-400 hover:text-white transition-colors">
                                Log in
                            </button>
                        </SignInButton>
                        <SignUpButton mode="modal">
                            <button className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-lg font-bold transition-all hover:scale-105 shadow-[0_0_15px_rgba(234,88,12,0.2)]">
                                Sign up
                            </button>
                        </SignUpButton>
                    </div>
                </SignedOut>
            </div>
        </header>
    );
}
