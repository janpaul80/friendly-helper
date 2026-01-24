import { AzureOpenAI } from "openai";
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import { AGENT_REGISTRY } from "@/lib/agent/registry";

const CONFIG = {
    AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/+$/, "")!,
    AZURE_OPENAI_KEY: process.env.AZURE_OPENAI_KEY || process.env.AZURE_OPENAI_API_KEY!,
    AZURE_MAAS_ENDPOINT: (process.env.AZURE_MAAS_ENDPOINT || process.env.AZURE_OPENAI_ENDPOINT)?.replace(/\/+$/, "")!,
    AZURE_MAAS_KEY: process.env.AZURE_MAAS_KEY || process.env.AZURE_OPENAI_KEY || process.env.AZURE_OPENAI_API_KEY!,
    AZURE_OPENAI_API_VERSION: process.env.AZURE_OPENAI_API_VERSION || "2024-02-15-preview",
    LANGDOCK_API_KEY: process.env.LANGDOCK_API_KEY || process.env.NEXT_PUBLIC_LANGDOCK_API_KEY!,
    LANGDOCK_ASSISTANT_ID: process.env.LANGDOCK_ASSISTANT_ID || process.env.NEXT_PUBLIC_LANGDOCK_ASSISTANT_ID!,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || process.env.MISTRAL_MEDIUM_LATEST_API_KEY!,
    MISTRAL_AGENT_ID: process.env.MISTRAL_AGENT_ID || "ag_019b7df2cec2719aa68ad67ae2bd6927"
};

// --- RUNTIME BOOT LOGGING ---
console.log("[AIEngine] Runtime Config Validation (Static Check):");
console.log(`[AIEngine] LANGDOCK_API_KEY: ${process.env.LANGDOCK_API_KEY ? `PRESENT (Sfx: ...${process.env.LANGDOCK_API_KEY.slice(-7)})` : "MISSING"}`);
console.log(`[AIEngine] LANGDOCK_ASSISTANT_ID: ${process.env.LANGDOCK_ASSISTANT_ID ? "PRESENT (READY)" : "MISSING (ACTION REQUIRED)"}`);
console.log(`[AIEngine] MISTRAL_API_KEY: ${process.env.MISTRAL_API_KEY || process.env.MISTRAL_MEDIUM_API_KEY ? "PRESENT (READY)" : "MISSING (ACTION REQUIRED)"}`);
console.log(`[AIEngine] MISTRAL_AGENT_ID: ${process.env.MISTRAL_AGENT_ID ? "PRESENT (CUSTOM)" : "NOT SET (USING DEFAULT: mistral-medium-latest)"}`);

export type ModelID =
    | "heftcoder-pro"
    | "heftcoder-plus"
    | "opus-reasoning"
    | "claude-sonnet-4.5"
    | "chatgpt-thinking"
    | "gemini-flash"
    | "ui-architect"
    | "debugger-pro"
    | "mistral-large"
    | "mistral-medium"
    | "llama-70b"
    | "agent-architect"
    | "agent-backend"
    | "agent-frontend"
    | "agent-integrator"
    | "agent-qa"
    | "agent-devops";

interface AIResponse {
    content: string;
    usage?: { inputTokenCount: number; outputTokenCount: number };
    failover?: boolean;
    provider: "langdock" | "mistral" | "openai" | "azure";
    agent: string;
}

export class AIEngine {

    private static getAzureClient(deployment: string) {
        return new AzureOpenAI({
            endpoint: CONFIG.AZURE_OPENAI_ENDPOINT,
            apiKey: CONFIG.AZURE_OPENAI_KEY,
            apiVersion: CONFIG.AZURE_OPENAI_API_VERSION,
            deployment: deployment,
        });
    }

