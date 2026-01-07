import { createServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { AIEngine, ModelID } from "@/lib/ai/engine";
import { auth } from "@clerk/nextjs/server";
import { ActionParser } from "@/lib/agent/parser";
import { IntentClassifier, UserIntent } from "@/lib/agent/intent";
import { ConversationalAgent } from "@/lib/agent/conversational";
import { WorkspaceState } from "@/types/workspace";

export async function POST(req: Request) {
    const { userId: clerkId } = await auth();

    // 1. Authenticate User (via Clerk)
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createServiceClient();
    const body = await req.json();
    const { projectId, prompt, model, fileContext, workspaceState, messages = [] } = body;

    console.log("[AIEngine] Incoming request", {
        model,
        projectId,
        prompt: prompt.substring(0, 100) + "...",
        origin: req.headers.get("origin"),
        referer: req.headers.get("referer"),
        ip: req.headers.get("x-forwarded-for"),
        userAgent: req.headers.get("user-agent")
    });

    // 3. Get User from Supabase and Check Credits
    const { data: userData, error: userError } = await supabase
        .from("users")
        .select("id, credits")
        .eq("clerk_id", clerkId)
        .single();

    if (userError || !userData) {
        return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }

    const isImage = model === "flux.2-pro";
    const cost = isImage ? 50 : 5;

    if (userData.credits < cost) {
        return NextResponse.json({ error: `Insufficient credits (Need ${cost})` }, { status: 403 });
    }

    try {
        // 4. Classify user intent and determine mode
        const intent = IntentClassifier.classify(prompt);
        const mode = ConversationalAgent.intentToMode(intent, workspaceState || {
            id: projectId,
            currentPlan: null,
            planStatus: "none"
        });

        console.log("[Intent] Classified as:", intent, "Mode:", mode);

        // 5. Check if plan is approved for code generation requests
        const isCodeRequest = intent === UserIntent.CODE_REQUEST;
        if (isCodeRequest && workspaceState?.planStatus !== "approved") {
            return NextResponse.json({
                success: true,
                intent,
                mode,
                response: {
                    type: "chat",
                    content: "I need to create a plan first. Please describe what you want to build, and I'll propose a plan for your approval."
                },
                shouldModifyFiles: false
            });
        }

        // 6. Call AI Engine for code generation
        const systemPrompt = ConversationalAgent.getSystemPrompt(mode);
        const result = await AIEngine.generate(model as ModelID, prompt, fileContext, messages, systemPrompt);

        let content;
        let imageUrl;
        let agentResponse;
        let shouldModifyFiles = IntentClassifier.shouldModifyFiles(intent);

        if (isImage) {
            const parsed = JSON.parse(result.content);
            imageUrl = parsed.url;
            const fileName = `public/assets/gen-${Date.now()}.png`;
            content = { [fileName]: `IMAGE_ASSET:${imageUrl}` };

            agentResponse = {
                conversationText: "Generated image",
                actions: [],
                requiresConfirmation: false
            };
            shouldModifyFiles = true;
        } else {
            try {
                content = JSON.parse(result.content);

                // If result is the special conversation object from Hybrid Parser
                if (content.__isConversation) {
                    agentResponse = {
                        conversationText: content.message,
                        actions: [],
                        requiresConfirmation: false
                    };
                } else {
                    // Parse into structured actions
                    agentResponse = ActionParser.parseResponse(content);
                }
            } catch (e) {
                // Not JSON - treat as chat response
                agentResponse = {
                    conversationText: result.content,
                    actions: [],
                    requiresConfirmation: false
                };
                shouldModifyFiles = false;
            }
        }

        // 7. Update Supabase (Files & History)
        const { data: project } = await supabase
            .from("projects")
            .select("files")
            .eq("id", projectId)
            .single();

        let updatedFiles = { ...project?.files };

        // Save AI generated files if applicable
        if (shouldModifyFiles && content && !content.__isConversation) {
            updatedFiles = { ...updatedFiles, ...content };
        }

        // Always Update History in .heftcoder/chat.json
        const aiMessage = {
            role: "ai",
            content: agentResponse?.conversationText || result.content,
            intent,
            timestamp: Date.now()
        };

        const currentHistory = [...messages, { role: "user", content: prompt }, aiMessage];
        updatedFiles[".heftcoder/chat.json"] = JSON.stringify(currentHistory);

        await supabase
            .from("projects")
            .update({
                files: updatedFiles,
                last_modified: Date.now()
            })
            .eq("id", projectId);

        // 8. Deduct Credits
        const { error: rpcError } = await supabase.rpc('decrement_credits', {
            target_user_id: userData.id,
            amount: cost
        });

        if (rpcError) {
            console.error("RPC Credit Deduction Failed, falling back to patch:", rpcError);
            await supabase
                .from("users")
                .update({ credits: Math.max(0, userData.credits - cost) })
                .eq("id", userData.id);
        }

        return NextResponse.json({
            success: true,
            intent,
            mode,
            changes: shouldModifyFiles ? content : null,
            response: {
                type: shouldModifyFiles ? "code" : "chat",
                content: agentResponse?.conversationText || result.content
            },
            imageUrl,
            failover: result.failover,
            agentResponse,
            shouldModifyFiles
        });

    } catch (error: any) {
        console.error("API Agent Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// getChatResponse removed: Now we always use AIEngine for high-fidelity responses
