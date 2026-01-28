import { Link } from "react-router-dom";
import { Code2, Zap, Layers, Sparkles, ArrowRight } from "lucide-react";
import { Header } from "../../components/marketing/Header";
import { Footer } from "../../components/marketing/Footer";
import { SEO } from "../../components/SEO";

export default function IDE() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <SEO
        title="IDE - AI-Powered Development Environment"
        description="Build production-ready apps with HeftCoder's intelligent IDE. Real-time AI assistance, smart code completion, and seamless deployment."
        url="/features/ide"
      />
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-orange-600/10 border border-orange-600/20 rounded-full px-4 py-2 mb-8">
            <Code2 className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-orange-400 font-medium">HeftCoder IDE</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            The AI-Native <span className="text-orange-500">Development Environment</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Write code at the speed of thought. Our intelligent IDE understands your intent and helps you build 
            production-ready applications faster than ever before.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(234,88,12,0.3)]"
          >
            Try the IDE
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">AI Code Generation</h3>
              <p className="text-gray-400">
                Describe what you want to build and watch as the AI generates production-ready code in real-time.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center mb-6">
                <Layers className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Multi-File Support</h3>
              <p className="text-gray-400">
                Work across multiple files seamlessly. The AI understands your entire project structure.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="w-12 h-12 bg-orange-600/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Preview</h3>
              <p className="text-gray-400">
                See your changes instantly with live preview. No build step required during development.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Build?</h2>
          <p className="text-lg text-gray-400 mb-8">
            Start building with the most powerful AI development environment.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-[0_0_30px_rgba(234,88,12,0.3)]"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
