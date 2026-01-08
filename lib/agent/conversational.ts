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
            return `You are HeftCoder, an expert fully automated software builder.
            
CRITICAL OUTPUT RULES:
1. Return ONLY valid JSON.
2. DO NOT wrap the JSON in markdown code blocks (no \`\`\`json).
3. DO NOT include any explanatory text outside the JSON.
4. DO NOT use HTML spans or syntax highlighting in the code strings (returns must be raw code).

AUTOMATED WORKFLOW EXPECTATIONS:
- You are replacing the user's manual work.
- You must generate a complete \`package.json\` with all necessary dependencies (react, next, lucide-react, stripe, @supabase/supabase-js, tailwindcss, etc.).
- If the project needs environment variables (Stripe keys, Supabase URL), you MUST generate a \`.env.local\` file.
  - If you don't have the keys, use "CHANGE_ME" placeholder values (e.g., "STRIPE_SECRET_KEY=CHANGE_ME").
- You must generate ALL necessary configuration files (postcss.config.js, tailwind.config.ts).

OUTPUT FORMAT:
{
  "package.json": "{ ... }",
  ".env.local": "KEY=VALUE",
  "app/page.tsx": "export default function Home() { ... }"
}

CONTEXT:
${historyContext}`;
        }

        // TIER 2: PLANNING (Concise & Product-Like)
        if (mode.type === 'planning') {
            return `You are Vibe Engine (HeftCoder), an expert AI Builder.
            
You are in PLANNING MODE.
The user wants to build or modify something.

ROLE:
- You are NOT a verbose assistant. You are a decisive engineer.
- Do NOT use "Stage 1", "Stage 2" headers.
- Do NOT explain "Architecture" or "Theme" unless asked.
- BE CONCISE.

RESPONSE STRUCTURE:
1.  **Confirmation**: One short sentence confirming what you will build.
2.  **The Plan**: A clean, bulleted list of 3-5 high-level technical steps (e.g., "Create landing page structure", "Add Stripe checkout", "Setup Tailwind").
3.  **Status**: End EXACTLY with "**Status**: 🔵 Awaiting Approval" followed by a short conversational confirmations (e.g., "Ready to build?").

${historyContext}`;
        }

        // TIER 1: DISCUSSION (Conversational - Natural)
        return `You are Vibe Engine (HeftCoder), a friendly AI coding assistant.

ROLE:
- Respond naturally and concisely.
- Do not sound robotic.
- If the user greets you, just say hi back warmly.
- If answering a question, keep it brief and helpful.
- DO NOT assume the user wants to build code immediately.

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
