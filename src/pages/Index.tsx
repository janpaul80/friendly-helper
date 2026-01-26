// HeftCoder Landing Page - Minimal Chat Input
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Paperclip, Mic, Send, ChevronDown } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [showAgentsDropdown, setShowAgentsDropdown] = useState(false);

  const handleSubmit = () => {
    if (!prompt.trim()) return;
    // Redirect to auth page when user submits
    navigate("/auth");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4">
      {/* Chat Input Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Input Box */}
        <div className="bg-[#1a1a1a] border border-white/10 rounded-2xl overflow-hidden">
          {/* Text Input */}
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message HeftCoder"
            className="w-full bg-transparent text-white placeholder-gray-500 px-4 py-4 text-base focus:outline-none"
          />

          {/* Bottom Bar */}
          <div className="flex items-center justify-between px-3 py-2 border-t border-white/5">
            {/* Left Side - Attach & Agents */}
            <div className="flex items-center gap-1">
              {/* Paperclip */}
              <button className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <Paperclip size={18} />
              </button>

              {/* Agents Button */}
              <div className="relative">
                <button
                  onClick={() => setShowAgentsDropdown(!showAgentsDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#2a2a2a] border border-orange-500/50 rounded-lg text-sm text-white hover:bg-[#333] transition-colors"
                >
                  <span className="text-orange-500 font-bold">◆</span>
                  <span className="font-medium">agents</span>
                </button>

                {/* Agents Dropdown */}
                {showAgentsDropdown && (
                  <div className="absolute bottom-full mb-2 left-0 bg-[#1a1a1a] border border-white/10 rounded-xl py-2 w-56 shadow-2xl z-50">
                    <button
                      onClick={() => setShowAgentsDropdown(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white text-left"
                    >
                      <span className="text-orange-500">◆</span>
                      HeftCoder PRO
                    </button>
                    <button
                      onClick={() => setShowAgentsDropdown(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white text-left"
                    >
                      <span className="text-orange-500">◆</span>
                      UI Architect
                    </button>
                    <button
                      onClick={() => setShowAgentsDropdown(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white text-left"
                    >
                      <span className="text-orange-500">◆</span>
                      Backend Engineer
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Mic & Send */}
            <div className="flex items-center gap-1">
              {/* Mic Button */}
              <button className="p-2 text-gray-500 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <Mic size={18} />
              </button>

              {/* Send Button */}
              <button
                onClick={handleSubmit}
                className="p-2 text-orange-500 hover:text-orange-400 transition-colors rounded-lg hover:bg-orange-500/10"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
