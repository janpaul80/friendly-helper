// REPLACE LINES 267-284 IN app/workspace/[id]/page.tsx WITH THIS:

<div className="flex-1 overflow-y-auto p-4 space-y-4">
    {messages.map((msg, i) => (
        <div key={i} className="space-y-2">
            <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[9px] uppercase font-bold shrink-0 ${msg.role === 'ai' ? 'bg-orange-600 text-white' : 'bg-white/10 text-gray-400'}`}>
                    {msg.role === 'ai' ? 'AI' : 'Me'}
                </div>
                <div className={`p-3 rounded-xl text-xs max-w-[85%] border shadow-sm ${msg.role === 'ai' ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-orange-600/10 border-orange-600/20 text-orange-100 italic'}`}>
                    {msg.content}
                    {msg.imageUrl && (
                        <div className="mt-3 rounded-lg overflow-hidden border border-white/10">
                            <img src={msg.imageUrl} alt="Generated" className="w-full h-auto" />
                        </div>
                    )}
                </div>
            </div>
            {/* NEW: Render actions if present */}
            {msg.actions && msg.actions.length > 0 && (
                <div className="ml-10">
                    <ActionList
                        actions={msg.actions}
                        statuses={msg.actionStatuses || {}}
                        outputs={msg.actionOutputs || {}}
                        errors={msg.actionErrors || {}}
                    />
                </div>
            )}
        </div>
    ))}
    <div ref={chatEndRef} />
</div>
