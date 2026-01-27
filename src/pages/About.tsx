import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Code, Shield, Rocket, Target, Eye } from "lucide-react";
import jpHartmannPhoto from "@/assets/jp-hartmann.png";
import { Footer } from "../components/marketing/Footer";
import { SEO, schemas } from "../components/SEO";

export default function About() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <SEO
        title="About Us"
        description="HeftCoder is a modern technology company building powerful, scalable, and human-centered digital products. Founded by JP Hartmann."
        url="/about"
        schema={schemas.organization}
      />
      {/* Header */}
      <header className="border-b border-white/5 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
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
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-600/5 rounded-full blur-3xl" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm mb-8">
            <Zap size={14} />
            <span>About Us</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-orange-100 to-orange-300 bg-clip-text text-transparent">
            Building the Future,<br />One Line of Code at a Time
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Heftcoder is a modern technology company focused on building powerful, scalable, and human-centered digital products. We design and develop software that solves real problems—fast, efficiently, and with purpose.
          </p>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-transparent">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmNjYwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-50 rounded-2xl" />
            <div className="relative z-10">
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Founded by <span className="text-orange-400 font-semibold">JP Hartmann</span>, Heftcoder was created with a simple belief:
              </p>
              <blockquote className="text-2xl md:text-3xl font-bold text-white italic border-l-4 border-orange-500 pl-6">
                "Great software should feel effortless, intelligent, and reliable."
              </blockquote>
              <p className="text-lg text-gray-400 mt-6 leading-relaxed">
                We work at the intersection of engineering, automation, and innovation—turning complex ideas into clean, usable products that businesses and users actually enjoy using.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-orange-500/30 transition-colors group">
            <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
              <Target className="w-7 h-7 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-gray-400 leading-relaxed">
              To empower individuals and companies with smart, secure, and scalable software solutions that accelerate growth and reduce friction.
            </p>
          </div>
          
          <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-orange-500/30 transition-colors group">
            <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
              <Eye className="w-7 h-7 text-orange-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Our Vision</h2>
            <p className="text-gray-400 leading-relaxed">
              A world where technology works for people—not the other way around.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 px-6 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What We Do</h2>
            <p className="text-gray-400">Engineering excellence across the full stack</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Code, title: "Custom Software Development" },
              { icon: Rocket, title: "Web & Mobile Applications" },
              { icon: Zap, title: "AI-Powered Tools & Automation" },
              { icon: Shield, title: "API Design & System Integrations" },
              { icon: Target, title: "Product Architecture & Scaling" },
              { icon: Eye, title: "Rapid Prototyping & MVPs" },
            ].map((item, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl border border-white/10 bg-white/[0.02] hover:border-orange-500/30 hover:bg-orange-500/5 transition-all group"
              >
                <item.icon className="w-6 h-6 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-semibold">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Leadership</h2>
          </div>
          
          <div className="relative p-8 md:p-12 rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-transparent">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg shadow-orange-500/20 border-2 border-orange-500/30">
                <img 
                  src={jpHartmannPhoto} 
                  alt="JP Hartmann - CEO & Founder of HeftCoder"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-1">JP Hartmann</h3>
                <p className="text-orange-400 font-medium mb-4">CEO & Founder</p>
                <p className="text-gray-400 leading-relaxed mb-6">
                  JP Hartmann is a technology entrepreneur and software engineer with a passion for building products that move fast and scale smart. He is the founder and CEO of:
                </p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                  {["Heftcoder", "NextCoder", "KquikApp", "Safebite App", "Vidhart"].map((company) => (
                    <span 
                      key={company}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
                    >
                      {company}
                    </span>
                  ))}
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Across these ventures, JP focuses on innovation, execution, and building technology that delivers real-world value—not buzzwords.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Heftcoder */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Heftcoder</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              "We build fast, but we build right",
              "Clean code. Clear thinking. Strong architecture",
              "Security and scalability are never afterthoughts",
              "We care about long-term impact, not short-term hacks",
            ].map((item, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-6 rounded-xl border border-white/10 bg-white/[0.02]"
              >
                <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-gray-300">{item}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-xl text-gray-400 mb-2">Heftcoder isn't just about writing code.</p>
            <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              It's about engineering trust.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
