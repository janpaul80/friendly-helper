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
  'heftcoder-pro': {
    id: 'heftcoder-pro',
    name: 'HeftCoder Pro',
    role: 'Orchestrator',
    description: 'Master VibeCoding Orchestrator. Expert in rapid full-stack design.',
    langdockId: process.env.HEFTCODER_PRO_ID || 'bddc9537-f05f-47ce-ada1-c4573e2b9609',
    capabilities: ['planning', 'coding', 'orchestration']
  },
  'heftcoder-plus': {
    id: 'heftcoder-plus',
    name: 'HeftCoder Plus',
    role: 'Engineering Core',
    description: 'Robust VibeCoding Engineering Core for deep architectural tasks.',
    langdockId: process.env.HEFTCODER_PLUS_ID || '7e95b06a-37c2-4a0b-9ce4-e0e64c8d5001',
    capabilities: ['engineering', 'backend', 'high-context']
  },
  'opus-reasoning': {
    id: 'opus-reasoning',
    name: 'Opus 4.5 Reasoning',
    role: 'Visionary',
    description: 'Architectural VibeCoding Visionary. Highest level reasoning.',
    langdockId: process.env.OPUS_REASONING_ID || 'da94e1f2-cc56-4c91-8a00-c4ae1240181e',
    capabilities: ['reasoning', 'debug', 'migrations']
  },
  'claude-sonnet-4.5': {
    id: 'claude-sonnet-4.5',
    name: 'Claude Sonnet 4.5',
    role: 'UI Specialist',
    description: 'Creative VibeCoding UI Specialist. Expert in premium design.',
    langdockId: process.env.CLAUDE_SONNET_45_ID || '8a134f99-ef2b-45f6-9782-da0971ef413a',
    capabilities: ['ui', 'animation', 'tailwind']
  },
  'chatgpt-thinking': {
    id: 'chatgpt-thinking',
    name: 'ChatGPT 5.1 Thinking',
    role: 'Logic Engine',
    description: 'Logic-First VibeCoding Engine. Fast reasoning and prototyping.',
    langdockId: process.env.CHATGPT_THINKING_ID || '08bef027-2353-44b5-8733-abf93a73245f',
    capabilities: ['logic', 'api-design', 'prototyping']
  },
  'gemini-flash': {
    id: 'gemini-flash',
    name: 'Gemini 2.5 Flash',
    role: 'Swift Specialist',
    description: 'Swift VibeCoding Specialist. Fast iterations and explanations.',
    langdockId: process.env.GEMINI_FLASH_ID || '87a78a43-dc3b-4c08-8062-b6d89a253dd5',
    capabilities: ['speed', 'flash-refactor', 'iterations']
  },
  'llama-70b': {
    id: 'llama-70b',
    name: 'Llama 3.3 70B',
    role: 'Open Source Expert',
    description: 'High-performance open model, great for general coding.',
    langdockId: 'bddc9537-f05f-47ce-ada1-c4573e2b9609', // Fallback to Pro or specific ID if available
    capabilities: ['explanation', 'general-coding', 'open-source']
  },
  'heft-api-v2': {
    id: 'heft-api-v2',
    name: 'HeftCoder API v2',
    role: 'Backend Specialist',
    description: 'Specialized agent for robust API and Database design.',
    langdockId: 'bddc9537-f05f-47ce-ada1-c4573e2b9609',
    capabilities: ['api', 'database', 'security']
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
