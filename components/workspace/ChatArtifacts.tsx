"use client";

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown, ChevronRight, Terminal, CheckCircle2, Circle, PlayCircle, FileText, Cpu, Layout, Play, Eye, EyeOff, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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
        <div className="flex items-center justify-between px-6 py-4 bg-muted/20 backdrop-blur-md border-b border-border w-full">
            {stages.map((stage, idx) => {
                const isActive = stage.id === currentStage;
                const isCompleted = stages.findIndex(s => s.id === currentStage) > idx;
                const Icon = stage.icon;

                return (
                    <div key={stage.id} className="flex items-center gap-2">
                        <div className={cn(
                            "flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                            isActive ? 'text-primary scale-110' : isCompleted ? 'text-green-500' : 'text-muted-foreground/50'
                        )}>
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500",
                                isActive ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.4)]" :
                                    isCompleted ? "bg-green-500/20 text-green-500 border-green-500/50" :
                                        "bg-muted text-muted-foreground border-border"
                            )}>
                                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                            </div>
                            {stage.label}
                        </div>
                        {idx < stages.length - 1 && (
                            <div className={cn(
                                "w-12 h-[1px] mx-4 transition-all duration-1000",
                                isCompleted ? "bg-green-500/30" : "bg-border"
                            )} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

/**
 * TerminalArtifact Component
 * Renders ```bash code blocks as a terminal window
 */
export function TerminalArtifact({ content, title = "heft-coder@dev:~/project" }: { content: string, title?: string }) {
    // Clean content
    const cleanContent = content.replace(/^```(bash|sh|terminal)?/, '').replace(/```$/, '').trim();

    return (
        <div className="w-full my-6 rounded-xl overflow-hidden border border-border bg-black/80 backdrop-blur-md shadow-2xl font-mono text-sm group/terminal">
            <div className="bg-muted/50 px-4 py-2.5 flex items-center justify-between border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/40 group-hover/terminal:bg-red-500 transition-colors" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/40 group-hover/terminal:bg-yellow-500 transition-colors" />
                        <div className="w-3 h-3 rounded-full bg-green-500/40 group-hover/terminal:bg-green-500 transition-colors" />
                    </div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2">{title}</div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-green-500/70 font-bold tracking-tighter">LIVE</span>
                </div>
            </div>
            <div className="p-5 text-green-400 overflow-x-auto selection:bg-green-500/20 selection:text-green-200">
                <div className="flex gap-3">
                    <span className="text-pink-500 select-none font-bold">➜</span>
                    <span className="text-blue-400 select-none font-bold">~</span>
                    <span className="whitespace-pre-wrap leading-relaxed">{cleanContent}</span>
                </div>
            </div>
        </div>
    );
}

/**
 * ArtifactMessage Component
 * The main rich-text renderer for the chat.
 */
export function ArtifactMessage({ content, onApprove }: { content: string, onApprove?: () => void }) {
    const [showThinking, setShowThinking] = useState(false);

    // Processing to handle [WAIT], [EXEC] tags and [THINKING] blocks
    const hasWaitTag = (content || "").includes('[WAIT]');
    const hasExecTag = (content || "").includes('[EXEC]');
    const processedContent = (content || "").replace('[WAIT]', '').replace('[EXEC]', '');

    return (
        <div className="w-full space-y-5">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h2: ({ node, ...props }) => (
                        <div className="mt-8 mb-4 flex items-center gap-3 pb-3 border-b border-border">
                            <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                            <h2 className="text-sm font-black text-foreground uppercase tracking-[0.15em]" {...props} />
                        </div>
                    ),
                    h3: ({ node, ...props }) => (
                        <h3 className="text-[11px] font-black text-primary/80 mt-6 mb-3 uppercase tracking-widest" {...props} />
                    ),
                    ul: ({ node, ...props }) => <ul className="space-y-2 my-4 pl-4 list-none" {...props} />,
                    li: ({ node, ...props }) => (
                        <li className="text-sm text-muted-foreground pl-4 relative before:content-[''] before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/30" {...props} />
                    ),
                    p: ({ node, children, ...props }) => {
                        const text = String(children);
                        if (text.includes('[THINKING]')) {
                            return (
                                <div className="my-4 group/thinking">
                                    <button
                                        onClick={() => setShowThinking(!showThinking)}
                                        className="flex items-center gap-3 text-[10px] font-black text-muted-foreground/50 hover:text-primary uppercase tracking-[0.2em] transition-all duration-300"
                                    >
                                        <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center group-hover/thinking:bg-primary/10 transition-colors">
                                            {showThinking ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                        </div>
                                        {showThinking ? 'Hide Agent Reasoning' : 'Reveal Agent Reasoning'}
                                    </button>
                                    {showThinking && (
                                        <div className="mt-3 p-4 bg-primary/5 rounded-xl text-xs text-muted-foreground leading-relaxed italic border border-primary/10 animate-in fade-in slide-in-from-top-2 duration-500">
                                            <div className="flex items-center gap-2 mb-2 text-[10px] font-black text-primary/40 uppercase tracking-widest">
                                                <Sparkles className="w-3 h-3" />
                                                Internal Process
                                            </div>
                                            {text.replace('[THINKING]', '').trim()}
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        return <p className="text-sm text-muted-foreground leading-relaxed mb-4" {...props}>{children}</p>;
                    },
                    code: ({ node, inline, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isTerminal = match && (match[1] === 'bash' || match[1] === 'sh' || match[1] === 'terminal');

                        if (!inline && isTerminal) {
                            return <TerminalArtifact content={String(children).replace(/\n$/, '')} />;
                        }

                        return !inline ? (
                            <div className="my-6 rounded-xl overflow-hidden border border-border bg-muted/30 group/code">
                                <div className="bg-muted px-4 py-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest border-b border-border flex justify-between items-center">
                                    <span>{match ? match[1] : 'code'}</span>
                                    <div className="w-2 h-2 rounded-full bg-primary/50" />
                                </div>
                                <div className="p-5 overflow-x-auto bg-black/40">
                                    <code className="text-sm font-mono text-zinc-300 leading-relaxed" {...props}>
                                        {children}
                                    </code>
                                </div>
                            </div>
                        ) : (
                            <code
                                className={cn(
                                    "px-2 py-0.5 rounded-md text-[11px] font-mono font-bold border",
                                    String(children).startsWith('npm') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                        String(children).startsWith('cd') ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                            'bg-primary/10 text-primary border-primary/20'
                                )}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    }
                }}
            >
                {processedContent}
            </ReactMarkdown>

            {/* Resume / Approve Button */}
            {hasWaitTag && (
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onApprove}
                        className="group flex items-center gap-3 bg-gradient-to-br from-primary via-primary/90 to-primary/70 hover:scale-105 active:scale-95 text-primary-foreground px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 transition-all duration-300"
                    >
                        <Play className="w-4 h-4 fill-current group-hover:animate-pulse" />
                        Execute Vibe Plan
                    </button>
                </div>
            )}

            {hasExecTag && (
                <div className="mt-8 flex justify-end">
                    <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 text-green-500 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                        <Cpu className="w-4 h-4" />
                        System Autonomic Mode
                    </div>
                </div>
            )}
        </div>
    );
}

export function PlanArtifact({ content }: { content: string }) {
    return (
        <div className="bg-muted/10 backdrop-blur-xl border border-border rounded-2xl p-6 shadow-2xl relative overflow-hidden group/plan">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover/plan:bg-primary/10 transition-colors" />
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                        <Layout className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Deployment Strategy</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
            </div>
            <ArtifactMessage content={content} />
        </div>
    )
}
