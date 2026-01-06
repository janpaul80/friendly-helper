/**
 * HashCoder IDE - Agent Registry
 * 
 * Manages specialized agents and their capabilities, now mapped to Langdock IDs.
 */

export interface AgentDescriptor {
  id: string;
  name: string;
  role: string;
  description: string;
  langdockId?: string; // Optional: If the agent is powered by a specific Langdock agent
  systemPrompt?: string; // Internal prompt if no Langdock ID
  capabilities: string[];
}

export const AGENT_REGISTRY: Record<string, AgentDescriptor> = {
  'heft-coder-pro': {
    id: 'heft-coder-pro',
    name: 'HeftCoder Pro',
    role: 'Orchestrator',
    description: 'The main conversational agent for planning and general coding.',
    langdockId: '62a310c1-449e-4301-b406-c66885263600', 
    capabilities: ['planning', 'coding', 'orchestration']
  },
  'heft-api-v2': {
    id: 'heft-api-v2',
    name: 'HeftCoder API v2',
    role: 'Backend Specialist',
    description: 'Specialized agent for robust API and Database design.',
    langdockId: 'bddc9537-f05f-47ce-ada1-c4573e2b9609',
    capabilities: ['api', 'database', 'security']
  },
  'ui-specialist': {
    id: 'ui-specialist',
    name: 'UI/UX Specialist',
    role: 'Frontend Engineer',
    description: 'Expert in building beautiful, responsive, and animated user interfaces.',
    // We can stick to a prompt-based agent for UI if no specific Langdock ID exists, 
    // or map it to Pro with a specific prompt override.
    systemPrompt: `You are the UI/UX Specialist. Your goal is to build visually stunning components.
Use:
- Tailwind CSS
- Framer Motion
- HeftCoder Orange (#ff6b35)
Focus on aesthetics and premium feel.`,
    capabilities: ['ui', 'animation', 'responsive']
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
    
    if (desc.includes('api') || desc.includes('backend') || desc.includes('database') || desc.includes('sql')) {
      return AGENT_REGISTRY['heft-api-v2'];
    }
    
    if (desc.includes('ui') || desc.includes('design') || desc.includes('css') || desc.includes('animation')) {
      return AGENT_REGISTRY['ui-specialist'];
    }

    // Default to the Pro Orchestrator
    return AGENT_REGISTRY['heft-coder-pro'];
  }
}
