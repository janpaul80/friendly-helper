import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Book, Code, Rocket, Terminal, Database, Shield, Layers, GitBranch, Settings, FileCode, Play, CheckCircle } from "lucide-react";
import { Footer } from "../components/marketing/Footer";

export default function Documentation() {
  const sections = [
    {
      title: "Getting Started",
      icon: Rocket,
      description: "Everything you need to launch your first project",
      articles: [
        { title: "Quick Start Guide", time: "5 min read", description: "Get up and running with HeftCoder in under 5 minutes" },
        { title: "Creating Your First Project", time: "8 min read", description: "Step-by-step tutorial for building your first application" },
        { title: "Understanding the Dashboard", time: "4 min read", description: "Navigate the HeftCoder dashboard like a pro" },
        { title: "Project Configuration", time: "6 min read", description: "Configure your project settings for optimal performance" },
      ]
    },
    {
      title: "Core Concepts",
      icon: Layers,
      description: "Deep dive into HeftCoder's architecture",
      articles: [
        { title: "How HeftCoder Works", time: "10 min read", description: "Understand the AI-powered development engine under the hood" },
        { title: "Project Structure", time: "7 min read", description: "Learn the anatomy of a HeftCoder project" },
        { title: "Component System", time: "8 min read", description: "Master the component-based architecture" },
        { title: "State Management", time: "12 min read", description: "Handle application state effectively" },
      ]
    },
    {
      title: "AI Development",
      icon: Terminal,
      description: "Harness the power of AI-assisted coding",
      articles: [
        { title: "Prompt Engineering", time: "15 min read", description: "Write effective prompts for better code generation" },
        { title: "AI Code Review", time: "6 min read", description: "Let AI review and optimize your code" },
        { title: "Automated Testing", time: "10 min read", description: "Generate comprehensive test suites automatically" },
        { title: "Bug Detection & Fixes", time: "8 min read", description: "Identify and resolve issues with AI assistance" },
      ]
    },
    {
      title: "Database & Backend",
      icon: Database,
      description: "Build robust server-side functionality",
      articles: [
        { title: "Database Setup", time: "12 min read", description: "Configure and connect your database" },
        { title: "API Development", time: "15 min read", description: "Build RESTful and GraphQL APIs" },
        { title: "Authentication", time: "10 min read", description: "Implement secure user authentication" },
        { title: "Real-time Features", time: "8 min read", description: "Add real-time capabilities to your app" },
      ]
    },
    {
      title: "Deployment",
      icon: GitBranch,
      description: "Ship your applications with confidence",
      articles: [
        { title: "One-Click Deploy", time: "3 min read", description: "Deploy your app instantly" },
        { title: "Custom Domains", time: "5 min read", description: "Connect your own domain name" },
        { title: "Environment Variables", time: "4 min read", description: "Manage secrets and configuration" },
        { title: "CI/CD Pipeline", time: "10 min read", description: "Set up continuous deployment" },
      ]
    },
    {
      title: "Advanced Topics",
      icon: Settings,
      description: "Take your skills to the next level",
      articles: [
        { title: "Performance Optimization", time: "12 min read", description: "Make your app lightning fast" },
        { title: "Security Best Practices", time: "15 min read", description: "Secure your application properly" },
        { title: "Scaling Strategies", time: "10 min read", description: "Handle millions of users" },
        { title: "Custom Integrations", time: "8 min read", description: "Connect third-party services" },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <header className="border-b border-white/5 py-4 px-6 sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors">
            <ArrowLeft size={18} />
            <span className="text-sm">Back to Home</span>
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
      <section className="relative py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent" />
        <div className="absolute top-10 left-1/3 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
              <Book className="w-8 h-8 text-orange-500" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">Documentation</h1>
              <p className="text-gray-400 mt-1">Everything you need to build amazing applications</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mt-8">
            <input 
              type="text"
              placeholder="Search documentation..."
              className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all"
            />
            <Code className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-3 mt-8">
            {["Quick Start", "API Reference", "Examples", "Tutorials", "FAQ"].map((link) => (
              <button key={link} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-400 hover:border-orange-500/30 hover:text-orange-400 transition-all">
                {link}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Play className="w-5 h-5 text-orange-500" />
            Popular Articles
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Build a Full-Stack App in 10 Minutes", views: "12.5k views", tag: "Tutorial" },
              { title: "Mastering AI Prompts for Code Generation", views: "8.2k views", tag: "Guide" },
              { title: "Deploy to Production: Complete Walkthrough", views: "6.8k views", tag: "Tutorial" },
            ].map((article, i) => (
              <div key={i} className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20 hover:border-orange-500/40 transition-all cursor-pointer group">
                <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">{article.tag}</span>
                <h3 className="text-white font-semibold mt-3 group-hover:text-orange-400 transition-colors">{article.title}</h3>
                <p className="text-gray-500 text-sm mt-2">{article.views}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <div key={index} className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-orange-500/20 transition-all group">
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                    <section.icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{section.title}</h3>
                    <p className="text-gray-500 text-sm mt-1">{section.description}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {section.articles.map((article, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group/item">
                      <FileCode className="w-4 h-4 text-gray-500 mt-1 group-hover/item:text-orange-500 transition-colors" />
                      <div className="flex-1">
                        <p className="text-gray-300 group-hover/item:text-white transition-colors">{article.title}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{article.description}</p>
                      </div>
                      <span className="text-xs text-gray-600">{article.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example Section */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">See It In Action</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Get started with a simple example that demonstrates the power of HeftCoder</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-white/10">
              <div className="bg-[#0a0a0a] px-4 py-3 border-b border-white/10 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-gray-500 text-sm ml-2">example.tsx</span>
              </div>
              <pre className="p-6 bg-[#0a0a0a] overflow-x-auto">
                <code className="text-sm leading-relaxed">
                  <span className="text-purple-400">import</span> <span className="text-gray-300">{"{ HeftCoder }"}</span> <span className="text-purple-400">from</span> <span className="text-green-400">'@heftcoder/sdk'</span>;{"\n\n"}
                  <span className="text-gray-500">// Initialize the HeftCoder engine</span>{"\n"}
                  <span className="text-purple-400">const</span> <span className="text-blue-400">engine</span> <span className="text-gray-300">=</span> <span className="text-purple-400">new</span> <span className="text-yellow-400">HeftCoder</span><span className="text-gray-300">({"{"}</span>{"\n"}
                  {"  "}<span className="text-gray-300">apiKey:</span> <span className="text-green-400">'your-api-key'</span>,{"\n"}
                  {"  "}<span className="text-gray-300">project:</span> <span className="text-green-400">'my-awesome-app'</span>{"\n"}
                  <span className="text-gray-300">{"}"});</span>{"\n\n"}
                  <span className="text-gray-500">// Generate a component with AI</span>{"\n"}
                  <span className="text-purple-400">const</span> <span className="text-blue-400">component</span> <span className="text-gray-300">=</span> <span className="text-purple-400">await</span> <span className="text-blue-400">engine</span>.<span className="text-yellow-400">generate</span><span className="text-gray-300">({"{"}</span>{"\n"}
                  {"  "}<span className="text-gray-300">prompt:</span> <span className="text-green-400">'Create a responsive pricing table'</span>,{"\n"}
                  {"  "}<span className="text-gray-300">style:</span> <span className="text-green-400">'modern'</span>,{"\n"}
                  {"  "}<span className="text-gray-300">framework:</span> <span className="text-green-400">'react'</span>{"\n"}
                  <span className="text-gray-300">{"}"});</span>{"\n\n"}
                  <span className="text-blue-400">console</span>.<span className="text-yellow-400">log</span><span className="text-gray-300">(</span><span className="text-blue-400">component</span>.<span className="text-gray-300">code);</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/20">
            <CheckCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-gray-400 mb-8">Our support team is here to help you 24/7. Reach out and we'll get back to you as soon as possible.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/community" className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors">
                Join Community
              </Link>
              <button className="px-6 py-3 rounded-xl border border-white/20 hover:border-orange-500/50 text-white font-semibold transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
