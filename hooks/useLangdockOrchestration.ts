/**
 * React Hook for Langdock Assistant Orchestration
 * 
 * Connects to the orchestrate edge function using Langdock Assistant API.
 * Provides SSE streaming with real-time agent status and progress indicators.
 */

import { useState, useCallback, useRef } from 'react';

export type AgentType = 'architect' | 'backend' | 'frontend' | 'integrator' | 'qa' | 'devops';

export interface AgentStatus {
  id: AgentType;
  name: string;
  status: 'idle' | 'thinking' | 'generating' | 'complete' | 'error';
  output: string;
  statusLabel: string;
  filesGenerated: string[];
}

export interface StreamEvent {
  type: 'agent_start' | 'status' | 'stream' | 'agent_complete' | 'pipeline_complete' | 'error' | '[DONE]';
  agent?: AgentType;
  name?: string;
  phase?: string;
  message?: string;
  chunk?: string;
  content?: string;
  files?: { path: string; content: string; language: string }[];
  progress?: number;
}

export interface OrchestrationState {
  phase: string;
  currentAgent: AgentType | null;
  plan: any;
  progress: number;
  executionLog: any[];
  error: string | null;
  generatedFiles: any[];
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
  { id: 'architect', name: 'The Architect', status: 'idle', output: '', statusLabel: 'Planning', filesGenerated: [] },
  { id: 'backend', name: 'Backend Engineer', status: 'idle', output: '', statusLabel: 'Backend', filesGenerated: [] },
  { id: 'frontend', name: 'Frontend Engineer', status: 'idle', output: '', statusLabel: 'Frontend', filesGenerated: [] },
  { id: 'integrator', name: 'The Integrator', status: 'idle', output: '', statusLabel: 'Integration', filesGenerated: [] },
  { id: 'qa', name: 'QA & Hardening', status: 'idle', output: '', statusLabel: 'Testing', filesGenerated: [] },
  { id: 'devops', name: 'DevOps', status: 'idle', output: '', statusLabel: 'Deploy', filesGenerated: [] },
];

export function useLangdockOrchestration() {
  const [agents, setAgents] = useState<AgentStatus[]>(initialAgentStatuses);
  const [state, setState] = useState<OrchestrationState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStream, setCurrentStream] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [generatedFiles, setGeneratedFiles] = useState<any[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const ORCHESTRATE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/orchestrate`;

  const resetAgents = useCallback(() => {
    setAgents(initialAgentStatuses);
    setCurrentStream('');
    setError(null);
    setProgress(0);
    setGeneratedFiles([]);
  }, []);

  const updateAgent = useCallback((agentId: AgentType, updates: Partial<AgentStatus>) => {
    setAgents(prev => prev.map(agent => 
      agent.id === agentId ? { ...agent, ...updates } : agent
    ));
  }, []);

  // Diagnose env vars
  const diagnose = useCallback(async () => {
    try {
      const response = await fetch(ORCHESTRATE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ action: 'diagnose' }),
      });
      return await response.json();
    } catch (err) {
      console.error('Diagnose failed:', err);
      return null;
    }
  }, [ORCHESTRATE_URL]);

  // Start orchestration
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
        body: JSON.stringify({ action: 'start', userRequest }),
      });

      const data = await response.json();
      if (data.success) {
        setState(data.state);
        setProgress(5);
        updateAgent('architect', { status: 'thinking', statusLabel: 'Analyzing...' });
        return true;
      } else {
        setError(data.error);
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [ORCHESTRATE_URL, resetAgents, updateAgent]);

  // Execute full pipeline with streaming
  const executePipeline = useCallback(async (userRequest: string) => {
    setIsLoading(true);
    setError(null);
    resetAgents();

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
        body: JSON.stringify({ action: 'execute_pipeline', userRequest }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to start pipeline');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      const agentOutputs: Record<AgentType, string> = {
        architect: '', backend: '', frontend: '', integrator: '', qa: '', devops: ''
      };

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
            const event: StreamEvent = JSON.parse(jsonStr);

            switch (event.type) {
              case 'agent_start':
                if (event.agent) {
                  updateAgent(event.agent, {
                    status: 'thinking',
                    statusLabel: 'Starting...',
                    output: '',
                  });
                  setCurrentStream('');
                }
                break;

              case 'status':
                if (event.agent && event.message) {
                  updateAgent(event.agent, {
                    status: 'generating',
                    statusLabel: event.message,
                  });
                }
                break;

              case 'stream':
                if (event.agent && event.chunk) {
                  agentOutputs[event.agent] += event.chunk;
                  setCurrentStream(agentOutputs[event.agent]);
                  updateAgent(event.agent, {
                    output: agentOutputs[event.agent],
                    status: 'generating',
                  });
                }
                break;

              case 'agent_complete':
                if (event.agent) {
                  const files = event.files || [];
                  updateAgent(event.agent, {
                    status: 'complete',
                    statusLabel: `Done (${files.length} files)`,
                    filesGenerated: files.map(f => f.path),
                  });
                  setGeneratedFiles(prev => [...prev, ...files]);
                }
                if (event.progress) {
                  setProgress(event.progress);
                }
                break;

              case 'pipeline_complete':
                setProgress(100);
                setState(prev => prev ? { ...prev, phase: 'complete' } : null);
                break;

              case 'error':
                setError(event.message || 'Pipeline failed');
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
      if (err instanceof Error && err.name === 'AbortError') return false;
      setError(err instanceof Error ? err.message : 'Pipeline failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [ORCHESTRATE_URL, resetAgents, updateAgent]);

  // Execute single agent
  const executeAgent = useCallback(async (agentType: AgentType, context?: any) => {
    setIsLoading(true);
    updateAgent(agentType, { status: 'thinking', statusLabel: 'Starting...', output: '' });

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
        body: JSON.stringify({ action: 'execute_agent', agentType, context }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to execute agent');
      }

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
            const event: StreamEvent = JSON.parse(jsonStr);

            if (event.type === 'status' && event.message) {
              updateAgent(agentType, { statusLabel: event.message, status: 'generating' });
            } else if (event.type === 'stream' && event.chunk) {
              agentOutput += event.chunk;
              setCurrentStream(agentOutput);
              updateAgent(agentType, { output: agentOutput });
            } else if (event.type === 'agent_complete') {
              const files = event.files || [];
              updateAgent(agentType, {
                status: 'complete',
                statusLabel: `Done (${files.length} files)`,
                filesGenerated: files.map(f => f.path),
              });
              setGeneratedFiles(prev => [...prev, ...files]);
              if (event.progress) setProgress(event.progress);
            } else if (event.type === 'error') {
              setError(event.message || 'Agent failed');
              updateAgent(agentType, { status: 'error', statusLabel: 'Error' });
            }
          } catch {
            // Skip
          }
        }
      }

      return true;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return false;
      setError(err instanceof Error ? err.message : 'Agent failed');
      updateAgent(agentType, { status: 'error', statusLabel: 'Error' });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [ORCHESTRATE_URL, updateAgent]);

  // Reset
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
    } catch (err) {
      console.error('Reset failed:', err);
    }

    resetAgents();
    setState(null);
  }, [ORCHESTRATE_URL, resetAgents]);

  return {
    agents,
    state,
    isLoading,
    error,
    currentStream,
    progress,
    generatedFiles,
    diagnose,
    startOrchestration,
    executePipeline,
    executeAgent,
    reset,
    updateAgent,
  };
}
