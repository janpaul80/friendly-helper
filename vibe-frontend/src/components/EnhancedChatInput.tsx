import { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown, Image, FileText, Square } from 'lucide-react';

// Model SVG Icons
const ModelIcons = {
    chatgpt: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z" />
        </svg>
    ),
    grok: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
        </svg>
    ),
    deepseek: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
    ),
    mistral: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <rect x="2" y="4" width="4" height="4" />
            <rect x="10" y="4" width="4" height="4" />
            <rect x="18" y="4" width="4" height="4" />
            <rect x="2" y="10" width="4" height="4" />
            <rect x="6" y="10" width="4" height="4" />
            <rect x="10" y="10" width="4" height="4" />
            <rect x="14" y="10" width="4" height="4" />
            <rect x="18" y="10" width="4" height="4" />
            <rect x="2" y="16" width="4" height="4" />
            <rect x="10" y="16" width="4" height="4" />
            <rect x="18" y="16" width="4" height="4" />
        </svg>
    ),
    flux: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" />
        </svg>
    )
};

// Model list - matches HeftCoder orchestrator
const models = [
    { id: 'chatgpt-5.1', name: 'ChatGPT 5.1', provider: 'openai', icon: 'chatgpt' },
    { id: 'grok-4', name: 'Grok 4 (Thinking)', provider: 'xai', icon: 'grok' },
    { id: 'deepseek-v3', name: 'DeepSeek V3', provider: 'deepseek', icon: 'deepseek' },
    { id: 'mistral-medium', name: 'Mistral Medium', provider: 'mistral', icon: 'mistral' },
    { id: 'flux-2-pro', name: 'Flux.2-Pro', provider: 'flux', icon: 'flux' },
];

interface EnhancedChatInputProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void;
    onModelChange?: (modelId: string) => void;
    onModeChange?: (mode: 'manual' | 'auto') => void;
    placeholder?: string;
    disabled?: boolean;
    autoFocus?: boolean;
}

