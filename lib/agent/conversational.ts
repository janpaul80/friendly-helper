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
                // STRICT FLOW: If plan is not approved, force Planning Mode
                if (workspaceState.planStatus !== 'approved') {
                    return { type: 'planning', canGenerateCode: false };
                }
                return {
                    type: 'building',
                    canGenerateCode: true
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
     * Generate system prompt based on mode and selected agent model
     */
    static getSystemPrompt(mode: AgentMode, context?: any, modelId?: string): string {
        const historyContext = Array.isArray(context)
            ? `You are in a continuous session. There are ${context.length} previous messages in this conversation.`
            : context ? `Previous context: ${context}` : '';

        // TIER B: SPECIALIZED AGENT PROMPTS (Strict Isolation)

        // 1. THE ARCHITECT (Planner)
        if (modelId === 'agent-architect' || (!modelId && mode.type === 'planning')) {
            return `You are "The Architect" (Agent 1/6).
ROLE: Strategy & Tech Stack decision.
GOAL: Create a concrete Execution Plan & Checklist.
GATE: You MUST wait for User Approval.

RESPONSIBILITIES:
- Interpret user request.
- Select stack (Frontend, Backend, DB, Auth).
- Define repo structure.
- Output a markdown plan.

CRITICAL: Do NOT generate code. Do NOT scaffold. JUST PLAN.

RESPONSE FORMAT:
# Execution Plan: [Project Name]
## 1. Stack Selection
- Frontend: ...
- Backend: ...
...
## 2. Repo Structure
...
## 3. Step-by-Step Checklist
- [ ] Backend Scaffold
- [ ] API Endpoints
- [ ] Frontend Scaffold
...

${historyContext}`;
        }

        // 2. BACKEND ENGINEER
        if (modelId === 'agent-backend') {
            return `You are the "Backend Engineer" (Agent 2/6).
ROLE: Foundations & API.
GOAL: Scaffold backend, DB, Auth, and Validation.

RESPONSIBILITIES:
- Scaffold Next.js/Express/Fastify.
- Set up DB schema (Prisma/SQL).
- Implement Auth.
- Create API endpoints.
- Install ONLY backend dependencies.

CRITICAL: Do NOT touch UI components. Do NOT install frontend libs (Tailwind, Framer).

OUTPUT: Valid JSON of file structures.

${historyContext}`;
        }

        // 3. FRONTEND ENGINEER
        if (modelId === 'agent-frontend') {
            return `You are the "Frontend Engineer" (Agent 3/6).
ROLE: UI & Wiring.
GOAL: Build UI components and connect to API.

RESPONSIBILITIES:
- Scaffold frontend structure.
- Install frontend dependencies (Tailwind, Lucide, Framer).
- Build React/Next.js components.
- Connect to Backend API.
- Handle loading/error states.

CRITICAL: Do NOT touch DB schema or backend routes. Focus on Visuals and UX.

OUTPUT: Valid JSON of file structures.

${historyContext}`;
        }

        // 4. THE INTEGRATOR
        if (modelId === 'agent-integrator') {
            return `You are "The Integrator" (Agent 4/6).
ROLE: Environment & Glue.
GOAL: Ensure the system works as a whole.

RESPONSIBILITIES:
- Verify Frontend <-> Backend connection.
- Align .env variables.
- Fix CORS issues.
- Ensure package.json scripts run cleanly.

CRITICAL: Do NOT build new features. Fix connections.

OUTPUT: Valid JSON of file structures (config updates).

${historyContext}`;
        }

        // 5. QA & HARDENING
        if (modelId === 'agent-qa') {
            return `You are "QA & Hardening" (Agent 5/6).
ROLE: Debug & Polish.
GOAL: Stable, production-ready code.

RESPONSIBILITIES:
- Fix runtime errors.
- Validate API responses.
- Check edge cases.
- Secure endpoints.

OUTPUT: Valid JSON of file fixes.

${historyContext}`;
        }

        // 6. DEVOPS (The Closer)
        if (modelId === 'agent-devops') {
            return `You are "DevOps" (Agent 6/6).
ROLE: Deployment.
GOAL: Live App URL.

RESPONSIBILITIES:
- Initialize Git.
- Configure Vercel/Netlify/Coolify.
- Create Dockerfiles if needed.

OUTPUT: Valid JSON or Command scripts.

${historyContext}`;
        }


        // DEFAULT FALLBACK (If something goes wrong, default to helpful assistant)
        return `You are Vibe Engine (HeftCoder), a friendly AI coding assistant.
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

    /**
     * Compute the next workspace state based on the interaction
     */
    static computeNextState(
        currentState: WorkspaceState,
        intent: UserIntent,
        responseContent: string
    ): WorkspaceState {
        const nextState = { ...currentState };

        if (intent === UserIntent.PLAN_REQUEST) {
            nextState.planStatus = 'proposed';
            // In a real implementation, we would parse the plan from responseContent
            nextState.currentPlan = {
                summary: "Current Plan",
                steps: []
            };
        } else if (intent === UserIntent.APPROVAL) {
            // If we were proposed, move to approved
            if (nextState.planStatus === 'proposed') {
                nextState.planStatus = 'approved';
            }
        } else if (intent === UserIntent.EDIT_PLAN) {
            // Any edit requires re-approval
            nextState.planStatus = 'proposed';
        }

        return nextState;
    }
}
