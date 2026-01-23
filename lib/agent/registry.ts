/**
 * HashCoder IDE - Agent Registry
 * 
 * Manages the 6 specialized agents for the automated orchestration pipeline.
 */

export interface AgentDescriptor {
  id: string;
  name: string;
  role: string;
  description: string;
  langdockId?: string;
  capabilities: string[];
}

export const AGENT_REGISTRY: Record<string, AgentDescriptor> = {
  'agent-architect': {
    id: 'agent-architect',
    name: 'The Architect',
    role: 'Planner',
    description: 'Strategy & Tech Stack decision. Defines the repo structure and creates the execution plan.',
    langdockId: process.env.AGENT_ARCHITECT_ID || 'architect-uuid-placeholder',
    capabilities: ['planning', 'strategy', 'repo-structure']
  },
  'agent-backend': {
    id: 'agent-backend',
    name: 'Backend Engineer',
    role: 'Foundations & API',
    description: 'Scaffolds backend, sets up DB schema, Auth, and Validation. Installs backend dependencies.',
    langdockId: process.env.AGENT_BACKEND_ID || 'backend-uuid-placeholder',
    capabilities: ['api', 'database', 'auth', 'backend-scaffold']
  },
  'agent-frontend': {
    id: 'agent-frontend',
    name: 'Frontend Engineer',
    role: 'UI & Wiring',
    description: 'Scaffolds frontend, builds UI components, connects to API, handles loading/error states.',
    langdockId: process.env.AGENT_FRONTEND_ID || 'frontend-uuid-placeholder',
    capabilities: ['ui', 'components', 'wiring', 'frontend-scaffold']
  },
  'agent-integrator': {
    id: 'agent-integrator',
    name: 'The Integrator',
    role: 'Environment & Glue',
    description: 'Verifies Frontend <-> Backend connection. Aligns Env variables and CORS. Ensures clean scripts.',
    langdockId: process.env.AGENT_INTEGRATOR_ID || 'integrator-uuid-placeholder',
    capabilities: ['integration', 'env-vars', 'cors', 'scripts']
  },
  'agent-qa': {
    id: 'agent-qa',
    name: 'QA & Hardening',
    role: 'Debug & Polish',
    description: 'Fixes runtime errors, validates API responses, checks edge cases and security basics.',
    langdockId: process.env.AGENT_QA_ID || 'qa-uuid-placeholder',
    capabilities: ['debug', 'testing', 'security', 'polish']
  },
  'agent-devops': {
    id: 'agent-devops',
    name: 'DevOps',
    role: 'Deployment',
    description: 'Initializes Git, configures build settings, deploys to live URL.',
    langdockId: process.env.AGENT_DEVOPS_ID || 'devops-uuid-placeholder',
    capabilities: ['git', 'deployment', 'ci-cd']
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
   * Determine best agent for a task (Fallback for manual mode if needed)
   */
  static selectAgent(taskDescription: string): AgentDescriptor {
    const desc = taskDescription.toLowerCase();

    if (desc.includes('deploy') || desc.includes('git')) return AGENT_REGISTRY['agent-devops'];
    if (desc.includes('debug') || desc.includes('fix') || desc.includes('error')) return AGENT_REGISTRY['agent-qa'];
    if (desc.includes('connect') || desc.includes('cors') || desc.includes('env')) return AGENT_REGISTRY['agent-integrator'];
    if (desc.includes('ui') || desc.includes('css') || desc.includes('component')) return AGENT_REGISTRY['agent-frontend'];
    if (desc.includes('api') || desc.includes('schema') || desc.includes('database')) return AGENT_REGISTRY['agent-backend'];

    // Default to Architect for planning/unknown
    return AGENT_REGISTRY['agent-architect'];
  }
}
