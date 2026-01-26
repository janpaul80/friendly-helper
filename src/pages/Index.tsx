// HeftCoder Landing Page - Main Entry
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { supabase } from "../integrations/supabase/client";
import { motion, useInView } from "framer-motion";
import { Header } from "../components/marketing/Header";
import { Footer } from "../components/marketing/Footer";
import { toast } from "sonner";
import { openExternalUrl, preopenExternalWindow } from "../lib/openExternal";
import {
  Paperclip,
  Github,
  ArrowRight,
  Music,
  Cpu,
  Cookie,
  Sparkles,
  Zap,
  Image,
  FileText,
  Link2,
  ChevronDown,
  AudioWaveform,
  X,
  CheckCircle,
  Loader2,
  MessageSquare,
  MessageCircle
} from "lucide-react";

// Animation variants for scroll-triggered sections
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const }
  }
};

// Reusable scroll-triggered section wrapper
const AnimatedSection = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" as const, delay }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Model list matching the design
const models = [
  { id: "heftcoder-pro", name: "HeftCoder PRO (Sonnet 4.5)", provider: "anthropic", pro: true },
  { id: "heftcoder-plus", name: "HeftCoder Plus (Mistral)", provider: "mistral", pro: true },
  { id: "ui-architect", name: "UI Architect", provider: "mistral", pro: true },
  { id: "debugger-pro", name: "Debugger Pro", provider: "mistral", pro: true },
  { id: "general-assistant", name: "General Assistant", provider: "anthropic", pro: false },
  { id: "mistral-large", name: "Mistral Large 3", provider: "mistral", pro: true },
  { id: "flux.2-pro", name: "Flux.2-Pro", provider: "flux", pro: true },
  { id: "sora", name: "Sora Video Gen", provider: "openai", pro: true },
];

const ModelIcon = ({ provider }: { provider: string }) => {
  switch (provider) {
    case 'anthropic':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L4 18H7.5L9.5 13.5H14.5L16.5 18H20L12 2ZM12 7.5L13.8 11.5H10.2L12 7.5Z" fill="#ff7f50" />
        </svg>
      );
    case 'openai':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5153-4.9066 6.0462 6.0462 0 0 0-4.445-2.9155 6.0073 6.0073 0 0 0-5.6381 2.3848 6.0134 6.0134 0 0 0-5.4505-1.0888 6.0524 6.0524 0 0 0-4.0026 3.4936 6.0073 6.0073 0 0 0 .8093 6.2202 5.9847 5.9847 0 0 0 .5154 4.9056 6.0462 6.0462 0 0 0 4.4451 2.9155 6.0072 6.0072 0 0 0 5.638-2.3858 6.0134 6.0134 0 0 0 5.4515 1.0888 6.0524 6.0524 0 0 0 4.0026-3.4936 6.0073 6.0073 0 0 0-.8094-6.2202Z" fill="white" />
        </svg>
      );
    case 'mistral':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L4 22L12 18L20 22L12 2Z" fill="#f97316" />
        </svg>
      );
    case 'flux':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="#8B5CF6" />
          <circle cx="8.5" cy="8.5" r="1.5" fill="white" />
          <path d="M21 15L16 10L5 21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return <div className="w-5 h-5 rounded-full bg-gray-500 flex-shrink-0" />;
  }
};

