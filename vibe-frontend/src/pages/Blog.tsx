import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, Calendar, Clock, User, ArrowRight } from 'lucide-react';

const blogPosts = [
    {
        id: 1,
        title: 'Introducing Orchestrator Agents: The Future of AI-Powered Development',
        excerpt: 'Today we\'re excited to announce our most powerful AI agents yet. Build production-ready apps faster than ever before.',
        author: 'HEFTCoder Team',
        date: 'December 15, 2025',
        readTime: '5 min read',
        category: 'Product',
        featured: true
    },
    {
        id: 2,
        title: 'How to Build a Full-Stack App in 10 Minutes',
        excerpt: 'Learn how our users are shipping complete applications in record time using AI-powered development.',
        author: 'Sarah Chen',
        date: 'December 12, 2025',
        readTime: '8 min read',
        category: 'Tutorial'
    },
    {
        id: 3,
        title: 'The Rise of Vibe Coding: Why Developers Love AI Assistants',
        excerpt: 'Exploring the new paradigm of collaborative AI development and what it means for the future of software.',
        author: 'Marcus Johnson',
        date: 'December 10, 2025',
        readTime: '6 min read',
        category: 'Insights'
    },
    {
        id: 4,
        title: 'HEFTCoder vs Traditional IDEs: A Comparison',
        excerpt: 'We compare development speed, code quality, and developer experience between AI-first and traditional approaches.',
        author: 'Alex Rivera',
        date: 'December 8, 2025',
        readTime: '10 min read',
        category: 'Comparison'
    },
    {
        id: 5,
        title: 'Security Best Practices for AI-Generated Code',
        excerpt: 'How we ensure the code our AI generates follows security best practices and industry standards.',
        author: 'Security Team',
        date: 'December 5, 2025',
        readTime: '7 min read',
        category: 'Security'
    },
];

export default function Blog() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
            <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-orange-500 rounded-lg flex items-center justify-center text-black font-bold">
                        <Zap size={20} fill="currentColor" />
                    </div>
                    <span className="font-bold text-xl">HeftCoder</span>
                </Link>
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft size={18} /> Back to Dashboard
                </Link>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Blog</h1>
                <p className="text-xl text-gray-400 text-center mb-12">News, updates, and insights from the HEFTCoder team</p>

                <div className="space-y-8">
                    {blogPosts.map((post, index) => (
                        <article
                            key={post.id}
                            className={`bg-[#121212] border border-white/5 rounded-xl p-6 hover:border-orange-500/30 transition-all ${post.featured ? 'ring-1 ring-orange-500/20' : ''
                                }`}
                        >
                            {post.featured && (
                                <span className="inline-block px-3 py-1 bg-orange-500/10 text-orange-400 text-xs font-bold rounded-full mb-4">
                                    FEATURED
                                </span>
                            )}
                            <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
                                <span className="px-2 py-0.5 bg-white/5 rounded text-gray-400">{post.category}</span>
                                <span className="flex items-center gap-1"><Calendar size={14} /> {post.date}</span>
                                <span className="flex items-center gap-1"><Clock size={14} /> {post.readTime}</span>
                            </div>
                            <h2 className="text-2xl font-bold mb-3 hover:text-orange-400 transition-colors cursor-pointer">{post.title}</h2>
                            <p className="text-gray-400 mb-4">{post.excerpt}</p>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-sm text-gray-500">
                                    <User size={14} /> {post.author}
                                </span>
                                <button className="text-orange-500 hover:text-orange-400 flex items-center gap-1 text-sm font-medium">
                                    Read More <ArrowRight size={14} />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
