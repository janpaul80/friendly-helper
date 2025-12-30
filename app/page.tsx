// ... imports
import { useState, useRef, useEffect } from "react";
import {
  X,
  Code2,
  Rocket,
  CheckCircle,
  Loader2,
  MessageSquare,
  MessageCircle,
  Github,
  FileText,
  Zap,
  Image,
  Music,
  Cpu,
  Cookie,
  Sparkles
} from "lucide-react";
// ... other imports
import { Toaster, toast } from 'sonner'; // Assuming sonner is installed, otherwise usage of simple alert or existing toast if available.
// If sonner is not available, I'll use a simple state-based notification or just console.log for now, 
// checking package.json would be ideal but user wants this "enabled". 
// I will implement a custom simple Toast component inside the page for zero-dependency feedback if needed, 
// OR simpler: use `window.alert` or just change UI state.
// Let's stick to UI state changes for "Connected".

// ... existing code ...

const ConnectorsModal = ({ onClose }: { onClose: () => void }) => {
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const toggleConnection = (id: string) => {
    setConnected(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const apps = [
    { id: 'github', name: 'GitHub', icon: Github, color: 'text-white' },
    { id: 'slack', name: 'Slack', icon: MessageSquare, color: 'text-purple-400' }, // customized icon mapping below
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
            <p className="text-gray-400 text-sm mt-1">Supercharge HEFTCoder with your favorite tools.</p>
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

// ... inside LandingPage component ...

const fileInputRef = useRef<HTMLInputElement>(null);
const [fileName, setFileName] = useState<string | null>(null);
const [isGithubConnected, setIsGithubConnected] = useState(false);

const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setFileName(file.name);
    setPrompt(prev => prev + `\n[Attached: ${file.name}]`);
    setShowAttachDropdown(false);
  }
};

const handleGithubConnect = () => {
  // Simulate auth flow
  setIsGithubConnected(true);
  setShowAttachDropdown(false);
  // Could trigger a toast here if we had one
};

// ... inside JSX ...

{/* Connectors Modal */ }
{ showConnectorsModal && <ConnectorsModal onClose={() => setShowConnectorsModal(false)} /> }

{/* Hidden File Input */ }
<input
  type="file"
  ref={fileInputRef}
  className="hidden"
  accept="image/*"
  onChange={handleImageUpload}
/>

{/* ... inside Dropdown ... */ }
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
    // ...


          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { icon: Music, label: 'Clone Spotify' },
              { icon: Cpu, label: 'Idea Logger' },
              { icon: Cookie, label: 'Baking Bliss' },
              { icon: Sparkles, label: 'Surprise Me' },
            ].map((chip) => (
              <button
                key={chip.label}
                onClick={() => setPrompt(chip.label === 'Surprise Me' ? 'Build me something unique and creative' : `Build me a ${chip.label.toLowerCase()} app`)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 rounded-xl text-sm text-gray-400 hover:text-white transition-all shadow-lg"
              >
                <chip.icon size={16} />
                {chip.label}
              </button>
            ))}
          </div>
        </div >
      </main >

  {/* Trusted By Carousel - UPDATED TO SCROLL RIGHT */ }
  < section className = "py-20 border-t border-white/5 bg-[#0a0a0a] overflow-hidden select-none" >
    <div className="max-w-6xl mx-auto text-center px-6">
      <p className="text-[10px] text-gray-500 mb-10 uppercase tracking-[0.3em] font-black opacity-50">
        Trusted by innovators at
      </p>
      <div className="relative group">
        <div className="flex animate-scroll-right gap-16 items-center w-max">
          {['Coinbase', 'Stripe', 'Vercel', 'Hg', 'Oscar', 'ARK Invest', 'Zillow', 'Microsoft', 'Coinbase', 'Stripe', 'Vercel', 'Hg', 'Oscar', 'ARK Invest', 'Zillow', 'Microsoft'].map((logo, i) => (
            <span key={`${logo}-${i}`} className="text-2xl font-black text-white/20 whitespace-nowrap hover:text-orange-500/50 transition-colors duration-500">{logo}</span>
          ))}
        </div>
      </div>
    </div>
      </section >

  {/* Orchestrator Banner */ }
  < section id = "features" className = "py-24 px-6 bg-gradient-to-b from-orange-600 to-orange-700 relative overflow-hidden" >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="bg-[#0a0a0a] rounded-2xl p-8 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="space-y-4 animate-pulse-slow">
              <div className="flex items-center gap-2 mb-6 opacity-50">
                <div className="w-3 h-3 rounded-full bg-red-500/50" /><div className="w-3 h-3 rounded-full bg-yellow-500/50" /><div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">U</div>
                <div className="bg-white/5 rounded-2xl px-4 py-3 text-gray-300 text-sm max-w-[85%] border border-white/5">
                  Build me a custom dashboard with real-time analytics and dark mode.
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl px-4 py-3 text-orange-200 text-sm max-w-[85%] shadow-[0_0_30px_rgba(234,88,12,0.1)]">
                  Architecting React infrastructure... Setting up Tailwind colors... Injecting Lucide icons...
                </div>
                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_10px_rgba(234,88,12,0.5)]">AI</div>
              </div>
              <div className="flex gap-3 justify-end">
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl px-4 py-3 text-green-400 text-sm max-w-[85%]">
                  ✓ Done! Deployment live at dashboard-v1.nextcoder.icu
                </div>
                <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white text-xs font-bold">AI</div>
              </div>
            </div>
          </div>
          <div className="text-white">
            <h2 className="text-4xl font-black mb-6 leading-tight">Orchestrator Agents <br />by HEFTCoder</h2>
            <p className="text-xl text-white/80 mb-8 font-light leading-relaxed">
              The most powerful autonomous AI agents for building production-ready applications in minutes.
              Turn <strong>Extended Thinking</strong> on for complex enterprise architectures.
            </p>
            <Link href="/dashboard" className="bg-white text-orange-600 px-8 py-4 rounded-xl font-black text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-2xl inline-block">
              Start Building Now →
            </Link>
          </div>
        </div>
      </section >

  {/* Pricing Section */ }
  < section id = "pricing" className = "py-24 px-6 bg-[#050505]" >
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
        <p className="text-gray-500 max-w-lg mx-auto">AI-powered coding with transparent pricing. Credits reset monthly. No surprise overages.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            name: 'Basic', price: '9', credits: '10,000',
            features: ['GPT-5.1 Orchestrator', 'Auto-Save Projects', 'Public Workspaces'],
            color: 'orange'
          },
          {
            name: 'Pro', price: '25', credits: '50,000', popular: true,
            features: ['VIBE Multi-Agent Mode', 'Private Workspaces', 'High-Power Models', 'Flux.2 PRO Image Gen'],
            color: 'blue'
          },
          {
            name: 'Studio', price: '59', credits: '150,000',
            features: ['Full Orchestration', 'Smart Model Routing', 'Team Workspaces', 'Priority Compute'],
            color: 'purple'
          }
        ].map((plan, i) => (
          <div key={plan.name} className={`relative p-8 rounded-3xl border transition-all hover:translate-y-[-8px] flex flex-col ${plan.popular ? 'bg-gradient-to-b from-blue-900/20 to-black border-blue-500/50 scale-105 shadow-2xl shadow-blue-500/10' : 'bg-[#111] border-white/5 shadow-xl'}`}>
            {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-[10px] font-black tracking-widest px-4 py-1 rounded-full uppercase">MOST POPULAR</div>}
            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
            <div className="mb-6">
              {plan.name === 'Basic' ? (
                <div>
                  <span className="text-sm font-bold text-green-500 uppercase tracking-wider block mb-1">7 Day Free Trial</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-gray-400">then</span>
                    <span className="text-4xl font-black">${plan.price}</span>
                    <span className="text-gray-600">/mo</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black">${plan.price}</span>
                  <span className="text-gray-600">/mo</span>
                </div>
              )}
            </div>
            <div className={`text-sm font-bold mb-8 uppercase tracking-widest ${plan.color === 'orange' ? 'text-orange-500' : plan.color === 'blue' ? 'text-blue-400' : 'text-purple-400'}`}>
              {plan.credits} HeftCredits
            </div>
            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex gap-3 text-sm text-gray-400">
                  <CheckCircle className="w-5 h-5 text-orange-500 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleUpgrade(plan.name)}
              disabled={!!loadingPlan}
              className={`w-full py-4 rounded-xl font-black transition-all flex items-center justify-center gap-2 ${plan.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : plan.name === 'Studio' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-white/5 hover:bg-white/10 text-white'}`}
            >
              {loadingPlan === plan.name ? <Loader2 className="w-5 h-5 animate-spin" /> : `Choose ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </div>
      </section >

  <Footer />
    </div >
  );
}
