import { Link } from 'react-router-dom';
import { Zap, ArrowLeft, Play, ExternalLink, Clock, BookOpen } from 'lucide-react';

const tutorials = [
    {
        id: 1,
        title: 'Getting Started with HEFTCoder',
        duration: '5 min',
        level: 'Beginner',
        description: 'Learn the basics of building your first app with AI',
        thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=225&fit=crop',
        url: '#'
    },
    {
        id: 2,
        title: 'Building a Dashboard with Charts',
        duration: '12 min',
        level: 'Intermediate',
        description: 'Create a beautiful analytics dashboard with Chart.js',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
        url: '#'
    },
    {
        id: 3,
        title: 'Adding Authentication to Your App',
        duration: '10 min',
        level: 'Intermediate',
        description: 'Implement secure user authentication with Supabase',
        thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&h=225&fit=crop',
        url: '#'
    },
    {
        id: 4,
        title: 'Deploying to Production',
        duration: '8 min',
        level: 'Beginner',
        description: 'Deploy your app to Vercel or Netlify in minutes',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop',
        url: '#'
    },
    {
        id: 5,
        title: 'Using Extended Thinking for Complex Tasks',
        duration: '15 min',
        level: 'Advanced',
        description: 'Master advanced AI features for complex applications',
        thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop',
        url: '#'
    },
    {
        id: 6,
        title: 'Connecting APIs and Databases',
        duration: '18 min',
        level: 'Advanced',
        description: 'Integrate external APIs and set up databases',
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop',
        url: '#'
    },
];

export default function Tutorials() {
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
                <div className="flex items-center gap-3 mb-4 justify-center">
                    <BookOpen size={32} className="text-orange-500" />
                    <h1 className="text-4xl md:text-5xl font-bold">Tutorials</h1>
                </div>
                <p className="text-xl text-gray-400 text-center mb-12">Learn how to build amazing apps with step-by-step guides</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tutorials.map((tutorial) => (
                        <Link
                            key={tutorial.id}
                            to={tutorial.url}
                            className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden hover:border-orange-500/30 transition-all group"
                        >
                            <div className="h-40 bg-gray-900 relative overflow-hidden">
                                <img
                                    src={tutorial.thumbnail}
                                    alt={tutorial.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center">
                                        <Play size={24} fill="black" className="text-black ml-1" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs px-2 py-1 rounded ${tutorial.level === 'Beginner' ? 'bg-green-500/10 text-green-400' :
                                        tutorial.level === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-red-500/10 text-red-400'
                                        }`}>{tutorial.level}</span>
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock size={12} /> {tutorial.duration}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold mb-2 group-hover:text-orange-400 transition-colors">{tutorial.title}</h3>
                                <p className="text-sm text-gray-500">{tutorial.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
