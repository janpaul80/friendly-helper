"use client";

import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Terminal, CheckCircle2, Circle, PlayCircle, FileText, Cpu, Layout } from 'lucide-react';

/**
 * StageProgress Component
 * Shows the current phase of the AI Agent (Planning -> Approving -> Coding)
 */
export function StageProgress({ currentStage }: { currentStage: 'planning' | 'approving' | 'coding' }) {
    const stages = [
        { id: 'planning', label: 'Planning', icon: FileText },
        { id: 'approving', label: 'Approval', icon: CheckCircle2 },
        { id: 'coding', label: 'Coding', icon: Terminal },
    ];

    return (
        <div className="flex items-center justify-between px-6 py-3 bg-[#0f0f0f] border-b border-white/5 w-full">
            {stages.map((stage, idx) => {
                const isActive = stage.id === currentStage;
                const isCompleted = stages.findIndex(s => s.id === currentStage) > idx;
                const Icon = stage.icon;

                return (
                    <div key={stage.id} className="flex items-center gap-2">
                        <div className={`
                            flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors
                            ${isActive ? 'text-orange-500' : isCompleted ? 'text-green-500' : 'text-gray-600'}
                        `}>
                            <Icon className="w-3.5 h-3.5" />
                            {stage.label}
                        </div>
                        {idx < stages.length - 1 && (
                            <div className="w-8 h-[1px] bg-white/10 mx-2" />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/**
 * PlanArtifact Component
 * Renders the "Stage 1", "Stage 2" plans as a structured document instead of a chat bubble.
 */
export function PlanArtifact({ content }: { content: string }) {
    // Parse the markdown content into sections based on "## Stage"
    const sections = content.split(/(?=## Stage)/g).filter(s => s.trim().length > 0);

    return (
        <div className="w-full my-4 rounded-xl overflow-hidden border border-white/10 bg-[#121212] shadow-xl">
            <div className="bg-[#1a1a1a] px-4 py-2 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-orange-500 font-bold uppercase tracking-widest">
                    <Layout className="w-3.5 h-3.5" /> Vibe Architecture Plan
                </div>
                <div className="text-[10px] text-gray-500">v1.0</div>
            </div>

            <div className="p-5 space-y-6">
                {sections.map((section, idx) => {
                    const lines = section.split('\n');
                    const title = lines[0].replace(/#/g, '').trim();
                    const body = lines.slice(1).join('\n').trim();

                    return (
                        <div key={idx} className="animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                            <h3 className="text-sm font-bold text-gray-200 mb-2 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                {title}
                            </h3>
                            <div className="text-xs text-gray-400 leading-relaxed pl-3.5 border-l border-white/5 whitespace-pre-wrap font-sans">
                                {body}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-orange-500/5 border-t border-orange-500/20 p-3 flex justify-end">
                <div className="flex items-center gap-2 text-xs text-orange-400 animate-pulse">
                    <Circle className="w-2 h-2 fill-orange-500" />
                    Waiting for approval
                </div>
            </div>
        </div>
    );
}

/**
 * TerminalArtifact Component
 * Renders ```bash code blocks as a terminal window
 */
export function TerminalArtifact({ content }: { content: string }) {
    // Extract content between ```bash and ``` or just usage
    const cleanContent = content.replace(/```(bash|sh|terminal)?/g, '').replace(/```/g, '').trim();

    return (
        <div className="w-full my-4 rounded-lg overflow-hidden border border-gray-800 bg-[#0d0d0d] shadow-2xl font-mono text-xs">
            <div className="bg-[#1a1a1a] px-3 py-1.5 flex items-center gap-2 border-b border-gray-800">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="text-gray-600 ml-2">heft-coder@dev:~/project</div>
            </div>
            <div className="p-4 text-green-400 overflow-x-auto">
                <div className="flex gap-2">
                    <span className="text-pink-500">➜</span>
                    <span className="text-blue-400">~</span>
                    <span className="whitespace-pre-wrap">{cleanContent}</span>
                </div>
            </div>
        </div>
    );
}
