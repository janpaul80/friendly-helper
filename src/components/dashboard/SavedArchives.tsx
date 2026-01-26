import { BookOpen, Code, FileCode, Bookmark, FolderArchive } from 'lucide-react';

interface SavedArchivesProps {
  archives: any[];
}

export function SavedArchives({ archives }: SavedArchivesProps) {
  const emptyState = archives.length === 0;

  return (
    <div className="min-h-[400px]">
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
          {archives.map((archive, index) => (
            <div key={index} className="bg-[#0a0a0f] border border-white/5 rounded-xl p-4 hover:border-orange-500/30 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#111118] rounded-lg flex items-center justify-center">
                  <Code size={18} className="text-gray-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{archive.name}</h4>
                  <p className="text-[10px] text-gray-500">{archive.type}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
