"use client";

import React, { useState, useRef } from 'react';
import { Sparkles, Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

const STAGES = [
    { id: 'planning', label: 'Planning' },
    { id: 'approval', label: 'Approval' },
    { id: 'coding', label: 'Coding' },
];

interface AIChatPanelProps {
    projectName?: string;
    currentStage?: 'planning' | 'approving' | 'coding';
    // Legacy props kept optional for compatibility
    messages?: any[];
    onSendMessage?: (msg: string) => void;
    isGenerating?: boolean;
    chatInput?: string;
    setChatInput?: (val: string) => void;
    selectedModel?: string;
}

export default function AIChatPanel({
    projectName = 'VIBE ENGINE',
    currentStage = 'planning',
    isGenerating = false,
}: AIChatPanelProps) {

    const getStageStatus = (stageId: string) => {
        const stageOrder = ['planning', 'approving', 'coding'];
        const currentIndex = stageOrder.indexOf(currentStage);
        const stageIndex = stageId === 'approval' ? 1 : (stageId === 'planning' ? 0 : 2);

        if (stageIndex < currentIndex) return 'completed';
        if (stageIndex === currentIndex) return 'active';
        return 'pending';
    };

    return (
        <div className="h-full flex flex-col bg-[#0d0d0d] rounded-lg overflow-hidden border border-[#1f1f1f] shadow-2xl">
            {/* Stage Progress */}
            <div className="px-5 py-4 border-b border-[#1a1a1a] bg-[#0a0a0a]">
                <div className="flex items-center justify-between">
                    {STAGES.map((stage, idx) => {
                        const status = getStageStatus(stage.id);
                        return (
                            <React.Fragment key={stage.id}>
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] border transition-all duration-300",
                                        status === 'active' && "bg-orange-500 text-white border-orange-400 shadow-[0_0_10px_rgba(234,88,12,0.4)]",
                                        status === 'completed' && "bg-green-500 text-white border-green-400",
                                        status === 'pending' && "bg-[#1a1a1a] text-zinc-600 border-[#2a2a2a]"
                                    )}>
                                        {status === 'completed' ? (
                                            <Check className="w-3 h-3" strokeWidth={3} />
                                        ) : status === 'active' ? (
                                            <Sparkles className="w-3 h-3" />
                                        ) : (
                                            <Circle className="w-3 h-3 fill-current" />
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-bold uppercase tracking-widest transition-colors duration-300",
                                        status === 'active' && "text-white",
                                        status === 'completed' && "text-green-500/80",
                                        status === 'pending' && "text-zinc-700"
                                    )}>
                                        {stage.label}
                                    </span>
                                </div>
                                {idx < STAGES.length - 1 && (
                                    <div className={cn(
                                        "flex-1 h-[2px] mx-3 rounded-full transition-colors duration-500",
                                        getStageStatus(STAGES[idx + 1].id) !== 'pending' ? "bg-green-500/20" : "bg-[#1a1a1a]"
                                    )} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Chat Header */}
            <div className="px-5 py-3 border-b border-[#1a1a1a] flex items-center justify-between bg-[#080808]">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(234,88,12,0.6)]" />
                    <span className="text-[10px] font-black text-white tracking-[0.2em] uppercase">
                        HEFTCODER PRO AI
                    </span>
                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest ml-2 border-l border-zinc-800 pl-2">
                        {projectName}
                    </span>
                </div>
                {isGenerating && (
                    <div className="flex items-center gap-2 px-2 py-1 bg-orange-500/10 rounded-lg border border-orange-500/20">
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1 h-1 bg-orange-500 rounded-full animate-bounce" />
                        </div>
                        <span className="text-[9px] font-black text-orange-500 uppercase tracking-tighter">Thinking...</span>
                    </div>
                )}
            </div>

            {/* Chat Content & Input - Replaced by LangDock Iframe */}
            <div className="flex-1 relative overflow-hidden bg-[#0d0d0d]">
                <iframe
                    src="https://app.langdock.com/chat?a=bddc9537-f05f-47ce-ada1-c4573e2b9609"
                    className="absolute inset-0 w-full h-full border-0"
                    title="HeftCoder Pro AI"
                    allow="clipboard-read; clipboard-write; microphone"
                />
            </div>
        </div>
    );
}
