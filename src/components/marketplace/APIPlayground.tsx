import { useState } from 'react';
import { X, Play, Copy, Check, ExternalLink, Zap, Code, FileJson, Terminal, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { MarketplaceAPI } from './types';

interface APIPlaygroundProps {
  api: MarketplaceAPI;
  onClose: () => void;
  onUse?: (api: MarketplaceAPI) => void;
}

const EXAMPLE_REQUESTS: Record<string, { method: string; endpoint: string; params?: Record<string, string> }> = {
  'Weather': { method: 'GET', endpoint: '/current', params: { location: 'New York' } },
  'Finance': { method: 'GET', endpoint: '/quote', params: { symbol: 'AAPL' } },
  'Cryptocurrency': { method: 'GET', endpoint: '/price', params: { coin: 'bitcoin' } },
  'Animals': { method: 'GET', endpoint: '/random' },
  'Games & Comics': { method: 'GET', endpoint: '/random' },
  'Music': { method: 'GET', endpoint: '/search', params: { q: 'jazz' } },
  'Art & Design': { method: 'GET', endpoint: '/random' },
  'default': { method: 'GET', endpoint: '/api/v1/resource' },
};

const MOCK_RESPONSES: Record<string, object> = {
  'Weather': {
    temperature: 72,
    condition: 'Sunny',
    humidity: 45,
    wind_speed: 8,
    location: 'New York, NY'
  },
  'Finance': {
    symbol: 'AAPL',
    price: 178.52,
    change: 2.34,
    change_percent: 1.33,
    volume: 45678900
  },
  'Cryptocurrency': {
    coin: 'bitcoin',
    price_usd: 45123.45,
    market_cap: 884567890123,
    change_24h: 2.5
  },
  'Animals': {
    image_url: 'https://example.com/animal.jpg',
    species: 'Golden Retriever',
    fact: 'Dogs have wet noses to help absorb scent chemicals.'
  },
  'default': {
    status: 'success',
    data: {
      id: 'abc123',
      result: 'Sample response data',
      timestamp: new Date().toISOString()
    }
  }
};

export function APIPlayground({ api, onClose, onUse }: APIPlaygroundProps) {
  const [activeTab, setActiveTab] = useState<'request' | 'response' | 'code'>('request');
  const [isLoading, setIsLoading] = useState(false);
  const [hasResponse, setHasResponse] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const exampleRequest = EXAMPLE_REQUESTS[api.category] || EXAMPLE_REQUESTS['default'];
  const mockResponse = MOCK_RESPONSES[api.category] || MOCK_RESPONSES['default'];

  const handleTryAPI = async () => {
    setIsLoading(true);
    setActiveTab('response');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setHasResponse(true);
    setIsLoading(false);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleUseInHeftcoder = () => {
    if (onUse) {
      onUse(api);
    }
    toast.success(`${api.name} added to workspace`);
    onClose();
  };

  const codeSnippet = `// ${api.name} API Integration
const response = await fetch('${api.link}${exampleRequest.endpoint}', {
  method: '${exampleRequest.method}',
  headers: {
    'Content-Type': 'application/json',${api.auth_type === 'apiKey' ? `
    'Authorization': 'Bearer YOUR_API_KEY',` : ''}
  },
});

const data = await response.json();
console.log(data);`;

  const curlCommand = `curl -X ${exampleRequest.method} "${api.link}${exampleRequest.endpoint}"${api.auth_type === 'apiKey' ? ` \\
  -H "Authorization: Bearer YOUR_API_KEY"` : ''}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/20 rounded-2xl shadow-2xl shadow-orange-500/10 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-orange-500/10">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <Terminal size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{api.name}</h2>
              <p className="text-xs text-orange-500/60 uppercase tracking-wider">{api.category} • API Playground</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-orange-500/10">
          {[
            { id: 'request', label: 'Request', icon: Play },
            { id: 'response', label: 'Response', icon: FileJson },
            { id: 'code', label: 'Code', icon: Code },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'request' | 'response' | 'code')}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab.id
                  ? 'text-orange-400 border-orange-500 bg-orange-500/5'
                  : 'text-gray-500 border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-5">
          {activeTab === 'request' && (
            <div className="space-y-6">
              {/* API Info */}
              <div className="p-4 bg-[#111118] border border-orange-500/10 rounded-xl">
                <p className="text-sm text-gray-300">{api.description}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                    api.auth_type === 'none' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : api.auth_type === 'oauth'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  }`}>
                    {api.auth_type === 'none' ? '🌐 No Auth' : api.auth_type === 'oauth' ? '🔐 OAuth' : '🔑 API Key'}
                  </span>
                  {api.https && (
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-[10px] font-bold border border-blue-500/30">
                      🔒 HTTPS
                    </span>
                  )}
                </div>
              </div>

              {/* Example Request */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Example Request</h3>
                <div className="bg-[#111118] border border-orange-500/10 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-orange-500/10 bg-[#0a0a0f]">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
                        {exampleRequest.method}
                      </span>
                      <code className="text-xs text-gray-400">{api.link}{exampleRequest.endpoint}</code>
                    </div>
                    <button
                      onClick={() => handleCopy(`${api.link}${exampleRequest.endpoint}`, 'URL')}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-500 hover:text-white"
                    >
                      {copied === 'URL' ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  
                  {exampleRequest.params && (
                    <div className="p-4">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Parameters</p>
                      {Object.entries(exampleRequest.params).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2 text-xs">
                          <code className="text-orange-400">{key}</code>
                          <span className="text-gray-600">=</span>
                          <code className="text-gray-300">"{value}"</code>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Try Button */}
              <button
                onClick={handleTryAPI}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 rounded-xl text-white font-bold transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Calling API...
                  </>
                ) : (
                  <>
                    <Play size={18} />
                    Try Request
                  </>
                )}
              </button>
            </div>
          )}

          {activeTab === 'response' && (
            <div className="space-y-4">
              {isLoading ? (
                <div className="py-12 text-center">
                  <Loader2 size={32} className="mx-auto text-orange-500 animate-spin mb-4" />
                  <p className="text-sm text-gray-400">Fetching response...</p>
                </div>
              ) : hasResponse ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
                        200 OK
                      </span>
                      <span className="text-xs text-gray-500">142ms</span>
                    </div>
                    <button
                      onClick={() => handleCopy(JSON.stringify(mockResponse, null, 2), 'Response')}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
                    >
                      {copied === 'Response' ? <Check size={12} /> : <Copy size={12} />}
                      Copy
                    </button>
                  </div>
                  
                  <pre className="p-4 bg-[#111118] border border-orange-500/10 rounded-xl overflow-x-auto">
                    <code className="text-xs text-gray-300">
                      {JSON.stringify(mockResponse, null, 2)}
                    </code>
                  </pre>
                </>
              ) : (
                <div className="py-12 text-center">
                  <FileJson size={40} className="mx-auto text-gray-600 mb-4" />
                  <p className="text-sm text-gray-400">No response yet</p>
                  <p className="text-xs text-gray-600 mt-1">Click "Try Request" to see the response</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-6">
              {/* JavaScript/TypeScript */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">JavaScript / TypeScript</h3>
                  <button
                    onClick={() => handleCopy(codeSnippet, 'JavaScript')}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
                  >
                    {copied === 'JavaScript' ? <Check size={12} /> : <Copy size={12} />}
                    Copy
                  </button>
                </div>
                <pre className="p-4 bg-[#111118] border border-orange-500/10 rounded-xl overflow-x-auto">
                  <code className="text-xs text-gray-300 whitespace-pre">{codeSnippet}</code>
                </pre>
              </div>

              {/* cURL */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">cURL</h3>
                  <button
                    onClick={() => handleCopy(curlCommand, 'cURL')}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition-colors"
                  >
                    {copied === 'cURL' ? <Check size={12} /> : <Copy size={12} />}
                    Copy
                  </button>
                </div>
                <pre className="p-4 bg-[#111118] border border-orange-500/10 rounded-xl overflow-x-auto">
                  <code className="text-xs text-gray-300 whitespace-pre">{curlCommand}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-4 p-5 border-t border-orange-500/10 bg-[#0a0a0f]">
          <a
            href={api.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors"
          >
            <ExternalLink size={14} />
            View Documentation
          </a>
          
          <button
            onClick={handleUseInHeftcoder}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 rounded-xl text-white font-bold text-sm transition-all shadow-lg shadow-orange-500/20"
          >
            <Zap size={16} />
            Use in Heftcoder
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
