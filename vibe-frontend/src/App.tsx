import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Workspace from './pages/Workspace';
import { supabase } from './lib/supabase';
import {
  Paperclip,
  Github,
  Globe,
  ArrowRight,
  RefreshCw,
  Music,
  Cpu,
  Cookie,
  Sparkles,
  Zap,
  Image,
  FileText,
  Figma,
  Link2,
  ChevronDown,
  AudioWaveform,
  X
} from 'lucide-react';

// Actual provider logo icons as SVGs
const ModelIcon = ({ provider }: { provider: string }) => {
  switch (provider) {
    case 'anthropic':
      // Anthropic/Claude logo - stylized A
      return (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M17.5 3L12 21L6.5 3H9.5L12 13L14.5 3H17.5Z" fill="#D97706" />
        </svg>
      );
    case 'openai':
      // OpenAI logo - hexagonal shape
      return (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.8956zm16.0993 3.8558L12.6 8.3829l2.02-1.1638a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.1408 6.6227zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997z" fill="#10B981" />
        </svg>
      );
    case 'google':
      // Google logo - G shape
      return (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      );
    case 'xai':
      // xAI/Grok logo - X shape
      return (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="white" />
        </svg>
      );
    case 'alibaba':
      // Qwen/Alibaba logo - cloud shape
      return (
        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#6366F1" />
        </svg>
      );
    default:
      return <div className="w-5 h-5 rounded-full bg-gray-500 flex-shrink-0" />;
  }
};

// Model list matching user requirements
const models = [
  { id: 'claude-4.5-sonnet', name: 'Claude 4.5 Sonnet', provider: 'anthropic', pro: false },
  { id: 'claude-4.5-sonnet-thinking', name: 'Claude 4.5 Sonnet', provider: 'anthropic', pro: true },
  { id: 'claude-opus-4.5', name: 'Claude Opus 4.5', provider: 'anthropic', pro: true },
  { id: 'gemini-2.5', name: 'Gemini 2.5', provider: 'google', pro: false },
  { id: 'gemini-3-pro', name: 'Gemini 3 Pro', provider: 'google', pro: true },
  { id: 'chatgpt-5.2', name: 'ChatGPT 5.2', provider: 'openai', pro: true },
  { id: 'grok', name: 'Grok', provider: 'xai', pro: true },
  { id: 'qwen-2.5', name: 'Qwen 2.5', provider: 'alibaba', pro: false },
  { id: 'qwen-3.5-thinking', name: 'Qwen 3.5 (Thinking)', provider: 'alibaba', pro: true },
];

