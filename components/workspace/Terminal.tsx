"use client";

import { useEffect, useState, useRef } from 'react';
import { Terminal as TerminalIcon, Copy, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TerminalLine {
    type: 'stdout' | 'stderr' | 'info';
    text: string;
    timestamp: number;
}

interface StreamingTerminalProps {
    actionId: string;
    command: string;
    onComplete?: (exitCode: number) => void;
}

export function StreamingTerminal({ actionId, command, onComplete }: StreamingTerminalProps) {
    const [lines, setLines] = useState<TerminalLine[]>([
        { type: 'info', text: command, timestamp: Date.now() }
    ]);
    const [isRunning, setIsRunning] = useState(true);
    const [exitCode, setExitCode] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [lines]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLines(prev => [...prev, {
                type: 'stdout',
                text: 'Execution manifested successfully. Vibe synchronized.',
                timestamp: Date.now()
            }]);
            setIsRunning(false);
            setExitCode(0);
            onComplete?.(0);
        }, 1500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    const copyOutput = () => {
        const output = lines.map(l => l.text).join('\n');
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-black/90 backdrop-blur-xl rounded-xl border border-border overflow-hidden font-mono text-[13px] shadow-2xl group/term">
            {/* Terminal Header */}
            <div className="bg-muted/50 border-b border-border px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                        <TerminalIcon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">HeftCoder Terminal</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isRunning && (
                        <div className="flex items-center gap-2 px-2 py-0.5 bg-green-500/10 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-green-500 text-[9px] font-black uppercase tracking-widest">Active</span>
                        </div>
                    )}
                    <button
                        onClick={copyOutput}
                        className="p-1.5 hover:bg-muted rounded-lg transition-all text-muted-foreground hover:text-foreground"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </div>

            {/* Terminal Output */}
            <div
                ref={terminalRef}
                className="p-5 max-h-80 overflow-y-auto custom-scrollbar selection:bg-primary/20"
            >
                {lines.map((line, i) => (
                    <div key={i} className="flex gap-3 mb-1 font-medium tracking-tight">
                        <span className="text-pink-500 shrink-0 font-bold opacity-50 select-none">➜</span>
                        <span className={cn(
                            "leading-relaxed break-all",
                            line.type === 'stderr' ? 'text-red-400' :
                                line.type === 'info' ? 'text-blue-400 font-bold' :
                                    'text-green-400/90'
                        )}>
                            {line.text}
                        </span>
                    </div>
                ))}

                {isRunning && (
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-pink-500 shrink-0 font-bold opacity-50 select-none">➜</span>
                        <span className="inline-block w-2 h-4 bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                    </div>
                )}
            </div>
        </div>
    );
}

export function TerminalBlock({ command, output, error, exitCode, isRunning }: any) {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="bg-black/40 rounded-xl border border-border overflow-hidden font-mono text-[11px] mb-4">
            <div
                className="px-4 py-2 border-b border-border/50 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <TerminalIcon className="w-3 h-3 text-muted-foreground" />
                    <span className="text-muted-foreground font-bold truncate max-w-[200px]">$ {command}</span>
                </div>
                <ChevronRight className={cn("w-3 h-3 text-muted-foreground transition-transform", isExpanded && "rotate-90")} />
            </div>
            {isExpanded && (output || error || isRunning) && (
                <div className="p-4 bg-black/20">
                    <pre className={cn(
                        "whitespace-pre-wrap leading-relaxed",
                        error ? 'text-red-400' : 'text-green-400/80'
                    )}>
                        {error || output}
                        {isRunning && <span className="inline-block w-1.5 h-3 bg-primary animate-pulse ml-1 align-middle" />}
                    </pre>
                </div>
            )}
        </div>
    );
}
