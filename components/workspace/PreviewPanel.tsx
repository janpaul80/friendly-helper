"use client";

import { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Share2 } from 'lucide-react';
import { SandpackPreview } from "@codesandbox/sandpack-react";

interface PreviewPanelProps {
    isBuilding: boolean;
    isReady: boolean;
    port?: number;
    error?: string;
    buildStatus?: string;
}

export function PreviewPanel({ isBuilding, isReady, port, error, buildStatus }: PreviewPanelProps) {
    const [dots, setDots] = useState('');

    // Animated dots for loading state
    useEffect(() => {
        if (isBuilding) {
            const interval = setInterval(() => {
                setDots(prev => prev.length >= 3 ? '' : prev + '.');
            }, 500);
            return () => clearInterval(interval);
        }
    }, [isBuilding]);

    // Default State: No app running
    if (!isBuilding && !isReady && !error) {
        return (
            <div className="h-full bg-[#0f0f0f] flex flex-col items-center justify-center">
                {/* HashCoder Logo Static */}
                <div className="relative mb-6">
                    <div className="h-16 w-16 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_25px_rgba(234,88,12,0.3)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap">
                            <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                        </svg>
                    </div>
                </div>

                {/* Status Text */}
                <h3 className="text-white text-lg font-medium mb-2">HashCoder IDE</h3>
                <p className="text-gray-500 text-sm">Ready to build something amazing</p>

                {/* Subtle Animation */}
                <div className="mt-8 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500/50 animate-pulse" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-orange-500/50 animate-pulse" style={{ animationDelay: '200ms' }} />
                    <div className="w-2 h-2 rounded-full bg-orange-500/50 animate-pulse" style={{ animationDelay: '400ms' }} />
                </div>
            </div>
        );
    }

    // Building State
    if (isBuilding) {
        return (
            <div className="h-full bg-[#0f0f0f] flex flex-col items-center justify-center">
                {/* Correct HeftCoder Logo */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-orange-600/20 blur-[60px] rounded-full" />
                    <div className="relative transform scale-150">
                        <div className="h-12 w-12 bg-orange-600 rounded-xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(234,88,12,0.4)] animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap">
                                <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Build Status */}
                <h3 className="text-white text-xl font-bold mb-2 tracking-tight">
                    HeftCoder is building{dots}
                </h3>
                <p className="text-gray-500 text-sm max-w-md text-center flex flex-col items-center gap-1">
                    <span className="font-mono text-xs text-orange-500/80">{buildStatus || 'Initializing environment...'}</span>
                </p>

                {/* Progress Indicators - HIDDEN for cleaner look, text update above is sufficient */}
                <div className="hidden mt-8 w-64 space-y-2">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span>Dependencies installed</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                        <Loader2 className="w-3 h-3 animate-spin text-orange-500" />
                        <span>Compiling application...</span>
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="h-full bg-[#0f0f0f] flex flex-col items-center justify-center p-8">
                <div className="bg-red-950/20 border border-red-900 rounded-lg p-6 max-w-md">
                    <div className="flex items-center gap-3 mb-4">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                        <h3 className="text-white font-medium">Build Failed</h3>
                    </div>
                    <pre className="text-xs text-red-400 font-mono whitespace-pre-wrap">
                        {error}
                    </pre>
                </div>
            </div>
        );
    }

    // Ready State: Show iframe
    if (isReady && port) {
        return (
            <div className="h-full bg-white flex flex-col">
                <div className="h-10 bg-[#f3f4f6] flex items-center px-4 gap-2 border-b border-gray-200">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <div className="flex-1 bg-white mx-4 rounded-md text-[11px] text-center py-1 text-gray-400 font-mono border border-gray-200 shadow-sm overflow-hidden truncate">
                        vibe-preview.heftcoder.app
                    </div>
                    <button className="p-1.5 hover:bg-gray-200 rounded text-gray-500">
                        <Share2 className="w-3.5 h-3.5" />
                    </button>
                </div>
                <div className="flex-1 preview-container relative">
                    <SandpackPreview
                        showNavigator={false}
                        showOpenInCodeSandbox={false}
                        showRefreshButton={false}
                        className="h-full w-full"
                    />
                </div>
            </div>
        );
    }

    // Fallback
    return (
        <div className="h-full bg-[#0f0f0f] flex items-center justify-center">
            <p className="text-gray-500 text-sm">Initializing...</p>
        </div>
    );
}
