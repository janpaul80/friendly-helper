
import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
        <div className="relative my-3 rounded-lg overflow-hidden border border-border">
            <div className="flex items-center justify-between px-3 py-2 bg-secondary/50 border-b border-border">
                <span className="text-xs text-muted-foreground">{language || 'code'}</span>
                <div className="flex items-center gap-1">
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
                <div className="p-4 bg-secondary/20 overflow-x-auto">
                    <pre className="text-sm font-mono leading-relaxed">
                        <code>{code}</code>
                    </pre>
                </div>
            )}
            {collapsed && (
                <div className="p-2 bg-secondary/20 text-xs text-muted-foreground text-center italic">
                    Code block collapsed
                </div>
            )}
        </div>
    );
}

export function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';

    return (
        <div
            className={cn(
                "flex w-full mb-6",
                isUser ? "justify-end" : "justify-start"
            )}
        >
            <div
                className={cn(
                    "max-w-[85%] rounded-lg px-4 py-3",
                    isUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                )}
            >
                <div className="prose prose-sm dark:prose-invert max-w-none break-words">
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
                                    <code className={cn("bg-secondary/50 px-1 py-0.5 rounded font-mono text-sm", className)} {...props}>
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
                            <div key={attachment.id} className="text-xs bg-background/20 px-2 py-1 rounded">
                                📎 {attachment.name}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
