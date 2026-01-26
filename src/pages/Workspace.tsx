import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowRight, Send, Zap, FolderOpen, Monitor, Tablet, Smartphone, Download, Code, Eye, Paperclip, Mic, Github, Sparkles, Clock, CheckCircle, Loader2, AlertCircle, FileCode } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import ReactMarkdown from 'react-markdown';
import { useLangdockOrchestration, AgentType, AgentStatus } from '@/hooks/useLangdockOrchestration';

const hcIcon = '/assets/hc-icon.png';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickStartItem {
  id: string;
  title: string;
  prompt: string;
}

const quickStartItems: QuickStartItem[] = [
  { id: '1', title: 'Create a modern portfolio website with dark theme', prompt: 'Create a modern portfolio website with dark theme' },
  { id: '2', title: 'Build a SaaS pricing page with 3 tiers', prompt: 'Build a SaaS pricing page with 3 tiers' },
  { id: '3', title: 'Design an e-commerce product page with reviews', prompt: 'Design an e-commerce product page with reviews' },
  { id: '4', title: 'Make a restaurant landing page with menu section', prompt: 'Make a restaurant landing page with menu section' },
];

type DeviceType = 'desktop' | 'tablet' | 'mobile';
type TabType = 'templates' | 'recent';
type ViewMode = 'preview' | 'code';

