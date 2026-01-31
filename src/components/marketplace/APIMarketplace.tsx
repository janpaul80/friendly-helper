import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Star, ExternalLink, Play, Zap, Globe, Key, Lock, RefreshCw, ChevronDown, Package, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { APIPlayground } from './APIPlayground';
import { toast } from 'sonner';
import type { MarketplaceAPI } from './types';

interface APIMarketplaceProps {
  userId: string;
  onUseAPI?: (api: MarketplaceAPI) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  'Animals': '🐾',
  'Anime': '🎌',
  'Anti-Malware': '🛡️',
  'Art & Design': '🎨',
  'Authentication': '🔐',
  'Blockchain': '⛓️',
  'Books': '📚',
  'Business': '💼',
  'Calendar': '📅',
  'Cloud Storage': '☁️',
  'Continuous Integration': '🔄',
  'Cryptocurrency': '₿',
  'Currency Exchange': '💱',
  'Data Validation': '✅',
  'Development': '💻',
  'Dictionaries': '📖',
  'Documents & Productivity': '📄',
  'Email': '📧',
  'Entertainment': '🎬',
  'Environment': '🌍',
  'Events': '🎉',
  'Finance': '💰',
  'Food & Drink': '🍔',
  'Games & Comics': '🎮',
  'Geocoding': '📍',
  'Government': '🏛️',
  'Health': '🏥',
  'Jobs': '💼',
  'Machine Learning': '🤖',
  'Music': '🎵',
  'News': '📰',
  'Open Data': '📊',
  'Open Source Projects': '🔓',
  'Patent': '📜',
  'Personality': '🧠',
  'Phone': '📱',
  'Photography': '📷',
  'Programming': '⌨️',
  'Science & Math': '🔬',
  'Security': '🔒',
  'Shopping': '🛒',
  'Social': '👥',
  'Sports & Fitness': '⚽',
  'Test Data': '🧪',
  'Text Analysis': '📝',
  'Tracking': '📦',
  'Transportation': '🚗',
  'URL Shorteners': '🔗',
  'Vehicle': '🚙',
  'Video': '🎥',
  'Weather': '🌤️',
};

const AUTH_BADGES = {
  none: { label: 'No Auth', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: Globe },
  apiKey: { label: 'API Key', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: Key },
  oauth: { label: 'OAuth', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: Lock },
};

