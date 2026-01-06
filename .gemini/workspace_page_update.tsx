/**
 * HashCoder IDE - Updated handleSendMessage with Conversational Mode
 * 
 * REPLACE the existing handleSendMessage function with this version
 */

import { ConversationalAgent } from '@/lib/agent/conversational';
import { ThinkingIndicator } from '@/components/workspace/ThinkingIndicator';

// Add to state variables:
const [agentMode, setAgentMode] = useState<'discussion' | 'building'>('discussion');
const [thinkingAction, setThinkingAction] = useState<'thinking' | 'writing' | 'building'>('thinking');

const handleSendMessage = async () => {
    if (!chatInput || isGenerating) return;

    const userPrompt = chatInput;
    setMessages(prev => [...prev, { role: "user", content: userPrompt }]);
    setIsGenerating(true);
    setChatInput("");

    try {
        // STEP 1: Detect user intent
        const intent = ConversationalAgent.detectIntent(userPrompt);
        setAgentMode(intent.type === 'building' ? 'building' : 'discussion');

        // STEP 2: If user wants to chat/plan (not build)
        if (!intent.canGenerateCode) {
            setThinkingAction('thinking');

            // Call chat API instead of generate
            const response = await fetch("/api/agent/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: userPrompt,
                    mode: intent.type,
                    conversationHistory: messages.slice(-5) // Last 5 messages for context
                })
            });

            if (!response.ok) {
                throw new Error("Chat failed");
            }

            const data = await response.json();

            // Add conversational response
            setMessages(prev => [...prev, {
                role: "ai",
                content: data.response
            }]);

            setIsGenerating(false);
            return; // Don't generate code
        }

        // STEP 3: User wants to BUILD - proceed with code generation
        setThinkingAction('building');

        const response = await fetch("/api/agent/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                projectId: params.id,
                prompt: userPrompt,
                fileContext: project?.files,
                model: selectedModel
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Generation failed");
        }

        const data = await response.json();

        // Handle failover
        if (data.failover) {
            setMessages(prev => [...prev, {
                role: "ai",
                content: "⚠️ Fail-Safe Mode Active: Primary Vibe engine busy. Automatically re-routing to HeftCoder Plus."
            }]);
        }

        // Handle image generation
        if (data.imageUrl) {
            setMessages(prev => [...prev, {
                role: "ai",
                content: "I've generated this image for you:",
                imageUrl: data.imageUrl
            }]);
        } else {
            // NEW: Handle agent response with actions
            const agentResponse = data.agentResponse;

            if (agentResponse && agentResponse.actions && agentResponse.actions.length > 0) {
                // Show building message
                setMessages(prev => [...prev, {
                    role: "ai",
                    content: agentResponse.conversationText || "✨ Building your project...",
                    actions: agentResponse.actions,
                    actionStatuses: {},
                    actionOutputs: {},
                    actionErrors: {}
                }]);

                // TODO: Execute actions (Phase 1 completion)
                // For now, just show the message
            } else {
                // Fallback
                setMessages(prev => [...prev, {
                    role: "ai",
                    content: "I've updated the code for you!"
                }]);
            }
        }

        // Refetch project
        const { data: updatedProject } = await supabase
            .from('projects')
            .select('*')
            .eq('id', params.id)
            .single();
        if (updatedProject) setProject(updatedProject);

    } catch (error: any) {
        console.error("Generation error:", error);
        setMessages(prev => [...prev, {
            role: "ai",
            content: `Error: ${error.message}`
        }]);
    } finally {
        setIsGenerating(false);
        setThinkingAction('thinking');
    }
};

// ADD this to the chat messages rendering (after line ~276):
{
    isGenerating && (
        <ThinkingIndicator visible={true} action={thinkingAction} />
    )
}