export default function App() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('claude-4.5-sonnet');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showAttachDropdown, setShowAttachDropdown] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [visibility, setVisibility] = useState<'auto' | 'manual'>('auto');
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showConnectorsModal, setShowConnectorsModal] = useState(false);

  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const attachDropdownRef = useRef<HTMLDivElement>(null);
  const visibilityDropdownRef = useRef<HTMLDivElement>(null);

  // Check for existing session and redirect if authenticated
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'SIGNED_IN' || event === 'INITIAL_SESSION')) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);



  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setShowModelDropdown(false);
      }
      if (attachDropdownRef.current && !attachDropdownRef.current.contains(e.target as Node)) {
        setShowAttachDropdown(false);
      }
      if (visibilityDropdownRef.current && !visibilityDropdownRef.current.contains(e.target as Node)) {
        setShowVisibilityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSelectedModelName = () => {
    const model = models.find(m => m.id === selectedModel);
    return model ? model.name : 'Claude 4.5 Sonnet';
  };

  // Voice input handler
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input is not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; // Will auto-detect language

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(prev => prev + (prev ? ' ' : '') + transcript);
    };

    recognition.start();
  };

  // Send handler
  const handleSend = async () => {
    if (!prompt.trim()) return;

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setShowAuthPrompt(true);
      return;
    }

    // Navigate to workspace with prompt
    navigate('/workspace', { state: { prompt, model: selectedModel } });
  };

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle suggestion chip click
  const handleSuggestionClick = (label: string) => {
    const prompts: Record<string, string> = {
      'Clone Spotify': 'Build me a music streaming app like Spotify with playlists, search, and a modern dark UI',
      'Idea Logger': 'Create a simple idea logging app where I can quickly capture thoughts with timestamps and tags',
      'Baking Bliss': 'Build a recipe app for baking with ingredient lists, step-by-step instructions, and timer functionality',
      'Surprise Me': 'Build me something creative and useful - surprise me with a unique app idea',
    };
    setPrompt(prompts[label] || label);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-blue-900/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      {/* Auth Prompt Modal */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 relative">
            <h2 className="text-2xl font-bold mb-2">Sign up or Sign in to continue</h2>
            <p className="text-gray-400 mb-6">Create an account to start building with AI</p>
            <div className="flex gap-3">
              <Link to="/login?mode=signup" className="flex-1 bg-orange-500 hover:bg-orange-600 text-black py-3 rounded-lg font-semibold text-center">
                Sign up
              </Link>
              <Link to="/login" className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-lg font-semibold text-center">
                Log in
              </Link>
            </div>
            <button onClick={() => setShowAuthPrompt(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* GitHub Modal */}
      {showGithubModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100]">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl p-8 max-w-md w-full mx-4 relative">
            <button onClick={() => setShowGithubModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <Github size={24} />
              <h2 className="text-xl font-bold">Import from GitHub</h2>
            </div>
            <p className="text-gray-400 mb-6">Connect your GitHub account to import repositories and sync code.</p>
            <input
              type="text"
              placeholder="https://github.com/username/repo"
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-orange-500"
            />
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-black py-3 rounded-lg font-semibold">
              Import Repository
            </button>
          </div>
        </div>
      )}

      {/* Connectors Modal */}
      {showConnectorsModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden relative">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Connectors</h2>
                <p className="text-gray-400 text-sm mt-1">Unlock more with HEFTCoder — connect your favorite tools</p>
              </div>
              <button onClick={() => setShowConnectorsModal(false)} className="text-gray-500 hover:text-white p-2">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Development & Deployment */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Development & Deployment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'GitHub', desc: 'Push and sync code repositories', icon: '🐙', connected: true },
                    { name: 'Vercel', desc: 'Deploy web apps instantly', icon: '▲', connected: false },
                    { name: 'Netlify', desc: 'Continuous deployment platform', icon: '🌐', connected: false },
                    { name: 'Docker', desc: 'Container management', icon: '🐳', connected: false },
                  ].map((c) => (
                    <button key={c.name} className="flex items-center gap-3 p-4 bg-[#252525] hover:bg-[#2a2a2a] rounded-xl border border-white/5 text-left transition-all">
                      <span className="text-2xl">{c.icon}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{c.name}</p>
                        <p className="text-gray-500 text-xs">{c.desc}</p>
                      </div>
                      {c.connected ? (
                        <span className="text-xs text-green-400 bg-green-500/20 px-2 py-1 rounded">Connected</span>
                      ) : (
                        <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">Connect</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI & Automation */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">AI & Automation</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Hugging Face', desc: 'AI models and agents', icon: '🤗', connected: false },
                    { name: 'Zapier', desc: 'Automate workflows', icon: '⚡', connected: false },
                    { name: 'n8n', desc: 'Custom workflow automation', icon: '🔄', connected: false },
                  ].map((c) => (
                    <button key={c.name} className="flex items-center gap-3 p-4 bg-[#252525] hover:bg-[#2a2a2a] rounded-xl border border-white/5 text-left transition-all">
                      <span className="text-2xl">{c.icon}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{c.name}</p>
                        <p className="text-gray-500 text-xs">{c.desc}</p>
                      </div>
                      <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">Connect</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Collaboration */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Collaboration</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Slack', desc: 'Team notifications', icon: '💬', connected: false },
                    { name: 'Discord', desc: 'Community integration', icon: '🎮', connected: false },
                    { name: 'Google Workspace', desc: 'Docs and Drive', icon: '📄', connected: false },
                  ].map((c) => (
                    <button key={c.name} className="flex items-center gap-3 p-4 bg-[#252525] hover:bg-[#2a2a2a] rounded-xl border border-white/5 text-left transition-all">
                      <span className="text-2xl">{c.icon}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{c.name}</p>
                        <p className="text-gray-500 text-xs">{c.desc}</p>
                      </div>
                      <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">Connect</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Payments */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Payments & Crypto</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Stripe', desc: 'Payment processing', icon: '💳', connected: false },
                    { name: 'Crypto.com', desc: 'Crypto payments', icon: '🪙', connected: false },
                  ].map((c) => (
                    <button key={c.name} className="flex items-center gap-3 p-4 bg-[#252525] hover:bg-[#2a2a2a] rounded-xl border border-white/5 text-left transition-all">
                      <span className="text-2xl">{c.icon}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{c.name}</p>
                        <p className="text-gray-500 text-xs">{c.desc}</p>
                      </div>
                      <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">Connect</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Design */}
              <div className="mb-2">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Design & Media</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: 'Figma', desc: 'UI/UX design imports', icon: '🎨', connected: false },
                    { name: 'Adobe Creative Cloud', desc: 'Creative assets', icon: '🖼️', connected: false },
                    { name: 'Sora 2', desc: 'AI-generated media', icon: '🎬', connected: false },
                  ].map((c) => (
                    <button key={c.name} className="flex items-center gap-3 p-4 bg-[#252525] hover:bg-[#2a2a2a] rounded-xl border border-white/5 text-left transition-all">
                      <span className="text-2xl">{c.icon}</span>
                      <div className="flex-1">
                        <p className="text-white font-medium">{c.name}</p>
                        <p className="text-gray-500 text-xs">{c.desc}</p>
                      </div>
                      <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded">Connect</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-[#151515]">
              <p className="text-xs text-gray-500 text-center">Upgrade to Pro to unlock all connectors</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center text-black font-bold">
              <Zap size={20} fill="currentColor" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">HeftCoder</span>
          </div>
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-400">
            <Link to="/products" className="hover:text-white transition-colors">Products</Link>
            <Link to="/for-work" className="hover:text-white transition-colors">For Work</Link>
            <Link to="/resources" className="hover:text-white transition-colors">Resources</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/careers" className="hover:text-white transition-colors">Careers</Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Log in</Link>
          <Link to="/login?mode=signup" className="bg-orange-500 hover:bg-orange-600 text-black px-5 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105">
            Sign up
          </Link>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 pt-40 px-6 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent">
            Where ideas become reality
          </h1>
          <p className="text-xl text-gray-400 mb-12 font-light">
            Build fully functional apps and websites through simple conversations
          </p>

          {/* AI Input Container */}
          <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-sm relative group focus-within:border-white/20 transition-all">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Build me an app for..."
              className="w-full h-24 bg-transparent text-lg text-white placeholder-gray-600 resize-none focus:outline-none p-2 mb-12"
            />

            {/* Input Toolbar - Responsive: Full on Desktop, Simplified on Mobile */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center gap-2">
              {/* Left Side: Paperclip + GitHub (desktop only) + Model Selector */}
              <div className="flex items-center gap-1 sm:gap-3">
                {/* Paperclip Dropdown */}
                <div className="relative" ref={attachDropdownRef}>
                  <button
                    onClick={() => setShowAttachDropdown(!showAttachDropdown)}
                    className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Paperclip size={20} />
                  </button>
                  {showAttachDropdown && (
                    <div className="absolute bottom-full mb-2 left-0 bg-[#1a1a1a] border border-white/10 rounded-xl py-2 w-52 shadow-xl z-50">
                      <button onClick={() => { setShowGithubModal(true); setShowAttachDropdown(false); }} className="sm:hidden w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                        <Github size={18} /> Connect GitHub
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                        <Image size={18} /> Import images
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                        <FileText size={18} /> Import files
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                        <Figma size={18} /> Import Figma design
                      </button>
                      <button onClick={() => { setShowConnectorsModal(true); setShowAttachDropdown(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white">
                        <Link2 size={18} /> Add connectors
                      </button>
                    </div>
                  )}
                </div>

                {/* GitHub Button - Desktop Only */}
                <button
                  onClick={() => setShowGithubModal(true)}
                  className="hidden sm:flex p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Github size={20} />
                </button>

                {/* Model Selector Dropdown */}
                <div className="relative" ref={modelDropdownRef}>
                  <button
                    onClick={() => setShowModelDropdown(!showModelDropdown)}
                    className="h-8 px-2 sm:px-3 flex items-center gap-1 sm:gap-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-xs sm:text-sm text-gray-300 hover:bg-[#252525] cursor-pointer transition-colors max-w-[120px] sm:max-w-none"
                  >
                    <Sparkles size={14} className="text-orange-500 flex-shrink-0" />
                    <span className="truncate">{getSelectedModelName()}</span>
                    <ChevronDown size={12} className={`flex-shrink-0 transition-transform ${showModelDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  {showModelDropdown && (
                    <div className="absolute bottom-full mb-2 left-0 bg-[#1a1a1a] border border-white/10 rounded-xl py-2 w-64 shadow-2xl z-50">
                      {models.map((model) => (
                        <button
                          key={model.id}
                          onClick={() => { setSelectedModel(model.id); setShowModelDropdown(false); }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${selectedModel === model.id ? 'bg-white/5' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <ModelIcon provider={model.provider} />
                            <span className={selectedModel === model.id ? 'text-white font-medium' : 'text-gray-300'}>{model.name}</span>
                          </div>
                          {model.pro && (
                            <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded font-medium">Pro</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side: Visibility (desktop only) + Voice + Send */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Visibility Toggle - Desktop Only */}
                <div className="hidden sm:block relative" ref={visibilityDropdownRef}>
                  <button
                    onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:text-white text-xs font-medium bg-white/5 rounded-full hover:bg-white/10 transition-colors"
                  >
                    <Globe size={14} />
                    {visibility === 'auto' ? 'Auto' : 'Manual'}
                    <ChevronDown size={12} />
                  </button>
                  {showVisibilityDropdown && (
                    <div className="absolute bottom-full mb-2 right-0 bg-[#1a1a1a] border border-white/10 rounded-lg py-1 w-28 shadow-xl z-50">
                      <button
                        onClick={() => { setVisibility('auto'); setShowVisibilityDropdown(false); }}
                        className={`w-full px-4 py-2 text-sm text-left hover:bg-white/5 ${visibility === 'auto' ? 'text-orange-500' : 'text-gray-300'}`}
                      >
                        Auto
                      </button>
                      <button
                        onClick={() => { setVisibility('manual'); setShowVisibilityDropdown(false); }}
                        className={`w-full px-4 py-2 text-sm text-left hover:bg-white/5 ${visibility === 'manual' ? 'text-orange-500' : 'text-gray-300'}`}
                      >
                        Manual
                      </button>
                    </div>
                  )}
                </div>

                {/* Voice Input */}
                <button
                  onClick={handleVoiceInput}
                  className={`p-2 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-500 hover:text-white'}`}
                >
                  <AudioWaveform size={20} />
                </button>

                {/* Send Button */}
                <button
                  onClick={handleSend}
                  className={`p-2.5 rounded-full transition-all flex-shrink-0 ${prompt ? 'bg-orange-500 text-black hover:scale-110 cursor-pointer' : 'bg-[#252525] text-gray-600 cursor-not-allowed'}`}
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>


          {/* Suggestion Chips */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { icon: Music, label: 'Clone Spotify' },
              { icon: Cpu, label: 'Idea Logger' },
              { icon: Cookie, label: 'Baking Bliss' },
              { icon: Sparkles, label: 'Surprise Me' },
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleSuggestionClick(chip.label)}
                className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border border-white/5 hover:border-white/20 hover:bg-[#252525] rounded-xl text-sm text-gray-400 hover:text-white transition-all"
              >
                <chip.icon size={16} />
                {chip.label}
              </button>
            ))}
            <button className="p-2 text-gray-600 hover:text-gray-400 hover:rotate-180 transition-all duration-500">
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </main>

      {/* Trusted By Section - Animated Carousel */}
      <section className="py-20 border-t border-white/5 bg-[#0a0a0a] overflow-hidden">
        <div className="max-w-6xl mx-auto text-center px-6">
          <p className="text-sm text-gray-500 mb-8 uppercase tracking-widest font-semibold">
            Trusted by innovators at
          </p>
          <div className="relative">
            <div className="flex animate-scroll gap-16 items-center">
              {['OPIC', 'Coinbase', 'Hg', 'Oscar', 'ARK Invest', 'Zillow', 'Stripe', 'Vercel', 'OPIC', 'Coinbase', 'Hg', 'Oscar', 'ARK Invest', 'Zillow', 'Stripe', 'Vercel'].map((logo, i) => (
                <span key={`${logo}-${i}`} className="text-xl font-bold text-gray-400 whitespace-nowrap opacity-60 hover:opacity-100 transition-opacity">{logo}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Orchestrator Agents Section - Orange Banner */}
      <section className="py-24 px-6 bg-gradient-to-b from-orange-600 to-orange-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Orchestrator Agents by HEFTCoder
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              The most powerful autonomous AI agents for building production-ready applications in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Agent Demo Animation */}
            <div className="bg-[#0a0a0a] rounded-2xl p-6 border border-white/10 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-500 text-sm ml-2">Agent Chat</span>
                </div>

                {/* Animated Chat Messages */}
                <div className="space-y-3 animate-pulse-slow">
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">U</div>
                    <div className="bg-[#1a1a1a] rounded-lg px-4 py-2 text-gray-300 text-sm max-w-[80%]">
                      Build me a dashboard with charts and user auth
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="bg-orange-500/20 border border-orange-500/30 rounded-lg px-4 py-2 text-orange-200 text-sm max-w-[80%]">
                      Creating React dashboard with Chart.js, setting up Supabase auth...
                    </div>
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-black text-xs font-bold">AI</div>
                  </div>
                  <div className="flex gap-3 justify-end">
                    <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2 text-green-200 text-sm max-w-[80%]">
                      ✓ Dashboard deployed! Preview available at your-app.heftcoder.app
                    </div>
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-black text-xs font-bold">AI</div>
                  </div>
                </div>

                {/* Agent Tools */}
                <div className="mt-6 p-4 bg-[#1a1a1a] rounded-lg">
                  <p className="text-xs text-gray-500 mb-3">Agent Tools</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Extended thinking</span>
                      <div className="w-10 h-5 bg-orange-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" /></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">High-power model</span>
                      <div className="w-10 h-5 bg-gray-600 rounded-full relative"><div className="absolute left-0.5 top-0.5 w-4 h-4 bg-gray-400 rounded-full" /></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-300">Web search</span>
                      <div className="w-10 h-5 bg-orange-500 rounded-full relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Description */}
            <div className="text-white">
              <h3 className="text-3xl font-bold mb-6">Build & refine your app with Agent</h3>
              <p className="text-white/80 mb-6 leading-relaxed">
                Start by telling the HEFTCoder Agent what kind of app or site you want to build.
                Then, keep improving it by giving the Agent feedback. The Agent automatically
                searches the Web as needed to ensure it has access to the latest information to fulfill your request.
              </p>
              <p className="text-white/80 mb-8 leading-relaxed">
                For more complex tasks, turn on advanced options like <strong>Extended Thinking</strong> and <strong>High-Power Models</strong>.
              </p>
              <button
                onClick={() => navigate('/login?mode=signup')}
                className="bg-black text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all hover:scale-105 shadow-xl"
              >
                Start Building with Agent →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 border-t border-white/5 bg-[#0a0a0a]">
        <h2 className="text-4xl font-bold text-center mb-4 text-white tracking-tight">Choose Your Plan</h2>
        <p className="text-gray-400 text-center mb-4">AI-powered coding with transparent, predictable pricing</p>
        <p className="text-gray-500 text-center text-sm mb-12">Credits reset monthly • No surprise overages • Upgrade anytime</p>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Basic",
              price: "$9",
              period: "/month",
              credits: "10,000 HeftCredits",
              tagline: "For builders, learners, and light projects",
              trial: "7 days free (2,500 credits)",
              features: [
                "GPT-5.1 (Orchestrator Mode)",
                "Single-agent coding",
                "Prompt-to-code workflows",
                "Chat-based coding & debugging",
                "Public project workspace"
              ],
              cta: "Start Free Trial",
              onClick: () => {
                window.location.href = '/pricing';
              },
              popular: false,
              color: "green"
            },
            {
              name: "Pro",
              price: "$25",
              period: "/month",
              credits: "50,000 HeftCredits",
              tagline: "For serious developers shipping real products",
              features: [
                "Multi-agent VIBE coding",
                "Planner + Coder + Reviewer Agents",
                "GPT-5.1-Codex-Mini",
                "Long-context reasoning",
                "Private workspaces",
                "Faster response priority"
              ],
              cta: "Upgrade Now",
              onClick: () => {
                window.location.href = '/pricing';
              },
              popular: true,
              color: "blue"
            },
            {
              name: "Studio",
              price: "$59",
              period: "/month",
              credits: "150,000 HeftCredits",
              tagline: "For power users, teams, and AI-first development",
              features: [
                "Full multi-agent orchestration",
                "ALL models: GPT-5.1 + Claude 4.5 Opus",
                "Smart model routing",
                "Long-running background jobs",
                "Private + team workspaces",
                "Priority compute & fastest responses",
                "Early access to new features"
              ],
              cta: "Go Studio",
              onClick: () => {
                window.location.href = '/pricing';
              },
              popular: false,
              flagship: true,
              color: "purple"
            }
          ].map((tier, i) => (
            <div
              key={i}
              className={`flex flex-col p-6 rounded-2xl border transition-all hover:scale-105 relative ${tier.popular
                ? 'bg-gradient-to-b from-blue-900/20 to-[#0f0f18] border-blue-500/50 scale-105 shadow-2xl shadow-blue-500/10'
                : tier.flagship
                  ? 'bg-gradient-to-b from-purple-900/20 to-[#0f0f18] border-purple-500/50'
                  : 'bg-[#121212] border-white/5'
                }`}
            >
              {tier.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold text-white bg-blue-600 rounded-full">
                  MOST POPULAR
                </span>
              )}
              {tier.flagship && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold text-white bg-purple-600 rounded-full">
                  FLAGSHIP
                </span>
              )}
              {tier.trial && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold text-white bg-green-600 rounded-full">
                  🎁 7 DAYS FREE
                </span>
              )}
              <h3 className="text-xl font-bold text-white mt-2">{tier.name}</h3>
              <p className="text-gray-400 text-sm mb-3">{tier.tagline}</p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-white">{tier.price}</span>
                <span className="text-gray-500">{tier.period}</span>
              </div>
              <p className={`text-sm font-medium mb-4 ${tier.color === 'green' ? 'text-green-400' :
                tier.color === 'blue' ? 'text-blue-400' : 'text-purple-400'
                }`}>{tier.credits}</p>
              <ul className="mb-6 space-y-2 flex-1">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-start text-gray-300 text-sm">
                    <Zap className="w-4 h-4 text-orange-500 mr-2 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={tier.onClick}
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-all ${tier.popular
                  ? "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105 shadow-lg shadow-blue-500/30"
                  : tier.flagship
                    ? "bg-purple-600 hover:bg-purple-700 text-white hover:scale-105 shadow-lg shadow-purple-500/30"
                    : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050505] text-gray-400 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <div className="flex items-center mb-4 gap-2">
              <div className="h-6 w-6 bg-orange-500 rounded flex items-center justify-center text-black">
                <Zap size={14} fill="currentColor" />
              </div>
              <span className="text-white font-bold text-lg">HeftCoder</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              AI-powered dev environment for the next generation of builders.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/features" className="hover:text-orange-500 transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-orange-500 transition-colors">Pricing</Link></li>
              <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/docs" className="hover:text-orange-500 transition-colors">Docs</Link></li>
              <li><Link to="/api" className="hover:text-orange-500 transition-colors">API</Link></li>
              <li><Link to="/community" className="hover:text-orange-500 transition-colors">Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-orange-500 transition-colors">Privacy</Link></li>
              <li><Link to="/terms" className="hover:text-orange-500 transition-colors">Terms</Link></li>
              <li><Link to="/security" className="hover:text-orange-500 transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/5 mt-12 pt-8 text-center text-xs text-gray-600">
          © 2025 HeftCoder. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