    private static async runGPT5(prompt: string, context: string): Promise<AIResponse> {
        const client = this.getAzureClient(process.env.AZURE_DEPLOYMENT_HEFTCODER_ORCHESTRATOR || process.env.AZURE_DEPLOYMENT_GPT51 || "heftcoder-orchestrator");

        const response = await client.chat.completions.create({
            messages: [
                { role: "system", content: "You are HeftCoder, an expert full-stack builder. Return ONLY valid JSON representing file changes." },
                { role: "system", content: `Context: ${context}` },
                { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            model: "", // AOAI handles this via deployment in path
        });

        return {
            content: response.choices[0].message.content || "{}",
            usage: response.usage ? {
                inputTokenCount: response.usage.prompt_tokens,
                outputTokenCount: response.usage.completion_tokens
            } : undefined,
            provider: "azure",
            agent: "gpt-5.chat"
        };
    }

    private static async runMaaS(modelId: string, prompt: string, context: string): Promise<AIResponse> {
        const deploymentMap: Record<string, string> = {
            "grok-4": process.env.AZURE_DEPLOYMENT_GROK || "grok-4-fast-reasoning",
            "deepseek-v3.1": process.env.AZURE_DEPLOYMENT_DEEPSEEK || "DeepSeek-V3.2",
            "mistral-medium": process.env.AZURE_DEPLOYMENT_MISTRAL_MEDIUM || "Mistral-Large-3", // Fallback to Large if Medium not deployed
            "mistral-large": process.env.AZURE_DEPLOYMENT_MISTRAL_LARGE || "Mistral-Large-3",
            "codestral": process.env.AZURE_DEPLOYMENT_CODESTRAL || process.env.AZURE_DEPLOYMENT_MISTRAL || "Codestral-2501",
            "llama-4": process.env.AZURE_DEPLOYMENT_LLAMA_MAVERICK || process.env.AZURE_DEPLOYMENT_LLAMA || "Llama-4-Maverick-17B-128E-Instruct-FP8",
            "kimi-k2": process.env.AZURE_DEPLOYMENT_KIMI || process.env.AZURE_DEPLOYMENT_GPT51 || "Kimi-K2-Thinking"
        };

        const deploymentName = deploymentMap[modelId];
        const client = this.getAzureClient(deploymentName);

        try {
            const response = await client.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a coding assistant. Return valid JSON only. If you are a reasoning model, finish your internal thinking before outputting the final JSON." },
                    { role: "user", content: `Context: ${context} \n\n Task: ${prompt}` }
                ],
                temperature: (modelId === "grok-4" || modelId === "llama-4" || modelId === "kimi-k2") ? 0.3 : 0.1,
                max_tokens: 4096,
                model: "", // AOAI handles this via deployment in path
            });

            let raw = response.choices[0].message.content || "";
            // Reasoning models cleanup
            raw = raw.replace(/<thinking>[\s\S]*?<\/thinking>/g, "").trim();
            raw = raw.replace(/```json/g, "").replace(/```/g, "");

            return {
                content: raw,
                usage: response.usage ? {
                    inputTokenCount: response.usage.prompt_tokens,
                    outputTokenCount: response.usage.completion_tokens
                } : undefined,
                provider: "azure",
                agent: modelId
            };
        } catch (error: any) {
            const errorMessage = error?.response?.body
                ? JSON.stringify(error.response.body)
                : (error.message || "Unknown Azure Error");
            throw new Error(`MaaS Error [${deploymentName}]: ${errorMessage}`);
        }
    }

    private static async runFlux(prompt: string): Promise<AIResponse> {
        const deploymentName = process.env.AZURE_DEPLOYMENT_FLUX || "FLUX.2-pro";
        const client = this.getAzureClient(deploymentName);

        try {
            const response = await client.images.generate({
                prompt: prompt,
                size: "1024x1024",
                n: 1,
                model: "", // AOAI handles this via deployment in path
            });

            if (!response.data || response.data.length === 0) {
                throw new Error("Azure returned no image data");
            }

            return {
                content: JSON.stringify({ url: response.data[0].url }),
                provider: "azure",
                agent: "flux"
            };
        } catch (error: any) {
            throw new Error(`Flux Gen Failed [${deploymentName}]: ${error.message}`);
        }
    }

    private static async runSora(prompt: string): Promise<AIResponse> {
        const deploymentName = process.env.AZURE_DEPLOYMENT_SORA || "sora";
        return {
            content: JSON.stringify({ url: "#", message: `Sora video generation (Mock: using deployment ${deploymentName})` }),
            provider: "azure",
            agent: "sora"
        };
    }

    public static async runLangdock(
        prompt: string,
        context: string,
        assistantId?: string,
        history: { role: string, content: string }[] = [],
        systemPrompt?: string
    ): Promise<AIResponse> {
        const id = assistantId || CONFIG.LANGDOCK_ASSISTANT_ID;
        const key = CONFIG.LANGDOCK_API_KEY?.trim();

        if (!id || id === "HeftCoder Pro" || !key) {
            console.error(`[CRITICAL] Langdock Config Missing! assistantId: ${id}, hasKey: ${!!key}`);
            throw new Error(`Langdock Configuration Missing`);
        }

        const maskedKey = `${key.substring(0, 8)}...${key.substring(key.length - 4)}`;
        console.log(`[Langdock] Calling Assistant: ${id.substring(0, 8)}... with Key: ${maskedKey}`);

        try {
            // Build conversation history (clean, no system injection)
            const messages: any[] = [];

            // Add history (if any)
            history.forEach(m => {
                const content = m.content?.trim();
                if (!content || m.role === 'system' || m.role === 'tool') return;
                const role = m.role === 'ai' || m.role === 'assistant' ? 'assistant' : 'user';
                messages.push({ role, content });
            });

            // Add current user message (SIMPLE - just the prompt, no noise!)
            // Only include context if it's actually useful
            let userMessage = prompt;
            if (context && context.length > 10 && context !== "{}") {
                // Only mention files that exist, don't dump everything
                try {
                    const files = JSON.parse(context);
                    const fileCount = Object.keys(files).length;
                    if (fileCount > 0) {
                        userMessage += `\n\n(Current project has ${fileCount} files)`;
                    }
                } catch {
                    // If context isn't JSON, ignore it
                }
            }

            messages.push({ role: "user", content: userMessage });

            // CRITICAL: Use the simple chat endpoint, NOT custom assistants
            // This respects the agent's native instructions!
            const response = await fetch(`https://api.langdock.com/assistant/v1/chat/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${key}`
                },
                body: JSON.stringify({
                    messages,
                    stream: false
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error(`[Langdock] API Error (${response.status}):`, errText);
                throw new Error(`Langdock API Error (${response.status})`);
            }

            const data = await response.json();

            // Extract content from response
            let content = "";
            if (data.choices?.[0]?.message?.content) {
                content = data.choices[0].message.content;
            } else if (data.content) {
                content = typeof data.content === 'string' ? data.content : JSON.stringify(data.content);
            } else {
                console.warn("[Langdock] Unexpected response format:", data);
                content = JSON.stringify(data);
            }

            // Clean up any <thinking> tags (some models use these)
            content = content.replace(/<thinking>[\s\S]*?<\/thinking>/g, "").trim();

            console.log(`[Langdock] Response received (${content.length} chars)`);

            return {
                content,
                usage: data.usage,
                provider: "langdock",
                agent: id
            };
        } catch (error: any) {
            console.error("[Langdock] Error:", error.message);
            throw new Error(`Langdock Integration Failed: ${error.message}`);
        }
    }

    private static async runMistral(prompt: string, context: string, modelOverride?: string, systemPrompt?: string): Promise<AIResponse> {
        // ALWAYS use model-based chat completions (not agents API)
        const model = modelOverride || "mistral-medium-latest";
        const key = CONFIG.MISTRAL_API_KEY;
        if (!key) {
            throw new Error(`Mistral API Key Missing: Ensure 'MISTRAL_API_KEY' is set in Coolify env.`);
        }

        let attempts = 0;
        const maxAttempts = 2;
        let lastError: any = null;
        let mistralUsage: AIResponse['usage'] | undefined;

        // Define default system prompt if none provided
        const defaultSystem = `You are HeftCoder PLUS.
You MUST respond with VALID JSON ONLY.
No markdown.
No explanations.
No backticks.
If unsure, return {}.
The output MUST be a single JSON object where keys are file paths and values are file contents.`;

        while (attempts < maxAttempts) {
            attempts++;
            try {
                console.log(`[Mistral] Call attempt ${attempts}/${maxAttempts}`);
                const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${key}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            {
                                role: "system",
                                content: systemPrompt || defaultSystem
                            },
                            { role: "user", content: `Generate code files for: ${prompt}\n\nExisting context:\n${context}` }
                        ],
                        temperature: 0.2, // Lower temperature for more consistent JSON
                        max_tokens: 4096
                    }),
                });

                if (!response.ok) {
                    const err = await response.text();
                    throw new Error(`Mistral API error: ${err}`);
                }

                const data = await response.json();
                const raw = data.choices?.[0]?.message?.content ?? "";
                console.log("[Mistral] Full raw response length:", raw.length);
                console.log("[Mistral] First 500 chars:", raw.substring(0, 500));

                mistralUsage = data.usage ? {
                    inputTokenCount: data.usage.prompt_tokens,
                    outputTokenCount: data.usage.completion_tokens
                } : undefined;

                try {
                    let parsedContent = this.parseSafeJSON(raw);
                    // Unwrap nested content structure from Mistral
                    parsedContent = this.unwrapContent(parsedContent);
                    return {
                        content: JSON.stringify(parsedContent),
                        usage: mistralUsage,
                        provider: "mistral",
                        agent: "heftcoder-plus"
                    };
                } catch (err) {
                    console.warn(`[Mistral] Parse failed on attempt ${attempts}. Raw output snippet: ${raw.substring(0, 100)}...`);
                    lastError = err;
                    if (attempts >= maxAttempts) {
                        // Final fallback — do NOT 500, return raw content if parsing consistently fails
                        return {
                            content: raw, // Return raw string if parsing fails after retries
                            usage: mistralUsage,
                            provider: "mistral",
                            agent: "heftcoder-plus"
                        };
                    }
                }
            } catch (err) {
                console.error(`[Mistral] Network/API Error on attempt ${attempts}:`, err);
                lastError = err;
                if (attempts >= maxAttempts) throw err;
            }
        }
        throw lastError; // Should not be reached if maxAttempts > 0
    }

    private static parseSafeJSON(str: string): any {
        try {
            return JSON.parse(str);
        } catch (initialError: any) {
            console.error("[Parser Error] Initial JSON.parse failed:", initialError.message);
            // Attempt repair
            try {
                let repaired = str.trim()
                    .replace(/```json|```/g, "")
                    .replace(/^[^{]*({[\s\S]*})[^}]*$/, "$1");

                // Extra cleaning for thinking blocks
                repaired = repaired.replace(/<thinking>[\s\S]*?<\/thinking>/g, "").trim();

                // AGGRESSIVE REPAIR: Fix control characters & Strip HTML Spans
                repaired = repaired.replace(
                    /"([^"\\]|\\.)*"/g,
                    (match) => {
                        // 1. Strip HTML tags like <span class="..."> 
                        // Note: We only strip strictly known highlighting tags or simple spans to avoid breaking generic strings containing <>
                        // Actually, safer to strip only if it looks like class="text-..." 
                        let cleaned = match.replace(/<span\s+class="[^"]*">/g, "").replace(/<\/span>/g, "");

                        // 2. Fix control chars
                        if (/[\x00-\x1F]/.test(cleaned)) {
                            return cleaned
                                .replace(/\n/g, '\\n')
                                .replace(/\r/g, '\\r')
                                .replace(/\t/g, '\\t');
                        }
                        return cleaned;
                    }
                );

                return JSON.parse(repaired);
            } catch (e: any) {
                console.error("[Parser Error] Aggressive cleanup failed. Total length:", str.length);
                console.error("[Parser Error] Parse error:", e.message);
                console.error("[Parser Error] Last 200 chars:", str.substring(str.length - 200));
                throw new Error("AI returned invalid JSON structure. Check logs for raw output.");
            }
        }
    }

    /**
     * Unwrap nested content structure from Mistral
     * Converts: { "file.ts": { "content": "code" } }
     * To: { "file.ts": "code" }
     */
    private static unwrapContent(obj: any): any {
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }

        const unwrapped: any = {};
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'object' && value !== null && 'content' in value) {
                // Unwrap nested content
                unwrapped[key] = (value as any).content;
            } else {
                unwrapped[key] = value;
            }
        }
        return unwrapped;
    }

    public static async generate(
        model: ModelID,
        prompt: string,
        fileContext: any,
        history: any[] = [],
        systemPrompt?: string,
        tools?: any[] // NEW: Tool definitions for orchestration
    ): Promise<AIResponse & { toolCalls?: any[] }> {
        const contextStr = JSON.stringify(fileContext);
        let response: AIResponse;

        // STEP 1 - Strict Routing Logic
        switch (model) {
            case "agent-architect":
            case "agent-qa":
            case "agent-frontend": // Frontend needs high creativity (Claude/GPT-4o)
            case "heftcoder-pro":
            case "opus-reasoning":
            case "claude-sonnet-4.5":
            case "chatgpt-thinking":
            case "gemini-flash":
            case "ui-architect":
            case "debugger-pro":
            case "llama-70b":
                // 1. Determine which Agent ID to use
                let assistantId = CONFIG.LANGDOCK_ASSISTANT_ID;

                // If the model exists in registry, try to use its custom Langdock ID
                if (AGENT_REGISTRY[model]?.langdockId) {
                    assistantId = AGENT_REGISTRY[model].langdockId || CONFIG.LANGDOCK_ASSISTANT_ID;
                }

                // 2. Run Langdock
                response = await this.runLangdock(prompt, contextStr, assistantId, history, systemPrompt);
                break;

            case "agent-backend": // Backend needs consistency (Mistral Large is great for this)
            case "agent-integrator":
            case "agent-devops":
            case "heftcoder-plus":
            case "mistral-medium":
            case "mistral-large":
                // Map internal ID to Mistral ID
                const mistralModel = 'mistral-large-latest'; // Default to Large for all these robust tasks
                response = await this.runMistral(prompt, contextStr, mistralModel, systemPrompt);
                break;

            default:
                // Fallback to Pro (Langdock) if unknown
                console.warn(`[AIEngine] Unknown model '${model}', defaulting to HeftCoder Pro`);
                response = await this.runLangdock(prompt, contextStr, CONFIG.LANGDOCK_ASSISTANT_ID, history, systemPrompt);
        }

        // STEP 4 - Normalize the Response (Content Cleanup)
        if (true) {
            try {
                // Improved Hybrid Parser:
                // If it's pure JSON, it returns the files object.
                // If it's text (Conversation/Planning), it will fail JSON parsing.
                // We catch that failure and return a "Message Object" instead.

                // 1. Try to extract JSON if embedded in markdown code blocks
                let contentToParse = response.content;
                const jsonBlockRegex = /```json\s*([\s\S]*?)\s*```/;
                const match = contentToParse.match(jsonBlockRegex);
                if (match && match[1]) {
                    contentToParse = match[1];
                }

                let parsed;
                try {
                    parsed = this.parseSafeJSON(contentToParse);
                    // Unwrap nested content structure (e.g., from Mistral)
                    parsed = this.unwrapContent(parsed);
                } catch (e) {
                    // JSON Parsing Failed -> Assume it's a Conversational/Planning response
                    console.log('[AIEngine] Response is not JSON code. Treating as Conversation/Plan.');

                    // Return a special object that the frontend understands is NOT a file update
                    parsed = {
                        __isConversation: true,
                        message: response.content,
                        // If it detected a plan, we can flag it
                        isPlan: response.content.toLowerCase().includes('**plan:**')
                    };
                }

                response.content = JSON.stringify(parsed);
            } catch (e: any) {
                // This catch block should rarely be reached now since we handle non-JSON gracefully above
                throw new Error(`Output Validation Failed: ${e.message}`);
            }
        }

        // STEP 5 - Tool Call Detection (for Orchestration)
        const toolCalls = this.detectToolCalls(response.content, tools);
        if (toolCalls.length > 0) {
            console.log('[AIEngine] Detected tool calls:', toolCalls);
            return { ...response, toolCalls };
        }

        return response;
    }

    /**
     * Detect tool calls in agent response
     * Supports both explicit tool syntax and keyword-based fallback
     */
    private static detectToolCalls(content: string, tools?: any[]): any[] {
        if (!tools || tools.length === 0) return [];

        const detectedCalls: any[] = [];

        // Strategy 1: Detect explicit tool call syntax
        // Format: TOOL_CALL: function_name({"param": "value"})
        const explicitPattern = /TOOL_CALL:\s*(\w+)\((.*?)\)/g;
        let match;
        while ((match = explicitPattern.exec(content)) !== null) {
            const [, functionName, paramsJson] = match;
            try {
                const parameters = JSON.parse(paramsJson);
                detectedCalls.push({ name: functionName, parameters });
            } catch (e) {
                console.warn(`[AIEngine] Failed to parse tool params: ${paramsJson}`);
            }
        }

        // Strategy 2: Keyword-based detection for orchestration handoffs
        // This catches when agents say things like "handoff to backend" in natural language
        const handoffPatterns = [
            { pattern: /\b(handoff|delegate|pass|transfer)\s+(to\s+)?backend\b/i, tool: 'handoff_to_backend' },
            { pattern: /\b(handoff|delegate|pass|transfer)\s+(to\s+)?frontend\b/i, tool: 'handoff_to_frontend' },
            { pattern: /\b(handoff|delegate|pass|transfer)\s+(to\s+)?integrator\b/i, tool: 'handoff_to_integrator' },
            { pattern: /\b(handoff|delegate|pass|transfer)\s+(to\s+)?qa\b/i, tool: 'handoff_to_qa' },
            { pattern: /\b(handoff|delegate|pass|transfer)\s+(to\s+)?devops\b/i, tool: 'handoff_to_devops' },
            { pattern: /\b(deployment|deploy)\s+(complete|successful|done)\b/i, tool: 'mark_complete' }
        ];

        for (const { pattern, tool } of handoffPatterns) {
            if (pattern.test(content)) {
                // Extract plan JSON if this is a backend handoff
                if (tool === 'handoff_to_backend') {
                    // Try to extract structured plan from the response
                    const planMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/);
                    const plan_json = planMatch ? JSON.parse(planMatch[1]) : { raw: content };
                    detectedCalls.push({ name: tool, parameters: { plan_json } });
                } else {
                    detectedCalls.push({ name: tool, parameters: {} });
                }
                break; // Only trigger one handoff per response
            }
        }

        return detectedCalls;
    }
}
