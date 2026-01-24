import { createServiceClient } from "@/lib/supabase";
import { NextResponse } from "next/server";
import { AIEngine, ModelID } from "@/lib/ai/engine";
import { auth } from "@clerk/nextjs/server";
import { ActionParser } from "@/lib/agent/parser";
import { IntentClassifier, UserIntent } from "@/lib/agent/intent";
import { ConversationalAgent } from "@/lib/agent/conversational";
import { WorkspaceState } from "@/types/workspace";

export async function POST(req: Request) {
    console.log('[Orchestration] ====== POST REQUEST STARTED ======');
    const { userId: clerkId } = await auth();

    // 1. Authenticate User (via Clerk)
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const supabase = createServiceClient();
    const body = await req.json();
    let { projectId, prompt, fileContext, workspaceState, messages = [] } = body;
    let model = body.model; // Use let so we can reassign for orchestration routing

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
        // 4. Load Workspace State (Persistence)
        let currentWorkspaceState: WorkspaceState = workspaceState;

        if (fileContext && fileContext['.heftcoder/workspace_state.json']) {
            try {
                currentWorkspaceState = JSON.parse(fileContext['.heftcoder/workspace_state.json']);
            } catch (e) {
                console.warn("[AIEngine] Failed to parse workspace state", e);
            }
        }

        if (!currentWorkspaceState) {
            currentWorkspaceState = {
                id: projectId,
                currentPlan: null,
                planStatus: "none"
            };
        }

        // 5. Check orchestration state and route to correct agent if needed
        console.error('[Orchestration] ========== ORCHESTRATION CODE IS RUNNING ==========');
        console.error('[Orchestration] STEP 1: About to import orchestrator');
        const { getOrchestrator } = await import('@/lib/orchestration/engine');
        console.error('[Orchestration] STEP 2: Got orchestrator, calling getOrchestrator()');
        const orchestrator = getOrchestrator();
        console.error('[Orchestration] STEP 3: Got orchestrator instance, getting state');
        let orchState = orchestrator.getState();

        console.error('[Orchestration] STEP 4: Initial state:', JSON.stringify({ phase: orchState.phase, currentAgent: orchState.currentAgent, model }));

        // 5. Classify user intent and determine mode
        const intent = IntentClassifier.classify(prompt);
        console.error('[Orchestration] STEP 5: Intent classified:', intent);
        const mode = ConversationalAgent.intentToMode(intent, currentWorkspaceState);
        console.error('[Orchestration] STEP 6: Mode determined:', mode.type);

        // Auto-start orchestration for code/plan requests if not already started
        // Start if: (code request OR plan request) AND (idle OR no orchestration) AND (architect model OR no specific model)
        const shouldStartOrchestration = (intent === UserIntent.CODE_REQUEST || intent === UserIntent.PLAN_REQUEST) &&
            (orchState.phase === 'idle' || !orchState.phase);

        console.error('[Orchestration] STEP 7: Should start?', shouldStartOrchestration, {
            isCodeRequest: intent === UserIntent.CODE_REQUEST,
            isPlanRequest: intent === UserIntent.PLAN_REQUEST,
            phase: orchState.phase,
            model
        });

        if (shouldStartOrchestration) {
            // If model is architect, or if no model specified (defaults to architect for code requests)
            if (model === 'agent-architect' || !model || model === 'default') {
                console.error('[Orchestration] STEP 8: Auto-starting orchestration for request', { intent, model, phase: orchState.phase });
                await orchestrator.startOrchestration(prompt);
                orchState = orchestrator.getState();
                console.error('[Orchestration] STEP 9: Started, phase:', orchState.phase, 'currentAgent:', orchState.currentAgent);
            } else {
                console.error('[Orchestration] STEP 8: Skipping auto-start - model is not architect', { model });
            }
        } else {
            console.error('[Orchestration] STEP 8: Skipping auto-start', { intent, phase: orchState.phase, isCodeRequest: intent === UserIntent.CODE_REQUEST, isPlanRequest: intent === UserIntent.PLAN_REQUEST });
        }

        // If orchestration is active, route to the current agent
        if (orchState.phase !== 'idle' && orchState.currentAgent) {
            const nextAgent = orchestrator.getNextAgent();
            if (nextAgent.shouldExecute && nextAgent.agent && model !== nextAgent.agent) {
                console.log(`[Orchestration] Routing to active agent: ${nextAgent.agent} (requested: ${model})`);
                // Override model to match orchestration state
                model = nextAgent.agent as any;
            }
        }

        console.log("[Intent] Classified as:", intent, "Mode:", mode, "PlanStatus:", currentWorkspaceState.planStatus, "OrchPhase:", orchState.phase);

        // 6. Check if plan is approved for code generation requests
        const isCodeRequest = intent === UserIntent.CODE_REQUEST;

        // If it's a code request but there is no plan, we don't BLOCK it anymore.
        // We simply let the agent (in planning mode) respond with a plan.
        // The ConversationalAgent.intentToMode will ensure it goes to 'planning' if not approved.
        if (isCodeRequest && currentWorkspaceState.planStatus !== "approved") {
            console.log("[Route] Code Request without approval -> Delegating to Planning Agent");
            // Do NOT return early. Let the AI generate the plan.
        }

        // 6. Prepare orchestration tools for all agents based on their model ID
        console.log('[Orchestration] STEP 11: About to prepare tools', { phase: orchState.phase, model });
        let tools: any[] | undefined;
        const { HANDOFF_TOOLS } = await import('@/lib/orchestration/engine');

        // Map each agent to their specific handoff tool
        const agentToolMap: Record<string, string[]> = {
            'agent-architect': ['handoff_to_backend'],
            'agent-backend': ['handoff_to_frontend'],
            'agent-frontend': ['handoff_to_integrator'],
            'agent-integrator': ['handoff_to_qa'],
            'agent-qa': ['handoff_to_devops'],
            'agent-devops': ['mark_complete']
        };

        // Pass tools if orchestration is active or if this is the architect
        if (orchState.phase !== 'idle' || model === 'agent-architect') {
            const toolNames = agentToolMap[model] || [];
            if (toolNames.length > 0) {
                tools = toolNames.map(name => HANDOFF_TOOLS[name as keyof typeof HANDOFF_TOOLS]).filter(Boolean);
                console.log(`[Orchestration] STEP 12: Passing tools to ${model}:`, toolNames);
            }
        }

        // 7. Call AI Engine for code generation
        const systemPrompt = ConversationalAgent.getSystemPrompt(mode, messages, model as string);
        const result = await AIEngine.generate(model as ModelID, prompt, fileContext, messages, systemPrompt, tools);

        // Check for tool calls BEFORE trying to parse as JSON
        // Tool calls come in the format: TOOL_CALL: function_name({...})
        const hasToolCall = result.content.includes('TOOL_CALL:') ||
            (result.toolCalls && result.toolCalls.length > 0);

        console.log('[Orchestration] Response check', {
            hasToolCall,
            toolCallsCount: result.toolCalls?.length || 0,
            contentPreview: result.content.substring(0, 100)
        });

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
        } else if (hasToolCall && !result.toolCalls) {
            // Tool call detected in content but not parsed yet - treat as conversation
            // The tool call will be handled later in the tool call section
            agentResponse = {
                conversationText: result.content,
                actions: [],
                requiresConfirmation: false
            };
            shouldModifyFiles = false;
        } else {
            try {
                // Strip markdown code blocks if present (common LLM behavior)
                const cleanJson = result.content.replace(/```json\n?|```/g, "").trim();
                content = JSON.parse(cleanJson);

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
                // JSON parse failed - treat as conversation/plan
                agentResponse = {
                    conversationText: result.content,
                    actions: [],
                    requiresConfirmation: false
                };
                shouldModifyFiles = false; // Default false for chat, but might be overridden by state change
            }
        }

        // 8. Handle Tool Calls (Orchestration Handoffs)
        if (result.toolCalls && result.toolCalls.length > 0) {
            console.log('[Orchestration] Tool calls detected:', result.toolCalls);

            // Execute each tool call
            for (const toolCall of result.toolCalls) {
                console.log(`[Orchestration] Executing tool: ${toolCall.name}`);
                await orchestrator.handleToolCall(toolCall.name, toolCall.parameters);
            }

            // Get updated orchestration state
            const updatedOrchState = orchestrator.getState();
            console.log('[Orchestration] New state:', updatedOrchState.phase, updatedOrchState.progress);

            // Check if there's a next agent to execute
            const nextAgent = orchestrator.getNextAgent();
            let nextAgentResponse = null;

            if (nextAgent.shouldExecute && nextAgent.agent && updatedOrchState.phase !== 'complete') {
                console.log(`[Orchestration] Auto-triggering next agent: ${nextAgent.agent}`);

                // Helper functions for next agent
                const getNextAgentPrompt = (agentId: string, state: any): string => {
                    const prompts: Record<string, string> = {
                        'agent-backend': `Build the backend according to this plan:\n${JSON.stringify(state.plan || {}, null, 2)}\n\nCreate API routes, database schema, and authentication.`,
                        'agent-frontend': `Build the frontend UI based on this backend:\n${JSON.stringify(state.currentContext?.backend_artifacts || {}, null, 2)}\n\nCreate React components and connect to the API.`,
                        'agent-integrator': `Integrate frontend with backend:\n${JSON.stringify(state.currentContext?.frontend_artifacts || {}, null, 2)}\n\nVerify connections and fix any integration issues.`,
                        'agent-qa': `Test and harden the application:\n${state.currentContext?.integration_status || 'Integration complete'}\n\nRun tests, fix bugs, and secure endpoints.`,
                        'agent-devops': `Deploy the application:\n${state.currentContext?.qa_report || 'QA complete'}\n\nConfigure deployment and deploy to production.`
                    };
                    return prompts[agentId] || 'Continue with your specialized task.';
                };

                const getToolsForNextAgent = (agentId: string): any[] => {
                    const agentToolMap: Record<string, string[]> = {
                        'agent-architect': ['handoff_to_backend'],
                        'agent-backend': ['handoff_to_frontend'],
                        'agent-frontend': ['handoff_to_integrator'],
                        'agent-integrator': ['handoff_to_qa'],
                        'agent-qa': ['handoff_to_devops'],
                        'agent-devops': ['mark_complete']
                    };
                    const toolNames = agentToolMap[agentId] || [];
                    return toolNames.map(name => HANDOFF_TOOLS[name as keyof typeof HANDOFF_TOOLS]).filter(Boolean);
                };

                // Prepare context for next agent
                const nextAgentPrompt = getNextAgentPrompt(nextAgent.agent, updatedOrchState);
                const nextAgentSystemPrompt = ConversationalAgent.getSystemPrompt('planning' as any, [], nextAgent.agent);
                const nextAgentTools = getToolsForNextAgent(nextAgent.agent);

                try {
                    // Call the next agent
                    const nextResult = await AIEngine.generate(
                        nextAgent.agent as ModelID,
                        nextAgentPrompt,
                        fileContext,
                        [],
                        nextAgentSystemPrompt,
                        nextAgentTools
                    );

                    // Parse next agent response
                    try {
                        const cleanJson = nextResult.content.replace(/```json\n?|```/g, "").trim();
                        const nextContent = JSON.parse(cleanJson);
                        if (nextContent.__isConversation) {
                            nextAgentResponse = nextContent.message;
                        } else {
                            const nextParsed = ActionParser.parseResponse(nextContent);
                            nextAgentResponse = nextParsed.conversationText;
                        }
                    } catch (e) {
                        nextAgentResponse = nextResult.content;
                    }

                    // Handle tool calls from next agent (recursive)
                    if (nextResult.toolCalls && nextResult.toolCalls.length > 0) {
                        for (const toolCall of nextResult.toolCalls) {
                            await orchestrator.handleToolCall(toolCall.name, toolCall.parameters);
                        }
                    }

                    // Update files with next agent's changes
                    if (nextResult.content && !nextResult.content.includes('__isConversation')) {
                        try {
                            const cleanJson = nextResult.content.replace(/```json\n?|```/g, "").trim();
                            const nextContent = JSON.parse(cleanJson);
                            if (!nextContent.__isConversation && content) {
                                Object.assign(content, nextContent);
                            }
                        } catch (e) {
                            // Ignore parse errors
                        }
                    }
                } catch (error: any) {
                    console.error(`[Orchestration] Next agent execution failed:`, error);
                    orchestrator.handleError(`${nextAgent.agent} failed: ${error.message}`);
                }
            }

            // Add orchestration status to the response
            const finalOrchState = orchestrator.getState();
            let responseText = agentResponse?.conversationText || result.content;
            if (nextAgentResponse) {
                responseText += `\n\n---\n\n**Next Agent (${nextAgent.agent}):**\n${nextAgentResponse}`;
            }

            agentResponse = {
                conversationText: `${responseText}\n\n🤖 Orchestration: ${finalOrchState.phase} (${finalOrchState.progress}%)`,
                actions: agentResponse?.actions || [],
                requiresConfirmation: false,
                orchestrationState: finalOrchState
            };
        }

        // 8. Check if architect created a plan and mark it ready for approval
        // This MUST happen regardless of whether orchestration was started, in case it wasn't auto-started
        // Check both result.content and agentResponse for plan detection
        const responseContent = agentResponse?.conversationText || result.content || '';
        const hasPlan = responseContent.includes('# Execution Plan') ||
            responseContent.includes('Execution Plan') ||
            responseContent.includes('## 1. Stack Selection') ||
            responseContent.includes('## 2. Repo Structure') ||
            responseContent.includes('## 3. Step-by-Step Checklist') ||
            responseContent.includes('Stack Selection') ||
            responseContent.includes('Repo Structure') ||
            responseContent.includes('Step-by-Step Checklist') ||
            (responseContent.includes('Stack') && responseContent.includes('Frontend') && responseContent.includes('Backend'));

        // Get fresh orchestration state
        orchState = orchestrator.getState();

        console.error('[Orchestration] ====== PLAN DETECTION ======');
        console.error('[Orchestration] STEP 10: Checking for plan', JSON.stringify({
            model,
            isArchitect: model === 'agent-architect',
            hasPlan,
            phase: orchState.phase,
            contentLength: responseContent.length,
            contentPreview: responseContent.substring(0, 100),
            intent
        }));

        // Check if architect created a plan - be more lenient with phase check
        // Also start orchestration if we detect a plan but orchestration wasn't started
        const isArchitect = model === 'agent-architect' || (!model && orchState.currentAgent === 'agent-architect');
        const isPlanRequest = intent === UserIntent.PLAN_REQUEST || intent === UserIntent.CODE_REQUEST;

        if ((isArchitect || isPlanRequest) && hasPlan) {
            // If orchestration wasn't started, start it now
            if (orchState.phase === 'idle' || !orchState.phase) {
                console.log('[Orchestration] Plan detected but orchestration not started - starting now');
                await orchestrator.startOrchestration(prompt);
                orchState = orchestrator.getState();
            }

            // ALWAYS mark as ready if we detect a plan, regardless of phase
            // This ensures the plan is available for approval even if orchestration state is wrong
            console.error('[Orchestration] STEP 10.4: Detected plan, marking as ready for approval. Current phase:', orchState.phase);
            try {
                // Try to extract plan structure
                const planMatch = responseContent.match(/```json\s*(\{[\s\S]*?\})\s*```/);
                let planData = null;
                if (planMatch) {
                    planData = JSON.parse(planMatch[1]);
                } else {
                    // Create a basic plan structure from markdown
                    planData = {
                        raw: responseContent,
                        stack: {},
                        repoStructure: {},
                        steps: []
                    };
                }
                orchestrator.markPlanReady(planData);
                const updatedState = orchestrator.getState();
                console.error('[Orchestration] STEP 10.5: Plan created, marked as awaiting approval. Phase:', updatedState.phase);
            } catch (e) {
                console.error('[Orchestration] STEP 10.5 ERROR: Failed to parse plan, using raw content:', e);
                orchestrator.markPlanReady({
                    stack: {
                        frontend: 'Unknown',
                        backend: 'Unknown',
                        database: 'Unknown',
                        auth: 'Unknown'
                    },
                    repoStructure: {},
                    steps: []
                });
                const updatedState = orchestrator.getState();
                console.error('[Orchestration] STEP 10.6: Plan marked ready with raw content. Phase:', updatedState.phase);
            }
        }

        // 8. Compute and Persist New State
        const nextState = ConversationalAgent.computeNextState(currentWorkspaceState, intent, result.content);
        const stateHasChanged = JSON.stringify(nextState) !== JSON.stringify(currentWorkspaceState);

        if (stateHasChanged) {
            shouldModifyFiles = true; // Force file update to save state
            console.log("[State] Transitioned to:", nextState.planStatus);
        }

        // 7. Update Supabase (Files & History)
        const { data: project } = await supabase
            .from("projects")
            .select("files")
            .eq("id", projectId)
            .single();

        let updatedFiles = { ...project?.files };

        // Save AI generated files if applicable
        if (shouldModifyFiles) {
            if (content && !content.__isConversation) {
                updatedFiles = { ...updatedFiles, ...content };
            }

            // Inject State File
            if (stateHasChanged) {
                updatedFiles['.heftcoder/workspace_state.json'] = JSON.stringify(nextState, null, 2);
            }
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

        // Get final orchestration state to include in response
        const finalOrchState = orchestrator.getState();

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
            agentResponse: {
                ...agentResponse,
                orchestrationState: finalOrchState
            },
            shouldModifyFiles,
            orchestrationState: finalOrchState
        });

    } catch (error: any) {
        console.error("API Agent Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// getChatResponse removed: Now we always use AIEngine for high-fidelity responses
