import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Code, Key, Lock, Globe, Database, Webhook, Cpu, ArrowRight, Copy, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Footer } from "../components/marketing/Footer";
import { useState } from "react";

export default function ApiReference() {
  const [activeTab, setActiveTab] = useState("rest");

  const endpoints = [
    {
      method: "POST",
      path: "/v1/projects",
      description: "Create a new project",
      auth: true,
      category: "Projects"
    },
    {
      method: "GET",
      path: "/v1/projects",
      description: "List all projects",
      auth: true,
      category: "Projects"
    },
    {
      method: "GET",
      path: "/v1/projects/:id",
      description: "Get project details",
      auth: true,
      category: "Projects"
    },
    {
      method: "PUT",
      path: "/v1/projects/:id",
      description: "Update a project",
      auth: true,
      category: "Projects"
    },
    {
      method: "DELETE",
      path: "/v1/projects/:id",
      description: "Delete a project",
      auth: true,
      category: "Projects"
    },
    {
      method: "POST",
      path: "/v1/generate",
      description: "Generate code with AI",
      auth: true,
      category: "AI Generation"
    },
    {
      method: "POST",
      path: "/v1/generate/component",
      description: "Generate a specific component",
      auth: true,
      category: "AI Generation"
    },
    {
      method: "POST",
      path: "/v1/analyze",
      description: "Analyze existing code",
      auth: true,
      category: "AI Generation"
    },
    {
      method: "POST",
      path: "/v1/deploy",
      description: "Deploy project to production",
      auth: true,
      category: "Deployment"
    },
    {
      method: "GET",
      path: "/v1/deployments",
      description: "List all deployments",
      auth: true,
      category: "Deployment"
    },
    {
      method: "GET",
      path: "/v1/deployments/:id/status",
      description: "Get deployment status",
      auth: true,
      category: "Deployment"
    },
  ];

  const methodColors: Record<string, string> = {
    GET: "bg-green-500/20 text-green-400 border-green-500/30",
    POST: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    PUT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const categories = [...new Set(endpoints.map(e => e.category))];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-white/5 py-4 px-4 sm:px-6 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm hidden sm:inline">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 bg-orange-600 rounded flex items-center justify-center text-white">
              <Zap size={14} fill="currentColor" />
            </div>
            <span className="text-white font-bold text-lg tracking-tighter">HeftCoder</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 px-4 sm:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent" />
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl hidden sm:block" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Code className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">API Reference</h1>
              <p className="text-gray-400 mt-1 text-sm sm:text-base">Build powerful integrations with the HeftCoder API</p>
            </div>
          </div>

          {/* Version Badge */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs sm:text-sm border border-green-500/30">
              v2.0 Stable
            </span>
            <span className="text-gray-500 text-xs sm:text-sm">Last updated: January 2025</span>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 flex items-center gap-2">
            <Key className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            Quick Start
          </h2>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Authentication */}
            <div className="p-5 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <Lock className="w-5 h-5 text-orange-500" />
                <h3 className="text-base sm:text-lg font-bold">Authentication</h3>
              </div>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                All API requests require authentication using an API key. Include your key in the Authorization header:
              </p>
              <div className="rounded-xl bg-[#0a0a0a] border border-white/10 overflow-hidden">
                <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Header</span>
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <code>
                    <span className="text-purple-400">Authorization:</span> <span className="text-green-400">Bearer YOUR_API_KEY</span>
                  </code>
                </pre>
              </div>
            </div>

            {/* Base URL */}
            <div className="p-5 sm:p-8 rounded-2xl border border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <Globe className="w-5 h-5 text-orange-500" />
                <h3 className="text-base sm:text-lg font-bold">Base URL</h3>
              </div>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">
                All API endpoints are relative to this base URL. Use HTTPS for all requests.
              </p>
              <div className="rounded-xl bg-[#0a0a0a] border border-white/10 overflow-hidden">
                <div className="px-4 py-2 border-b border-white/10 flex items-center justify-between">
                  <span className="text-gray-500 text-sm">Base URL</span>
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <pre className="p-4 text-sm overflow-x-auto">
                  <code className="text-orange-400">https://api.heftcoder.com</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SDK Examples */}
      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">SDK Examples</h2>
          
          <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2">
            {[
              { id: "rest", label: "cURL" },
              { id: "node", label: "Node.js" },
              { id: "python", label: "Python" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl overflow-hidden border border-white/10">
            <div className="bg-[#0a0a0a] px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-gray-500 text-sm ml-2">Create Project Example</span>
              </div>
              <button className="text-gray-500 hover:text-white transition-colors">
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <pre className="p-6 bg-[#0a0a0a] overflow-x-auto text-sm leading-relaxed">
              {activeTab === "rest" && (
                <code>
                  <span className="text-green-400">curl</span> <span className="text-gray-300">-X POST https://api.heftcoder.com/v1/projects \</span>{"\n"}
                  {"  "}<span className="text-gray-300">-H</span> <span className="text-yellow-400">"Authorization: Bearer YOUR_API_KEY"</span> <span className="text-gray-300">\</span>{"\n"}
                  {"  "}<span className="text-gray-300">-H</span> <span className="text-yellow-400">"Content-Type: application/json"</span> <span className="text-gray-300">\</span>{"\n"}
                  {"  "}<span className="text-gray-300">-d</span> <span className="text-yellow-400">'{JSON.stringify({ name: "my-app", framework: "react" }, null, 2)}'</span>
                </code>
              )}
              {activeTab === "node" && (
                <code>
                  <span className="text-purple-400">import</span> <span className="text-gray-300">{"{ HeftCoder }"}</span> <span className="text-purple-400">from</span> <span className="text-green-400">'@heftcoder/sdk'</span>;{"\n\n"}
                  <span className="text-purple-400">const</span> <span className="text-blue-400">client</span> <span className="text-gray-300">=</span> <span className="text-purple-400">new</span> <span className="text-yellow-400">HeftCoder</span><span className="text-gray-300">(</span><span className="text-green-400">'YOUR_API_KEY'</span><span className="text-gray-300">);</span>{"\n\n"}
                  <span className="text-purple-400">const</span> <span className="text-blue-400">project</span> <span className="text-gray-300">=</span> <span className="text-purple-400">await</span> <span className="text-blue-400">client</span>.<span className="text-yellow-400">projects</span>.<span className="text-yellow-400">create</span><span className="text-gray-300">({"{"}</span>{"\n"}
                  {"  "}<span className="text-gray-300">name:</span> <span className="text-green-400">'my-app'</span>,{"\n"}
                  {"  "}<span className="text-gray-300">framework:</span> <span className="text-green-400">'react'</span>{"\n"}
                  <span className="text-gray-300">{"}"});</span>{"\n\n"}
                  <span className="text-blue-400">console</span>.<span className="text-yellow-400">log</span><span className="text-gray-300">(</span><span className="text-blue-400">project</span><span className="text-gray-300">);</span>
                </code>
              )}
              {activeTab === "python" && (
                <code>
                  <span className="text-purple-400">from</span> <span className="text-gray-300">heftcoder</span> <span className="text-purple-400">import</span> <span className="text-gray-300">HeftCoder</span>{"\n\n"}
                  <span className="text-blue-400">client</span> <span className="text-gray-300">=</span> <span className="text-yellow-400">HeftCoder</span><span className="text-gray-300">(</span><span className="text-green-400">"YOUR_API_KEY"</span><span className="text-gray-300">)</span>{"\n\n"}
                  <span className="text-blue-400">project</span> <span className="text-gray-300">=</span> <span className="text-blue-400">client</span>.<span className="text-yellow-400">projects</span>.<span className="text-yellow-400">create</span><span className="text-gray-300">(</span>{"\n"}
                  {"    "}<span className="text-gray-300">name=</span><span className="text-green-400">"my-app"</span>,{"\n"}
                  {"    "}<span className="text-gray-300">framework=</span><span className="text-green-400">"react"</span>{"\n"}
                  <span className="text-gray-300">)</span>{"\n\n"}
                  <span className="text-yellow-400">print</span><span className="text-gray-300">(</span><span className="text-blue-400">project</span><span className="text-gray-300">)</span>
                </code>
              )}
            </pre>
          </div>
        </div>
      </section>

      {/* Endpoints */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 flex items-center gap-2">
            <Webhook className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            Endpoints
          </h2>

          {categories.map((category) => (
            <div key={category} className="mb-8 sm:mb-12">
              <h3 className="text-base sm:text-lg font-bold text-orange-400 mb-3 sm:mb-4 flex items-center gap-2">
                <Database className="w-4 h-4 sm:w-5 sm:h-5" />
                {category}
              </h3>
              <div className="space-y-2 sm:space-y-3">
                {endpoints.filter(e => e.category === category).map((endpoint, i) => (
                  <div key={i} className="p-3 sm:p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:border-orange-500/20 transition-all cursor-pointer group flex flex-wrap sm:flex-nowrap items-start sm:items-center gap-2 sm:gap-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold border ${methodColors[endpoint.method]}`}>
                      {endpoint.method}
                    </span>
                    <code className="text-gray-300 font-mono text-xs sm:text-sm flex-1 break-all">{endpoint.path}</code>
                    <span className="text-gray-500 text-xs sm:text-sm hidden lg:block">{endpoint.description}</span>
                    {endpoint.auth && <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />}
                    <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors hidden sm:block" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rate Limits */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 flex items-center gap-2">
            <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
            Rate Limits
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {[
              { plan: "Free", requests: "100", period: "per hour", color: "gray" },
              { plan: "Pro", requests: "1,000", period: "per hour", color: "blue" },
              { plan: "Enterprise", requests: "Unlimited", period: "", color: "orange" },
            ].map((tier, i) => (
              <div key={i} className={`p-4 sm:p-6 rounded-xl border ${tier.color === 'orange' ? 'border-orange-500/30 bg-orange-500/5' : 'border-white/10 bg-white/[0.02]'}`}>
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">{tier.plan}</h3>
                <p className="text-2xl sm:text-3xl font-bold text-orange-400">{tier.requests}</p>
                <p className="text-gray-500 text-xs sm:text-sm">{tier.period || "requests"}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-start gap-3 sm:gap-4">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-yellow-400 font-semibold text-sm sm:text-base">Rate Limit Headers</p>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Check <code className="text-yellow-400">X-RateLimit-Remaining</code> and <code className="text-yellow-400">X-RateLimit-Reset</code> headers in API responses to monitor your usage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Response Codes */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Response Codes</h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            {[
              { code: "200", status: "OK", description: "Request succeeded", type: "success" },
              { code: "201", status: "Created", description: "Resource created successfully", type: "success" },
              { code: "400", status: "Bad Request", description: "Invalid request parameters", type: "warning" },
              { code: "401", status: "Unauthorized", description: "Missing or invalid API key", type: "error" },
              { code: "403", status: "Forbidden", description: "Insufficient permissions", type: "error" },
              { code: "404", status: "Not Found", description: "Resource not found", type: "warning" },
              { code: "429", status: "Too Many Requests", description: "Rate limit exceeded", type: "warning" },
              { code: "500", status: "Server Error", description: "Internal server error", type: "error" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
                <span className={`px-3 py-1 rounded-lg text-sm font-mono font-bold ${
                  item.type === 'success' ? 'bg-green-500/20 text-green-400' :
                  item.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {item.code}
                </span>
                <div className="flex-1">
                  <p className="text-white font-medium">{item.status}</p>
                  <p className="text-gray-500 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20">
            <Info className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Need Help With the API?</h2>
            <p className="text-gray-400 mb-8">Our developer relations team is ready to assist you with integration questions.</p>
            <Link to="/community" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors">
              Join Developer Community
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
