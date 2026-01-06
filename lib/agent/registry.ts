/**
 * HashCoder IDE - Agent Registry
 * 
 * Manages specialized agents and their capabilities
 */

export interface AgentDescriptor {
    id: string;
    name: string;
    role: string;
    description: string;
    systemPrompt: string;
    capabilities: string[];
}

export const AGENT_REGISTRY: Record<string, AgentDescriptor> = {
    'heft-architect': {
        id: 'heft-architect',
        name: 'SaaS Architect',
        role: 'Architect',
        description: 'Expert in scaffolding full SaaS applications with Stripe, Auth, and DB.',
        systemPrompt: `You are the SaaS Architect. Your goal is to design the high-level structure of a SaaS application.
Focus on:
- Folder structure
- Core dependencies
- Database schema
- Integration points (Stripe, Auth)`,
        capabilities: ['scaffold', 'database', 'stripe']
    },
    'ui-specialist': {
        id: 'ui-specialist',
        name: 'UI/UX Specialist',
        role: 'Engineer',
        description: 'Expert in building beautiful, responsive, and animated user interfaces.',
        systemPrompt: `You are the UI/UX Specialist. Your goal is to build visually stunning components.
Use:
- Tailwind CSS
- Framer Motion
- HeftCoder Orange (#ff6b35)
Focus on aesthetics and premium feel.`,
        capabilities: ['ui', 'animation', 'responsive']
    },
    'backend-expert': {
        id: 'backend-expert',
        name: 'Backend Expert',
        role: 'Engineer',
        description: 'Expert in Node.js, API design, and server-side logic.',
        systemPrompt: `You are the Backend Expert. Your goal is to build robust and secure APIs.
Focus on:
- API routes
- Middleware
- Security
- Serverless functions`,
        capabilities: ['api', 'security', 'serverless']
    }
};

export class AgentManager {
    /**
     * Get agent by ID
     */
    static getAgent(id: string): AgentDescriptor | undefined {
        return AGENT_REGISTRY[id];
    }

    /**
     * Determine best agent for a task
     */
    static selectAgent(taskDescription: string): AgentDescriptor {
        const desc = taskDescription.toLowerCase();

        if (desc.includes('saas') || desc.includes('scaffold') || desc.includes('stripe')) {
            return AGENT_REGISTRY['heft-architect'];
        }

        if (desc.includes('ui') || desc.includes('design') || desc.includes('animation') || desc.includes('look')) {
            return AGENT_REGISTRY['ui-specialist'];
        }

        if (desc.includes('api') || desc.includes('backend') || desc.includes('server') || desc.includes('database')) {
            return AGENT_REGISTRY['backend-expert'];
        }

        // Default to architect for broad requests
        return AGENT_REGISTRY['heft-architect'];
    }
}