const ConnectorsModal = ({ onClose }: { onClose: () => void }) => {
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const toggleConnection = (id: string) => {
    setConnected(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const apps = [
    { id: 'github', name: 'GitHub', icon: Github, color: 'text-white' },
    { id: 'slack', name: 'Slack', icon: MessageSquare, color: 'text-purple-400' },
    { id: 'notion', name: 'Notion', icon: FileText, color: 'text-gray-200' },
    { id: 'linear', name: 'Linear', icon: Zap, color: 'text-blue-400' },
    { id: 'discord', name: 'Discord', icon: MessageCircle, color: 'text-indigo-400' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden relative shadow-2xl flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#111]">
          <div>
            <h2 className="text-2xl font-bold text-white">Connectors</h2>
            <p className="text-gray-400 text-sm mt-1">Supercharge HeftCoder with your favorite tools.</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white p-2 transition-colors rounded-lg hover:bg-white/5">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {apps.map(app => (
            <div key={app.id} className="p-4 rounded-xl border border-white/5 bg-white/5 hover:border-white/10 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-black/50 ${app.color}`}>
                  <app.icon size={20} />
                </div>
                <span className="font-medium text-gray-200">{app.name}</span>
              </div>
              <button
                onClick={() => toggleConnection(app.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${connected[app.id]
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-transparent'
                  }`}
              >
                {connected[app.id] ? 'Connected' : 'Connect'}
              </button>
            </div>
          ))}
          <div className="p-4 rounded-xl border border-dashed border-white/10 flex flex-col items-center justify-center text-gray-500 gap-2 min-h-[100px]">
            <span className="text-xs uppercase tracking-widest font-bold">More Coming Soon</span>
          </div>
        </div>
        <div className="p-4 border-t border-white/10 bg-[#111] flex justify-end">
          <button onClick={onClose} className="bg-white text-black px-6 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// Trusted logos
const trustedLogos = ['Stripe', 'Vercel', 'Hg', 'Oscar', 'ARK Invest', 'Zillow', 'Microsoft', 'Coinbase'];

export default function LandingPage() {
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('heftcoder-pro');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [showAttachDropdown, setShowAttachDropdown] = useState(false);
  const [showConnectorsModal, setShowConnectorsModal] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [isGithubConnected, setIsGithubConnected] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const attachDropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setShowModelDropdown(false);
      }
      if (attachDropdownRef.current && !attachDropdownRef.current.contains(e.target as Node)) {
        setShowAttachDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Redirect to auth when user interacts with chat input
  const handlePromptFocus = () => {
    if (isAuthenticated === false) {
      navigate('/auth');
    }
  };

  const handleUpgrade = async (plan: string) => {
    setLoadingPlan(plan);
    // In the editor, open Stripe in a new tab (Stripe Checkout doesn't like iframes)
    const checkoutWindow = preopenExternalWindow();
    try {
      const supabaseUrl = "https://ythuhewbaulqirjrkgly.supabase.co";
      const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aHVoZXdiYXVscWlyanJrZ2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzOTkwMDgsImV4cCI6MjA4NDk3NTAwOH0.lbkprUMf_qkyzQOBqSOboipowjA0K8HZ2yaPglwe8MI";
      
      console.log("Starting checkout for plan:", plan);
      
      const response = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          plan: plan.charAt(0).toUpperCase() + plan.slice(1),
          userId: null,
          userEmail: null,
        }),
      });

      console.log("Response status:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Response not OK:", errorText);
        toast.error("Failed to create checkout session. Please try again.");
        return;
      }
      
      const data = await response.json();
      console.log("Response data:", data);
      
      if (data?.url) {
        console.log("Redirecting to:", data.url);
        openExternalUrl(data.url, checkoutWindow);
      } else if (data?.error) {
        console.error("Checkout error:", data.error);
        toast.error(data.error || "An error occurred. Please try again.");
      } else {
        console.error("No URL in response:", data);
        toast.error("Failed to get checkout URL. Please try again.");
      }
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const getSelectedModelName = () => {
    const model = models.find(m => m.id === selectedModel);
    return model ? model.name : 'Heft Orchestrator';
  };

  const handleSend = () => {
    if (!prompt.trim()) return;
    const tempId = `temp-${Date.now()}`;
    navigate(`/workspace/${tempId}?prompt=${encodeURIComponent(prompt)}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPrompt(prev => prev + `\n[Attached: ${file.name}]`);
      setShowAttachDropdown(false);
    }
  };

  const handleGithubConnect = () => {
    setIsGithubConnected(true);
    setShowAttachDropdown(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-orange-500/30 overflow-x-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-900/10 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-blue-900/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      {/* Connectors Modal */}
      {showConnectorsModal && <ConnectorsModal onClose={() => setShowConnectorsModal(false)} />}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />

      <Header />

      <main className="relative z-10 pt-40 px-6 pb-20">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div 
            variants={staggerItem}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-600/10 border border-orange-500/20 text-orange-500 text-xs font-medium mb-8 animate-pulse"
          >
            <Zap className="w-3 h-3" />
            <span>v2.1 Orchestrator Mode Live</span>
          </motion.div>
          <motion.h1 
            variants={staggerItem}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-br from-white via-white to-gray-500 bg-clip-text text-transparent leading-[1.1]"
          >
            Where ideas become <br /> reality
          </motion.h1>
          <motion.p 
            variants={staggerItem}
            className="text-xl text-gray-400 mb-12 font-light max-w-2xl mx-auto"
          >
            The most powerful autonomous AI agents for building production-ready applications in minutes.
          </motion.p>

          <motion.div 
            variants={fadeInScale}
            className="bg-[#121212] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-sm relative group focus-within:border-orange-500/50 transition-all"
          >
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onFocus={handlePromptFocus}
              placeholder="Build me a SaaS platform for..."
              className="w-full h-24 bg-transparent text-lg text-white placeholder-gray-600 resize-none focus:outline-none p-2 mb-12"
            />

            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center gap-2">
              <div className="flex items-center gap-1 sm:gap-3">
                <div className="relative" ref={attachDropdownRef}>
                  <button
                    onClick={() => setShowAttachDropdown(!showAttachDropdown)}
                    className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  >
                    <Paperclip size={20} />
                  </button>
                  {showAttachDropdown && (
                    <div className="absolute bottom-full mb-2 left-0 bg-[#1a1a1a] border border-white/10 rounded-xl py-2 w-52 shadow-xl z-50">
                      <button
                        onClick={handleGithubConnect}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white text-left"
                      >
                        <Github size={18} className={isGithubConnected ? "text-green-500" : ""} />
                        {isGithubConnected ? "GitHub Connected" : "Connect GitHub"}
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white text-left"
                      >
                        <Image size={18} /> Import images
                      </button>
                      <button
                        onClick={() => { setShowConnectorsModal(true); setShowAttachDropdown(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white text-left"
                      >
                        <Link2 size={18} /> Add connectors
                      </button>
                    </div>
                  )}
                </div>

                <div className="h-9 px-3 flex items-center gap-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-sm text-gray-300">
                  <ModelIcon provider="anthropic" />
                  <span>Heftcoder Orchestrator</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-500 hover:text-white transition-colors">
                  <AudioWaveform size={20} />
                </button>
                <button
                  onClick={handleSend}
                  className={`p-3 rounded-xl transition-all ${prompt ? 'bg-orange-600 text-white hover:scale-105 shadow-[0_0_20px_rgba(234,88,12,0.4)]' : 'bg-[#252525] text-gray-600'}`}
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            {[
              { icon: Music, label: 'Clone Spotify' },
              { icon: Cpu, label: 'Idea Logger' },
              { icon: Cookie, label: 'Baking Bliss' },
              { icon: Sparkles, label: 'Surprise Me' },
            ].map((chip) => (
              <motion.button
                key={chip.label}
                variants={staggerItem}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPrompt(chip.label === 'Surprise Me' ? 'Build me something unique and creative' : `Build me a ${chip.label.toLowerCase()} app`)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 rounded-xl text-sm text-gray-400 hover:text-white transition-all shadow-lg"
              >
                <chip.icon size={16} />
                {chip.label}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </main>

      {/* Trusted By Carousel */}
      <section className="py-20 border-t border-white/5 bg-[#0a0a0a] overflow-hidden select-none">
        <AnimatedSection className="max-w-6xl mx-auto text-center px-6">
          <p className="text-[10px] text-gray-500 mb-10 uppercase tracking-[0.3em] font-black opacity-50">
            Trusted by innovators at
          </p>
          <div className="relative overflow-hidden">
            {/* Gradient masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />
            {/* Scrolling logos */}
            <div className="flex animate-scroll-left gap-16 items-center w-max">
              {[...trustedLogos, ...trustedLogos, ...trustedLogos, ...trustedLogos, ...trustedLogos, ...trustedLogos].map((logo, i) => (
                <span key={`${logo}-${i}`} className="text-2xl font-black text-white/20 whitespace-nowrap hover:text-orange-500/50 transition-colors duration-500">{logo}</span>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Orchestrator Banner - Orange Background Section */}
      <section id="features" className="py-24 px-6 bg-gradient-to-b from-orange-600 to-orange-700 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <AnimatedSection delay={0}>
            <div className="bg-[#0a0a0a] rounded-2xl p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-6 opacity-50">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" /><div className="w-3 h-3 rounded-full bg-yellow-500/50" /><div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">U</div>
                  <div className="flex-1 bg-[#1a1a1a] rounded-lg p-3 text-sm text-gray-300 border border-white/5">
                    Build me a custom dashboard with real-time analytics and dark mode.
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white text-xs font-bold">AI</div>
                  <div className="flex-1 bg-[#1a1a1a] rounded-lg p-3 text-sm text-gray-300 border border-white/5">
                    Architecting React infrastructure... Setting up Tailwind colors... Injecting Lucide icons...
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  viewport={{ once: true }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white text-xs font-bold">AI</div>
                  <div className="flex-1 bg-[#1a1a1a] rounded-lg p-3 text-sm text-green-400 border border-white/5">
                    ✓ Done! Deployment live at dashboard-v1.heftcoder.icu
                  </div>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection delay={0.2} className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Orchestrator Agents<br /><span className="text-orange-200">by HeftCoder</span>
            </h2>
            <p className="text-xl text-orange-100/80 mb-8 leading-relaxed">
              The most powerful autonomous AI agents for building production-ready applications in minutes. Turn <strong className="text-white">Extended Thinking</strong> on for complex enterprise architectures.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to="/dashboard" 
                className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
              >
                Start Building Now <ArrowRight size={20} />
              </Link>
            </motion.div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-[#0a0a0a]">
        <AnimatedSection className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
            Choose Your Plan
          </h2>
          <p className="text-gray-400 mb-16 max-w-xl mx-auto text-lg">
            AI-powered coding with transparent pricing. Credits reset monthly. No surprise overages.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Basic */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-[#111] border border-white/10 rounded-2xl p-8 text-left hover:border-white/20 transition-all group"
            >
              <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
              <p className="text-orange-500 text-sm mb-4">7 Day Free Trial</p>
              <div className="mb-6">
                <span className="text-gray-500 text-sm">then</span>
                <span className="text-4xl font-bold text-white">$9</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <p className="text-orange-400 font-medium mb-6">10,000 HeftCredits</p>
              <ul className="space-y-3 text-gray-400 text-sm mb-8">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> GPT-5.1 Orchestrator</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Auto-Save Projects</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Public Workspaces</li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleUpgrade('basic')}
                disabled={loadingPlan === 'basic'}
                className="w-full py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                {loadingPlan === 'basic' ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Choose Basic'}
              </motion.button>
            </motion.div>

            {/* Pro */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-[#111] border-2 border-orange-500 rounded-2xl p-8 text-left relative scale-105 shadow-[0_0_60px_rgba(234,88,12,0.2)]"
            >
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-orange-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
              <div className="mb-6 mt-4">
                <span className="text-4xl font-bold text-white">$25</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <p className="text-orange-400 font-medium mb-6">50,000 HeftCredits</p>
              <ul className="space-y-3 text-gray-400 text-sm mb-8">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> VIBE Multi-Agent Mode</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Private Workspaces</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> High-Power Models</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Flux.2 PRO Image Gen</li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleUpgrade('pro')}
                disabled={loadingPlan === 'pro'}
                className="w-full py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(234,88,12,0.4)]"
              >
                {loadingPlan === 'pro' ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Choose Pro'}
              </motion.button>
            </motion.div>

            {/* Studio */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-[#111] border border-white/10 rounded-2xl p-8 text-left hover:border-white/20 transition-all group"
            >
              <h3 className="text-xl font-bold text-white mb-2">Studio</h3>
              <div className="mb-6 mt-4">
                <span className="text-4xl font-bold text-white">$59</span>
                <span className="text-gray-500">/mo</span>
              </div>
              <p className="text-orange-400 font-medium mb-6">150,000 HeftCredits</p>
              <ul className="space-y-3 text-gray-400 text-sm mb-8">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Full Orchestration</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Smart Model Routing</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Team Workspaces</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Priority Compute</li>
              </ul>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleUpgrade('studio')}
                disabled={loadingPlan === 'studio'}
                className="w-full py-3 rounded-xl border border-white/20 text-white font-bold hover:bg-white/5 transition-colors disabled:opacity-50"
              >
                {loadingPlan === 'studio' ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Choose Studio'}
              </motion.button>
            </motion.div>
          </div>
        </AnimatedSection>
      </section>

      <Footer />
    </div>
  );
}
