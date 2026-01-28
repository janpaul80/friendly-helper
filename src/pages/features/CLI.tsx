import { Link } from "react-router-dom";
import { Terminal, Zap, Download, Settings, ArrowRight } from "lucide-react";
import { Header } from "../../components/marketing/Header";
import { Footer } from "../../components/marketing/Footer";
import { SEO } from "../../components/SEO";

export default function CLI() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SEO
        title="CLI - Command Line Interface"
        description="Build and deploy HeftCoder projects from your terminal. Powerful CLI tools for developers who love the command line."
        url="/features/cli"
      />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-600/20 rounded-full px-4 py-2 mb-8">
            <Terminal className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-orange-400 font-medium">HeftCoder CLI</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Build from the <span className="text-orange-500">Command Line</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            For developers who prefer the terminal. Create, build, and deploy HeftCoder projects 
            without leaving your favorite environment.
          </p>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 max-w-md mx-auto mb-10">
            <code className="text-orange-400 font-mono">npm install -g @heftcoder/cli</code>
          </div>
          <Link
            to="/docs"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(234,88,12,0.3)]"
          >
            Read the Docs
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">CLI Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center mb-6">
                <Download className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Quick Scaffolding</h3>
              <p className="text-gray-400">
                Bootstrap new projects instantly with our templates. One command to get started.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Deployment</h3>
              <p className="text-gray-400">
                Deploy to production with a single command. Zero configuration required.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center mb-6">
                <Settings className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Full Control</h3>
              <p className="text-gray-400">
                Manage projects, environments, and deployments entirely from your terminal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commands */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Common Commands</h2>
          <div className="space-y-4">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
              <code className="text-sm font-mono">
                <span className="text-gray-500">$</span> <span className="text-orange-400">heft</span> <span className="text-white">init my-project</span>
              </code>
              <p className="text-sm text-gray-500 mt-2">Create a new project</p>
            </div>
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
              <code className="text-sm font-mono">
                <span className="text-gray-500">$</span> <span className="text-orange-400">heft</span> <span className="text-white">dev</span>
              </code>
              <p className="text-sm text-gray-500 mt-2">Start development server</p>
            </div>
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4">
              <code className="text-sm font-mono">
                <span className="text-gray-500">$</span> <span className="text-orange-400">heft</span> <span className="text-white">deploy --prod</span>
              </code>
              <p className="text-sm text-gray-500 mt-2">Deploy to production</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Get the CLI</h2>
          <p className="text-lg text-gray-400 mb-8">
            Install HeftCoder CLI and start building from your terminal.
          </p>
          <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-4 max-w-md mx-auto">
            <code className="text-orange-400 font-mono">npm install -g @heftcoder/cli</code>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
