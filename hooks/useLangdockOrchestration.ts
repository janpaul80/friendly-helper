/**
 * React Hook for Langdock Agent Orchestration
 * 
 * Connects to the orchestrate edge function for real Langdock agent execution.
 * Provides SSE streaming for real-time agent updates.
 */

import { useState, useCallback, useRef } from 'react';
import type { AgentType, OrchestrationStreamEvent } from '@/lib/langdock/client';

export interface AgentStatus {
  id: AgentType;
  name: string;
  status: 'idle' | 'working' | 'complete' | 'error';
  output: string;
  statusLabel: string;
}

export interface OrchestrationState {
  phase: string;
  currentAgent: AgentType | null;
  plan: any;
  progress: number;
  executionLog: any[];
  error: string | null;
}

const AGENT_NAMES: Record<AgentType, string> = {
  architect: 'The Architect',
  backend: 'Backend Engineer',
  frontend: 'Frontend Engineer',
  integrator: 'The Integrator',
  qa: 'QA & Hardening',
  devops: 'DevOps',
};

const initialAgentStatuses: AgentStatus[] = [
  { id: 'architect', name: 'The Architect', status: 'idle', output: '', statusLabel: 'Planning' },
  { id: 'backend', name: 'Backend Engineer', status: 'idle', output: '', statusLabel: 'Backend' },
  { id: 'frontend', name: 'Frontend Engineer', status: 'idle', output: '', statusLabel: 'Frontend' },
  { id: 'integrator', name: 'The Integrator', status: 'idle', output: '', statusLabel: 'Integration' },
  { id: 'qa', name: 'QA & Hardening', status: 'idle', output: '', statusLabel: 'Testing' },
  { id: 'devops', name: 'DevOps', status: 'idle', output: '', statusLabel: 'Deploying' },
];

export function useLangdockOrchestration() {
  const [agents, setAgents] = useState<AgentStatus[]>(initialAgentStatuses);
  const [state, setState] = useState<OrchestrationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamOutput, setStreamOutput] = useState<string>('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const ORCHESTRATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/orchestrate`;

  // Reset all agents to idle
  const resetAgents = useCallback(() => {
    setAgents(initialAgentStatuses);
    setStreamOutput('');
    setError(null);
  }, []);

  // Update a specific agent's status
  const updateAgent = useCallback((agentId: AgentType, updates: Partial<AgentStatus>) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, ...updates } : agent
    ));
  }, []);

  // Start orchestration (planning phase)
  const startOrchestration = useCallback(async (userRequest: string) => {
    setIsLoading(true);
    setError(null);
    resetAgents();

    try {
      const response = await fetch(ORCHESTRATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: 'start',
          userRequest,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setState(data.state);
        updateAgent('architect', { status: 'working', statusLabel: 'Planning...' });
        return true;
      } else {
        setError(data.error);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start orchestration';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [ORCHESTRATE_URL, resetAgents, updateAgent]);

  // Approve plan and trigger execution
  const approvePlan = useCallback(async (plan: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(ORCHESTRATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: 'approve_plan',
          plan,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setState(data.state);
        updateAgent('architect', { status: 'complete', statusLabel: 'Done' });
        return true;
      } else {
        setError(data.error);
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve plan';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [ORCHESTRATE_URL, updateAgent]);

  // Execute an agent with SSE streaming
  const executeAgent = useCallback(async (agentType: AgentType, context?: any) => {
    setIsLoading(true);
    setError(null);
    updateAgent(agentType, { status: 'working', statusLabel: 'Working...', output: '' });

    // Cancel any previous stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(ORCHESTRATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          action: 'execute_agent',
          agentType,
          context,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to execute agent');
      }

      // Process SSE stream
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let agentOutput = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') continue;

          try {
            const event: OrchestrationStreamEvent = JSON.parse(jsonStr);

            switch (event.type) {
              case 'agent_status':
                if (event.agent) {
                  updateAgent(event.agent, {
                    status: event.status === 'working' ? 'working' : 'idle',
                    statusLabel: event.message || '',
                  });
                }
                break;

              case 'agent_stream':
                if (event.chunk) {
                  agentOutput += event.chunk;
                  setStreamOutput(agentOutput);
                  if (event.agent) {
                    updateAgent(event.agent, { output: agentOutput });
                  }
                }
                break;

              case 'tool_call':
                if (event.agent) {
                  updateAgent(event.agent, {
                    status: 'complete',
                    statusLabel: `Handed off: ${event.tool}`,
                  });
                }
                if (event.nextAgent) {
                  updateAgent(event.nextAgent, {
                    status: 'working',
                    statusLabel: 'Starting...',
                  });
                }
                break;

              case 'agent_complete':
                if (event.agent) {
                  updateAgent(event.agent, {
                    status: 'complete',
                    statusLabel: 'Done',
                    output: event.content || agentOutput,
                  });
                }
                if (event.state) {
                  setState(event.state);
                }
                break;

              case 'error':
                setError(event.message || 'Agent execution failed');
                if (event.agent) {
                  updateAgent(event.agent, {
                    status: 'error',
                    statusLabel: 'Error',
                  });
                }
                break;
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }

      return true;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return false;
      }
      const errorMessage = err instanceof Error ? err.message : 'Agent execution failed';
      setError(errorMessage);
      updateAgent(agentType, { status: 'error', statusLabel: 'Error' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [ORCHESTRATE_URL, updateAgent]);

  // Get current state from backend
  const fetchState = useCallback(async () => {
    try {
      const response = await fetch(ORCHESTRATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ action: 'get_state' }),
      });

      const data = await response.json();
      if (data.success) {
        setState(data.state);
      }
    } catch (err) {
      console.error('Failed to fetch state:', err);
    }
  }, [ORCHESTRATE_URL]);

  // Reset orchestration
  const reset = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    try {
      await fetch(ORCHESTRATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ action: 'reset' }),
      });

      resetAgents();
      setState(null);
    } catch (err) {
      console.error('Failed to reset:', err);
    }
  }, [ORCHESTRATE_URL, resetAgents]);

  return {
    agents,
    state,
    isLoading,
    error,
    streamOutput,
    startOrchestration,
    approvePlan,
    executeAgent,
    fetchState,
    reset,
    updateAgent,
  };
}
