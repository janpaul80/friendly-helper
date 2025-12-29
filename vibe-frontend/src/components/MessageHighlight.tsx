// Message highlighting utility for Claude-style colored text
// Automatically highlights key phrases with color coding

interface HighlightRule {
    pattern: RegExp;
    className: string;
}

// Define highlight rules for different types of content
const highlightRules: HighlightRule[] = [
    // Code blocks and commands (teal)
    { pattern: /`([^`]+)`/g, className: 'highlight-code' },
    { pattern: /(npm install|npm run|git clone|cd |mkdir|touch|node |python |pip install)/gi, className: 'highlight-code' },

    // File paths (teal)
    { pattern: /(\/[a-zA-Z0-9_\-/.]+\.[a-zA-Z0-9]+|[a-zA-Z0-9_\-/.]+\.(js|ts|tsx|jsx|css|html|json|py|java|go|rs))/g, className: 'highlight-code' },

    // Actions/Status (soft blue)
    { pattern: /(✅|✓|ready|complete|success|done|action required|approved|created|generated|built)/gi, className: 'highlight-primary' },

    // Warnings/Alerts (orange)
    { pattern: /(⚠️|❌|warning|error|failed|missing|required|approval needed|caution|important|note)/gi, className: 'highlight-secondary' },

    // Links (teal with underline)
    { pattern: /(https?:\/\/[^\s]+)/g, className: 'highlight-link' },
];

export function highlightMessage(text: string): string {
    let highlighted = text;

    // Track positions we've already highlighted to avoid overlap
    const highlightedRanges: Array<{ start: number, end: number }> = [];

    // Apply each rule
    highlightRules.forEach(rule => {
        const matches = [...highlighted.matchAll(rule.pattern)];

        // Process matches in reverse to maintain correct indices
        matches.reverse().forEach(match => {
            if (!match.index) return;

            const start = match.index;
            const end = start + match[0].length;

            // Check if this range overlaps with existing highlights
            const overlaps = highlightedRanges.some(range =>
                (start >= range.start && start < range.end) ||
                (end > range.start && end <= range.end)
            );

            if (!overlaps) {
                const matchText = match[0];
                const replacement = `<span class="${rule.className}">${matchText}</span>`;
                highlighted = highlighted.substring(0, start) + replacement + highlighted.substring(end);
                highlightedRanges.push({ start, end: start + replacement.length });
            }
        });
    });

    return highlighted;
}

interface MessageContentProps {
    content: string;
    role: 'user' | 'agent';
}

export function MessageContent({ content, role }: MessageContentProps) {
    if (role === 'user') {
        // No highlighting for user messages
        return <div className="agent-message">{content}</div>;
    }

    // Highlight agent messages
    const highlighted = highlightMessage(content);

    return (
        <div
            className="agent-message"
            dangerouslySetInnerHTML={{ __html: highlighted }}
        />
    );
}
