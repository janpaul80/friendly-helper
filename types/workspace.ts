/**
 * HashCoder IDE - Updated Message Interface with Actions
 */

import { AgentAction } from '@/lib/agent/actions';

export interface Message {
    role: "user" | "ai";
    content: string;
    imageUrl?: string;
    // NEW: Actions from the agent
    actions?: AgentAction[];
    actionStatuses?: Record<string, 'pending' | 'running' | 'done' | 'error'>;
    actionOutputs?: Record<string, string>;
    actionErrors?: Record<string, string>;
    attachments?: Attachment[];
    id?: string;
}

export interface Attachment {
    id: string;
    name: string;
    type: 'code' | 'pdf' | 'image' | 'zip' | 'figma';
    content?: string;
}

export interface AIModel {
    id: string;
    name: string;
    icon: string | React.ComponentType<{ className?: string }>;
    description?: string;
    tag?: string | null;
}

/**
 * Workspace State Management
 */
export interface WorkspaceState {
    id: string;
    currentPlan: {
        summary: string;
        steps: string[];
    } | null;
    planStatus: "none" | "proposed" | "approved";
}

/**
 * Agent Event Types for UI
 */
export type AgentEvent =
    | { type: "chat"; content: string }
    | { type: "file:create"; path: string }
    | { type: "file:update"; path: string }
    | { type: "command"; cmd: string; status?: "running" | "success" | "error" };
