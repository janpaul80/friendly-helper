"use client";
import { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';

interface InviteModalProps {
    onClose: () => void;
    inviteCode: string;
}

export function InviteModal({ onClose, inviteCode }: InviteModalProps) {
    const [copied, setCopied] = useState(false);
    const referralLink = `https://heftcoder.icu?ref=${inviteCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans">
            <div className="bg-[#0F1117] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
                {/* Header Decoration */}
                <div className="h-2 bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500" />

                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-1">Refer & Earn</h2>
                            <p className="text-gray-400 text-sm">Grow the community and get rewarded.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-white transition-colors p-1"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-8">
                        <div className="flex items-center gap-3 text-orange-500 mb-2">
                            <Share2 size={18} />
                            <span className="font-bold text-sm">Referral Bonus</span>
                        </div>
                        <p className="text-white text-sm font-medium leading-relaxed">
                            Earn <span className="text-orange-500 font-bold">200 HeftCredits</span> for every friend who joins HEFTCoder and upgrades to a paid plan.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Your Personal Link
                        </label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-[#16181D] border border-white/5 rounded-xl px-4 py-3 text-sm text-gray-400 truncate font-mono">
                                {referralLink}
                            </div>
                            <button
                                onClick={handleCopy}
                                className={`h-[46px] px-6 rounded-xl flex items-center justify-center transition-all ${copied ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-gray-200'}`}
                            >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5">
                        <div className="flex justify-between items-center text-xs text-gray-500 px-1">
                            <span>No limit on referrals</span>
                            <span>Earned: 0 credits</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
