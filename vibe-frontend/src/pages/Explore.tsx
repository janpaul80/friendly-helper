import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, ExternalLink, Heart } from 'lucide-react';

// Curated projects from the community
const featuredProjects = [
    {
        id: 1,
        title: '2go Social Connect',
        author: 'Community',
        image: 'https://i.imgur.com/YZ0ELLh.jpg',
        url: '#',
        likes: 2156,
        category: 'Social'
    },
    {
        id: 2,
        title: 'VFitness Dashboard',
        author: 'Community',
        image: 'https://i.imgur.com/zbR2FpN.jpg',
        url: '#',
        likes: 1892,
        category: 'Fitness'
    },
    {
        id: 3,
        title: 'ChatMore Messaging',
        author: 'Community',
        image: 'https://i.imgur.com/XlfIjEs.jpg',
        url: '#',
        likes: 2034,
        category: 'Communication'
    },
    {
        id: 4,
        title: 'NODE VR Experience',
        author: 'Community',
        image: 'https://i.imgur.com/7VDVe2R.jpg',
        url: '#',
        likes: 2567,
        category: 'VR/AR'
    },
    {
        id: 5,
        title: 'Portfolio Landing Page',
        author: 'Community',
        image: 'https://i.imgur.com/dtpc63w.jpg',
        url: '#',
        likes: 1756,
        category: 'Portfolio'
    },
    {
        id: 6,
        title: 'AURALEE Fashion App',
        author: 'Community',
        image: 'https://i.imgur.com/ZLURwMc.jpg',
        url: '#',
        likes: 1523,
        category: 'Fashion'
    },
    {
        id: 7,
        title: 'MedEx Health Dashboard',
        author: 'Community',
        image: 'https://i.imgur.com/ojiWH5P.jpg',
        url: '#',
        likes: 1847,
        category: 'Healthcare'
    },
    {
        id: 8,
        title: 'ICG Team Chat',
        author: 'Community',
        image: 'https://i.imgur.com/gRelue4.jpg',
        url: '#',
        likes: 1634,
        category: 'Communication'
    },
    {
        id: 9,
        title: 'Bookify Reading App',
        author: 'Community',
        image: 'https://i.imgur.com/r04StH5.jpg',
        url: '#',
        likes: 1945,
        category: 'Education'
    },
    {
        id: 10,
        title: 'Social Media Platform',
        author: 'Community',
        image: 'https://i.imgur.com/vVkQllp.jpg',
        url: '#',
        likes: 1284,
        category: 'Social'
    },
];

export default function Explore() {
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

            <main className="max-w-6xl mx-auto px-6 py-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Explore Projects</h1>
                <p className="text-xl text-gray-400 text-center mb-12">Get inspired by amazing designs from the community</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredProjects.map((project) => (
                        <a
                            key={project.id}
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden hover:border-orange-500/30 transition-all group"
                        >
                            <div className="h-48 bg-gray-900 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/1a1a1a/666?text=' + project.category;
                                    }}
                                />
                            </div>
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs px-2 py-1 bg-orange-500/10 text-orange-400 rounded">{project.category}</span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Heart size={12} /> {project.likes}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold mb-1 group-hover:text-orange-400 transition-colors">{project.title}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-500">by {project.author}</span>
                                    <ExternalLink size={14} className="text-gray-500 group-hover:text-orange-400" />
                                </div>
                            </div>
                        </a>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a
                        href="https://dribbble.com/search/app-design"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-black rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                        Explore More on Dribbble <ExternalLink size={16} />
                    </a>
                </div>
            </main>
        </div>
    );
}
