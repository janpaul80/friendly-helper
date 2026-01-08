/**
 * HashCoder IDE - Conversational Agent System
 *
 * Makes the agent chat and plan before coding, like Claude/Cursor
 */

import { UserIntent, IntentClassifier } from './intent';
import { WorkspaceState } from '@/types/workspace';

export interface AgentMode {
    type: 'discussion' | 'planning' | 'building';
    canGenerateCode: boolean;
}

export class ConversationalAgent {
    /**
     * Detect user intent using the new classifier
     */
    static detectIntent(userMessage: string): UserIntent {
        return IntentClassifier.classify(userMessage);
    }

    /**
     * Convert intent to agent mode
     */
    static intentToMode(intent: UserIntent, workspaceState: WorkspaceState): AgentMode {
        switch (intent) {
            case UserIntent.GREETING:
                return { type: 'discussion', canGenerateCode: false };

            case UserIntent.QUESTION:
                return { type: 'discussion', canGenerateCode: false };

            case UserIntent.PLAN_REQUEST:
                return { type: 'planning', canGenerateCode: false };

            case UserIntent.CODE_REQUEST:
                // Only allow code generation if plan is approved
                return {
                    type: 'building',
                    canGenerateCode: workspaceState.planStatus === 'approved'
                };

            case UserIntent.APPROVAL:
                // Approval should trigger code generation if there's a plan
                return {
                    type: 'building',
                    canGenerateCode: workspaceState.currentPlan !== null
                };

            case UserIntent.EDIT_PLAN:
                return { type: 'planning', canGenerateCode: false };

            default:
                return { type: 'discussion', canGenerateCode: false };
        }
    }

    /**
     * Generate system prompt based on mode
     */
    static getSystemPrompt(mode: AgentMode, context?: any): string {
        const historyContext = Array.isArray(context)
            ? `You are in a continuous session. There are ${context.length} previous messages in this conversation.`
            : context ? `Previous context: ${context}` : '';

        // TIER 3: BUILDING (Strict Execution)
        if (mode.type === 'building' && mode.canGenerateCode) {
            return `You are HeftCoder, an expert full-stack developer.
You are currently implementing an approved plan.

CRITICAL INSTRUCTION:
- You are a JSON-only API.
- DO NOT use any tools.
- DO NOT use Python code execution.
- DO NOT return markdown code blocks.
- Return ONLY a raw JSON object string.

OUTPUT FORMAT:
{
  "file.tsx": "code here",
  "package.json": "{ ... }"
}

REQUIREMENTS:
- Use modern React, Next.js, TypeScript
- Include all necessary files (pages, components, styles, config)
- Add package.json with all dependencies
- Production-quality code with proper error handling
- Beautiful, responsive UI with HeftCoder orange (#ff6b35) accents
- Tailwind CSS for styling

NO markdown, NO explanations, ONLY the JSON object.

${historyContext}`;
        }

        // TIER 2: PLANNING (Structured)
        if (mode.type === 'planning') {
            return `You are Vibe Engine (HeftCoder), an expert AI Architect.
            
You are in PLANNING MODE. The user wants to build or modify something.
Your goal is to create a clear, technical implementation plan.

PROCESS:
1.  **Analyze**: Understand the technical requirements.
2.  **Plan**: Propose a step-by-step implementation plan.
3.  **Wait**: Explicitly ask for approval before writing code.

RESPONSE FORMAT (Strict Markdown):

## Stage 1: Understanding the Task
[Brief summary of what will be built]

## Stage 2: Architecture & Design
**Theme**: [Visual style/theme]
**Components**:
- [List of key components]

## Stage 3: Implementation Steps
1. [Step 1]
2. [Step 2]
...

**Status**: 🔵 AWAITING APPROVAL
[Explicitly ask: "Shall I proceed with this plan?"] -- Do not use this exact string, be conversational.

${historyContext}`;
        }

        // TIER 1: DISCUSSION (Conversational - Default)
        return `You are Vibe Engine (HeftCoder), a friendly and intelligent AI coding assistant.

ROLE:
- You are helpful, calm, and concise.
- You answer questions, explain concepts, and chat about code.
- You DO NOT assume the user wants to build code immediately unless they ask.
- If the user says "hi" or "hello", reply with a short, friendly greeting (e.g., "Hey 👋 What would you like to build or change today?").

BEHAVIOR:
- Concise responses.
- No planning artifacts.
- No "Stage 1/2/3" headers.
- Just helpful conversation.

${historyContext}`;
    }

    /**
     * Create a conversational response with plan structure
     */
    static formatPlanningResponse(
        idea: string,
        features: string[],
        components: string[],
        stack: string[]
    ): string {
        return `# Planning your project

**Idea:** ${idea}

## Plan:

### 1. Key Features:
${features.map(f => `- ${f}`).join('\n')}

### 2. Technical Stack:
${stack.map(s => `- ${s}`).join('\n')}

### 3. Components:
${components.map(c => `- ${c}`).join('\n')}

---

**Let me build this:**

When you're ready, just say "build this" and I'll create the complete application step by step!

What would you like to change or add?`;
    }
}
