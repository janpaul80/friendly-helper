"use client";
import { X, Shield, Lock, Server } from 'lucide-react';

interface BackendUsageModalProps {
    onClose: () => void;
}

export function BackendUsageModal({ onClose }: BackendUsageModalProps) {
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 font-sans">
            <div className="bg-[#0F1117] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-8">
                    <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-400">
                                <Server size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Backend Usage</h2>
                                <p className="text-gray-400 text-sm">Enterprise infrastructure status</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-white transition-colors p-1"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-[#16181D] border border-white/5 rounded-xl p-4">
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Active Projects</span>
                                <div className="text-2xl font-bold text-white">0 / 1</div>
                            </div>
                            <div className="bg-[#16181D] border border-white/5 rounded-xl p-4">
                                <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Server Region</span>
                                <div className="text-sm font-bold text-white">US-East (Vercel)</div>
                            </div>
                        </div>

                        <div className="bg-blue-600/5 border border-blue-500/10 rounded-xl p-5 flex items-start gap-4">
                            <Shield className="text-blue-500 shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="text-blue-400 font-bold text-sm mb-1">Compute Isolation</h4>
                                <p className="text-gray-400 text-xs leading-relaxed">
                                    Your backend services are running in a dedicated isolated environment. Upgrade to Enterprise for multi-region failover.
                                </p>
                            </div>
                        </div>

                        <div className="bg-yellow-600/5 border border-yellow-500/10 rounded-xl p-5 flex items-start gap-4">
                            <Lock className="text-yellow-500 shrink-0 mt-1" size={20} />
                            <div>
                                <h4 className="text-yellow-400 font-bold text-sm mb-1">Advanced Analytics Locked</h4>
                                <p className="text-gray-400 text-xs leading-relaxed">
                                    Real-time log streaming and database inspection require a Pro or Enterprise subscription.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/5 flex justify-end">
                        <button
                            onClick={onClose}
                            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
