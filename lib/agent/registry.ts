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
    langdockId: 'bddc9537-f05f-47ce-ada1-c4573e2b9609',
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
  },
  'heft-coder-thinking': {
    id: 'heft-coder-thinking',
    name: 'ChatGPT 5 (Thinking Fast)',
    role: 'Deep Thinker',
    description: 'Advanced reasoning model for complex architectural planning and tough bugs.',
    // User needs to provide this specific ID found in Langdock
    langdockId: 'bddc9537-f05f-47ce-ada1-c4573e2b9609',
    capabilities: ['reasoning', 'planning', 'complex-logic']
  },
  'gemini-flash': {
    id: 'gemini-flash',
    name: 'Gemini 2.5 Flash',
    role: 'Speed Coder',
    description: 'Ultra-fast model for quick iterations, refactoring, and simple tasks.',
    langdockId: 'bddc9537-f05f-47ce-ada1-c4573e2b9609',
    capabilities: ['speed', 'refactoring', 'quick-fixes']
  },
  'llama-70b': {
    id: 'llama-70b',
    name: 'Llama 3.3 70B',
    role: 'Open Source Expert',
    description: 'High-performance open model, great for general coding and explanation.',
    langdockId: 'bddc9537-f05f-47ce-ada1-c4573e2b9609',
    capabilities: ['explanation', 'general-coding', 'open-source']
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
