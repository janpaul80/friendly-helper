import { FolderOpen, Github, Upload, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import type { UserTier } from '@/types/workspace-v2';

interface TopNavProps {
  onFileExplorerOpen: () => void;
  userTier: UserTier;
}

export function TopNav({ onFileExplorerOpen, userTier }: TopNavProps) {
  const canDownload = userTier === 'pro' || userTier === 'studio';

  return (
    <header className="h-14 border-b border-border bg-[#0a0a0a] flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Image src="/assets/hc-icon.png" alt="HeftCoder" width={32} height={32} className="h-8 w-8 rounded-lg" />
          <span className="text-lg font-semibold text-foreground">HeftCoder</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onFileExplorerOpen}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <FolderOpen className="h-4 w-4 mr-2" />
          File Explorer
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          title="Push to GitHub"
        >
          <Github className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground hover:bg-secondary"
          title="Deploy to Vercel"
        >
          <Upload className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          disabled={!canDownload}
          className="text-muted-foreground hover:text-foreground hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
          title={canDownload ? "Download Code" : "Pro/Studio required"}
        >
          <Download className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

