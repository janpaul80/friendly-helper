# HeftCoder Workspace V3 Integration

## Overview
This document describes the integration of the new Workspace Editor (V3) from the `heftcoder-ai-workspace-38739ecc` repository into HeftCoder.

## Architecture: Hybrid Hosting

### Frontend (Coolify)
- **Domain**: `heftcoder.icu`
- **Hosting**: Your VPS via Coolify
- **Includes**: React UI, static assets, Next.js app

### Backend (Lovable Cloud)
- **Hosting**: Lovable Cloud Supabase
- **Project URL**: `https://ayrqoqzrjximjotyevqh.supabase.co`
- **Includes**: 
  - Edge Functions (orchestrator endpoint)
  - Database (templates, project history)
  - Secure secrets management

## Components Copied

### From `heftcoder-ai-workspace-38739ecc/src/components/workspace/`:
- ✅ `WorkspaceEditor.tsx` - Main workspace component
- ✅ `ChatPanel.tsx` - Left panel with chat interface
- ✅ `PreviewPanel.tsx` - Right panel showing live preview
- ✅ `StartPanel.tsx` - Quick start templates and project history
- ✅ `AgentProgressBar.tsx` - Shows 6-agent orchestration progress
- ✅ `ChatInput.tsx` - Message input with file attachments
- ✅ `ChatMessage.tsx` - Individual message rendering
- ✅ `TemplateGallery.tsx` - Template selection UI
- ✅ `ProjectHistoryPanel.tsx` - Recent projects list
- ✅ `FileExplorerModal.tsx` - File browser modal
- ✅ `TopNav.tsx` - Top navigation bar
- ✅ And more supporting components...

**Destination**: `C:\Users\hartm\hc\heft-coder\components\workspace-v3\`

### From `heftcoder-ai-workspace-38739ecc/src/hooks/`:
- ✅ `useOrchestrator.ts` - **Adapted for Next.js** - Connects to Lovable Cloud backend
- ✅ `useTemplates.ts` - Template management
- ✅ `useProjectHistory.ts` - Project history management

**Destination**: `C:\Users\hartm\hc\heft-coder\hooks\`

### From `heftcoder-ai-workspace-38739ecc/src/types/`:
- ✅ `orchestrator.ts` - Types for 6-agent orchestration
- ✅ `workspace.ts` - Workspace-related types

**Destination**: `C:\Users\hartm\hc\heft-coder\types-new\`

## Key Adaptations for Next.js

### 1. Environment Variables
**Original (Vite)**:
```typescript
import.meta.env.VITE_SUPABASE_URL
import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
```

**Adapted (Next.js)**:
```typescript
process.env.NEXT_PUBLIC_LOVABLE_SUPABASE_URL
process.env.NEXT_PUBLIC_LOVABLE_SUPABASE_ANON_KEY
```

### 2. Import Paths
**Original**:
```typescript
import type { AgentInfo } from '@/types/orchestrator';
```

**Adapted**:
```typescript
import type { AgentInfo } from '@/types-new/orchestrator';
```
> Uses `types-new/` to avoid conflicts with existing types

## Environment Configuration

### `.env.local` (Added)
```bash
# Lovable Cloud Backend (Workspace Orchestrator)
NEXT_PUBLIC_LOVABLE_SUPABASE_URL=https://ayrqoqzrjximjotyevqh.supabase.co
NEXT_PUBLIC_LOVABLE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Backend Integration

### Orchestrator Endpoint
```
POST https://ayrqoqzrjximjotyevqh.supabase.co/functions/v1/orchestrator
```

**Actions**:
- `plan` - Request a build plan from Architect agent
- `execute` - Execute approved plan with 6-agent system

**Authentication**: Bearer token using `NEXT_PUBLIC_LOVABLE_SUPABASE_ANON_KEY`

## 6-Agent Orchestration System

The workspace uses Langdock agents configured in `.env.local`:

```bash
AGENT_ARCHITECT_ID=344f2121-a034-4f62-9ec5-fb6920942d09
AGENT_ASSISTANT_ARCHITECT_ID=942db20b-ad2c-444a-b071-bde267619e4b
AGENT_BACKEND_ID=aa69fdf7-24d1-4950-8bb3-e6c8a0cd0f04
AGENT_FRONTEND_ID=0fb07aed-a0ce-4a77-83b2-6c0c80477f5c
AGENT_INTEGRATOR_ID=ae6ffb0b-ffd0-4a89-aa88-ce4dbc9d704f
AGENT_QA_ID=9a76bf1b-061e-4266-8d70-2db1fe73a5b9
```

**Workflow**:
1. **Planning Phase**: Architect creates project plan
2. **User Approval**: User reviews and approves plan
3. **Building Phase**: 
   - Backend Agent: Generates backend code
   - Frontend Agent: Generates frontend code
   - Integrator: Connects frontend/backend
   - QA: Tests and validates
4. **Complete**: Project files ready for preview/download

## Usage

### Create a New Page
```typescript
// app/workspace-v3/page.tsx
import { WorkspaceEditor } from '@/components/workspace-v3/WorkspaceEditor';

export default function WorkspaceV3Page() {
  return <WorkspaceEditor />;
}
```

### Test Locally
```bash
npm run dev
# Visit http://localhost:3000/workspace-v3
```

## Features

### ✅ What Works
- Quick Start templates
- Template gallery
- Project history
- Chat interface
- Live preview panel
- 6-agent orchestration
- File explorer
- Resizable panels

### 🔄 What's Integrated
- Langdock API (already configured)
- Hybrid backend (Lovable Cloud)
- All workspace components

### 🚧 What's Next
1. Create `/workspace-v3` route
2. Test orchestrator connection
3. Deploy to Coolify
4. Verify production functionality

## Cost Management

**Lovable Cloud Free Tier**: $25/month allocation
- Covers dev/early-stage usage
- Monitors usage in Lovable dashboard
- Self-hosted Supabase is an option later if needed

## Deployment

### Frontend (Coolify)
```bash
git add -A
git commit -m "feat: integrate workspace v3 with Lovable Cloud backend"
git push origin main
```
Coolify will auto-deploy to `heftcoder.icu`

### Backend (Lovable Cloud)
- No manual deployment needed
- Edge functions auto-deploy via Lovable
- Database schema managed through Lovable workspace

## Troubleshooting

### CORS Errors
Ensure Lovable Cloud allows `heftcoder.icu` origin. Configure in Supabase dashboard.

### 401 Unauthorized
Verify `NEXT_PUBLIC_LOVABLE_SUPABASE_ANON_KEY` is correct and not expired.

### Agent Not Responding
Check Langdock agent IDs in `.env.local` match the Lovable Cloud backend configuration.

---

**Last Updated**: 2026-01-24
**Integration Status**: ✅ Components Copied, ⏳ Testing Pending
