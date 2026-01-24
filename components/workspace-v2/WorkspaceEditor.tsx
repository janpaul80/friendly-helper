"use client";
import { useState, useCallback, useEffect } from 'react';
import { TopNav } from './TopNav';
import { ChatPanel } from './ChatPanel';
import { PreviewPanel } from './PreviewPanel';
import { FileExplorerModal } from './FileExplorerModal';
import type { Message, Attachment, AIModel, ProjectStatus, UserTier } from '@/types/workspace-v2';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { useUser } from '@clerk/nextjs';
import { toast } from '@/hooks/use-toast';
import { useOrchestration } from '@/hooks/useOrchestration';
import { OrchestrationStatus } from '@/components/orchestration/OrchestrationStatus';

interface WorkspaceEditorProps {
  projectId?: string;
}

export function WorkspaceEditor({ projectId }: WorkspaceEditorProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>({ status: 'idle' });
  const [isLoading, setIsLoading] = useState(false);
  const [fileExplorerOpen, setFileExplorerOpen] = useState(false);
  const [userTier, setUserTier] = useState<UserTier>('basic'); // Default to basic
  const [project, setProject] = useState<any>(null);

  // Orchestration hook
  const { state: orchState, approvePlan } = useOrchestration();

  // Fetch user tier and project data
  useEffect(() => {
    const fetchData = async () => {
      if (!projectId) return;

      try {
        // Fetch project
        const projectRes = await fetch(`/api/projects/${projectId}`);
        if (projectRes.ok) {
          const data = await projectRes.json();
          setProject(data.project);

          // Load chat history if exists
          const chatHistory = data.project?.files?.['.heftcoder/chat.json'];
          if (chatHistory) {
            const history = JSON.parse(chatHistory);
            const formatted = history.map((msg: any) => ({
              id: crypto.randomUUID(),
              role: msg.role === 'ai' ? 'assistant' : msg.role,
              content: msg.content,
              timestamp: new Date(msg.timestamp || Date.now()),
            }));
            setMessages(formatted);
          }
        }

        // Fetch user tier (from subscription)
        // TODO: Implement actual subscription check
        // For now, set to 'pro' for testing
        setUserTier('pro');
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [projectId]);

  const handleSendMessage = useCallback(
    async (content: string, attachments: Attachment[], model: AIModel) => {
      if (!projectId) {
        toast({
          title: "Error",
          description: "No project selected",
          variant: "destructive"
        });
        return;
      }

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date(),
        attachments,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setProjectStatus({ status: 'working' });

      // Check for approval keywords (triggers orchestration)
      const isApproval = /\b(approved|proceed|yes|build it|start building)\b/i.test(content);
      if (isApproval && messages.length > 0) {
        // Find the last assistant message with a plan
        const lastPlanMessage = messages.slice().reverse().find(m =>
          m.role === 'assistant' && m.content.includes('# Execution Plan')
        );

        if (lastPlanMessage) {
          console.log('[Approval] Plan approved by user - triggering orchestration');
          
          try {
            // Extract plan from the message (try to parse JSON if present)
            let planData = null;
            const jsonMatch = lastPlanMessage.content.match(/```json\s*(\{[\s\S]*?\})\s*```/);
            if (jsonMatch) {
              try {
                planData = JSON.parse(jsonMatch[1]);
              } catch (e) {
                console.warn('Failed to parse plan JSON, using raw content');
              }
            }
            
            // If no JSON found, create a basic plan structure from the markdown
            if (!planData) {
              planData = {
                raw: lastPlanMessage.content,
                stack: {},
                repoStructure: {},
                steps: []
              };
            }

            // Call orchestration API to approve plan
            const approveResponse = await approvePlan(planData);
            
            if (approveResponse) {
              const approvalMessage: Message = {
                id: crypto.randomUUID(),
                role: 'assistant',
                content: `✅ **Plan Approved!**\n\n🚀 **Orchestration Started**\n\n📊 **Development Status:**\n- ⚙️ Backend Setup: Starting...\n- 🎨 Frontend Development: Queued\n- 🔌 Integration: Queued\n- 🛡️ QA & Testing: Queued\n- 🚀 Deployment: Queued\n\n_The agents are now working sequentially. You'll see updates as each phase completes._`,
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, approvalMessage]);
              
              // Trigger the first agent (backend) by calling the generate API with orchestration context
              // The orchestration engine will handle the sequential execution
              setIsLoading(true);
              
              // Call the agent generate API to trigger backend agent
              const agentResponse = await fetch('/api/agent/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  projectId,
                  prompt: 'Start building the backend according to the approved plan.',
                  model: 'agent-backend',
                  fileContext: project?.files || {},
                  messages: [],
                  orchestrationContext: { phase: 'building_backend', plan: planData }
                }),
              });
              
              if (agentResponse.ok) {
                const agentData = await agentResponse.json();
                const agentMessage: Message = {
                  id: crypto.randomUUID(),
                  role: 'assistant',
                  content: agentData.response?.content || agentData.agentResponse?.conversationText || 'Backend agent is working...',
                  timestamp: new Date(),
                };
                setMessages((prev) => [...prev, agentMessage]);
              }
              
              setIsLoading(false);
              setProjectStatus({ status: 'working' });
              return;
            }
          } catch (error: any) {
            console.error('[Approval] Failed to trigger orchestration:', error);
            toast({
              title: "Approval Error",
              description: error.message || "Failed to start orchestration",
              variant: "destructive"
            });
          }
        }
      }

      try {
        const response = await fetch('/api/agent/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectId,
            prompt: content,
            model: model.id,
            fileContext: project?.files || {},
            messages: messages.map(m => ({
              role: m.role === 'assistant' ? 'ai' : m.role,
              content: m.content,
            })),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Generation failed');
        }

        const data = await response.json();

        const aiMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: data.response?.content || data.agentResponse?.conversationText || 'Response received',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
        
        // Update orchestration state if provided
        if (data.orchestrationState) {
          console.log('[WorkspaceEditor] Received orchestration state:', data.orchestrationState.phase);
          // The useOrchestration hook will poll for updates, but we can also trigger a fetch
          if (data.orchestrationState.phase === 'awaiting_approval') {
            console.log('[WorkspaceEditor] Plan is awaiting approval - approval button should appear');
          }
        }

        // Update project status
        if (data.shouldModifyFiles) {
          setProjectStatus({ status: 'complete' });

          // Refetch project to get updated files
          const projectRes = await fetch(`/api/projects/${projectId}`);
          if (projectRes.ok) {
            const updated = await projectRes.json();
            setProject(updated.project);
          }
        } else {
          setProjectStatus({ status: 'idle' });
        }
      } catch (error: any) {
        console.error('Generation error:', error);
        const errorMessage: Message = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: `❌ Error: ${error.message}`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        setProjectStatus({ status: 'error', message: error.message });

        toast({
          title: "Generation Error",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    },
    [projectId, project, messages]
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        ::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #444;
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: #333 #0a0a0a;
        }
      `}</style>
      <TopNav
        onFileExplorerOpen={() => setFileExplorerOpen(true)}
        userTier={userTier}
      />

      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
          <div className="flex flex-col h-full">
            {/* Orchestration Status Banner */}
            {orchState && orchState.phase !== 'idle' && (
              <div className="p-3 border-b">
                <OrchestrationStatus 
                  state={orchState} 
                  onApprove={async () => {
                    // Find the last plan message
                    const lastPlanMessage = messages.slice().reverse().find(m =>
                      m.role === 'assistant' && (m.content.includes('# Execution Plan') || m.content.includes('Execution Plan'))
                    );
                    
                    if (lastPlanMessage) {
                      let planData = null;
                      const jsonMatch = lastPlanMessage.content.match(/```json\s*(\{[\s\S]*?\})\s*```/);
                      if (jsonMatch) {
                        try {
                          planData = JSON.parse(jsonMatch[1]);
                        } catch (e) {
                          console.warn('Failed to parse plan JSON');
                        }
                      }
                      
                      if (!planData) {
                        planData = {
                          raw: lastPlanMessage.content,
                          stack: {},
                          repoStructure: {},
                          steps: []
                        };
                      }
                      
                      const approved = await approvePlan(planData);
                      if (approved) {
                        // Trigger backend agent
                        setIsLoading(true);
                        try {
                          const agentResponse = await fetch('/api/agent/generate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              projectId,
                              prompt: 'Start building the backend according to the approved plan.',
                              model: 'agent-backend',
                              fileContext: project?.files || {},
                              messages: [],
                            }),
                          });
                          
                          if (agentResponse.ok) {
                            const agentData = await agentResponse.json();
                            const agentMessage: Message = {
                              id: crypto.randomUUID(),
                              role: 'assistant',
                              content: agentData.response?.content || agentData.agentResponse?.conversationText || 'Backend agent is working...',
                              timestamp: new Date(),
                            };
                            setMessages((prev) => [...prev, agentMessage]);
                          }
                        } catch (error: any) {
                          console.error('Failed to trigger backend agent:', error);
                        } finally {
                          setIsLoading(false);
                        }
                      }
                    }
                  }}
                />
              </div>
            )}

            <ChatPanel
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </div>
        </ResizablePanel>

        <ResizableHandle className="w-1 bg-border hover:bg-primary/50 transition-colors" />

        <ResizablePanel defaultSize={50} minSize={30} maxSize={70}>
          <PreviewPanel
            status={projectStatus}
            previewUrl={project?.subdomain ? `https://${project.subdomain}.heftcoder.icu` : undefined}
          />
        </ResizablePanel>
      </ResizablePanelGroup>

      <FileExplorerModal
        open={fileExplorerOpen}
        onOpenChange={setFileExplorerOpen}
        files={project?.files}
      />
    </div>
  );
}
