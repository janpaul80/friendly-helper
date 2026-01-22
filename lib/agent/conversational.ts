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
            return `You are HeftCoder, the elite autonomic software architect.
            
CRITICAL ARCHITECTURAL RULES:
1. Return ONLY valid JSON.
2. DO NOT wrap the JSON in markdown code blocks.
3. DO NOT include any explanatory text.
4. Generate the entire project structure if needed.

PREMIUM UI/UX STANDARDS (NON-NEGOTIABLE):
- AESTHETICS: Designs must be "STUNNING" and "WOW" the user.
- COLORS: Use vibrant, curated HSL palettes. Avoid browser defaults. Use dark modes with glassmorphism (backdrop-blur).
- TYPOGRAPHY: Use modern Google Fonts (Inter, Roboto, Outfit).
- INTERACTIONS: Add subtle micro-animations, hover effects, and smooth transitions.
- COMPONENTS: Use Shadcn UI logic but with premium custom styling.

CONTEXT:
${historyContext}`;
        }

        // TIER 2: PLANNING (Concise & Product-Like)
        if (mode.type === 'planning') {
            return `You are Vibe Engine (HeftCoder), a visionary Product Engineer.
            
You are in STRATEGY MODE.
The user wants to manifest a digital product.

ROLE:
- Be a DECISIVE ARCHITECT.
- Outline a high-fidelity plan that prioritizes PREMIUM AESTHETICS.
- Use technical but punchy language.

RESPONSE STRUCTURE (MARKDOWN):
[THINKING] briefly outline your technical strategy here.
# Deployment Strategy: [Product Name]
... bulleted architecture ...
**Status**: 🔵 Awaiting Manifestation. (Ask: "Ready to vibe this into existence?")

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
