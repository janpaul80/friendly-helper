import { Link } from "react-router-dom";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#050505] text-gray-500 py-16 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center mb-6 gap-2">
            <img src="/assets/hc-logo.png" alt="HeftCoder" className="h-6 w-6 rounded" />
            <span className="text-white font-bold text-lg tracking-tighter">HeftCoder</span>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Autonomous AI development engine for shipping production-ready apps at the speed of thought.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Product</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#features" className="hover:text-orange-500 transition-colors">Features</a></li>
            <li><a href="#pricing" className="hover:text-orange-500 transition-colors">Pricing</a></li>
            <li><Link to="/about" className="hover:text-orange-500 transition-colors">About Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/docs" className="hover:text-orange-500 transition-colors">Documentation</Link></li>
            <li><Link to="/api-reference" className="hover:text-orange-500 transition-colors">API Reference</Link></li>
            <li><Link to="/community" className="hover:text-orange-500 transition-colors">Community</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-widest">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-orange-500 transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
            <li><Link to="/security" className="hover:text-orange-500 transition-colors">Security</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>© 2025 HeftCoder. Built for the VIBE era.</p>
        <div className="flex gap-6">
          <a href="https://github.com/janpaul80" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            <Github className="w-4 h-4" />
          </a>
          <span className="hover:text-white cursor-pointer transition-colors">Twitter / X</span>
        </div>
      </div>
    </footer>
  );
}
