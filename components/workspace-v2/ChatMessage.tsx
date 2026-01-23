import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Message } from '@/types/workspace-v2';
import { cn } from '@/lib/utils';

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
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronUp className="h-3 w-3" />
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
              <Check className="h-3 w-3 text-model-openai" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "p-4 bg-black/30 overflow-x-auto font-mono text-sm transition-all",
          collapsed && "max-h-20 overflow-hidden"
        )}
      >
        <pre className="text-foreground/90">
          <code>{code}</code>
        </pre>
      </div>
      {collapsed && (
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      )}
    </div>
  );
}

// Parse content for code blocks and markdown
function parseContent(content: string) {
  const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex, match.index),
      });
    }
    // Add code block
    parts.push({
      type: 'code',
      language: match[1],
      content: match[2].trim(),
    });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.slice(lastIndex),
    });
  }

  return parts.length > 0 ? parts : [{ type: 'text' as const, content }];
}


import { useState } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, Reply, ThumbsUp, ThumbsDown, MoreHorizontal, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Message } from '@/types/workspace-v2';
import { cn } from '@/lib/utils';
// ... rest of imports

// ... CodeBlock and parseContent functions remain the same (implied, but I need to include them or target specific lines)
// To stay safe, I will replace the component export specifically.

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const parts = parseContent(message.content);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex w-full animate-fade-in mb-6 gap-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {/* AGENT AVATAR */}
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <Avatar className="h-8 w-8 ring-2 ring-orange-500/20">
            <AvatarImage src="/heft-logo.png" alt="HeftCoder" />
            <AvatarFallback className="bg-gradient-to-br from-orange-500 to-amber-600">
              <Zap className="w-4 h-4 text-white fill-white" />
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      <div className={cn("flex flex-col max-w-[85%]", isUser ? "items-end" : "items-start")}>
        <div
          className={cn(
            "rounded-2xl px-5 py-4",
            isUser
              ? "bg-black/40 backdrop-blur-md border border-white/10 text-white rounded-br-none"
              : "bg-transparent text-foreground px-0 py-0"
          )}
        >
          {parts.map((part, index) =>
            part.type === 'code' ? (
              <CodeBlock key={index} code={part.content} language={part.language} />
            ) : (
              <p key={index} className="whitespace-pre-wrap leading-relaxed mb-1 last:mb-0">
                {part.content}
              </p>
            )
          )}

          {/* Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-border/50">
              {message.attachments.map((attachment) => (
                <span
                  key={attachment.id}
                  className="text-xs px-2 py-1 bg-black/20 rounded text-muted-foreground flex items-center gap-1"
                >
                  📎 {attachment.name}
                </span>
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

                <div className="hidden sm:flex ml-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-white hover:bg-white/10 rounded-md">
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Good</p></TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-white hover:bg-white/10 rounded-md">
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Bad</p></TooltipContent>
                  </Tooltip>
                </div>

                <div className="w-[1px] h-3 bg-white/10 mx-1" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-white hover:bg-white/10 rounded-md">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>More</p></TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </div>
        )}
      </div>
    </div>
  );
}

