import { useRef, useEffect } from 'react';

export function CodeEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        // Only auto-scroll on mount if needed
        if (textareaRef.current) {
            // Optional: textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
        }
    }, []);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full bg-gray-950 text-gray-300 p-4 font-mono text-sm outline-none resize-none border-none"
            spellCheck="false"
        />
    );
}
