import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Zap, FolderOpen, Monitor, Tablet, Smartphone } from "lucide-react";

export default function Workspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setMessages(prev => [
      ...prev,
      { role: 'user', content: message },
      { role: 'assistant', content: '🤔 Analyzing your request... I\'m designing the architecture and creating a build plan.' }
    ]);
    setMessage("");
  };

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0a] text-white">
      {/* Top Nav */}
      <header className="border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/")}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Zap size={18} fill="currentColor" />
            </div>
            <span className="font-bold">HeftCoder</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <FolderOpen size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Panel */}
        <div className="w-[40%] border-r border-white/10 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h2 className="text-2xl font-bold mb-2">What would you like to build?</h2>
                <p className="text-gray-400">Describe your project and I'll help you create it.</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`p-3 rounded-lg ${msg.role === 'user' ? 'bg-orange-600/20 ml-8' : 'bg-white/5 mr-8'}`}>
                  {msg.content}
                </div>
              ))
            )}
          </div>
          
          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message HeftCoder..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
              />
              <button 
                onClick={handleSend}
                className="p-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col">
          <div className="border-b border-white/10 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button className="p-2 bg-white/10 rounded-lg"><Monitor size={16} /></button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Tablet size={16} /></button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Smartphone size={16} /></button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-orange-600 rounded-full flex items-center justify-center">
                <Zap size={32} fill="currentColor" />
              </div>
              <p>Your project preview will appear here once generation starts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
