import { useState, useEffect, useCallback } from 'react';
import { BookOpen, Code, FileCode, Bookmark, FolderArchive, Plus, Trash2, Star, X, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface Archive {
  id: string;
  name: string;
  description: string | null;
  archive_type: 'snippet' | 'template' | 'component';
  content: string;
  language: string;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
}

interface SavedArchivesProps {
  userId: string;
}

export function SavedArchives({ userId }: SavedArchivesProps) {
  const [archives, setArchives] = useState<Archive[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'snippet' | 'template' | 'component'>('all');
  const [newArchive, setNewArchive] = useState({
    name: '',
    description: '',
    archive_type: 'snippet' as const,
    content: '',
    language: 'typescript',
  });
  const [saving, setSaving] = useState(false);

  const fetchArchives = useCallback(async () => {
    if (!userId) return;

    try {
      // Archives table doesn't exist yet - use empty array
      setArchives([]);
    } catch (err) {
      console.error('Error fetching archives:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchArchives();
  }, [fetchArchives]);

  const handleSaveArchive = async () => {
    if (!newArchive.name || !newArchive.content) {
      toast.error('Name and content are required');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('archives' as any).insert({
        user_id: userId,
        name: newArchive.name,
        description: newArchive.description || null,
        archive_type: newArchive.archive_type,
        content: newArchive.content,
        language: newArchive.language,
        tags: [],
        is_favorite: false,
      });

      if (error) throw error;

      toast.success('Archive saved!');
      setShowModal(false);
      setNewArchive({ name: '', description: '', archive_type: 'snippet', content: '', language: 'typescript' });
      fetchArchives();
    } catch (err) {
      console.error('Error saving archive:', err);
      toast.error('Failed to save archive');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArchive = async (id: string) => {
    try {
      const { error } = await supabase.from('archives' as any).delete().eq('id', id);
      if (error) throw error;
      
      setArchives(prev => prev.filter(a => a.id !== id));
      toast.success('Archive deleted');
    } catch (err) {
      console.error('Error deleting archive:', err);
      toast.error('Failed to delete archive');
    }
  };

  const handleToggleFavorite = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from('archives' as any)
        .update({ is_favorite: !currentValue })
        .eq('id', id);

      if (error) throw error;

      setArchives(prev =>
        prev.map(a => (a.id === id ? { ...a, is_favorite: !currentValue } : a))
      );
    } catch (err) {
      console.error('Error updating favorite:', err);
    }
  };

  const filteredArchives = activeFilter === 'all' 
    ? archives 
    : archives.filter(a => a.archive_type === activeFilter);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'snippet': return <Code size={16} className="text-blue-500" />;
      case 'template': return <FileCode size={16} className="text-purple-500" />;
      case 'component': return <BookOpen size={16} className="text-emerald-500" />;
      default: return <Code size={16} className="text-gray-500" />;
    }
  };

  const emptyState = filteredArchives.length === 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={32} className="animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-[400px]">
      {/* Filter Tabs + Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          {(['all', 'snippet', 'template', 'component'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeFilter === filter
                  ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(251,146,60,0.3)]'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {filter === 'all' ? 'All' : filter + 's'}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-lg font-bold text-sm shadow-[0_0_20px_rgba(251,146,60,0.3)] hover:from-orange-500 hover:to-orange-400 transition-all"
        >
          <Plus size={16} />
          New Archive
        </button>
      </div>

      {emptyState ? (
        <div className="flex flex-col items-center justify-center py-24 px-6">
          <div className="relative">
            <div className="h-20 w-20 bg-[#111118] rounded-2xl flex items-center justify-center border border-white/5">
              <FolderArchive size={36} className="text-gray-700" />
            </div>
            <div className="absolute -top-2 -right-2 h-8 w-8 bg-orange-500/10 rounded-full flex items-center justify-center border border-orange-500/20">
              <Bookmark size={14} className="text-orange-500" />
            </div>
          </div>
          
          <h3 className="text-lg font-black uppercase tracking-widest text-gray-600 mt-6">Archives Empty</h3>
          <p className="text-sm text-gray-500 mt-2 text-center max-w-md">
            Save code snippets, templates, and reusable components here for quick access across projects.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#111118] rounded-lg border border-white/5">
              <Code size={14} className="text-blue-500" />
              <span className="text-xs text-gray-400">Snippets</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#111118] rounded-lg border border-white/5">
              <FileCode size={14} className="text-purple-500" />
              <span className="text-xs text-gray-400">Templates</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-[#111118] rounded-lg border border-white/5">
              <BookOpen size={14} className="text-emerald-500" />
              <span className="text-xs text-gray-400">Components</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArchives.map((archive) => (
            <div 
              key={archive.id} 
              className="bg-[#0a0a0f] border border-white/5 rounded-xl p-4 hover:border-orange-500/30 transition-all group relative"
            >
              {/* Actions */}
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleToggleFavorite(archive.id, archive.is_favorite)}
                  className={`p-1.5 rounded-lg transition-all ${
                    archive.is_favorite 
                      ? 'bg-orange-500/20 text-orange-500' 
                      : 'bg-white/5 text-gray-500 hover:text-orange-500'
                  }`}
                >
                  <Star size={14} fill={archive.is_favorite ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => handleDeleteArchive(archive.id)}
                  className="p-1.5 rounded-lg bg-white/5 text-gray-500 hover:bg-red-500/20 hover:text-red-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#111118] rounded-lg flex items-center justify-center">
                  {getTypeIcon(archive.archive_type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{archive.name}</h4>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">{archive.archive_type} • {archive.language}</p>
                </div>
              </div>

              {archive.description && (
                <p className="text-xs text-gray-400 mt-3 line-clamp-2">{archive.description}</p>
              )}

              <div className="mt-3 p-2 bg-black/50 rounded-lg">
                <pre className="text-[10px] font-mono text-gray-500 overflow-hidden line-clamp-3">
                  {archive.content}
                </pre>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Archive Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          
          <div className="relative w-full max-w-lg bg-gradient-to-br from-[#0a0a0f] to-[#12121a] border border-orange-500/20 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black uppercase tracking-wider text-white">New Archive</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-lg">
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Name</label>
                <input
                  type="text"
                  value={newArchive.name}
                  onChange={(e) => setNewArchive(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="My awesome snippet"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-orange-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Type</label>
                <select
                  value={newArchive.archive_type}
                  onChange={(e) => setNewArchive(prev => ({ ...prev, archive_type: e.target.value as any }))}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500/50"
                >
                  <option value="snippet">Snippet</option>
                  <option value="template">Template</option>
                  <option value="component">Component</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Language</label>
                <select
                  value={newArchive.language}
                  onChange={(e) => setNewArchive(prev => ({ ...prev, language: e.target.value }))}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500/50"
                >
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="css">CSS</option>
                  <option value="html">HTML</option>
                  <option value="sql">SQL</option>
                  <option value="python">Python</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Description (optional)</label>
                <input
                  type="text"
                  value={newArchive.description}
                  onChange={(e) => setNewArchive(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What does this do?"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-orange-500/50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Content</label>
                <textarea
                  value={newArchive.content}
                  onChange={(e) => setNewArchive(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Paste your code here..."
                  rows={6}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-orange-500/50 font-mono text-sm resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 font-bold hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveArchive}
                disabled={saving || !newArchive.name || !newArchive.content}
                className="flex-1 py-3 bg-gradient-to-r from-orange-600 to-orange-500 rounded-lg text-white font-bold shadow-[0_0_20px_rgba(251,146,60,0.3)] hover:from-orange-500 hover:to-orange-400 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Save Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