export function APIMarketplace({ userId, onUseAPI }: APIMarketplaceProps) {
  const [apis, setApis] = useState<MarketplaceAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedAuth, setSelectedAuth] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAPI, setSelectedAPI] = useState<MarketplaceAPI | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Fetch APIs
  useEffect(() => {
    fetchAPIs();
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const fetchAPIs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('api_catalog')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('name', { ascending: true })
        .limit(1000);

      if (error) throw error;
      setApis((data || []) as MarketplaceAPI[]);
    } catch (err) {
      console.error('Error fetching APIs:', err);
      toast.error('Failed to load APIs');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('user_api_favorites')
        .select('api_id')
        .eq('user_id', userId);

      if (!error && data) {
        setFavorites(new Set(data.map((f: { api_id: string }) => f.api_id)));
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const supabaseUrl = "https://ythuhewbaulqirjrkgly.supabase.co";
      const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aHVoZXdiYXVscWlyanJrZ2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzOTkwMDgsImV4cCI6MjA4NDk3NTAwOH0.lbkprUMf_qkyzQOBqSOboipowjA0K8HZ2yaPglwe8MI";
      
      const response = await fetch(`${supabaseUrl}/functions/v1/sync-public-apis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
        },
      });

      const result = await response.json();
      
      if (result.success) {
        toast.success(`Synced ${result.stats.total_upserted} APIs from ${result.stats.categories} categories`);
        fetchAPIs();
      } else {
        throw new Error(result.error || 'Sync failed');
      }
    } catch (err) {
      console.error('Sync error:', err);
      toast.error('Failed to sync APIs');
    } finally {
      setSyncing(false);
    }
  };

  const toggleFavorite = async (apiId: string) => {
    if (!userId) {
      toast.error('Sign in to save favorites');
      return;
    }

    const isFav = favorites.has(apiId);
    
    try {
      if (isFav) {
        await supabase
          .from('user_api_favorites')
          .delete()
          .eq('user_id', userId)
          .eq('api_id', apiId);
        
        setFavorites(prev => {
          const next = new Set(prev);
          next.delete(apiId);
          return next;
        });
      } else {
        await supabase
          .from('user_api_favorites')
          .insert({ user_id: userId, api_id: apiId });
        
        setFavorites(prev => new Set([...prev, apiId]));
      }
    } catch (err) {
      console.error('Favorite toggle error:', err);
    }
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [...new Set(apis.map(a => a.category))].sort();
    return cats;
  }, [apis]);

  // Filter APIs
  const filteredAPIs = useMemo(() => {
    return apis.filter(api => {
      const matchesSearch = !searchQuery || 
        api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        api.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        api.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || api.category === selectedCategory;
      const matchesAuth = selectedAuth === 'all' || api.auth_type === selectedAuth;
      
      return matchesSearch && matchesCategory && matchesAuth;
    });
  }, [apis, searchQuery, selectedCategory, selectedAuth]);

  // Featured APIs (first 6 featured or most common)
  const featuredAPIs = useMemo(() => {
    const featured = apis.filter(a => a.is_featured);
    if (featured.length >= 6) return featured.slice(0, 6);
    
    // Fallback: show APIs with no auth (easiest to use)
    const noAuth = apis.filter(a => a.auth_type === 'none');
    return noAuth.slice(0, 6);
  }, [apis]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-12 bg-[#0a0a0f] rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-48 bg-[#0a0a0f] rounded-xl animate-pulse border border-orange-500/5" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search & Sync */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search 1000+ APIs by name, category, or use case..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#0a0a0f] border border-orange-500/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all"
          />
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
              showFilters 
                ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' 
                : 'bg-[#0a0a0f] border-orange-500/10 text-gray-400 hover:border-orange-500/30'
            }`}
          >
            <Filter size={16} />
            <span className="hidden sm:inline">Filters</span>
            <ChevronDown size={14} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-br from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-50"
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{syncing ? 'Syncing...' : 'Sync APIs'}</span>
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-[#0a0a0f]/80 border border-orange-500/10 rounded-xl">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#111118] border border-orange-500/10 rounded-lg text-white focus:outline-none focus:border-orange-500/40"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{CATEGORY_ICONS[cat] || '📦'} {cat}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Authentication</label>
            <select
              value={selectedAuth}
              onChange={(e) => setSelectedAuth(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#111118] border border-orange-500/10 rounded-lg text-white focus:outline-none focus:border-orange-500/40"
            >
              <option value="all">All Auth Types</option>
              <option value="none">🌐 No Auth Required</option>
              <option value="apiKey">🔑 API Key</option>
              <option value="oauth">🔐 OAuth</option>
            </select>
          </div>
        </div>
      )}

      {/* Featured APIs Section - Only show when no search/filter */}
      {!searchQuery && selectedCategory === 'all' && selectedAuth === 'all' && featuredAPIs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-orange-500" />
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Quick Start APIs</h3>
            <span className="text-[10px] text-gray-600">No auth required</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {featuredAPIs.map(api => (
              <button
                key={api.id}
                onClick={() => setSelectedAPI(api)}
                className="group p-4 bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/10 hover:border-orange-500/40 rounded-xl text-left transition-all hover:shadow-lg hover:shadow-orange-500/5"
              >
                <div className="text-2xl mb-2">{CATEGORY_ICONS[api.category] || '📦'}</div>
                <h4 className="text-xs font-bold text-white truncate group-hover:text-orange-400 transition-colors">{api.name}</h4>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">{api.category}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Showing <span className="text-white font-bold">{filteredAPIs.length}</span> APIs
          {searchQuery && <span> matching "{searchQuery}"</span>}
        </p>
        
        {apis.length === 0 && (
          <button
            onClick={handleSync}
            className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
          >
            Click "Sync APIs" to load the catalog →
          </button>
        )}
      </div>

      {/* API Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAPIs.slice(0, 50).map(api => {
          const authBadge = AUTH_BADGES[api.auth_type as keyof typeof AUTH_BADGES] || AUTH_BADGES.none;
          const AuthIcon = authBadge.icon;
          const isFav = favorites.has(api.id);
          
          return (
            <div
              key={api.id}
              className="group relative bg-gradient-to-br from-[#0a0a0f] to-[#0f0f18] border border-orange-500/10 hover:border-orange-500/30 rounded-xl overflow-hidden transition-all hover:shadow-lg hover:shadow-orange-500/5"
            >
              {/* Category Icon Header */}
              <div className="absolute top-4 right-4 text-2xl opacity-20 group-hover:opacity-40 transition-opacity">
                {CATEGORY_ICONS[api.category] || '📦'}
              </div>
              
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-white truncate group-hover:text-orange-400 transition-colors">
                      {api.name}
                    </h3>
                    <p className="text-[10px] text-orange-500/60 uppercase tracking-wider mt-0.5">{api.category}</p>
                  </div>
                  
                  <button
                    onClick={() => toggleFavorite(api.id)}
                    className={`p-1.5 rounded-lg transition-all ${
                      isFav 
                        ? 'text-orange-400 bg-orange-500/20' 
                        : 'text-gray-600 hover:text-orange-400 hover:bg-orange-500/10'
                    }`}
                  >
                    <Star size={14} fill={isFav ? 'currentColor' : 'none'} />
                  </button>
                </div>
                
                {/* Description */}
                <p className="text-xs text-gray-400 line-clamp-2 min-h-[2.5rem] mb-4">
                  {api.description}
                </p>
                
                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold border ${authBadge.color}`}>
                    <AuthIcon size={10} />
                    {authBadge.label}
                  </span>
                  
                  {api.https && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-md text-[10px] font-bold border border-blue-500/30">
                      🔒 HTTPS
                    </span>
                  )}
                  
                  {api.cors === 'yes' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-md text-[10px] font-bold border border-green-500/30">
                      ✓ CORS
                    </span>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedAPI(api)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 hover:border-orange-500/40 rounded-lg text-xs font-bold text-orange-400 transition-all"
                  >
                    <Play size={12} />
                    Try API
                  </button>
                  
                  <a
                    href={api.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-3 py-2 bg-[#111118] hover:bg-[#1a1a24] border border-white/10 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-all"
                  >
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Load More Indicator */}
      {filteredAPIs.length > 50 && (
        <div className="text-center py-8">
          <p className="text-xs text-gray-500">
            Showing 50 of {filteredAPIs.length} APIs. Use search to narrow results.
          </p>
        </div>
      )}

      {/* Empty State */}
      {filteredAPIs.length === 0 && apis.length > 0 && (
        <div className="py-16 text-center">
          <Package size={40} className="mx-auto text-gray-600 mb-4" />
          <p className="text-sm text-gray-400 font-bold">No APIs match your filters</p>
          <p className="text-xs text-gray-600 mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Initial Empty State */}
      {apis.length === 0 && (
        <div className="py-16 text-center border border-dashed border-orange-500/20 rounded-2xl bg-gradient-to-br from-orange-500/5 to-transparent">
          <Package size={48} className="mx-auto text-orange-500/40 mb-4" />
          <p className="text-sm text-gray-400 font-bold">API Marketplace Empty</p>
          <p className="text-xs text-gray-600 mt-2 mb-6">Click "Sync APIs" to load 1000+ free APIs from GitHub</p>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-br from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 rounded-xl text-white font-bold text-sm transition-all"
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing from GitHub...' : 'Sync Public APIs'}
          </button>
        </div>
      )}

      {/* API Playground Modal */}
      {selectedAPI && (
        <APIPlayground
          api={selectedAPI}
          onClose={() => setSelectedAPI(null)}
          onUse={onUseAPI}
        />
      )}
    </div>
  );
}
