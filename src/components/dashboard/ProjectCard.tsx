import { Folder, Clock, ExternalLink, Globe, Hash } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
  project_type: string;
  template_id: string | null;
  preview_html: string | null;
  original_prompt: string;
  user_id: string;
  files: any;
}

interface ProjectCardProps {
  project: Project;
  onOpen: (projectId: string) => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const computeHash = project.id.slice(0, 8).toUpperCase();
  const subdomain = project.name.toLowerCase().replace(/\s+/g, '-').slice(0, 20);

  return (
    <div className="group bg-[#0a0a0f] border border-white/5 rounded-2xl hover:border-orange-500/30 transition-all duration-300 flex flex-col relative overflow-hidden">
      {/* Thumbnail */}
      <div className="h-36 bg-gradient-to-br from-[#111118] to-[#0a0a0f] border-b border-white/5 relative overflow-hidden">
        {project.thumbnail_url ? (
          <img src={project.thumbnail_url} alt={project.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        ) : project.preview_html ? (
          <div 
            className="w-full h-full opacity-50 group-hover:opacity-70 transition-opacity"
            dangerouslySetInnerHTML={{ __html: project.preview_html }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center opacity-30 group-hover:opacity-50 transition-opacity">
              <Folder size={32} className="text-gray-500 mx-auto mb-2" />
              <span className="text-[10px] text-gray-600 font-mono uppercase tracking-widest">No Preview</span>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400">Live</span>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider text-blue-400 border border-blue-500/20">
          {project.project_type}
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base text-white line-clamp-1 group-hover:text-orange-400 transition-colors">
            {project.name}
          </h3>
          
          {/* Subdomain */}
          <div className="flex items-center gap-1.5 mt-2">
            <Globe size={10} className="text-gray-500" />
            <span className="text-[10px] text-gray-500 font-mono truncate">
              {subdomain}.heftcoder.icu
            </span>
          </div>

          {/* Compute Hash */}
          <div className="flex items-center gap-1.5 mt-1">
            <Hash size={10} className="text-gray-600" />
            <span className="text-[9px] text-gray-600 font-mono">
              {computeHash}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-1.5 text-[9px] text-gray-500 uppercase tracking-widest font-bold">
            <Clock size={11} />
            {getTimeAgo(project.updated_at)}
          </div>
          <button
            onClick={() => onOpen(project.id)}
            className="flex items-center gap-1.5 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-orange-500/20 hover:border-orange-500 active:scale-95"
          >
            Launch <ExternalLink size={10} />
          </button>
        </div>
      </div>
    </div>
  );
}
