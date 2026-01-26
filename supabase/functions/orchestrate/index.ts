// @ts-nocheck
/**
 * HeftCoder Orchestration Edge Function
 * 
 * Uses Lovable AI Gateway as the brain for vibe coding.
 * Streams results back via SSE for real-time UI updates.
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

// Get Lovable AI API key
function getApiKey(): string {
  const key = Deno.env.get('LOVABLE_API_KEY');
  if (!key) throw new Error('LOVABLE_API_KEY not configured. Please enable Lovable AI.');
  return key;
}

// Diagnose which env vars are present
function diagnoseEnvVars(): Record<string, boolean> {
  return {
    'LOVABLE_API_KEY': !!Deno.env.get('LOVABLE_API_KEY'),
  };
}

// Generate agent system prompt based on role
function getAgentSystemPrompt(agentType: AgentType): string {
  const systemPrompts: Record<AgentType, string> = {
    'architect': `You are The Architect, a senior software architect. Your role is to:
1. Analyze user requirements and create detailed execution plans
2. Define tech stack, project structure, and file organization
3. Break down the project into phases for other agents

Always output a structured JSON plan with:
- projectName: string
- description: string
- techStack: { frontend, backend, database, auth }
- files: array of { path, description }
- phases: array of { agent, tasks }

Format your response as valid JSON wrapped in \`\`\`json code blocks.`,

    'backend': `You are a Backend Engineer. Your role is to:
1. Build API routes, database schemas, and server logic
2. Implement authentication and authorization
3. Create backend configuration files

Output each file with its path using this format:
\`\`\`typescript:src/server/index.ts
// file content here
\`\`\`

Focus on clean, production-ready code with proper error handling.`,

    'frontend': `You are a Frontend Engineer. Your role is to:
1. Build React components with Tailwind CSS
2. Create pages, layouts, and routing
3. Implement state management and hooks
4. Style the UI with modern, responsive design

Output each file with its path using this format:
\`\`\`tsx:src/components/Button.tsx
// file content here
\`\`\`

Focus on clean, accessible, and well-structured components.`,

    'integrator': `You are The Integrator. Your role is to:
1. Connect frontend components to backend APIs
2. Wire up data fetching and state management
3. Ensure proper error handling and loading states
4. Verify CORS and environment configuration

Output integration code and fixes with file paths.`,

    'qa': `You are QA & Hardening specialist. Your role is to:
1. Add error boundaries and fallbacks
2. Implement input validation
3. Add security headers and best practices
4. Performance optimization suggestions

Output hardening patches with file paths.`,

    'devops': `You are a DevOps Engineer. Your role is to:
1. Create Dockerfile and docker-compose.yml
2. Set up CI/CD workflows
3. Configure environment templates
4. Deployment documentation

Output deployment files with paths.`
  };
  
  return systemPrompts[agentType];
}

// Generate user prompt based on context
function getAgentUserPrompt(agentType: AgentType, context: any): string {
  const prompts: Record<AgentType, string> = {
    'architect': `Create an execution plan for this project:
${context?.userRequest || 'No request provided'}

Output a JSON plan with projectName, description, techStack, files array, and phases array.`,
    
    'backend': `Build the backend based on this plan:
${JSON.stringify(context?.plan || {}, null, 2)}

Generate all necessary backend files with proper paths.`,
    
    'frontend': `Build the frontend UI. Project context:
User Request: ${context?.userRequest || 'Build a modern web app'}
Plan: ${JSON.stringify(context?.plan || {}, null, 2)}

Generate React components and pages with Tailwind CSS.`,
    
    'integrator': `Connect the frontend to backend:
Frontend files: ${context?.frontendArtifacts?.files?.length || 0} files
Backend files: ${context?.backendArtifacts?.files?.length || 0} files

Wire up API calls and ensure proper data flow.`,
    
    'qa': `Test and harden this application:
Total files generated: ${orchestrationState.generatedFiles.length}

Add error handling, validation, and security improvements.`,
    
    'devops': `Create deployment configuration:
Project: ${context?.plan?.projectName || 'web-app'}

Generate Dockerfile, CI/CD, and deployment files.`
  };
  
  return prompts[agentType];
}

// Call Lovable AI Gateway with streaming
async function callLovableAI(
  agentType: AgentType,
  context: any,
  onChunk: (chunk: string) => void,
  onStatus: (status: string) => void
): Promise<{ content: string; files: any[] }> {
  const apiKey = getApiKey();
  
  const systemPrompt = getAgentSystemPrompt(agentType);
  const userPrompt = getAgentUserPrompt(agentType, context);
  
  console.log(`[Orchestrate] Calling ${AGENT_NAMES[agentType]} via Lovable AI`);
  onStatus(`${AGENT_NAMES[agentType]} is thinking...`);
  
  const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-3-flash-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: true,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    if (response.status === 402) {
      throw new Error('AI credits exhausted. Please add credits in Settings → Workspace → Usage.');
    }
    
    throw new Error(`Lovable AI error (${response.status}): ${errorText}`);
  }
  
  if (!response.body) {
    throw new Error('No response body from Lovable AI');
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

// Helper to verify authentication
async function verifyAuth(req: Request): Promise<{ userId: string } | null> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[Orchestrate] Missing Supabase env vars for auth');
      return null;
    }
    
    const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        'Authorization': authHeader,
        'apikey': supabaseServiceKey,
      },
    });
    
    if (!userResponse.ok) {
      console.log('[Orchestrate] Auth verification failed:', userResponse.status);
      return null;
    }
    
    const userData = await userResponse.json();
    return { userId: userData.id };
  } catch (error) {
    console.error('[Orchestrate] Auth error:', error);
    return null;
  }
}

// User-specific state storage (keyed by userId)
const userOrchestrationStates = new Map<string, typeof orchestrationState>();

function getUserState(userId: string) {
  if (!userOrchestrationStates.has(userId)) {
    userOrchestrationStates.set(userId, {
      phase: 'idle',
      currentAgent: null,
      plan: null,
      progress: 0,
      executionLog: [],
      error: null,
      generatedFiles: [],
    });
  }
  return userOrchestrationStates.get(userId)!;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Verify authentication for all requests
    const authResult = await verifyAuth(req);
    if (!authResult) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Please log in to use the orchestration service.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const { userId } = authResult;
    const userState = getUserState(userId);
    
    const body: OrchestrationRequest = await req.json();
    const { action, userRequest, plan, agentType, context } = body;
    
    console.log(`[Orchestrate] User: ${userId}, Action: ${action}`);
    
    switch (action) {
      case 'diagnose': {
        const envStatus = diagnoseEnvVars();
        return new Response(
          JSON.stringify({ 
            success: true, 
            envVars: envStatus,
            message: 'Environment variable diagnostic - using Lovable AI'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      case 'start': {
        // Reset user state for new orchestration
        userState.phase = 'planning';
        userState.currentAgent = 'architect';
        userState.plan = null;
        userState.progress = 5;
        userState.executionLog = [{
          timestamp: new Date().toISOString(),
          agent: 'architect',
          message: 'Starting project analysis...'
        }];
        userState.error = null;
        userState.generatedFiles = [];
        
        return new Response(
          JSON.stringify({ success: true, state: userState }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      case 'approve_plan': {
        userState.plan = plan;
        userState.phase = 'building_backend';
        userState.currentAgent = 'backend';
        userState.progress = 20;
        userState.executionLog.push({
          timestamp: new Date().toISOString(),
          agent: 'backend',
          message: 'Plan approved. Starting backend generation...'
        });
        
        return new Response(
          JSON.stringify({ success: true, state: userState }),
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
              userState.currentAgent = agentType;
              userState.phase = getPhaseForAgent(agentType);
              
              send({
                type: 'agent_start',
                agent: agentType,
                name: AGENT_NAMES[agentType],
                phase: userState.phase,
              });
              
              const { content, files } = await callLovableAI(
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
                  message: `${AGENT_NAMES[agentType]} did not generate any code. Try rephrasing your request.`,
                });
              }
              
              // Store files
              userState.generatedFiles.push(...files);
              userState.progress = getProgressForAgent(agentType);
              
              // Log completion
              userState.executionLog.push({
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
                progress: userState.progress,
                warning: !content.trim() && files.length === 0 ? 'No code was generated by this agent' : undefined,
              });
              
            } catch (error) {
              const errorMsg = error instanceof Error ? error.message : 'Unknown error';
              userState.error = errorMsg;
              userState.phase = 'error';
              
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
                userState.currentAgent = agent;
                userState.phase = getPhaseForAgent(agent);
                
                send({
                  type: 'agent_start',
                  agent,
                  name: AGENT_NAMES[agent],
                  phase: userState.phase,
                  progress: userState.progress,
                });
                
                const { content, files } = await callLovableAI(
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
                  // Try to parse JSON plan from content
                  try {
                    const jsonMatch = content.match(/```json\n([\s\S]*?)```/);
                    if (jsonMatch) {
                      pipelineContext.plan = JSON.parse(jsonMatch[1]);
                      userState.plan = pipelineContext.plan;
                    }
                  } catch {
                    pipelineContext.plan = content;
                    userState.plan = content;
                  }
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
                    message: `${AGENT_NAMES[agent]} did not generate any code. The orchestration will continue.`,
                  });
                }
                
                userState.generatedFiles.push(...files);
                userState.progress = getProgressForAgent(agent);
                
                userState.executionLog.push({
                  timestamp: new Date().toISOString(),
                  agent,
                  message: files.length > 0 ? `Completed. Generated ${files.length} files.` : 'Completed with no files generated.',
                });
                
                send({
                  type: 'agent_complete',
                  agent,
                  files,
                  progress: userState.progress,
                  warning: !content.trim() && files.length === 0 ? 'No code was generated by this agent' : undefined,
                });
                
              } catch (error) {
                const errorMsg = error instanceof Error ? error.message : 'Unknown error';
                userState.error = errorMsg;
                userState.phase = 'error';
                
                send({ type: 'error', agent, message: errorMsg });
                break;
              }
            }
            
            if (!userState.error) {
              userState.phase = 'complete';
              send({
                type: 'pipeline_complete',
                files: userState.generatedFiles,
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
          JSON.stringify({ success: true, state: userState }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      case 'reset': {
        // Reset user's state
        userState.phase = 'idle';
        userState.currentAgent = null;
        userState.plan = null;
        userState.progress = 0;
        userState.executionLog = [];
        userState.error = null;
        userState.generatedFiles = [];
        
        return new Response(
          JSON.stringify({ success: true, state: userState }),
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
