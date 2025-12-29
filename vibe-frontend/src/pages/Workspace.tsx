import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Play, Settings, RefreshCw, Database, Upload, Mic, Send, Folder, Terminal } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { FileTree } from '../components/FileTree';
import { LivePreview } from '../components/LivePreview';
import * as workspaceApi from '../lib/workspaceApi';
import { API_BASE_URL } from '../lib/workspaceApi';
import { supabase } from '../lib/supabase';
import { EnhancedChatInput } from '../components/EnhancedChatInput';
import { MessageContent } from '../components/MessageHighlight';

export default function Workspace() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<any[]>([
        {
            id: 1,
            role: 'agent',
            content: "Welcome to **HeftCoder Orchestrator**! I'm powered by GPT-5.1 and ready to build.\n\n**Model Commands:**\n- `/grok` - Switch to Grok\n- `/deepseek` - Switch to DeepSeek\n- `/flux` - Switch to Flux\n- `/gpt` - Switch back to GPT-5.1\n\nWhat are we creating today?",
            timestamp: new Date().toISOString()
        }
    ]);
    const [input, setInput] = useState('');
    const [agentStatus, setAgentStatus] = useState<'idle' | 'working' | 'ready'>('idle');
    const [showFileTree, setShowFileTree] = useState(true);
    const [userPlan, setUserPlan] = useState<'Free' | 'Basic' | 'Pro'>('Basic');
    const [files, setFiles] = useState<any[]>([]);
    const [previewCode, setPreviewCode] = useState<string>('');
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [loadingFiles, setLoadingFiles] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isListening, setIsListening] = useState(false);
    const [workspaceId, setWorkspaceId] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('claude-4.5-sonnet');
    const [projectName, setProjectName] = useState<string>('Untitled Project');
    const [isEditingName, setIsEditingName] = useState(false);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load workspace file tree from production API
    useEffect(() => {
        if (!projectId) {
            console.log('[Workspace] No project ID provided');
            const lastProjectId = localStorage.getItem('last_project_id');
            if (lastProjectId) {
                console.log(`[Workspace] Redirecting to last active project: ${lastProjectId}`);
                navigate(`/workspace/${lastProjectId}`, { replace: true });
                return;
            }
            setLoadError('No project selected. Please create a new project or select an existing one from the dashboard.');
            setLoadingFiles(false);
            return;
        }

        // Fetch the workspace_id from Supabase first
        const loadWorkspace = async () => {
            try {
                setLoadingFiles(true);
                let actualWorkspaceId = '';

                // Check if projectId is already a workspace_id (starts with ws_)
                if (projectId.startsWith('ws_')) {
                    // It's already a workspace ID, use it directly
                    actualWorkspaceId = projectId;
                } else {
                    // It's a Supabase UUID or legacy ID, query Supabase
                    const { data: projectList, error } = await supabase
                        .from('projects')
                        .select('workspace_id, name')
                        .eq('id', projectId);

                    const project = projectList && projectList.length > 0 ? projectList[0] : null;

                    if (error || !project) {
                        console.error('Failed to fetch project:', error);
                        setLoadError('Project not found or you don\'t have access.');
                        return;
                    }

                    if (project.name) setProjectName(project.name);

                    // If project exists but has no workspace_id, create one now
                    if (!project.workspace_id) {
                        console.log('⚠️ Legacy project without workspace_id, creating one...');
                        try {
                            // Create workspace via Orchestrator
                            const newWorkspaceId = await workspaceApi.createWorkspace(projectId);

                            // Update Supabase with new workspace_id
                            const { error: updateError } = await supabase
                                .from('projects')
                                .update({ workspace_id: newWorkspaceId })
                                .eq('id', projectId);

                            if (updateError) {
                                console.error('Failed to update project with workspace_id:', updateError);
                            }

                            actualWorkspaceId = newWorkspaceId;
                            console.log(`✅ Created workspace for legacy project: ${newWorkspaceId}`);
                        } catch (wsError: any) {
                            console.error('Failed to create workspace for legacy project:', wsError);
                            setLoadError(`Workspace Initialization Failed: ${wsError.message || 'CORS or Network Error'}. Please check if the API is reachable.`);
                            setLoadingFiles(false);
                            return;
                        }
                    } else {
                        actualWorkspaceId = project.workspace_id;
                    }
                }

                setWorkspaceId(actualWorkspaceId);

                // Step 2: Now use the CORRECT workspace_id for Orchestrator API calls
                const fileTree = await workspaceApi.getFileTree(actualWorkspaceId);
                setFiles(fileTree);

                // Set preview URL with correct workspace ID
                const preview = workspaceApi.getPreviewUrl(actualWorkspaceId, 'index.html');
                setPreviewUrl(preview);
            } catch (error: any) {
                console.error('Failed to load workspace:', error);
                setLoadError(error.message || 'Failed to load workspace files.');
            } finally {
                setLoadingFiles(false);
            }
        };

        loadWorkspace();

        // Socket Connection - DIRECT ONLY (Strict Nginx Flow)
        const socket = io(API_BASE_URL, {
            path: "/socket.io",
            transports: ["websocket", "polling"],
            secure: true,
            reconnection: true,
            rejectUnauthorized: false
        });

        socket.on('connect', () => {
            console.log("Connected to socket");
            socket.emit('join-project', projectId);
        });

        socket.on('agent:update', (data) => {
            console.log("Agent Update:", data);
            if (data.status) setAgentStatus(data.status);
            if (data.message) {
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    role: 'agent',
                    content: data.message,
                    timestamp: new Date().toISOString()
                }]);
            }
            if (data.files) {
                // Update file tree
                setFiles(prev => {
                    const newFiles = [...prev];
                    data.files.forEach((f: any) => {
                        const idx = newFiles.findIndex(Fx => Fx.path === f.path);
                        if (idx >= 0) newFiles[idx] = f;
                        else newFiles.push(f);

                        // Update preview if it's the App.jsx
                        if (f.path === 'App.jsx') {
                            setPreviewCode(f.content);
                        }
                    });
                    return newFiles;
                });
            }
            if (data.code) { // Direct code update from agent route
                setPreviewCode(data.code);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [projectId]);

    // Auth state
    const [authUser, setAuthUser] = useState<{ id: string; email?: string } | null>(null);
    const [authLoading, setAuthLoading] = useState(true);

    // Fetch authenticated user on mount
    useEffect(() => {
        const loadAuth = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    setAuthUser({ id: user.id, email: user.email || undefined });
                    localStorage.setItem('heftcoder_user_id', user.id);
                }
            } catch (err) {
                console.warn('[Auth] Failed to load user:', err);
            } finally {
                setAuthLoading(false);
            }
        };
        loadAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setAuthUser({ id: session.user.id, email: session.user.email || undefined });
                localStorage.setItem('heftcoder_user_id', session.user.id);
            } else {
                setAuthUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // User ID: real user or anonymous fallback
    const userId = authUser?.id || localStorage.getItem('heftcoder_user_id') || `anon-${Date.now()}`;

    // Session ID: persisted per workspace for conversation continuity
    const getOrCreateSessionId = () => {
        if (!workspaceId) return `session-${Date.now()}`;
        const sessionKey = `heftcoder_session_${workspaceId}`;
        const stored = localStorage.getItem(sessionKey);
        if (stored) return stored;
        const newSession = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem(sessionKey, newSession);
        return newSession;
    };
    const [sessionId, setSessionId] = useState<string>(() => getOrCreateSessionId());

    // Update session when workspace changes
    useEffect(() => {
        if (workspaceId) {
            setSessionId(getOrCreateSessionId());
        }
    }, [workspaceId]);

    const [currentModel, setCurrentModel] = useState<string>('chatgpt-5.1');

    // Model routing commands
    const MODEL_COMMANDS: Record<string, string> = {
        '/grok': 'grok-4',
        '/deepseek': 'deepseek-v3',
        '/flux': 'flux-2-pro',
        '/mistral': 'mistral-medium',
        '/gpt': 'chatgpt-5.1',
        '/default': 'chatgpt-5.1'
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;
        if (!workspaceId) {
            console.warn('Workspace ID not yet loaded, please wait');
            return;
        }

        let messageText = input.trim();
        let targetModel = currentModel;

        // Check for model routing commands
        const firstWord = messageText.split(' ')[0].toLowerCase();
        if (MODEL_COMMANDS[firstWord]) {
            targetModel = MODEL_COMMANDS[firstWord];
            messageText = messageText.substring(firstWord.length).trim();
            setCurrentModel(targetModel);

            // Model descriptions for better UX
            const MODEL_INFO: Record<string, { name: string; desc: string }> = {
                'chatgpt-5.1': { name: 'ChatGPT 5.1', desc: 'Best for complex reasoning and code generation' },
                'grok-4': { name: 'Grok 4 (Thinking)', desc: 'Quick responses with real-time knowledge' },
                'deepseek-v3': { name: 'DeepSeek V3', desc: 'Specialized for deep technical analysis' },
                'mistral-medium': { name: 'Mistral Medium', desc: 'Balanced performance for general tasks' },
                'flux-2-pro': { name: 'Flux.2-Pro', desc: 'Creative tasks and image-aware responses' }
            };

            // If only the command was sent, show detailed confirmation
            if (!messageText) {
                const modelInfo = MODEL_INFO[targetModel] || { name: targetModel, desc: 'AI model' };
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    role: 'agent',
                    content: `**Switched to ${modelInfo.name}**\n\n${modelInfo.desc}\n\n_Send your next message to use this model._`,
                    timestamp: new Date().toISOString(),
                    isSystemMessage: true
                }]);
                setInput('');
                return;
            }
        }

        const userMsg = {
            id: Date.now(),
            role: 'user',
            content: input, // Show original input including command
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setAgentStatus('working');

        try {
            // Bot Framework Activity schema
            const activity = {
                type: 'message',
                text: messageText,
                from: { id: userId },
                conversation: { id: sessionId },
                // Custom fields for HeftCoder orchestrator
                channelData: {
                    workspaceId: workspaceId,
                    model: targetModel
                }
            };

            console.log('[HeftCoder] Sending activity:', activity);

            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

            try {
                const res = await fetch(`${API_BASE_URL}/api/messages`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(activity),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!res.ok) {
                    const errorText = await res.text();
                    console.error('[HeftCoder] API Error:', res.status, errorText);

                    // Handle specific error codes
                    if (res.status === 429) {
                        throw new Error('RATE_LIMIT');
                    } else if (res.status === 503 || res.status === 502) {
                        throw new Error('SERVICE_UNAVAILABLE');
                    } else if (res.status === 401 || res.status === 403) {
                        throw new Error('AUTH_ERROR');
                    } else {
                        throw new Error(`API_ERROR_${res.status}`);
                    }
                }

                const data = await res.json();
                console.log('[HeftCoder] Response:', data);

                // Parse response - handle different response formats
                let responseText = '';
                if (typeof data === 'string') {
                    responseText = data;
                } else if (data.text) {
                    responseText = data.text;
                } else if (data.message) {
                    responseText = data.message;
                } else if (data.content) {
                    responseText = data.content;
                } else if (data.choices?.[0]?.message?.content) {
                    // OpenAI-style response
                    responseText = data.choices[0].message.content;
                } else {
                    responseText = JSON.stringify(data);
                }

                // Display the AI response in chat
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    role: 'agent',
                    content: responseText || 'No response received',
                    timestamp: data.timestamp || new Date().toISOString(),
                    model: targetModel
                }]);

            } catch (fetchError: any) {
                clearTimeout(timeoutId);

                // Generate user-friendly error message
                let errorMessage = '';

                if (fetchError.name === 'AbortError') {
                    errorMessage = `**Request timed out**\n\nThe ${targetModel} model is taking too long to respond. This can happen with complex requests.\n\n**Try:**\n- Simplify your request\n- Use a faster model with \`/grok\`\n- Try again in a moment`;
                } else if (fetchError.message === 'RATE_LIMIT') {
                    errorMessage = `**Rate limit reached**\n\nYou've sent too many requests. Please wait a moment before trying again.\n\n_Tip: Upgrade to Pro for higher rate limits._`;
                } else if (fetchError.message === 'SERVICE_UNAVAILABLE') {
                    errorMessage = `**Service temporarily unavailable**\n\nThe AI service is experiencing high load. Please try again in a few seconds.\n\n**Alternative models:**\n- \`/grok\` - Grok-4 Fast Reasoning\n- \`/deepseek\` - DeepSeek v3.2`;
                } else if (fetchError.message === 'AUTH_ERROR') {
                    errorMessage = `**Authentication required**\n\nPlease log in to continue using HeftCoder.`;
                } else if (fetchError.message === 'Failed to fetch' || fetchError.message.includes('NetworkError')) {
                    errorMessage = `**Network error**\n\nUnable to connect to HeftCoder servers. Please check your internet connection and try again.`;
                } else {
                    errorMessage = `**Something went wrong**\n\n${fetchError.message}\n\n**Try:**\n- Refresh the page\n- Use a different model: \`/grok\`, \`/deepseek\`, \`/flux\``;
                }

                throw new Error(errorMessage);
            }

            setAgentStatus('idle');
        } catch (err: any) {
            console.error('[HeftCoder] Error:', err);
            setMessages(prev => [...prev, {
                id: Date.now(),
                role: 'agent',
                content: err.message,
                timestamp: new Date().toISOString(),
                isError: true
            }]);
            setAgentStatus('idle');
        }
    };

    const handleDownloadZip = () => {
        if (userPlan === 'Free') {
            alert("Upgrade to download code");
            return;
        }
        window.open(`${API_BASE_URL}/api/projects/${projectId}/export?token=${localStorage.getItem('token') || 'mock-token'}`, '_blank');
    };

    const startListening = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice input not supported in this browser.");
            return;
        }

        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
            setIsListening(false);
        };
        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    if (loadError) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6 text-center">
                <div className="max-w-md">
                    <Database size={48} className="text-gray-600 mx-auto mb-4 opacity-50" />
                    <h2 className="text-xl font-bold mb-2">Workspace Error</h2>
                    <p className="text-gray-400 mb-6">{loadError}</p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg transition-colors font-semibold"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/dashboard?create=true')}
                            className="bg-gray-800 hover:bg-gray-700 px-6 py-2 rounded-lg transition-colors font-semibold border border-purple-500/30"
                        >
                            Create New Project
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="border-b border-gray-800 px-4 md:px-6 py-4 flex items-center justify-between flex-shrink-0 bg-black z-10">
                <div className="flex items-center space-x-4">
                    <button className="p-2 hover:bg-gray-800 rounded" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={16} />
                    </button>
                    <div className="hidden md:flex items-center gap-4">
                        <div className="h-6 w-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-sm flex-shrink-0"></div>
                        <div className="flex items-center gap-2">
                            {isEditingName ? (
                                <input
                                    autoFocus
                                    className="bg-transparent border-b border-purple-500 outline-none text-sm font-medium w-48"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    onBlur={async () => {
                                        setIsEditingName(false);
                                        if (projectId && projectName.trim()) {
                                            await supabase.from('projects').update({ name: projectName.trim() }).eq('id', projectId);
                                        }
                                    }}
                                    onKeyDown={async (e) => {
                                        if (e.key === 'Enter') {
                                            setIsEditingName(false);
                                            if (projectId && projectName.trim()) {
                                                await supabase.from('projects').update({ name: projectName.trim() }).eq('id', projectId);
                                            }
                                        }
                                    }}
                                />
                            ) : (
                                <span
                                    className="text-sm font-medium cursor-pointer hover:text-purple-400 transition-colors"
                                    onClick={() => setIsEditingName(true)}
                                >
                                    {projectName}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => setShowFileTree(!showFileTree)}
                        className={`p-2 rounded ${showFileTree ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}
                        title="Toggle File Tree"
                    >
                        <Folder size={18} />
                    </button>
                    <div className="h-6 w-px bg-gray-800 mx-2 hidden md:block"></div>
                    <button
                        onClick={handleDownloadZip}
                        disabled={userPlan === 'Free'}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${userPlan === 'Free' ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-800 hover:bg-gray-700 text-white'
                            }`}
                        title={userPlan === 'Free' ? "Upgrade to download" : "Download Source Code"}
                    >
                        <Download size={14} />
                        <span className="hidden sm:inline">Download</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                {/* File Tree Panel */}
                {showFileTree && (
                    <div className="absolute md:relative z-20 top-0 bottom-0 left-0 w-64 bg-[#0a0a0a] border-r border-gray-800 flex-shrink-0">
                        <FileTree files={files} onFileClick={() => { }} />
                    </div>
                )}

                <div className="flex-1 flex flex-col min-w-0 border-r border-gray-800 bg-black/50 backdrop-blur-sm max-w-xl">
                    <div className="p-4 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-300">HEFTCoder</span>
                            {/* Model badge with model-specific colors */}
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${currentModel === 'grok-4' ? 'bg-amber-900/50 text-amber-300 border-amber-700/50' :
                                currentModel === 'deepseek-v3' ? 'bg-blue-900/50 text-blue-300 border-blue-700/50' :
                                    currentModel === 'flux-2-pro' ? 'bg-pink-900/50 text-pink-300 border-pink-700/50' :
                                        currentModel === 'mistral-medium' ? 'bg-orange-900/50 text-orange-300 border-orange-700/50' :
                                            'bg-purple-900/50 text-purple-300 border-purple-700/50'
                                }`}>
                                {currentModel === 'chatgpt-5.1' ? 'ChatGPT 5.1' :
                                    currentModel === 'grok-4' ? 'Grok 4' :
                                        currentModel === 'deepseek-v3' ? 'DeepSeek V3' :
                                            currentModel === 'mistral-medium' ? 'Mistral' :
                                                currentModel === 'flux-2-pro' ? 'Flux.2-Pro' : currentModel}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Auth indicator */}
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${authUser
                                ? 'bg-green-900/30 text-green-400 border-green-700/50'
                                : 'bg-gray-800 text-gray-500 border-gray-700'
                                }`}>
                                {authLoading ? '...' : authUser?.email?.split('@')[0] || 'Guest'}
                            </span>
                            <div className={`h-2 w-2 rounded-full ${agentStatus === 'working' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                {msg.role !== 'user' && (
                                    <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-900/30">
                                        {/* HeftCoder Logo Icon */}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                                            <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" fill="currentColor" />
                                        </svg>
                                    </div>
                                )}
                                <div className={`max-w-[85%] p-4 rounded-xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-gray-800 text-white ml-auto rounded-tr-none'
                                    : 'bg-[#1a1a1a] text-gray-200 rounded-tl-none border border-gray-800'
                                    }`}>
                                    <MessageContent content={msg.content} role={msg.role} />
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Enhanced Chat Input */}
                    <EnhancedChatInput
                        value={input}
                        onChange={setInput}
                        onSend={handleSendMessage}
                        onModelChange={setSelectedModel}
                        onModeChange={(mode) => console.log('Mode changed to:', mode)}
                        placeholder="Describe your app (e.g., Dark mode landing page)..."
                        disabled={agentStatus === 'working'}
                    />
                </div>

                {/* Right Panel: Live Preview */}
                <div className="flex-1 flex flex-col bg-[#050505]">
                    <div className="p-2 border-b border-gray-800 bg-[#111] flex justify-between items-center text-xs text-gray-500 px-4">
                        <span>LIVE PREVIEW</span>
                        <div className="flex gap-3 items-center">
                            <button
                                onClick={() => window.open(previewUrl, '_blank')}
                                className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                                title="Open in new tab"
                            >
                                <Play size={12} />
                                Open
                            </button>
                            <button
                                onClick={() => {
                                    const iframe = document.querySelector('iframe[title="workspace-preview"]') as HTMLIFrameElement;
                                    if (iframe) iframe.src = iframe.src;
                                }}
                                className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                                title="Refresh preview"
                            >
                                <RefreshCw size={12} />
                                Refresh
                            </button>
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        {previewUrl ? (
                            <iframe
                                src={previewUrl}
                                title="workspace-preview"
                                className="w-full h-full border-none bg-white"
                                sandbox="allow-scripts allow-same-origin"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-4">
                                <Terminal size={48} className="opacity-20" />
                                <p>{loadingFiles ? 'Loading workspace...' : 'No preview available. Create files first.'}</p>
                            </div>
                        )}
                        {/* Loading Overlay */}
                        {agentStatus === 'working' && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center gap-4 shadow-2xl">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                                    <div className="text-sm font-medium">Generating Code with Groq...</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
