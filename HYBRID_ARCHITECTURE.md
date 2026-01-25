# Hybrid Architecture Guide

This project now uses a **Hybrid Architecture** combining:
1.  **Frontend (Next.js)**: The main `heftcoder.icu` application (auth, dashboard, payments).
2.  **Workspace (Vite)**: The AI Workspace builder running on `workspace-vite` directory.
3.  **Backend (Lovable Cloud)**: Supabase implementation for the Workspace logic.

## Why Hybrid?
The AI Workspace relies on specific Vite modules and runtime behaviors that conflict with Next.js Server Components. By running the Workspace as a separate Vite app, we ensure:
- **Stability**: No conflicts between Next.js SSR and client-side workspace logic.
- **Performance**: Vite serves the highly interactive workspace as a static SPA.
- **Compatibility**: Direct integration with Lovable Cloud backend logic.

## Directory Structure
- `/heft-coder/`: Main Next.js App
- `/workspace-vite/`: Cloned Workspace Builder (Vite App)

## Deployment Instructions

### 1. Main App (`heft-coder`)
Deploy as a **Next.js** application.
- Domain: `heftcoder.icu`
- Env Vars: See `.env.local`

### 2. Workspace App (`workspace-vite`)
Deploy as a **Static / Docker** application using the provided `Dockerfile`.
- **Repo/Folder**: `workspace-vite`
- **Domain**: `workspace.heftcoder.icu` (or similar subdomain)
- **Environment Variables**:
  ```env
  VITE_SUPABASE_URL=...
  VITE_SUPABASE_PUBLISHABLE_KEY=...
  ```
  *(These are pre-configured in `workspace-vite/.env` for local reference, add them to Coolify)*

## Linking
Update the main app's navigation to point to `https://workspace.heftcoder.icu` instead of the internal `/workspace` route.
