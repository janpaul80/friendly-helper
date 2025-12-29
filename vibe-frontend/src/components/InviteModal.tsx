import { X, Copy, Heart, Check } from 'lucide-react';
import { useState } from 'react';

interface InviteModalProps {
    onClose: () => void;
    inviteCode?: string;
}

export function InviteModal({ onClose, inviteCode }: InviteModalProps) {
    const [copied, setCopied] = useState(false);
    const inviteLink = inviteCode
        ? `https://heftcoder.icu/invite/${inviteCode}`
        : "https://heftcoder.icu/invite/M09MTX...";

    const handleCopy = () => {
        navigator.clipboard.writeText(inviteLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-[#121212] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden p-8 text-center">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg"
                >
                    <X size={20} />
                </button>

                <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center text-green-500">
                        <Heart size={32} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Invite to get credits</h2>
                <p className="text-gray-400 mb-6">
                    Share your invitation link, get <span className="text-white font-bold">200 free credits</span> for every friend who signs up.
                </p>

                <div className="inline-block px-4 py-1 bg-white/5 rounded-full text-xs text-gray-400 mb-8 border border-white/5">
                    Monthly invites: 0/10
                </div>

                <div className="text-left mb-2">
                    <label className="text-sm font-medium text-white">Share your invitation link</label>
                </div>
                <div className="flex gap-2">
                    <div className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-gray-400 text-sm truncate font-mono">
                        {inviteLink}
                    </div>
                    <button
                        onClick={handleCopy}
                        className="bg-[#2a3a2a] hover:bg-[#344634] text-green-400 border border-green-500/30 px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? 'Copied' : 'Copy link'}
                    </button>
                </div>
            </div>
        </div>
    );
}
