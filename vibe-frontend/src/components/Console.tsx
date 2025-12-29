export function Console() {
    return (
        <div className="h-full overflow-y-auto p-3 font-mono text-sm space-y-1 bg-black text-gray-300">
            <div className="text-green-400 flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 6l-6-6-6 6" /></svg>
                <span>Starting AI build...</span>
            </div>
            <div className="text-green-400 flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 6l-6-6-6 6" /></svg>
                <span>Dependencies resolved</span>
            </div>
            <div className="text-yellow-400 flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                <span>Editor agent writing components...</span>
            </div>
            <div className="text-blue-400 flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2m12-10c0 1.105-1.343 2-3 2s-3-.895-3-2M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2m12-10c0 1.105-1.343 2-3 2s-3-.895-3-2m12-10c0 1.105-1.343 2-3 2s-3-.895-3-2M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2m12-10c0 1.105-1.343 2-3 2s-3-.895-3-2m12-10c0 1.105-1.343 2-3 2s-3-.895-3-2M9 19c0 1.105-1.343 2 0 0"></path></svg>
                <span>Server listening on port 3000</span>
            </div>
            <div className="pl-5 text-gray-500">
                &gt; Ready for requests...
            </div>
        </div>
    );
}
