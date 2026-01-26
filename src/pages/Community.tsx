import { Link } from "react-router-dom";
import { ArrowLeft, Zap, Users, MessageSquare, Github, Twitter, Linkedin, Youtube, Globe, Award, Star, Heart, Code, Rocket, Calendar, MapPin, ExternalLink } from "lucide-react";
import { Footer } from "../components/marketing/Footer";

export default function Community() {
  const stats = [
    { label: "Active Developers", value: "25,000+", icon: Users },
    { label: "Projects Built", value: "150,000+", icon: Code },
    { label: "Countries", value: "120+", icon: Globe },
    { label: "Discord Members", value: "15,000+", icon: MessageSquare },
  ];

  const channels = [
    {
      name: "Discord",
      description: "Join our active Discord community for real-time discussions, support, and networking with fellow developers.",
      icon: MessageSquare,
      members: "15,247",
      link: "#",
      color: "from-indigo-500 to-purple-600"
    },
    {
      name: "GitHub",
      description: "Contribute to open-source projects, report issues, and collaborate on the future of HeftCoder.",
      icon: Github,
      members: "8,500",
      link: "https://github.com/heftcoder",
      color: "from-gray-600 to-gray-800"
    },
    {
      name: "Twitter / X",
      description: "Follow us for the latest updates, tips, feature announcements, and community highlights.",
      icon: Twitter,
      members: "32,100",
      link: "#",
      color: "from-blue-400 to-blue-600"
    },
    {
      name: "YouTube",
      description: "Watch tutorials, webinars, and deep-dive sessions on building with HeftCoder.",
      icon: Youtube,
      members: "12,800",
      link: "#",
      color: "from-red-500 to-red-700"
    },
    {
      name: "LinkedIn",
      description: "Connect professionally, find job opportunities, and network with tech leaders.",
      icon: Linkedin,
      members: "18,400",
      link: "#",
      color: "from-blue-600 to-blue-800"
    },
  ];

  const contributors = [
    { name: "Alex Chen", role: "Core Contributor", contributions: 847, avatar: "AC" },
    { name: "Sarah Miller", role: "Documentation Lead", contributions: 523, avatar: "SM" },
    { name: "Marcus Johnson", role: "Plugin Developer", contributions: 412, avatar: "MJ" },
    { name: "Priya Patel", role: "Community Mod", contributions: 389, avatar: "PP" },
    { name: "David Kim", role: "Tutorial Creator", contributions: 356, avatar: "DK" },
    { name: "Emma Wilson", role: "Bug Hunter", contributions: 298, avatar: "EW" },
  ];

  const events = [
    {
      title: "HeftCoder Weekly Office Hours",
      date: "Every Thursday",
      time: "5:00 PM UTC",
      type: "Weekly",
      description: "Live Q&A with the core team. Bring your questions!"
    },
    {
      title: "February Hackathon 2025",
      date: "Feb 15-17, 2025",
      time: "48 hours",
      type: "Hackathon",
      description: "Build something amazing and win $10,000 in prizes!"
    },
    {
      title: "Advanced AI Workshop",
      date: "Feb 8, 2025",
      time: "2:00 PM UTC",
      type: "Workshop",
      description: "Deep dive into AI-powered development techniques."
    },
  ];

  const resources = [
    {
      title: "Starter Templates",
      description: "Jumpstart your project with our curated collection of production-ready templates.",
      count: "50+ templates",
      icon: Rocket
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides from basics to advanced techniques.",
      count: "200+ videos",
      icon: Youtube
    },
    {
      title: "Code Examples",
      description: "Real-world examples and patterns you can use in your projects.",
      count: "500+ snippets",
      icon: Code
    },
    {
      title: "Community Plugins",
      description: "Extend HeftCoder with plugins built by the community.",
      count: "120+ plugins",
      icon: Globe
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
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent" />
        <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm mb-8">
            <Users size={16} />
            <span>Join Our Community</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-orange-100 to-orange-300 bg-clip-text text-transparent">
            Build Together.<br />Grow Together.
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
            Join thousands of developers, designers, and creators building the future with HeftCoder. Get help, share your work, and connect with like-minded innovators.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <stat.icon className="w-6 h-6 text-orange-500 mx-auto mb-3" />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-gray-500 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Channels */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Connect With Us</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Choose your favorite platform to engage with the HeftCoder community</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {channels.map((channel, i) => (
              <a
                key={i}
                href={channel.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-orange-500/30 transition-all"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${channel.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <channel.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                  {channel.name}
                  <ExternalLink className="w-4 h-4 text-gray-600 group-hover:text-orange-500 transition-colors" />
                </h3>
                <p className="text-gray-400 text-sm mb-4">{channel.description}</p>
                <p className="text-orange-400 text-sm font-semibold">{channel.members} members</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Top Contributors */}
      <section className="py-16 px-6 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-sm mb-4">
              <Award size={16} />
              <span>Hall of Fame</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Top Contributors</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Celebrating the incredible people who make our community thrive</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributors.map((contributor, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-orange-500/20 transition-all group">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white font-bold text-lg">
                    {contributor.avatar}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{contributor.name}</h3>
                    <p className="text-orange-400 text-sm">{contributor.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{contributor.contributions} contributions</span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-gray-500 mb-4">Want to become a contributor?</p>
            <a href="https://github.com/heftcoder" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-colors">
              <Github className="w-5 h-5" />
              Start Contributing on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Upcoming Events</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Join our live events to learn, network, and grow</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-orange-500/20 transition-all">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                  event.type === 'Hackathon' ? 'bg-purple-500/20 text-purple-400' :
                  event.type === 'Workshop' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-green-500/20 text-green-400'
                }`}>
                  {event.type}
                </span>
                <h3 className="text-lg font-bold text-white mb-2">{event.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{event.description}</p>
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {event.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Community Resources</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Free resources created by and for the community</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, i) => (
              <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:border-orange-500/30 hover:bg-orange-500/5 transition-all cursor-pointer group">
                <resource.icon className="w-8 h-8 text-orange-500 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-bold mb-2">{resource.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{resource.description}</p>
                <span className="text-orange-400 text-sm font-semibold">{resource.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-2xl bg-gradient-to-br from-orange-500/10 to-purple-500/10 border border-orange-500/20">
            <Heart className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Join the Movement?</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Whether you're a beginner or an expert, there's a place for you in our community. Start building today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:from-orange-600 hover:to-orange-700 transition-all">
                Get Started Free
              </Link>
              <a href="#" className="px-8 py-4 rounded-xl border border-white/20 text-white font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
