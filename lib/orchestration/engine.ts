/**
 * HeftCoder Orchestration Engine
 * 
 * Manages the workflow between 6 specialized agents with:
 * - Agent-to-agent handoffs via tool invocation
 * - State machine for tracking progress
 * - Auto-execution when user approves plans
 * - Live status updates (Planning → Building → Integrating → QA → Deploying)
 */

export type AgentPhase =
    | 'idle'
    | 'planning'          // Agent 1: Architect creating plan
    | 'awaiting_approval' // Waiting for user to say "approved"
    | 'building_backend'  // Agent 2: Backend Engineer
    | 'building_frontend' // Agent 3: Frontend Engineer
    | 'integrating'       // Agent 4: Integrator
    | 'qa_testing'        // Agent 5: QA & Hardening
    | 'deploying'         // Agent 6: DevOps
    | 'complete'
    | 'error';

export type AgentID =
    | 'agent-architect'
    | 'agent-backend'
    | 'agent-frontend'
    | 'agent-integrator'
    | 'agent-qa'
    | 'agent-devops';

export interface OrchestrationState {
    phase: AgentPhase;
    currentAgent: AgentID | null;
    plan: ProjectPlan | null;
    progress: number; // 0-100
    executionLog: ExecutionLogEntry[];
    error?: string;
}

export interface ProjectPlan {
    stack: {
        frontend: string;
        backend: string;
        database: string;
        auth: string;
    };
    repoStructure: Record<string, string>; // path -> description
    steps: ExecutionStep[];
}

export interface ExecutionStep {
    stepNumber: number;
    agent: AgentID;
    task: string;
    dependencies?: string[]; // File/service dependencies
    status: 'pending' | 'running' | 'complete' | 'failed';
}

export interface ExecutionLogEntry {
    timestamp: Date;
    agent: AgentID;
    phase: AgentPhase;
    message: string;
    filesModified?: string[];
}

/**
 * Tool definitions for agent handoffs
 * These allow agents to call functions instead of dumping text
 */
export const HANDOFF_TOOLS = {
    handoff_to_backend: {
        name: 'handoff_to_backend',
        description: 'Call this when the plan is approved and you need to delegate backend work to Agent 2',
        parameters: {
            type: 'object',
            properties: {
                plan_json: {
                    type: 'object',
                    description: 'The structured plan to execute'
                }
            },
            required: ['plan_json']
        }
    },
    handoff_to_frontend: {
        name: 'handoff_to_frontend',
        description: 'Call this when backend is complete and you need to delegate UI work to Agent 3',
        parameters: {
            type: 'object',
            properties: {
                backend_artifacts: {
                    type: 'object',
                    description: 'API endpoints, schemas, auth config created by backend'
                }
            },
            required: ['backend_artifacts']
        }
    },
    handoff_to_integrator: {
        name: 'handoff_to_integrator',
        description: 'Call this when frontend is complete and you need Agent 4 to verify connections',
        parameters: {
            type: 'object',
            properties: {
                frontend_artifacts: {
                    type: 'object',
                    description: 'Components and pages created by frontend'
                }
            },
            required: ['frontend_artifacts']
        }
    },
    handoff_to_qa: {
        name: 'handoff_to_qa',
        description: 'Call this when integration is complete and you need Agent 5 to test/harden',
        parameters: {
            type: 'object',
            properties: {
                integration_status: {
                    type: 'string',
                    description: 'Summary of integration verification'
                }
            },
            required: ['integration_status']
        }
    },
    handoff_to_devops: {
        name: 'handoff_to_devops',
        description: 'Call this when QA is complete and you need Agent 6 to deploy',
        parameters: {
            type: 'object',
            properties: {
                qa_report: {
                    type: 'string',
                    description: 'Summary of QA findings and fixes'
                }
            },
            required: ['qa_report']
        }
    },
    mark_complete: {
        name: 'mark_complete',
        description: 'Call this when deployment is successful and the project is live',
        parameters: {
            type: 'object',
            properties: {
                deployment_url: {
                    type: 'string',
                    description: 'The live URL where the project is deployed'
                }
            },
            required: ['deployment_url']
        }
    }
};

/**
 * Orchestration Engine Class
 */
export class OrchestrationEngine {
    private state: OrchestrationState;

    constructor() {
        this.state = {
            phase: 'idle',
            currentAgent: null,
            plan: null,
            progress: 0,
            executionLog: []
        };
    }

    /**
     * Get current state
     */
    getState(): OrchestrationState {
        return { ...this.state };
    }

    /**
     * Start orchestration with user's request
     */
    async startOrchestration(userRequest: string): Promise<void> {
        this.state.phase = 'planning';
        this.state.currentAgent = 'agent-architect';
        this.state.progress = 5;

        this.logActivity('agent-architect', 'planning', 'Starting project planning...');
    }

