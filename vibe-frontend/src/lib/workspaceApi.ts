/**
 * Workspace API Client
 * Same-origin API calls for unified IONOS deployment
 */

export const API_BASE_URL = import.meta.env.MODE === 'production' ? '' : 'http://localhost:3978';

export interface FileNode {
    name: string;
    type: 'file' | 'directory';
    path: string;
    children?: FileNode[];
}

export interface WorkspaceFile {
    path: string;
    content: string;
}

export interface CreateWorkspaceResponse {
    success: boolean;
    workspaceId: string;
    workspace_id: string; // aligned with orchestrator requirement
    message: string;
}

export interface WriteFilesResponse {
    success: boolean;
    workspaceId: string;
    filesWritten: number;
    message: string;
}

export interface GetFilesResponse {
    success: boolean;
    workspaceId: string;
    files: FileNode[];
}

/**
 * Creates a new workspace
 */
export async function createWorkspace(projectId?: string, userId?: string): Promise<string> {
    const response = await fetch(`${API_BASE_URL}/api/workspace/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId, userId }),
    });

    if (!response.ok) {
        throw new Error(`Failed to create workspace: ${response.statusText}`);
    }

    const data: CreateWorkspaceResponse = await response.json();

    if (!data.success) {
        throw new Error(data.message || 'Failed to create workspace');
    }

    return data.workspaceId;
}

/**
 * Writes files to a workspace
 */
export async function writeFiles(workspaceId: string, files: WorkspaceFile[]): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/workspace/${workspaceId}/write`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files }),
    });

    if (!response.ok) {
        throw new Error(`Failed to write files: ${response.statusText}`);
    }

    const data: WriteFilesResponse = await response.json();

    if (!data.success) {
        throw new Error(data.message || 'Failed to write files');
    }
}

/**
 * Gets the file tree for a workspace
 */
export async function getFileTree(workspaceId: string): Promise<FileNode[]> {
    const response = await fetch(`${API_BASE_URL}/api/workspace/${workspaceId}/files`);

    if (!response.ok) {
        throw new Error(`Failed to get file tree: ${response.statusText}`);
    }

    const data: GetFilesResponse = await response.json();

    if (!data.success) {
        throw new Error('Failed to get file tree');
    }

    return data.files;
}

/**
 * Gets the preview URL for a workspace file
 */
export function getPreviewUrl(workspaceId: string, filePath: string = 'index.html'): string {
    return `${API_BASE_URL}/preview/${workspaceId}/${filePath}`;
}

/**
 * Health check for API
 */
export async function healthCheck(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/health`);
        return response.ok;
    } catch {
        return false;
    }
}
