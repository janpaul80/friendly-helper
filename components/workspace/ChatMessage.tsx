

import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Reply, ThumbsUp, ThumbsDown, MoreHorizontal, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Message } from '@/types/workspace';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
    message: Message;
}

// Simple code block component
function CodeBlock({ code, language }: { code: string; language?: string }) {
    const [copied, setCopied] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const lines = code.split('\n');
    const shouldShowCollapse = lines.length > 10;

    return (
        <div className="relative my-3 rounded-lg overflow-hidden border border-border group/code">
            <div className="flex items-center justify-between px-3 py-2 bg-muted/40 border-b border-border backdrop-blur-sm">
                <span className="text-xs text-muted-foreground font-mono">{language || 'code'}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover/code:opacity-100 transition-opacity">
                    {shouldShowCollapse && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => setCollapsed(!collapsed)}
                        >
                            {collapsed ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronUp className="h-4 w-4" />
                            )}
                        </Button>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handleCopy}
                    >
                        {copied ? (
                            <Check className="h-3 w-3 text-green-500" />
                        ) : (
                            <Copy className="h-3 w-3" />
                        )}
                    </Button>
                </div>
            </div>
            {!collapsed && (
                <div className="p-4 bg-background/50 overflow-x-auto custom-scrollbar">
                    <pre className="text-sm font-mono leading-relaxed">
                        <code>{code}</code>
                    </pre>
                </div>
            )}
            {collapsed && (
                <div className="p-2 bg-background/50 text-xs text-muted-foreground text-center italic">
                    Code block collapsed
                </div>
            )}
        </div>
    );
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={cn(
                "flex w-full mb-6 gap-4 animate-in fade-in duration-300 slide-in-from-bottom-2",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            {/* AGENT AVATAR */}
            {!isUser && (
                <div className="flex-shrink-0 mt-1">
                    <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                        <AvatarImage src="/heft-logo.png" alt="HeftCoder" />
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-600">
                            <Zap className="w-4 h-4 text-white fill-white" />
                        </AvatarFallback>
                    </Avatar>
                </div>
            )}

            <div className={cn("flex flex-col max-w-[85%]", isUser ? "items-end" : "items-start")}>
                {/* MESSAGE CONTENT */}
                <div
                    className={cn(
                        "rounded-2xl px-5 py-4 shadow-sm",
                        isUser
                            ? "bg-muted/30 backdrop-blur-md border border-white/5 text-white rounded-br-none"
                            : "bg-transparent text-foreground px-0 py-0 shadow-none"
                    )}
                >
                    <div className="prose prose-sm dark:prose-invert max-w-none break-words leading-relaxed">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({ node, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const isInline = !match && !String(children).includes('\n');

                                    if (!isInline && match) {
                                        return (
                                            <CodeBlock
                                                code={String(children).replace(/\n$/, '')}
                                                language={match[1]}
                                            />
                                        );
                                    }

                                    return (
                                        <code className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm text-amber-500" {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>

                    {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {message.attachments.map((attachment) => (
                                <div key={attachment.id} className="text-xs bg-background/20 px-2 py-1 rounded border border-white/10 flex items-center gap-1">
                                    <span className="opacity-50">📎</span> {attachment.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ACTION BAR (Agent Only) */}
                {!isUser && (
                    <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <TooltipProvider delayDuration={0}>
                            <div className="flex items-center p-1 bg-background/40 backdrop-blur-md rounded-lg border border-white/5 shadow-sm">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-white hover:bg-white/10 rounded-md">
                                            <Copy className="h-3.5 w-3.5" onClick={handleCopy} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>{copied ? 'Copied!' : 'Copy'}</p></TooltipContent>
                                </Tooltip>

                                <div className="w-[1px] h-3 bg-white/10 mx-1" />

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-white hover:bg-white/10 rounded-md">
                                            <Reply className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Reply</p></TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-white hover:bg-white/10 rounded-md">
                                            <ThumbsUp className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Good response</p></TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-white hover:bg-white/10 rounded-md">
                                            <ThumbsDown className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>Bad response</p></TooltipContent>
                                </Tooltip>

                                <div className="w-[1px] h-3 bg-white/10 mx-1" />

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-white hover:bg-white/10 rounded-md">
                                            <MoreHorizontal className="h-3.5 w-3.5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent><p>More options</p></TooltipContent>
                                </Tooltip>
                            </div>
                        </TooltipProvider>
                    </div>
                )}
            </div>
        </div>
    );
}
