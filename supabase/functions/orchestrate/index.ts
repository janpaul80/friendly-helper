/**
 * HeftCoder Orchestration Edge Function
 * 
 * Routes execution to real Langdock agents while streaming results back via SSE.
 * This is the core backend for the multi-agent orchestration pipeline.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Agent type mapping
type AgentType = 'architect' | 'backend' | 'frontend' | 'integrator' | 'qa' | 'devops';

interface OrchestrationRequest {
  action: 'start' | 'approve_plan' | 'execute_agent' | 'get_state' | 'reset';
  userRequest?: string;
  plan?: any;
  agentType?: AgentType;
  context?: any;
}

// In-memory state (in production, use Supabase for persistence)
let orchestrationState = {
  phase: 'idle',
  currentAgent: null as AgentType | null,
  plan: null as any,
  progress: 0,
  executionLog: [] as any[],
  error: null as string | null,
};

// Handoff tools for agent-to-agent communication
const HANDOFF_TOOLS = [
  {
    type: 'function',
    function: {
      name: 'handoff_to_backend',
      description: 'Call when plan is approved to delegate backend work',
      parameters: {
        type: 'object',
        properties: {
          plan_json: { type: 'object', description: 'The structured plan' }
        },
        required: ['plan_json']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'handoff_to_frontend',
      description: 'Call when backend is complete to delegate UI work',
      parameters: {
        type: 'object',
        properties: {
          backend_artifacts: { type: 'object', description: 'Backend artifacts' }
        },
        required: ['backend_artifacts']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'handoff_to_integrator',
      description: 'Call when frontend is complete to verify connections',
      parameters: {
        type: 'object',
        properties: {
          frontend_artifacts: { type: 'object', description: 'Frontend artifacts' }
        },
        required: ['frontend_artifacts']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'handoff_to_qa',
      description: 'Call when integration is complete to test/harden',
      parameters: {
        type: 'object',
        properties: {
          integration_status: { type: 'string', description: 'Integration summary' }
        },
        required: ['integration_status']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'handoff_to_devops',
      description: 'Call when QA is complete to deploy',
      parameters: {
        type: 'object',
        properties: {
          qa_report: { type: 'string', description: 'QA findings' }
        },
        required: ['qa_report']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'mark_complete',
      description: 'Call when deployment is successful',
      parameters: {
        type: 'object',
        properties: {
          deployment_url: { type: 'string', description: 'Live URL' }
        },
        required: ['deployment_url']
      }
    }
  }
];

// Get agent-specific tools
function getToolsForAgent(agentType: AgentType) {
  const toolMap: Record<AgentType, string[]> = {
    'architect': ['handoff_to_backend'],
    'backend': ['handoff_to_frontend'],
    'frontend': ['handoff_to_integrator'],
    'integrator': ['handoff_to_qa'],
    'qa': ['handoff_to_devops'],
    'devops': ['mark_complete']
  };
  
  const toolNames = toolMap[agentType] || [];
  return HANDOFF_TOOLS.filter(t => toolNames.includes(t.function.name));
}

// Get agent ID from environment
function getAgentId(agentType: AgentType): string {
  const envMap: Record<AgentType, string> = {
    'architect': 'AGENT_ARCHITECT_ID',
    'backend': 'AGENT_BACKEND_ID',
    'frontend': 'AGENT_FRONTEND_ID',
    'integrator': 'AGENT_INTEGRATOR_ID',
    'qa': 'AGENT_QA_ID',
    'devops': 'AGENT_DEVOPS_ID'
  };
  
  // @ts-ignore - Deno global
  const id = Deno.env.get(envMap[agentType]);
  if (!id) {
    throw new Error(`${envMap[agentType]} not configured`);
  }
  return id;
}

// Generate prompt for each agent
function getAgentPrompt(agentType: AgentType, context: any): string {
  const prompts: Record<AgentType, string> = {
    'architect': `You are The Architect. Analyze this request and create an execution plan:
${context?.userRequest || 'No request provided'}

Create a plan with:
1. Tech stack selection (frontend, backend, database, auth)
2. Repository structure
3. Execution steps for each agent

When the plan is approved, call handoff_to_backend() with the plan JSON.`,
    
    'backend': `You are the Backend Engineer. Build the backend based on this plan:
${JSON.stringify(context?.plan_json || {}, null, 2)}

Create:
1. API routes and endpoints
2. Database schema and models  
3. Authentication/authorization
4. Server configuration

When complete, call handoff_to_frontend() with backend artifacts.`,
    
    'frontend': `You are the Frontend Engineer. Build the UI based on this backend:
${JSON.stringify(context?.backend_artifacts || {}, null, 2)}

Create:
1. React/Next.js components
2. Pages and routing
3. State management
4. API integration

When complete, call handoff_to_integrator() with frontend artifacts.`,
    
    'integrator': `You are The Integrator. Connect frontend to backend:
${JSON.stringify(context?.frontend_artifacts || {}, null, 2)}

Tasks:
1. Wire API calls
2. Test data flow
3. Fix integration issues
4. Verify end-to-end functionality

When complete, call handoff_to_qa() with integration status.`,
    
    'qa': `You are QA & Hardening. Test and harden the application:
Integration Status: ${context?.integration_status || 'Complete'}

Tasks:
1. Run tests
2. Fix bugs
3. Add error handling
4. Security review

When complete, call handoff_to_devops() with QA report.`,
    
    'devops': `You are DevOps. Deploy the application:
QA Report: ${context?.qa_report || 'All tests passing'}

Tasks:
1. Configure deployment
2. Set environment variables
3. Deploy to production
4. Verify live site

When successful, call mark_complete() with the deployment URL.`
  };
  
  return prompts[agentType];
}

// Call Langdock agent with streaming
async function callLangdockAgent(
  agentType: AgentType,
  context: any,
  onChunk: (chunk: string) => void
): Promise<{ content: string; toolCalls: any[] }> {
  // @ts-ignore - Deno global
  const apiKey = Deno.env.get('LANGDOCK_API_KEY');
  if (!apiKey) {
    throw new Error('LANGDOCK_API_KEY not configured');
  }
  
  const agentId = getAgentId(agentType);
  const url = `https://api.langdock.com/agent/v1/${agentId}/chat/completions`;
  const tools = getToolsForAgent(agentType);
  const prompt = getAgentPrompt(agentType, context);
  
  console.log(`[Orchestrate] Calling ${agentType} agent (${agentId})`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      stream: true,
      tools: tools.length > 0 ? tools : undefined,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Langdock API error (${response.status}): ${errorText}`);
  }
  
  if (!response.body) {
    throw new Error('No response body');
  }
  
  // Process SSE stream
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullContent = '';
  let toolCalls: any[] = [];
  let currentToolCall: any = null;
  
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
        const chunk = JSON.parse(jsonStr);
        const delta = chunk.choices?.[0]?.delta;
        
        if (delta?.content) {
          fullContent += delta.content;
          onChunk(delta.content);
        }
        
        if (delta?.tool_calls) {
          for (const tc of delta.tool_calls) {
            if (tc.id) {
              // New tool call
              if (currentToolCall) {
                toolCalls.push(currentToolCall);
              }
              currentToolCall = {
                id: tc.id,
                type: tc.type,
                function: {
                  name: tc.function?.name || '',
                  arguments: tc.function?.arguments || ''
                }
              };
            } else if (currentToolCall && tc.function?.arguments) {
              // Continue building arguments
              currentToolCall.function.arguments += tc.function.arguments;
            }
          }
        }
      } catch {
        // Skip invalid JSON
      }
    }
  }
  
  // Push last tool call
  if (currentToolCall) {
    toolCalls.push(currentToolCall);
  }
  
  return { content: fullContent, toolCalls };
}

// Process tool calls and transition state
function processToolCall(toolCall: any): { nextAgent: AgentType | null; context: any } {
  const name = toolCall.function.name;
  let args: any = {};
  
  try {
    args = JSON.parse(toolCall.function.arguments);
  } catch {
    console.error('Failed to parse tool arguments');
  }
  
  const transitions: Record<string, { agent: AgentType; phase: string }> = {
    'handoff_to_backend': { agent: 'backend', phase: 'building_backend' },
    'handoff_to_frontend': { agent: 'frontend', phase: 'building_frontend' },
    'handoff_to_integrator': { agent: 'integrator', phase: 'integrating' },
    'handoff_to_qa': { agent: 'qa', phase: 'qa_testing' },
    'handoff_to_devops': { agent: 'devops', phase: 'deploying' },
  };
  
  if (name === 'mark_complete') {
    orchestrationState.phase = 'complete';
    orchestrationState.progress = 100;
    return { nextAgent: null, context: args };
  }
  
  const transition = transitions[name];
  if (transition) {
    orchestrationState.phase = transition.phase;
    orchestrationState.currentAgent = transition.agent;
    return { nextAgent: transition.agent, context: args };
  }
  
  return { nextAgent: null, context: null };
}

// Update progress based on phase
function updateProgress(phase: string) {
  const progressMap: Record<string, number> = {
    'idle': 0,
    'planning': 10,
    'awaiting_approval': 15,
    'building_backend': 30,
    'building_frontend': 50,
    'integrating': 70,
    'qa_testing': 85,
    'deploying': 95,
    'complete': 100,
  };
  orchestrationState.progress = progressMap[phase] || 0;
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const body: OrchestrationRequest = await req.json();
    const { action, userRequest, plan, agentType, context } = body;
    
    console.log(`[Orchestrate] Action: ${action}`);
    
    switch (action) {
      case 'start': {
        // Reset and start planning
        orchestrationState = {
          phase: 'planning',
          currentAgent: 'architect',
          plan: null,
          progress: 10,
          executionLog: [{
            timestamp: new Date().toISOString(),
            agent: 'architect',
            message: 'Starting project planning...'
          }],
          error: null,
        };
        
        return new Response(
          JSON.stringify({ success: true, state: orchestrationState }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      case 'approve_plan': {
        orchestrationState.plan = plan;
        orchestrationState.phase = 'building_backend';
        orchestrationState.currentAgent = 'backend';
        orchestrationState.progress = 20;
        orchestrationState.executionLog.push({
          timestamp: new Date().toISOString(),
          agent: 'backend',
          message: 'Plan approved. Starting backend scaffolding...'
        });
        
        return new Response(
          JSON.stringify({ success: true, state: orchestrationState }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      case 'execute_agent': {
        if (!agentType) {
          throw new Error('agentType required for execute_agent');
        }
        
        // Create SSE response for streaming
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            const send = (data: any) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };
            
            try {
              // Send initial status
              send({
                type: 'agent_status',
                agent: agentType,
                status: 'working',
                message: `${agentType} agent is working...`
              });
              
              // Call Langdock agent
              const { content, toolCalls } = await callLangdockAgent(
                agentType,
                context,
                (chunk) => {
                  send({
                    type: 'agent_stream',
                    agent: agentType,
                    chunk
                  });
                }
              );
              
              // Log the output
              orchestrationState.executionLog.push({
                timestamp: new Date().toISOString(),
                agent: agentType,
                message: content.substring(0, 200) + '...'
              });
              
              // Process tool calls for handoffs
              if (toolCalls.length > 0) {
                for (const tc of toolCalls) {
                  const { nextAgent, context: nextContext } = processToolCall(tc);
                  
                  send({
                    type: 'tool_call',
                    agent: agentType,
                    tool: tc.function.name,
                    nextAgent
                  });
                  
                  updateProgress(orchestrationState.phase);
                  
                  // If there's a next agent, recursively execute
                  if (nextAgent) {
                    send({
                      type: 'agent_status',
                      agent: nextAgent,
                      status: 'starting',
                      message: `Handing off to ${nextAgent}...`
                    });
                  }
                }
              }
              
              // Send completion
              send({
                type: 'agent_complete',
                agent: agentType,
                content,
                state: orchestrationState
              });
              
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error';
              console.error(`[Orchestrate] Error:`, error);
              orchestrationState.phase = 'error';
              orchestrationState.error = errorMessage;
              
              send({
                type: 'error',
                agent: agentType,
                message: errorMessage
              });
            }
            
            send({ type: '[DONE]' });
            controller.close();
          }
        });
        
        return new Response(stream, {
          headers: {
            ...corsHeaders,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
          }
        });
      }
      
      case 'get_state': {
        return new Response(
          JSON.stringify({ success: true, state: orchestrationState }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      case 'reset': {
        orchestrationState = {
          phase: 'idle',
          currentAgent: null,
          plan: null,
          progress: 0,
          executionLog: [],
          error: null,
        };
        
        return new Response(
          JSON.stringify({ success: true, state: orchestrationState }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Orchestrate] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
