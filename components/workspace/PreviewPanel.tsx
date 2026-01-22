"use client";

import React, { useState, useEffect } from 'react';
import { Share2, Zap, AlertCircle, Globe, Lock, ShieldCheck } from 'lucide-react';
import { SandpackPreview } from "@codesandbox/sandpack-react";
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface PreviewPanelProps {
    isBuilding: boolean;
    isReady: boolean;
    port?: number;
    error?: string;
    buildStatus?: string;
}

export default function PreviewPanel({ isBuilding, isReady, port, error, buildStatus }: PreviewPanelProps) {
    const [dots, setDots] = useState('');

    useEffect(() => {
        if (isBuilding) {
            const interval = setInterval(() => {
                setDots(prev => prev.length >= 3 ? '' : prev + '.');
            }, 500);
            return () => clearInterval(interval);
        }
    }, [isBuilding]);

    if (error) {
        return (
            <div className="h-full flex flex-col bg-background/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-destructive/20 shadow-2xl">
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6 border border-destructive/20">
                        <AlertCircle className="w-8 h-8 text-destructive" />
                    </div>
                    <h3 className="text-lg font-black text-foreground uppercase tracking-widest mb-2">Build Defunct</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-xs">{error}</p>
                    <button className="px-6 py-2 bg-muted hover:bg-muted/80 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">
                        Re-Manifest
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-background/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-border shadow-2xl relative group">
            {/* Browser Header / Navigation Bar */}
            <div className="h-14 bg-muted/30 backdrop-blur-md flex items-center px-4 gap-4 border-b border-border z-20 relative">
                <div className="flex items-center gap-1.5 min-w-[50px]">
                    <div className="w-3 h-3 rounded-full bg-red-500/20" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                    <div className="w-3 h-3 rounded-full bg-green-500/20" />
                </div>

                {/* URL Bar */}
                <div className="flex-1 max-w-xl mx-auto flex items-center gap-2 bg-background/50 rounded-xl py-1.5 px-4 text-xs font-medium text-muted-foreground border border-border shadow-inner">
                    <Lock className="w-3 h-3 text-green-500" />
                    <span className="truncate opacity-60">https://</span>
                    <span className="truncate font-bold text-foreground/80">vibe-manifest.heftcoder.app</span>
                    <div className="ml-auto opacity-40">
                        <Zap className="w-3 h-3" />
                    </div>
                </div>

                <div className="flex items-center gap-2 min-w-[50px] justify-end">
                    <button className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-all">
                        <Share2 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Main Preview Area */}
            <div className="flex-1 preview-container relative bg-white">
                <SandpackPreview
                    showNavigator={false}
                    showOpenInCodeSandbox={false}
                    showRefreshButton={false}
                    className="h-full w-full"
                />

                {/* Manifesting Overlay */}
                <div
                    className={cn(
                        "absolute inset-0 bg-[#050505] z-30 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out px-12 text-center",
                        (isBuilding || !isReady) ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none scale-105 blur-2xl'
                    )}
                >
                    {/* Background Vibe */}
                    <Image
                        src="/assets/wave-speech.jpg"
                        alt="bg"
                        fill
                        className="object-cover opacity-5 mix-blend-overlay"
                    />

                    <div className="relative z-10 w-full max-w-xs">
                        <div className="w-24 h-24 mx-auto relative mb-12">
                            <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full animate-pulse" />
                            <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-primary/60 p-[1px] shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)] animate-bounce duration-[2000ms]">
                                <div className="absolute inset-0 bg-black rounded-[23px]" />
                                <Image
                                    src="/assets/hc-icon.png"
                                    alt="HeftCoder"
                                    width={96}
                                    height={96}
                                    className="relative z-10 w-full h-full object-contain p-4 brightness-110"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-center gap-2">
                                <ShieldCheck className="w-3 h-3 text-primary animate-pulse" />
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Autonomic Engine Active</span>
                            </div>

                            <h2 className="text-sm font-bold text-white uppercase tracking-widest leading-relaxed line-clamp-2">
                                {buildStatus || "Manifesting your digital vibe..."}
                            </h2>

                            <div className="flex items-center justify-center gap-1.5 h-6">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/20 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/80 animate-bounce" style={{ animationDelay: '450ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '600ms' }} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