// Agent Progress Bar with real streaming status
function AgentProgressBar({ 
  agents, 
  progress, 
  currentStream 
}: { 
  agents: AgentStatus[]; 
  progress: number;
  currentStream: string;
}) {
  const getStatusIcon = (status: AgentStatus['status']) => {
    switch (status) {
      case 'thinking':
        return <Loader2 size={14} className="animate-spin text-yellow-500" />;
      case 'generating':
        return <Loader2 size={14} className="animate-spin text-orange-500" />;
      case 'complete':
        return <CheckCircle size={14} className="text-green-500" />;
      case 'warning':
        return <AlertCircle size={14} className="text-amber-500" />;
      case 'error':
        return <AlertCircle size={14} className="text-red-500" />;
      default:
        return <div className="w-3.5 h-3.5 rounded-full bg-gray-600" />;
    }
  };

  const getStatusColor = (status: AgentStatus['status']) => {
    switch (status) {
      case 'thinking':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'generating':
        return 'border-orange-500/50 bg-orange-500/10';
      case 'complete':
        return 'border-green-500/50 bg-green-500/10';
      case 'warning':
        return 'border-amber-500/50 bg-amber-500/10';
      case 'error':
        return 'border-red-500/50 bg-red-500/10';
      default:
        return 'border-white/10 bg-white/5';
    }
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl border border-white/10 p-4 mb-4">
      {/* Header with progress */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-orange-600 rounded flex items-center justify-center">
            <Zap size={14} fill="currentColor" />
          </div>
          <span className="text-sm font-medium text-white">Agent Orchestra</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">{progress}%</span>
          <div className="w-20 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-3 gap-2">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${getStatusColor(agent.status)}`}
          >
            {getStatusIcon(agent.status)}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-white truncate">{agent.name}</div>
              <div className="text-[10px] text-gray-400 truncate">
                {agent.statusLabel}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Live Streaming Output */}
      {currentStream && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="text-[10px] text-gray-500 mb-1">Live output:</div>
          <div className="text-xs text-gray-300 font-mono max-h-24 overflow-y-auto bg-black/30 rounded p-2">
            {currentStream.slice(-500)}
          </div>
        </div>
      )}
    </div>
  );
}

// Generated Files Panel
function GeneratedFilesPanel({ files }: { files: { path: string; content: string; language: string }[] }) {
  const [selectedFile, setSelectedFile] = useState(0);

  if (files.length === 0) return null;

  return (
    <div className="h-full flex flex-col">
      {/* File List */}
      <div className="h-12 border-b border-white/10 px-2 flex items-center gap-2 overflow-x-auto bg-[#111]">
        {files.map((file, idx) => (
          <button
            key={file.path}
            onClick={() => setSelectedFile(idx)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs whitespace-nowrap transition-colors ${
              idx === selectedFile 
                ? 'bg-orange-600/20 text-orange-400 border border-orange-500/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileCode size={12} />
            {file.path.split('/').pop()}
          </button>
        ))}
      </div>

      {/* File Content */}
      <div className="flex-1 overflow-auto bg-[#0d0d0d] p-4">
        <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap">
          <code>{files[selectedFile]?.content || ''}</code>
        </pre>
      </div>
    </div>
  );
}

export default function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Use Langdock orchestration hook
  const {
    agents,
    state,
    isLoading,
    error,
    currentStream,
    progress,
    generatedFiles,
    executePipeline,
    reset,
  } = useLangdockOrchestration();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(Math.max(textarea.scrollHeight, 48), 200);
      textarea.style.height = `${newHeight}px`;
    }
  }, [message]);

  // Add error to messages if it occurs
  useEffect(() => {
    if (error) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `❌ **Error:** ${error}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  }, [error]);

  // Add completion message when pipeline finishes
  useEffect(() => {
    if (state?.phase === 'complete' && generatedFiles.length > 0) {
      const completeMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `✅ **Build Complete!**\n\nGenerated ${generatedFiles.length} files successfully.\n\nFiles:\n${generatedFiles.map(f => `- \`${f.path}\``).join('\n')}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, completeMessage]);
    }
  }, [state?.phase, generatedFiles]);

  const handleSend = async (prompt?: string) => {
    const content = prompt || message;
    if (!content.trim() || isLoading) return;

    // Reset previous state
    await reset();

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '🚀 **Starting orchestration...**\n\nThe Agent Orchestra is analyzing your request and will build your project step by step.',
      timestamp: new Date(),
    };

    setMessages([userMessage, assistantMessage]);
    setMessage("");

    // Execute the full pipeline
    await executePipeline(content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Build preview HTML from generated files
  const getPreviewHtml = () => {
    const htmlFile = generatedFiles.find(f => f.path.endsWith('.html') || f.path.endsWith('index.html'));
    if (htmlFile) return htmlFile.content;

    // If no HTML, create a simple preview showing what was generated
    return `<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white min-h-screen flex items-center justify-center p-8">
  <div class="text-center max-w-2xl">
    <h1 class="text-3xl font-bold mb-4">🎉 Project Generated!</h1>
    <p class="text-gray-400 mb-6">${generatedFiles.length} files created</p>
    <div class="text-left bg-gray-800 rounded-lg p-4 text-sm">
      ${generatedFiles.map(f => `<div class="py-1 text-gray-300">📄 ${f.path}</div>`).join('')}
    </div>
  </div>
</body>
</html>`;
  };

  const showStartPanel = messages.length === 0;
  const showAgentProgress = isLoading || agents.some(a => a.status !== 'idle');
  const hasProject = generatedFiles.length > 0;

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-white">
      {/* Top Nav */}
      <header className="h-14 border-b border-white/10 bg-[#0a0a0a] flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="text-lg font-semibold">HeftCoder</span>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <FolderOpen size={18} />
            <span className="text-sm">File Explorer</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
            <Github size={20} />
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
            <Download size={20} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors">
            <div className="w-4 h-4 border-2 border-white rounded-full" />
            Publish
          </button>
        </div>
      </header>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Chat Panel */}
        <ResizablePanel defaultSize={40} minSize={25} maxSize={55}>
          <div className="h-full flex flex-col bg-[#111111] border-r border-white/10">
            {/* Messages or Start Panel */}
            <div className="flex-1 overflow-y-auto p-6">
              {showStartPanel ? (
                <div className="space-y-6">
                  {/* Header */}
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">What would you like to build?</h1>
                    <p className="text-gray-400 text-sm">
                      Start from a template, continue a project, or describe what you want to create.
                    </p>
                  </div>

                  {/* Quick Start Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-orange-500">
                      <Sparkles size={16} />
                      <span className="text-sm font-medium">Quick start</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {quickStartItems.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleSend(item.prompt)}
                          className="group flex items-start justify-between p-4 bg-transparent border border-white/10 hover:border-orange-500/50 hover:bg-white/5 rounded-xl text-left transition-all"
                        >
                          <span className="text-sm text-gray-300 group-hover:text-white pr-2 leading-relaxed">
                            {item.title}
                          </span>
                          <ArrowRight size={16} className="text-gray-500 group-hover:text-orange-500 mt-0.5 shrink-0 transition-colors" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Templates / Recent Projects Tabs */}
                  <div className="flex items-center gap-2 pt-4">
                    <button
                      onClick={() => setActiveTab('templates')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeTab === 'templates'
                          ? 'bg-white/10 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Sparkles size={14} />
                      Templates
                    </button>
                    <button
                      onClick={() => setActiveTab('recent')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeTab === 'recent'
                          ? 'bg-white/10 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Clock size={14} />
                      Recent Projects
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Agent Progress Bar */}
                  {showAgentProgress && (
                    <AgentProgressBar 
                      agents={agents} 
                      progress={progress}
                      currentStream={currentStream}
                    />
                  )}
                  
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`p-4 rounded-xl ${
                        msg.role === 'user' 
                          ? 'bg-orange-600/20 ml-8 border border-orange-500/30' 
                          : 'bg-white/5 mr-8'
                      }`}
                    >
                      <div className="prose prose-sm prose-invert max-w-none">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex flex-col gap-3 p-3 bg-[#1a1a1a] rounded-xl border border-white/10 focus-within:border-orange-500/50 transition-all">
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message HeftCoder"
                  className="w-full min-h-[48px] max-h-[200px] resize-none bg-transparent border-0 text-white placeholder:text-gray-500 focus:outline-none text-sm leading-relaxed"
                  rows={1}
                  disabled={isLoading}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
                      <Paperclip size={18} />
                    </button>
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#252525] rounded-lg text-sm border border-orange-500/30 shadow-[0_0_15px_rgba(255,140,0,0.2)]">
                      <div className="h-5 w-5 bg-orange-600 rounded flex items-center justify-center">
                        <Zap size={12} fill="currentColor" />
                      </div>
                      <span className="text-white font-medium">agents</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white">
                      <Mic size={18} />
                    </button>
                    <button 
                      onClick={() => handleSend()}
                      disabled={!message.trim() || isLoading}
                      className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle className="w-px bg-white/10 hover:bg-orange-500/50 transition-colors" />

        {/* Preview Panel */}
        <ResizablePanel defaultSize={60} minSize={45} maxSize={75}>
          <div className="h-full flex flex-col bg-[#0d0d0d]">
            {/* Preview Content */}
            <div className="flex-1 flex items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-orange-500/30 blur-3xl rounded-full scale-150 animate-pulse" />
                    <div className="relative w-20 h-20 bg-orange-600 rounded-2xl flex items-center justify-center">
                      <Zap size={40} fill="currentColor" className="animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-medium text-white">Building your project</span>
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">{progress}% complete</div>
                </div>
              ) : hasProject ? (
                <div className="h-full w-full flex flex-col">
                  {/* Preview Toolbar */}
                  <div className="h-12 border-b border-white/10 px-4 flex items-center justify-between bg-[#111]">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-[#1a1a1a] rounded-lg p-1">
                        <button 
                          onClick={() => setViewMode('preview')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                            viewMode === 'preview' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <Eye size={14} />
                          Preview
                        </button>
                        <button 
                          onClick={() => setViewMode('code')}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                            viewMode === 'code' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          <Code size={14} />
                          Code ({generatedFiles.length})
                        </button>
                      </div>
                      {viewMode === 'preview' && (
                        <div className="flex items-center gap-1 bg-[#1a1a1a] rounded-lg p-1 ml-2">
                          <button 
                            onClick={() => setDevice('desktop')}
                            className={`p-2 rounded transition-colors ${device === 'desktop' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                          >
                            <Monitor size={16} />
                          </button>
                          <button 
                            onClick={() => setDevice('tablet')}
                            className={`p-2 rounded transition-colors ${device === 'tablet' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                          >
                            <Tablet size={16} />
                          </button>
                          <button 
                            onClick={() => setDevice('mobile')}
                            className={`p-2 rounded transition-colors ${device === 'mobile' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
                          >
                            <Smartphone size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {viewMode === 'preview' ? (
                    <div className="flex-1 flex items-center justify-center bg-[#1a1a1a] p-4">
                      <div 
                        className={`bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 ${
                          device !== 'desktop' ? 'border-8 border-gray-800 rounded-3xl' : ''
                        }`}
                        style={{ 
                          width: device === 'desktop' ? '100%' : device === 'tablet' ? '768px' : '375px', 
                          height: device === 'desktop' ? '100%' : device === 'tablet' ? '1024px' : '667px',
                          maxWidth: '100%',
                          maxHeight: '100%'
                        }}
                      >
                        <iframe
                          srcDoc={getPreviewHtml()}
                          title="Project Preview"
                          className="w-full h-full border-0"
                          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                        />
                      </div>
                    </div>
                  ) : (
                    <GeneratedFilesPanel files={generatedFiles} />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-orange-600 rounded-2xl flex items-center justify-center mb-6">
                    <Zap size={32} fill="currentColor" />
                  </div>
                  <p className="text-gray-400 text-lg max-w-sm">
                    Your project preview will appear here once generation starts
                  </p>
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
