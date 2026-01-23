---
description: Deploy HeftCoder to Coolify
---

# 🚀 Deploy HeftCoder to Coolify

This workflow guides you through deploying HeftCoder to your Coolify instance.

## 📋 Prerequisites

- Coolify instance running at: `http://74.208.158.106:8000/`
- GitHub repository: `janpaul80/hc`
- Domain configured: `heftcoder.icu`

---

## 🔧 Step 1: Prepare the Codebase

### 1. Commit all changes
```bash
// turbo
git add .
git commit -m "feat: 6-agent orchestration system"
git push origin main
```

### 2. Verify environment variables in Coolify
Navigate to: http://74.208.158.106:8000/project/heftcoder/application/[app-id]/configuration/environment-variables

Required variables:
```env
# JWT
JWT_SECRET=<your-secret>
JWT_EXPIRES_IN=90d

# OAuth
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-secret>
GITHUB_CLIENT_ID=<your-client-id>
GITHUB_CLIENT_SECRET=<your-secret>

# Stripe
STRIPE_PUBLISHABLE_KEY=<your-key>
STRIPE_SECRET_KEY=<your-secret>
STRIPE_WEBHOOK_SECRET_KEY=<your-secret>

# Azure OpenAI
AZURE_OPENAI_ENDPOINT=<your-endpoint>
AZURE_OPENAI_API_VERSION=2025-04-01-preview
AZURE_OPENAI_KEY=<your-key>

# Deployments
AZURE_DEPLOYMENT_HEFTCODER_ORCHESTRATOR=gpt-5.1-chat
AZURE_DEPLOYMENT_CODESTRAL=codestral-2501
AZURE_DEPLOYMENT_DEEPSEEK=deepseek-v3.2
AZURE_DEPLOYMENT_GROK=grok-4-fast-reasoning
AZURE_DEPLOYMENT_MISTRAL_MEDIUM=mistral-medium-2505
AZURE_DEPLOYMENT_MISTRAL_LARGE=mistra-large-3

# Supabase
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
SUPABASE_SERVICE_ROLE_KEY=<your-key>

# Langdock
LANGDOCK_API_KEY=<your-key>
LANGDOCK_ASSISTANT_ID=<your-id>

# Model IDs
HEFTCODER_PRO_ID=<your-id>
HEFTCODER_PLUS_ID=<your-id>
CLAUDE_SONNET_45_ID=<your-id>
OPUS_REASONING_ID=<your-id>
CHATGPT_THINKING_ID=<your-id>
GEMINI_FLASH_ID=<your-id>

# 6-Agent Orchestration System
AGENT_ARCHITECT_ID=344f2121-a034-4f62-9ec5-fb6920942d09
AGENT_BACKEND_ID=aa69fdf7-24d1-4950-8bb3-e6c8a0cd0f04
AGENT_FRONTEND_ID=0fb07aed-a0ce-4a77-83b2-6c0c80477f5c
AGENT_INTEGRATOR_ID=ae6ffb0b-ffd0-4a89-aa88-ce4dbc9d704f
AGENT_QA_ID=9a76bf1b-061e-4266-8d70-2db1fe73a5b9
AGENT_DEVOPS_ID=08de6f7b-a2e2-44f4-84a6-3201b900bfdc

# App Info
NEXT_PUBLIC_APP_URL=https://heftcoder.icu
NODE_ENV=production
```

---

## 🚀 Step 2: Deploy via Coolify

### Option A: Manual Deployment (Recommended)

1. **Navigate to Coolify Dashboard**
   - URL: http://74.208.158.106:8000/
   - Login: `hello@heftcoder.icu` / `Ecuagrowers10@@`

2. **Go to the HeftCoder Project**
   - Click "Projects" → "heftcoder"
   - Select the application

3. **Trigger Deployment**
   - Click "Deployments" tab
   - Click "Redeploy" button
   - Wait for build to complete (~5-10 minutes)

4. **Verify Deployment**
   - Check deployment logs for errors
   - Visit https://heftcoder.icu to confirm the app is live
   - Test the 6-agent system in production

### Option B: Auto-Deploy on Git Push

1. **Enable Webhook in Coolify**
   - Go to Application Configuration
   - Enable "Auto Deploy on Push"
   - Copy the webhook URL

2. **Add Webhook to GitHub**
   - Go to https://github.com/janpaul80/hc/settings/hooks
   - Add webhook URL from Coolify
   - Select "Just the push event"
   - Save

Now every push to `main` will auto-deploy!

---

## 🔍 Step 3: Verify Deployment

### 1. Check Build Logs
Navigate to: Deployments tab in Coolify

Look for:
- ✅ "Build successful"
- ✅ "Container started"
- ✅ No errors in logs

### 2. Test the Live App

Visit: https://heftcoder.icu

**Test Checklist:**
- [ ] App loads without errors
- [ ] Authentication works (Google/GitHub OAuth)
- [ ] Agent selector shows all 6 agents
- [ ] Agent 1 (Architect) responds correctly
- [ ] Chat interface is functional
- [ ] No console errors

### 3. Test Agent System in Production

1. Log in to https://heftcoder.icu
2. Select "Agent 1: The Architect"
3. Send: "Plan a simple todo app"
4. Verify the response is from the Architect (strategic plan, not code)

---

## 🐛 Step 4: Troubleshooting

### **Build Fails**

**Check:**
1. Coolify logs for specific error
2. GitHub Actions (if connected)
3. Environment variables in Coolify
4. Node version (should be 18+)

**Fix:**
```bash
# Locally test the build
npm run build

# If successful, push to GitHub
git push origin main
```

### **App Crashes on Start**

**Check:**
1. Environment variables are set correctly
2. Database connection is working
3. API keys are valid

**Fix:**
- Review Coolify logs
- Restart the container
- Check Supabase connection

### **Agents Not Working**

**Check:**
1. `LANGDOCK_API_KEY` is set
2. All 6 agent IDs are in environment variables
3. Langdock API is accessible from Coolify server

**Fix:**
```bash
# Test Langdock API
curl -H "Authorization: Bearer $LANGDOCK_API_KEY" \
  https://api.langdock.com/v1/assistants
```

---

## 🔄 Step 5: Update Deployment

When you make changes:

1. **Make changes locally**
2. **Test locally**: `npm run dev`
3. **Commit & push**:
   ```bash
   // turbo
   git add .
   git commit -m "Update: [your changes]"
   git push origin main
   ```
4. **Coolify auto-deploys** (if webhook enabled) or manually redeploy

---

## 📊 Deployment Status

Current deployment:
- **URL**: https://heftcoder.icu
- **Server**: localhost (Coolify)
- **Branch**: main
- **Build Pack**: Nixpacks
- **Environment**: production
- **Status**: ✅ Running

---

## 🎉 Success!

Your HeftCoder app with the 6-agent orchestration system is now live at:
**https://heftcoder.icu** 🚀

Share it with your users and watch them build projects with a full AI development team!
