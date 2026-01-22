import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceButtonProps {
    onTranscript: (text: string) => void;
    disabled?: boolean;
}

export function VoiceButton({ onTranscript, disabled }: VoiceButtonProps) {
    const handleClick = () => {
        // Placeholder implementation
        alert("Voice input is not yet implemented.");
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClick}
            disabled={disabled}
            className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground hover:bg-secondary"
            title="Voice Input (Coming Soon)"
        >
            <Mic className="h-5 w-5" />
        </Button>
    );
}
