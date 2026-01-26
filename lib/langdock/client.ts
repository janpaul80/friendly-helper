/**
 * Langdock Agent API Client Types
 * 
 * Type definitions for Langdock agent communication.
 * Actual API calls happen in Edge Functions.
 */

export interface LangdockMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LangdockAgentRequest {
  messages: LangdockMessage[];
  stream?: boolean;
  tools?: any[];
}

export interface LangdockAgentResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
      tool_calls?: {
        id: string;
        type: string;
        function: {
          name: string;
          arguments: string;
        };
      }[];
    };
    finish_reason: string;
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface LangdockStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    delta: {
      role?: string;
      content?: string;
      tool_calls?: {
        index: number;
        id?: string;
        type?: string;
        function?: {
          name?: string;
          arguments?: string;
        };
      }[];
    };
    finish_reason: string | null;
  }[];
}

export type AgentType = 
  | 'architect'
  | 'backend'
  | 'frontend'
  | 'integrator'
  | 'qa'
  | 'devops';

export interface OrchestrationStreamEvent {
  type: 'agent_status' | 'agent_stream' | 'agent_complete' | 'tool_call' | 'error' | '[DONE]';
  agent?: AgentType;
  status?: string;
  message?: string;
  chunk?: string;
  content?: string;
  tool?: string;
  nextAgent?: AgentType | null;
  state?: any;
}