export function EnhancedChatInput({
    value,
    onChange,
    onSend,
    onModelChange,
    onModeChange,
    placeholder = "Type your task here (@ to add files)...",
    disabled = false,
    autoFocus = false
}: EnhancedChatInputProps) {
    const [selectedModel, setSelectedModel] = useState('chatgpt-5.1');
    const [showModelDropdown, setShowModelDropdown] = useState(false);
    const [showFilesDropdown, setShowFilesDropdown] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [mode, setMode] = useState<'manual' | 'auto'>('manual');

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const modelDropdownRef = useRef<HTMLDivElement>(null);
    const filesDropdownRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }, [value]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
                setShowModelDropdown(false);
            }
            if (filesDropdownRef.current && !filesDropdownRef.current.contains(e.target as Node)) {
                setShowFilesDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleModelSelect = (modelId: string) => {
        setSelectedModel(modelId);
        setShowModelDropdown(false);
        onModelChange?.(modelId);
    };

    const handleModeToggle = (newMode: 'manual' | 'auto') => {
        setMode(newMode);
        onModeChange?.(newMode);
    };

    const getSelectedModel = () => {
        return models.find(m => m.id === selectedModel) || models[0];
    };

    const renderModelIcon = (iconKey: string) => {
        const IconComponent = ModelIcons[iconKey as keyof typeof ModelIcons];
        return IconComponent ? <IconComponent /> : null;
    };

    const handleVoiceInput = () => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice input is not supported in your browser.');
            return;
        }

        if (isListening) {
            setIsListening(false);
            return;
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = navigator.language || 'en-US';

        let finalTranscript = '';
        let silenceTimer: number;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => {
            setIsListening(false);
            if (silenceTimer) clearTimeout(silenceTimer);
        };
        recognition.onerror = () => setIsListening(false);

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }
            const fullText = (finalTranscript + interimTranscript).trim();
            if (fullText) onChange(fullText);

            if (finalTranscript.trim()) {
                if (silenceTimer) clearTimeout(silenceTimer);
                silenceTimer = setTimeout(() => {
                    recognition.stop();
                    setIsListening(false);
                    if (onSend) setTimeout(() => onSend(), 100);
                }, 1500);
            }
        };

        try {
            recognition.start();
        } catch (error) {
            setIsListening(false);
            alert('Failed to start voice input.');
        }
    };

    const handleFileSelect = (type: 'image' | 'file') => {
        if (fileInputRef.current) {
            fileInputRef.current.accept = type === 'image' ? 'image/*' : '*/*';
            fileInputRef.current.click();
        }
        setShowFilesDropdown(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (value.trim() && !disabled) {
                onSend();
                if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                }
            }
        }
    };

    return (
        <div className="border-t border-gray-800/50 bg-black">
            {/* Top Bar: Model Selector + "10X Coding Agent" */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800/30">
                {/* Model Dropdown */}
                <div className="relative" ref={modelDropdownRef}>
                    <button
                        onClick={() => setShowModelDropdown(!showModelDropdown)}
                        disabled={disabled}
                        className="px-3 py-1.5 bg-[#0f0f0f] border border-gray-800 rounded text-sm text-gray-300 hover:bg-gray-900 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <span className="text-gray-400">{renderModelIcon(getSelectedModel().icon)}</span>
                        <span>{getSelectedModel().name}</span>
                        <ChevronDown size={14} className={`transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                    </button>

                    {showModelDropdown && (
                        <div className="absolute bottom-full mb-2 left-0 bg-[#0f0f0f] border border-gray-800 rounded-lg py-1 w-56 shadow-2xl z-50">
                            {models.map((model) => (
                                <button
                                    key={model.id}
                                    onClick={() => handleModelSelect(model.id)}
                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-900 transition-colors flex items-center gap-3 ${selectedModel === model.id ? 'bg-gray-900 text-white' : 'text-gray-400'
                                        }`}
                                >
                                    <span className="text-gray-500">{renderModelIcon(model.icon)}</span>
                                    {model.name}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* "10X Coding Agent" Text */}
                <span className="text-sm font-medium text-orange-500">
                    10X Coding Agent
                </span>
            </div>

            {/* Input Area */}
            <div className="px-4 pt-4 pb-2">
                <div className="flex items-end gap-3 bg-[#1a1a1a] border border-gray-800 rounded-lg p-3 focus-within:border-gray-700 transition-colors">
                    {/* Center: Textarea */}
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        disabled={disabled}
                        autoFocus={autoFocus}
                        className="flex-1 bg-transparent border-none outline-none text-sm text-gray-200 placeholder-gray-600 resize-none min-h-[40px] max-h-[200px]"
                        rows={1}
                    />

                    {/* Right: Icons */}
                    <div className="flex items-center gap-2">
                        {/* Voice Icon (Audio Waveform) */}
                        <button
                            onClick={handleVoiceInput}
                            disabled={disabled}
                            className={`p-2 rounded transition-colors ${isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                                }`}
                            title="Voice input"
                            aria-label="Voice input"
                        >
                            {/* Audio Waveform SVG */}
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="2" y1="12" x2="2" y2="12" />
                                <line x1="6" y1="9" x2="6" y2="15" />
                                <line x1="10" y1="6" x2="10" y2="18" />
                                <line x1="14" y1="4" x2="14" y2="20" />
                                <line x1="18" y1="6" x2="18" y2="18" />
                                <line x1="22" y1="9" x2="22" y2="15" />
                            </svg>
                        </button>

                        {/* Files Square Icon with Dropdown */}
                        <div className="relative" ref={filesDropdownRef}>
                            <button
                                onClick={() => setShowFilesDropdown(!showFilesDropdown)}
                                disabled={disabled}
                                className="p-2 text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded transition-colors"
                                title="Add files"
                                aria-label="Add files"
                            >
                                <Square size={18} />
                            </button>

                            {showFilesDropdown && (
                                <div className="absolute bottom-full right-0 mb-2 bg-[#0f0f0f] border border-gray-800 rounded-lg py-1 w-48 shadow-2xl z-50">
                                    <button
                                        onClick={() => handleFileSelect('image')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-900 hover:text-gray-200 flex items-center gap-2"
                                    >
                                        <Image size={16} />
                                        Upload Image
                                    </button>
                                    <button
                                        onClick={() => handleFileSelect('file')}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-900 hover:text-gray-200 flex items-center gap-2"
                                    >
                                        <FileText size={16} />
                                        Upload File
                                    </button>
                                    <button
                                        onClick={() => { setShowFilesDropdown(false); alert('Figma import coming soon!'); }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:bg-gray-900 hover:text-gray-200 flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 2C6.9 2 6 2.9 6 4V20C6 21.1 6.9 22 8 22C9.1 22 10 21.1 10 20V14H12C13.1 14 14 13.1 14 12V10C14 8.9 13.1 8 12 8H10V4C10 2.9 9.1 2 8 2ZM16 8C14.9 8 14 8.9 14 10V14C14 15.1 14.9 16 16 16C17.1 16 18 15.1 18 14V10C18 8.9 17.1 8 16 8Z" />
                                        </svg>
                                        Import from Figma
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Send Button */}
                        <button
                            onClick={onSend}
                            disabled={!value.trim() || disabled}
                            className="p-2 bg-orange-600 hover:bg-orange-500 rounded text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            title="Send message"
                            aria-label="Send message"
                        >
                            <Send size={16} />
                        </button>
                    </div>

                    {/* Hidden file input */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                console.log('File selected:', file.name);
                            }
                        }}
                    />
                </div>

                {/* Manual/Auto Toggle */}
                <div className="flex gap-2 mt-3 px-1">
                    <button
                        onClick={() => handleModeToggle('manual')}
                        className={`px-3 py-1 text-xs rounded transition-colors ${mode === 'manual'
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
                            }`}
                    >
                        Manual
                    </button>
                    <button
                        onClick={() => handleModeToggle('auto')}
                        className={`px-3 py-1 text-xs rounded transition-colors ${mode === 'auto'
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-500 hover:bg-gray-900 hover:text-gray-300'
                            }`}
                    >
                        Auto
                    </button>
                </div>
            </div>
        </div>
    );
}
