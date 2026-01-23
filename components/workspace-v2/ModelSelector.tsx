import { useState } from 'react';
import { ChevronDown, Sparkles, Zap, Brain } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AIModel } from '@/types/workspace-v2';

const MODELS: AIModel[] = [
  { id: 'agent-architect', name: 'Agent 1: The Architect', provider: 'heftcoder', badge: 'pro' },
  { id: 'agent-backend', name: 'Agent 2: Backend Eng.', provider: 'heftcoder', badge: 'new' },
  { id: 'agent-frontend', name: 'Agent 3: Frontend Eng.', provider: 'claude' },
  { id: 'agent-integrator', name: 'Agent 4: Integrator', provider: 'mistral' },
  { id: 'agent-qa', name: 'Agent 5: QA & Polish', provider: 'openai' },
  { id: 'agent-devops', name: 'Agent 6: DevOps', provider: 'mistral', badge: 'hot' },
];

interface ModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

function ProviderIcon({ provider }: { provider: AIModel['provider'] }) {
  switch (provider) {
    case 'claude':
      return (
        <div className="w-5 h-5 rounded flex items-center justify-center bg-model-claude/20">
          <Sparkles className="w-3 h-3 text-model-claude" />
        </div>
      );
    case 'openai':
      return (
        <div className="w-5 h-5 rounded flex items-center justify-center bg-model-openai/20">
          <Brain className="w-3 h-3 text-model-openai" />
        </div>
      );
    case 'mistral':
      return (
        <div className="w-5 h-5 rounded flex items-center justify-center bg-model-mistral/20">
          <Zap className="w-3 h-3 text-model-mistral" />
        </div>
      );
    case 'heftcoder':
      return (
        <div className="w-5 h-5 rounded flex items-center justify-center bg-model-heft/20">
          <Zap className="w-3 h-3 text-model-heft" />
        </div>
      );
    default:
      return null;
  }
}

function ModelBadge({ badge }: { badge?: AIModel['badge'] }) {
  if (!badge) return null;

  const variants = {
    hot: 'bg-destructive/20 text-destructive border-destructive/30',
    new: 'bg-model-openai/20 text-model-openai border-model-openai/30',
    pro: 'bg-primary/20 text-primary border-primary/30',
  };

  return (
    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-4 ${variants[badge]}`}>
      {badge.toUpperCase()}
    </Badge>
  );
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 px-3 bg-secondary hover:bg-muted border border-border text-foreground gap-2"
        >
          <ProviderIcon provider={selectedModel.provider} />
          <span className="text-sm font-medium">{selectedModel.name}</span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-56 bg-card border-border"
      >
        {MODELS.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => {
              onModelChange(model);
              setOpen(false);
            }}
            className={`flex items-center gap-3 cursor-pointer py-2.5 px-3 ${selectedModel.id === model.id ? 'bg-secondary' : ''
              }`}
          >
            <ProviderIcon provider={model.provider} />
            <span className="flex-1 text-sm">{model.name}</span>
            <ModelBadge badge={model.badge} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { MODELS };

