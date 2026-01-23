
import { useState, useMemo } from 'react';
import { X, Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}

interface FileTreeNodeProps {
  node: FileNode;
  depth: number;
}

function FileTreeNode({ node, depth }: FileTreeNodeProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Auto-expand src and root folders
  useMemo(() => {
    if (depth < 2) setIsOpen(true);
  }, [depth]);

  if (node.type === 'file') {
    return (
      <div
        className="flex items-center gap-2 py-1.5 px-2 hover:bg-secondary rounded cursor-pointer group"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <File className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 shrink-0 transition-colors" />
        <span className="text-sm text-foreground truncate group-hover:text-blue-100 transition-colors">{node.name}</span>
      </div>
    );
  }

  return (
    <div>
      <div
        className="flex items-center gap-2 py-1.5 px-2 hover:bg-secondary rounded cursor-pointer group"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
        <Folder className={cn(
          "w-4 h-4 shrink-0 transition-colors",
          isOpen ? "text-orange-500" : "text-muted-foreground group-hover:text-orange-400"
        )} />
        <span className="text-sm text-foreground truncate group-hover:text-orange-100 transition-colors">{node.name}</span>
      </div>
      {isOpen && node.children && (
        <div className="animate-in slide-in-from-left-1 fade-in duration-200">
          {node.children.sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'folder' ? -1 : 1;
          }).map((child, index) => (
            <FileTreeNode key={`${child.name}-${index}`} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

interface FileExplorerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files?: Record<string, string>;
}

function buildFileTree(files: Record<string, string>): FileNode[] {
  const rootNodes: FileNode[] = [];

  // Sort keys to ensure folders are processed implicitly
  const paths = Object.keys(files || {}).sort();

  const addNode = (pathParts: string[], currentLevel: FileNode[]) => {
    if (pathParts.length === 0) return;
    const part = pathParts[0];
    const isFile = pathParts.length === 1;

    let existing = currentLevel.find(n => n.name === part);
    if (!existing) {
      existing = {
        name: part,
        type: isFile ? 'file' : 'folder',
        children: isFile ? undefined : []
      };
      currentLevel.push(existing);
    }

    if (!isFile && existing.children) {
      addNode(pathParts.slice(1), existing.children);
    }
  };

  paths.forEach(path => {
    // Remove ./ prefix if present
    const cleanPath = path.startsWith('./') ? path.substring(2) : path;
    // Ignore dotfiles like .heftcoder or .git unless requested
    if (cleanPath.startsWith('.heftcoder') || cleanPath.startsWith('.git')) return;

    addNode(cleanPath.split('/'), rootNodes);
  });

  return rootNodes;
}

export function FileExplorerModal({ open, onOpenChange, files = {} }: FileExplorerModalProps) {
  const tree = useMemo(() => buildFileTree(files), [files]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-[#0a0a0a] border-white/10 text-white shadow-2xl">
        <DialogHeader className="border-b border-white/5 pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-light tracking-wide">
            <div className="bg-orange-600/10 p-2 rounded-lg text-orange-500">
              <Folder className="w-5 h-5" />
            </div>
            Project Files
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4 mt-2">
          {tree.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 py-20">
              <Folder className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm uppercase tracking-widest font-bold">No files found</p>
            </div>
          ) : (
            <div className="space-y-0.5 pl-1">
              {tree.map((node, index) => (
                <FileTreeNode key={`${node.name}-${index}`} node={node} depth={0} />
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t border-white/5">
          <span className="text-xs text-mono text-gray-600">
            {Object.keys(files || {}).length} files across project
          </span>
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="hover:bg-white/5 hover:text-white text-gray-400">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