    /**
     * Handle user approval of plan
     * This is the CRITICAL function that triggers auto-execution
     */
    async approvePlan(plan: ProjectPlan): Promise<void> {
        if (this.state.phase !== 'awaiting_approval') {
            throw new Error('No plan is awaiting approval');
        }

        this.state.plan = plan;
        this.state.phase = 'building_backend';
        this.state.currentAgent = 'agent-backend';
        this.state.progress = 20;

        this.logActivity('agent-backend', 'building_backend', 'Plan approved. Starting backend scaffolding...');

        // Trigger backend agent execution
        await this.executeAgent('agent-backend');
    }

    /**
     * Handle tool invocation from agents
     */
    async handleToolCall(toolName: string, parameters: any): Promise<void> {
        console.log(`[Orchestration] Tool called: ${toolName}`, parameters);

        switch (toolName) {
            case 'handoff_to_backend':
                await this.transitionTo('building_backend', 'agent-backend', parameters.plan_json);
                break;

            case 'handoff_to_frontend':
                await this.transitionTo('building_frontend', 'agent-frontend', parameters.backend_artifacts);
                break;

            case 'handoff_to_integrator':
                await this.transitionTo('integrating', 'agent-integrator', parameters.frontend_artifacts);
                break;

            case 'handoff_to_qa':
                await this.transitionTo('qa_testing', 'agent-qa', parameters.integration_status);
                break;

            case 'handoff_to_devops':
                await this.transitionTo('deploying', 'agent-devops', parameters.qa_report);
                break;

            case 'mark_complete':
                this.state.phase = 'complete';
                this.state.progress = 100;
                this.logActivity('agent-devops', 'complete', `Project deployed to: ${parameters.deployment_url}`);
                break;

            default:
                console.warn(`Unknown tool: ${toolName}`);
        }
    }

    /**
     * Transition to next phase and trigger agent
     */
    private async transitionTo(phase: AgentPhase, agent: AgentID, context: any): Promise<void> {
        this.state.phase = phase;
        this.state.currentAgent = agent;
        this.state.progress = this.calculateProgress(phase);

        const message = this.getPhaseMessage(phase);
        this.logActivity(agent, phase, message);

        // Auto-execute the next agent
        await this.executeAgent(agent, context);
    }

    /**
     * Execute an agent with context
     */
    private async executeAgent(agentId: AgentID, context?: any): Promise<void> {
        console.log(`[Orchestration] Executing agent: ${agentId}`);

        // This would call the AI engine with the agent's specialized prompt
        // and pass the context from the previous agent

        // For now, this is a placeholder that would integrate with your AI engine
        // In production, this would:
        // 1. Call AIEngine.generate() with the agent's model ID
        // 2. Pass the context from the previous agent
        // 3. Include the handoff tools in the function definitions
        // 4. Monitor for tool calls and handle them
    }

    /**
     * Calculate progress based on phase
     */
    private calculateProgress(phase: AgentPhase): number {
        const progressMap: Record<AgentPhase, number> = {
            'idle': 0,
            'planning': 10,
            'awaiting_approval': 15,
            'building_backend': 30,
            'building_frontend': 50,
            'integrating': 70,
            'qa_testing': 85,
            'deploying': 95,
            'complete': 100,
            'error': 0
        };
        return progressMap[phase] || 0;
    }

    /**
     * Get human-readable message for phase
     */
    private getPhaseMessage(phase: AgentPhase): string {
        const messages: Record<AgentPhase, string> = {
            'idle': 'Waiting for task...',
            'planning': 'Creating execution plan...',
            'awaiting_approval': 'Plan ready. Awaiting approval...',
            'building_backend': 'Scaffolding backend (API, DB, Auth)...',
            'building_frontend': 'Building UI components...',
            'integrating': 'Connecting frontend ↔ backend...',
            'qa_testing': 'Testing and hardening code...',
            'deploying': 'Deploying to production...',
            'complete': 'Project successfully deployed!',
            'error': 'Execution failed'
        };
        return messages[phase] || 'Processing...';
    }

    /**
     * Log activity
     */
    private logActivity(agent: AgentID, phase: AgentPhase, message: string, filesModified?: string[]): void {
        this.state.executionLog.push({
            timestamp: new Date(),
            agent,
            phase,
            message,
            filesModified
        });
    }

    /**
     * Handle errors
     */
    handleError(error: string): void {
        this.state.phase = 'error';
        this.state.error = error;
        this.logActivity(this.state.currentAgent || 'agent-architect', 'error', error);
    }

    /**
     * Reset orchestration
     */
    reset(): void {
        this.state = {
            phase: 'idle',
            currentAgent: null,
            plan: null,
            progress: 0,
            executionLog: []
        };
    }
}

// Singleton instance
let orchestratorInstance: OrchestrationEngine | null = null;

export function getOrchestrator(): OrchestrationEngine {
    if (!orchestratorInstance) {
        orchestratorInstance = new OrchestrationEngine();
    }
    return orchestratorInstance;
}
