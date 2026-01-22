"use client";

import React from 'react';
import { X, FileCode, Circle } from 'lucide-react';
import { SandpackCodeEditor } from "@codesandbox/sandpack-react";
import { cn } from '@/lib/utils';

interface CodePanelProps {
    fileName: string;
    code: string;
    onClose?: () => void;
}

export default function CodePanel({ fileName = 'App.tsx', onClose }: CodePanelProps) {
    return (
        <div className="h-full flex flex-col bg-background/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-border shadow-2xl relative group/code">
            {/* Header / Tab Bar */}
            <div className="flex items-center justify-between bg-muted/30 backdrop-blur-md border-b border-border px-4 h-12">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-background/50 border border-border rounded-lg shadow-sm">
                        <FileCode className="w-3.5 h-3.5 text-primary" />
                        <span className="text-[10px] font-black text-foreground tracking-widest uppercase">{fileName}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5 px-2">
                        <div className="w-2 h-2 rounded-full bg-red-500/30" />
                        <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
                        <div className="w-2 h-2 rounded-full bg-green-500/30" />
                    </div>
                </div>
            </div>

            {/* Code Content */}
            <div className="flex-1 overflow-hidden relative">
                <SandpackCodeEditor
                    showTabs={false}
                    showLineNumbers={true}
                    showInlineErrors={true}
                    showRunButton={false}
                    wrapContent={true}
                    closableTabs={false}
                    style={{ height: "100%", width: "100%" }}
                />

                {/* Decorative overlay */}
                <div className="absolute inset-0 pointer-events-none border-l border-white/5" />
            </div>

            {/* Footer / Status Bar */}
            <div className="h-8 bg-muted/20 border-t border-border px-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <Circle className="w-1.5 h-1.5 fill-primary text-primary" />
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">UTF-8</span>
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">React TypeScript</span>
                </div>
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Line 1, Col 1</span>
            </div>
        </div>
    );
}
