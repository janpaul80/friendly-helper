"use client";

import React, { useRef, useEffect } from 'react';
import { Sparkles, Check, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { ThinkingIndicator } from './ThinkingIndicator';
import type { Message, AIModel, Attachment } from '@/types/workspace';

const STAGES = [
    { id: 'planning', label: 'Planning' },
    { id: 'approval', label: 'Approval' },
    { id: 'coding', label: 'Coding' },
];

interface AIChatPanelProps {
    projectName?: string;
    messages: Message[];
    currentStage: 'planning' | 'approving' | 'coding';
    onSendMessage: (msg: string, attachments: Attachment[], model: AIModel) => void;
    isGenerating: boolean;
    selectedModel: AIModel;
    onApprove?: () => void;
}

export default function AIChatPanel({
    projectName = 'VIBE ENGINE',
    messages,
    currentStage,
    onSendMessage,
    isGenerating,
    selectedModel,
    onApprove
}: AIChatPanelProps) {
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isGenerating]);

    const getStageStatus = (stageId: string) => {
        const stageOrder = ['planning', 'approving', 'coding'];
        const currentIndex = stageOrder.indexOf(currentStage);
        const stageIndex = stageId === 'approval' ? 1 : (stageId === 'planning' ? 0 : 2);

        if (stageIndex < currentIndex) return 'completed';
        if (stageIndex === currentIndex) return 'active';
        return 'pending';
    };

    return (
        <div className="h-full flex flex-col bg-background/50 backdrop-blur-xl rounded-2xl overflow-hidden border border-border shadow-2xl relative group/panel">
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

            {/* Stage Progress */}
            <div className="px-6 py-4 border-b border-border bg-muted/30 backdrop-blur-md relative z-10">
                <div className="flex items-center justify-between">
                    {STAGES.map((stage, idx) => {
                        const status = getStageStatus(stage.id);
                        return (
                            <React.Fragment key={stage.id}>
                                <div className="flex items-center gap-2.5">
                                    <div className={cn(
                                        "w-6 h-6 rounded-full flex items-center justify-center text-[10px] border transition-all duration-500",
                                        status === 'active' && "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)] scale-110",
                                        status === 'completed' && "bg-green-500/20 text-green-500 border-green-500/50",
                                        status === 'pending' && "bg-muted text-muted-foreground border-border"
                                    )}>
                                        {status === 'completed' ? (
                                            <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                        ) : status === 'active' ? (
                                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                                        ) : (
                                            <Circle className="w-1.5 h-1.5 fill-current" />
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                                        status === 'active' && "text-foreground scale-105",
                                        status === 'completed' && "text-green-500/70",
                                        status === 'pending' && "text-muted-foreground/50"
                                    )}>
                                        {stage.label}
                                    </span>
                                </div>
                                {idx < STAGES.length - 1 && (
                                    <div className={cn(
                                        "flex-1 h-[1px] mx-4 rounded-full transition-all duration-1000",
                                        getStageStatus(STAGES[idx + 1].id) !== 'pending'
                                            ? "bg-gradient-to-r from-green-500/50 to-primary/50"
                                            : "bg-border"
                                    )} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar relative z-10">
                {messages.map((msg, idx) => (
                    <ChatMessage key={msg.id || idx} message={msg} />
                ))}

                {isGenerating && (
                    <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <ThinkingIndicator visible={true} action={currentStage === 'coding' ? 'building' : 'thinking'} />
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="relative z-20">
                <ChatInput
                    onSend={onSendMessage}
                    disabled={isGenerating}
                />

                {/* Meta info below input */}
                <div className="flex justify-between items-center py-2 px-6 bg-muted/20 backdrop-blur-sm border-t border-border/50">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                            Engine Ready: {selectedModel.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">
                            {projectName}
                        </span>
                    </div>
                </div>
            </div>

            {/* Decorative background glow */}
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary/10 blur-[100px] rounded-full pointer-events-none" />
        </div>
    );
}
