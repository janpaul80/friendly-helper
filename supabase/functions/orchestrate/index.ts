// @ts-nocheck
/**
 * HeftCoder Orchestration Edge Function
 * 
 * Uses Langdock Assistant API (/assistant/v1/chat/completions) with per-agent assistantIds.
 * Streams results back via SSE for real-time UI updates.
 * Lovable AI serves as the brain/orchestrator for vibe coding.
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type AgentType = 'architect' | 'backend' | 'frontend' | 'integrator' | 'qa' | 'devops';

interface OrchestrationRequest {
  action: 'start' | 'approve_plan' | 'execute_agent' | 'execute_pipeline' | 'get_state' | 'reset' | 'diagnose';
  userRequest?: string;
  plan?: any;
  agentType?: AgentType;
  context?: any;
}

// In-memory state
let orchestrationState = {
  phase: 'idle' as string,
  currentAgent: null as AgentType | null,
  plan: null as any,
  progress: 0,
  executionLog: [] as any[],
  error: null as string | null,
  generatedFiles: [] as any[],
};

// Agent assistant ID environment variable names
const ASSISTANT_ENV_VARS: Record<AgentType, string> = {
  'architect': 'LANGDOCK_ASSISTANT_ARCHITECT',
  'backend': 'LANGDOCK_ASSISTANT_BACKEND',
  'frontend': 'LANGDOCK_ASSISTANT_FRONTEND',
  'integrator': 'LANGDOCK_ASSISTANT_INTEGRATOR',
  'qa': 'LANGDOCK_ASSISTANT_QA',
  'devops': 'LANGDOCK_ASSISTANT_DEVOPS',
};

// Agent display names
const AGENT_NAMES: Record<AgentType, string> = {
  'architect': 'The Architect',
  'backend': 'Backend Engineer',
  'frontend': 'Frontend Engineer',
  'integrator': 'The Integrator',
  'qa': 'QA & Hardening',
  'devops': 'DevOps',
};

// Execution pipeline order
const AGENT_PIPELINE: AgentType[] = ['architect', 'backend', 'frontend', 'integrator', 'qa', 'devops'];

// Get assistant ID for an agent
function getAssistantId(agentType: AgentType): string | null {
  const envVar = ASSISTANT_ENV_VARS[agentType];
  // @ts-ignore - Deno global
  return Deno.env.get(envVar) || null;
}

// Get Langdock API key
function getApiKey(): string {
  // @ts-ignore - Deno global
  const key = Deno.env.get('LANGDOCK_API_KEY');
  if (!key) throw new Error('LANGDOCK_API_KEY not configured');
  return key;
}

// Diagnose which env vars are present
function diagnoseEnvVars(): Record<string, boolean> {
  const result: Record<string, boolean> = {
    'LANGDOCK_API_KEY': false,
  };
  
  // @ts-ignore - Deno global
  result['LANGDOCK_API_KEY'] = !!Deno.env.get('LANGDOCK_API_KEY');
  
  for (const [agent, envVar] of Object.entries(ASSISTANT_ENV_VARS)) {
    // @ts-ignore - Deno global
    result[envVar] = !!Deno.env.get(envVar);
  }
  
  return result;
}

// Generate agent prompt based on context
function getAgentPrompt(agentType: AgentType, context: any): string {
  const prompts: Record<AgentType, string> = {
    'architect': `Analyze this request and create an execution plan:
${context?.userRequest || 'No request provided'}

Output a structured plan with:
1. Project name and description
2. Tech stack: frontend (React/Next.js), backend, database, auth
3. Repository structure with file paths
4. Execution steps for each agent phase

Format the plan as JSON that can be parsed.`,
    
    'backend': `Build the backend based on this plan:
${JSON.stringify(context?.plan || {}, null, 2)}

Generate:
1. API routes (Express/Fastify)
2. Database schema (SQL/Prisma)
3. Authentication middleware
4. Server configuration files

Output each file with its path and content.`,
    
    'frontend': `Build the frontend UI. Backend context:
${JSON.stringify(context?.backendArtifacts || {}, null, 2)}

Generate:
1. React components with Tailwind CSS
2. Pages and routing
3. State management hooks
4. API client utilities

Output each file with its path and content.`,
    
    'integrator': `Connect frontend to backend:
${JSON.stringify(context?.frontendArtifacts || {}, null, 2)}

Tasks:
1. Wire API calls to backend endpoints
2. Handle loading states and errors
3. Verify CORS configuration
4. Ensure env vars are aligned

Output integration files and fixes.`,
    
    'qa': `Test and harden the application:
Integration status: ${context?.integrationStatus || 'Complete'}

Tasks:
1. Add error boundaries
2. Input validation
3. Security headers
4. Performance checks

Output hardening patches as files.`,
    
    'devops': `Deploy the application:
${context?.qaReport || 'All checks passed'}

Tasks:
1. Dockerfile
2. docker-compose.yml
3. CI/CD config (.github/workflows)
4. Environment template

Output deployment files.`
  };
  
  return prompts[agentType];
}

// Call Langdock Assistant API with streaming
async function callLangdockAssistant(
  agentType: AgentType,
  context: any,
  onChunk: (chunk: string) => void,
  onStatus: (status: string) => void
): Promise<{ content: string; files: any[] }> {
  const apiKey = getApiKey();
  const assistantId = getAssistantId(agentType);
  
  if (!assistantId) {
    throw new Error(`${ASSISTANT_ENV_VARS[agentType]} not configured`);
  }
  
  const url = 'https://api.langdock.com/assistant/v1/chat/completions';
  const prompt = getAgentPrompt(agentType, context);
  
  console.log(`[Orchestrate] Calling ${AGENT_NAMES[agentType]} (${assistantId.substring(0, 8)}...)`);
  onStatus(`${AGENT_NAMES[agentType]} is thinking...`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      assistantId,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Langdock API error (${response.status}): ${errorText}`);
  }
  
  if (!response.body) {
    throw new Error('No response body from Langdock');
  }
  
  onStatus(`${AGENT_NAMES[agentType]} is generating code...`);
  
  // Process SSE stream
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let fullContent = '';
  
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
        const delta = chunk.choices?.[0]?.delta?.content;
        
        if (delta) {
          fullContent += delta;
          onChunk(delta);
        }
      } catch {
        // Skip invalid JSON chunks
      }
    }
  }
  
  // Extract files from content (look for code blocks with file paths)
  const files = extractFilesFromContent(fullContent);
  
  // Check if no content was generated
  if (!fullContent.trim()) {
    console.warn(`[Orchestrate] ${AGENT_NAMES[agentType]} returned empty response`);
  }
  
  return { content: fullContent, files };
}

// Extract files from markdown code blocks
function extractFilesFromContent(content: string): any[] {
  const files: any[] = [];
  
  // Match code blocks with file paths like ```tsx:src/components/Button.tsx
  const codeBlockRegex = /```(\w+)?(?::([^\n]+))?\n([\s\S]*?)```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    const language = match[1] || 'text';
    const filePath = match[2];
    const code = match[3].trim();
    
    if (filePath && code) {
      files.push({
        path: filePath,
        content: code,
        language,
      });
    }
  }
  
  return files;
}

// Update progress based on agent
function getProgressForAgent(agentType: AgentType): number {
  const progressMap: Record<AgentType, number> = {
    'architect': 15,
    'backend': 35,
    'frontend': 55,
    'integrator': 75,
    'qa': 90,
    'devops': 100,
  };
  return progressMap[agentType];
}

// Get phase name for agent
function getPhaseForAgent(agentType: AgentType): string {
  const phaseMap: Record<AgentType, string> = {
    'architect': 'planning',
    'backend': 'building_backend',
    'frontend': 'building_frontend',
    'integrator': 'integrating',
    'qa': 'qa_testing',
    'devops': 'deploying',
  };
  return phaseMap[agentType];
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const body: OrchestrationRequest = await req.json();
    const { action, userRequest, plan, agentType, context } = body;
    
    console.log(`[Orchestrate] Action: ${action}`);
    
    switch (action) {
      case 'diagnose': {
        const envStatus = diagnoseEnvVars();
        return new Response(
          JSON.stringify({ 
            success: true, 
            envVars: envStatus,
            message: 'Environment variable diagnostic'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      case 'start': {
        orchestrationState = {
          phase: 'planning',
          currentAgent: 'architect',
          plan: null,
          progress: 5,
          executionLog: [{
            timestamp: new Date().toISOString(),
            agent: 'architect',
            message: 'Starting project analysis...'
          }],
          error: null,
          generatedFiles: [],
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
          message: 'Plan approved. Starting backend generation...'
        });
        
        return new Response(
          JSON.stringify({ success: true, state: orchestrationState }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      case 'execute_agent': {
        if (!agentType) {
          throw new Error('agentType required');
        }
        
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            const send = (data: any) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };
            
            try {
              orchestrationState.currentAgent = agentType;
              orchestrationState.phase = getPhaseForAgent(agentType);
              
              send({
                type: 'agent_start',
                agent: agentType,
                name: AGENT_NAMES[agentType],
                phase: orchestrationState.phase,
              });
              
              const { content, files } = await callLangdockAssistant(
                agentType,
                context,
                (chunk) => {
                  send({ type: 'stream', agent: agentType, chunk });
                },
                (status) => {
                  send({ type: 'status', agent: agentType, message: status });
                }
              );
              
              // Check for empty response
              if (!content.trim() && files.length === 0) {
                console.warn(`[Orchestrate] ${AGENT_NAMES[agentType]} produced no output`);
                send({
                  type: 'warning',
                  agent: agentType,
                  message: `${AGENT_NAMES[agentType]} did not generate any code. This may indicate an issue with the Langdock assistant configuration.`,
                });
              }
              
              // Store files
              orchestrationState.generatedFiles.push(...files);
              orchestrationState.progress = getProgressForAgent(agentType);
              
              // Log completion
              orchestrationState.executionLog.push({
                timestamp: new Date().toISOString(),
                agent: agentType,
                message: files.length > 0 ? `Completed. Generated ${files.length} files.` : 'Completed with no files generated.',
                filesGenerated: files.map(f => f.path),
              });
              
              send({
                type: 'agent_complete',
                agent: agentType,
                content,
                files,
                progress: orchestrationState.progress,
                warning: !content.trim() && files.length === 0 ? 'No code was generated by this agent' : undefined,
              });
              
            } catch (error) {
              const errorMsg = error instanceof Error ? error.message : 'Unknown error';
              orchestrationState.error = errorMsg;
              orchestrationState.phase = 'error';
              
              send({ type: 'error', agent: agentType, message: errorMsg });
            }
            
            send({ type: '[DONE]' });
            controller.close();
          }
        });
        
        return new Response(stream, {
          headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
        });
      }
      
      case 'execute_pipeline': {
        // Execute all agents in sequence with streaming
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          async start(controller) {
            const send = (data: any) => {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
            };
            
            let pipelineContext: any = { userRequest };
            
            for (const agent of AGENT_PIPELINE) {
              try {
                orchestrationState.currentAgent = agent;
                orchestrationState.phase = getPhaseForAgent(agent);
                
                send({
                  type: 'agent_start',
                  agent,
                  name: AGENT_NAMES[agent],
                  phase: orchestrationState.phase,
                  progress: orchestrationState.progress,
                });
                
                const { content, files } = await callLangdockAssistant(
                  agent,
                  pipelineContext,
                  (chunk) => {
                    send({ type: 'stream', agent, chunk });
                  },
                  (status) => {
                    send({ type: 'status', agent, message: status });
                  }
                );
                
                // Update context for next agent
                if (agent === 'architect') {
                  pipelineContext.plan = content;
                  orchestrationState.plan = content;
                } else if (agent === 'backend') {
                  pipelineContext.backendArtifacts = { content, files };
                } else if (agent === 'frontend') {
                  pipelineContext.frontendArtifacts = { content, files };
                } else if (agent === 'integrator') {
                  pipelineContext.integrationStatus = content;
                } else if (agent === 'qa') {
                  pipelineContext.qaReport = content;
                }
                
                // Check for empty response in pipeline
                if (!content.trim() && files.length === 0) {
                  console.warn(`[Orchestrate] Pipeline: ${AGENT_NAMES[agent]} produced no output`);
                  send({
                    type: 'warning',
                    agent,
                    message: `${AGENT_NAMES[agent]} did not generate any code. The orchestration will continue, but results may be incomplete.`,
                  });
                }
                
                orchestrationState.generatedFiles.push(...files);
                orchestrationState.progress = getProgressForAgent(agent);
                
                orchestrationState.executionLog.push({
                  timestamp: new Date().toISOString(),
                  agent,
                  message: files.length > 0 ? `Completed. Generated ${files.length} files.` : 'Completed with no files generated.',
                });
                
                send({
                  type: 'agent_complete',
                  agent,
                  files,
                  progress: orchestrationState.progress,
                  warning: !content.trim() && files.length === 0 ? 'No code was generated by this agent' : undefined,
                });
                
              } catch (error) {
                const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                orchestrationState.error = errorMsg;
                orchestrationState.phase = 'error';
                
                send({ type: 'error', agent, message: errorMsg });
                break;
              }
            }
            
            if (!orchestrationState.error) {
              orchestrationState.phase = 'complete';
              send({
                type: 'pipeline_complete',
                files: orchestrationState.generatedFiles,
                progress: 100,
              });
            }
            
            send({ type: '[DONE]' });
            controller.close();
          }
        });
        
        return new Response(stream, {
          headers: { ...corsHeaders, 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' }
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
          generatedFiles: [],
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
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Orchestrate] Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: errorMsg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
