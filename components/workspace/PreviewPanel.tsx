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
                {/* HashCoder Logo with Glow */}
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-orange-500/20 blur-3xl rounded-full animate-pulse" />
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-600 to-orange-400 flex items-center justify-center">
                            <span className="text-4xl font-bold text-white">HC</span>
                        </div>
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
                {/* Spinning Logo / Solar Icon */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-orange-500/20 blur-[50px] rounded-full" />
                    <div className="relative w-24 h-24 flex items-center justify-center">
                        <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-pulse"></div>
                        <div className="w-16 h-16 bg-gradient-to-t from-orange-600 to-orange-400 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/30">
                            <div className="w-16 h-8 bg-white/10 rounded-t-full absolute top-0" />
                            {/* Horizontal Lines for "Sun" effect */}
                            <div className="w-full h-full flex flex-col justify-center items-center gap-1.5 opacity-40">
                                <div className="w-10 h-1 bg-black/20 rounded-full" />
                                <div className="w-12 h-1 bg-black/20 rounded-full" />
                                <div className="w-8 h-1 bg-black/20 rounded-full" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Build Status */}
                <h3 className="text-white text-lg font-medium mb-2 tracking-wide">
                    Building your idea{dots}
                </h3>
                <p className="text-gray-400 text-sm max-w-md text-center flex flex-col items-center gap-2">
                    <span>{buildStatus || 'Preparing your application'}</span>
                    <span className="text-xs text-gray-600 mt-4">Did you know?</span>
                    <span className="text-xs text-gray-500">Brainstorm ideas in Discussion Mode at 0.3 credits per request</span>
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
