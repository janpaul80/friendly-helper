---
description: How to use the 6-Agent Orchestration System
---

# 🤖 6-Agent Orchestration System

HeftCoder now features a **specialized 6-agent system** where each agent focuses on a specific part of the development lifecycle. This prevents conflicts, ensures clean code, and speeds up development.

## 📋 The 6 Agents

### **Agent 1: The Architect** 🏗️
- **Role**: Strategy & Planning
- **Goal**: Create comprehensive project plans
- **Responsibilities**:
  - Define tech stack
  - Create file structures
  - Plan database schemas
  - Delegate tasks to other agents
- **When to use**: Start of any new project or feature
- **Example prompt**: _"Plan a real-time chat app with Next.js and Supabase"_

---

### **Agent 2: Backend Engineer** ⚙️
- **Role**: Foundations & API
- **Goal**: Build robust backends
- **Responsibilities**:
  - Scaffold backend structure
  - Define database schemas
  - Create API routes
  - Implement authentication
  - Add validation (Zod)
- **Critical Rule**: ❌ Do NOT touch UI or frontend code
- **When to use**: After the Architect provides a backend plan
- **Example prompt**: _"Implement the user authentication API from the plan"_

---

### **Agent 3: Frontend Engineer** 🎨
- **Role**: UI & Wiring
- **Goal**: Build beautiful, functional UIs
- **Responsibilities**:
  - Scaffold frontend structure
  - Install UI dependencies (Tailwind, Lucide, Framer)
  - Build React/Next.js components
  - Connect to Backend API
  - Handle loading/error states
- **Critical Rule**: ❌ Do NOT touch DB schema or backend routes
- **When to use**: After the backend is ready
- **Example prompt**: _"Build the chat interface from the plan"_

---

### **Agent 4: The Integrator** 🔌
- **Role**: Environment & Glue
- **Goal**: Make everything work together
- **Responsibilities**:
  - Verify Frontend ↔ Backend connection
  - Align `.env` variables
  - Fix CORS issues
  - Ensure `package.json` scripts run cleanly
- **Critical Rule**: ❌ Do NOT build new features. Only fix connections.
- **When to use**: When frontend and backend aren't communicating
- **Example prompt**: _"Fix the API connection between frontend and backend"_

---

### **Agent 5: QA & Hardening** 🛡️
- **Role**: Debug & Polish
- **Goal**: Production-ready, stable code
- **Responsibilities**:
  - Fix runtime errors
  - Validate API responses
  - Check edge cases
  - Secure endpoints
  - Add error handling
- **When to use**: Before deployment or when bugs appear
- **Example prompt**: _"Audit the authentication flow for security issues"_

---

### **Agent 6: DevOps** 🚀
- **Role**: Deployment
- **Goal**: Get the app live
- **Responsibilities**:
  - Initialize Git
  - Configure Vercel/Netlify/Coolify
  - Create Dockerfiles
  - Set up CI/CD
- **When to use**: When you're ready to deploy
- **Example prompt**: _"Deploy this app to Coolify"_

---

## 🎯 Workflow: Building a Project End-to-End

### **Step 1: Planning (The Architect)**
1. Select **Agent 1: The Architect** from the model dropdown
2. Describe your project: _"Plan a blog platform with Next.js, Supabase, and markdown support"_
3. The Architect will:
   - Define the tech stack
   - Create a file structure
   - Plan the database schema
   - Break the work into tasks for other agents

### **Step 2: Backend (Backend Engineer)**
1. Select **Agent 2: Backend Engineer**
2. Ask it to implement the backend from the plan: _"Build the backend API for the blog platform"_
3. The Backend Engineer will:
   - Create database migrations
   - Build API routes (`/api/posts`, `/api/auth`, etc.)
   - Add validation schemas
   - Implement authentication

### **Step 3: Frontend (Frontend Engineer)**
1. Select **Agent 3: Frontend Engineer**
2. Ask it to build the UI: _"Build the blog UI with post list and editor"_
3. The Frontend Engineer will:
   - Create React components
   - Style with Tailwind CSS
   - Connect to the backend API
   - Handle loading/error states

### **Step 4: Integration (The Integrator)**
1. Select **Agent 4: The Integrator**
2. Ask it to verify everything: _"Check if frontend and backend are properly connected"_
3. The Integrator will:
   - Test API calls
   - Fix CORS issues
   - Align environment variables
   - Ensure scripts run cleanly

### **Step 5: QA (QA & Hardening)**
1. Select **Agent 5: QA & Hardening**
2. Ask it to audit: _"Check for security issues and edge cases"_
3. QA will:
   - Find and fix bugs
   - Add error handling
   - Secure endpoints
   - Validate edge cases

### **Step 6: Deployment (DevOps)**
1. Select **Agent 6: DevOps**
2. Ask it to deploy: _"Deploy this to Coolify"_
3. DevOps will:
   - Create deployment configs
   - Set up environment variables
   - Provide deployment instructions

---

## 🔑 Key Benefits

### **1. Specialization = Quality**
Each agent is an expert in its domain. No more backend agents breaking your UI!

### **2. No Conflicts**
Strict isolation rules prevent agents from stepping on each other's toes.

### **3. Faster Development**
Agents know exactly what to do. No wasted time on irrelevant tasks.

### **4. Clean, Modular Code**
Each agent follows best practices for its specialty.

---

## 💡 Pro Tips

### **Tip 1: Always start with The Architect**
Don't jump straight to coding. Let the Architect create a plan first.

### **Tip 2: Follow the workflow order**
Backend → Frontend → Integration → QA → Deployment

### **Tip 3: One agent at a time**
Don't ask multiple agents to work simultaneously. Go step-by-step.

### **Tip 4: Be specific**
Instead of: _"Build a chat app"_
Use: _"Agent 2, implement the WebSocket backend from the Architect's plan"_

### **Tip 5: Use The Integrator for debugging**
If things aren't working, don't ask other agents. Use Agent 4.

---

## 🚨 Common Mistakes

### ❌ **Asking the wrong agent**
- Don't ask the Backend Engineer to fix UI styling
- Don't ask the Frontend Engineer to modify database schemas

### ❌ **Skipping The Architect**
- Always plan before coding
- The Architect creates the roadmap for other agents

### ❌ **Not testing integration**
- Always use Agent 4 to verify frontend ↔ backend connections

### ❌ **Deploying untested code**
- Run Agent 5 (QA) before Agent 6 (DevOps)

---

## 🔧 Technical Details

### **Agent Routing (Under the Hood)**
The system uses intelligent routing:
- **The Architect** & **QA** → Langdock Pro (advanced reasoning)
- **Backend**, **Frontend**, **Integrator** → Mistral Large (fast code generation)
- **DevOps** → Claude Sonnet 4.5 (config expertise)

### **Environment Variables**
All agent IDs are stored in `.env.local`:
```bash
AGENT_ARCHITECT_ID=344f2121-a034-4f62-9ec5-fb6920942d09
AGENT_BACKEND_ID=aa69fdf7-24d1-4950-8bb3-e6c8a0cd0f04
AGENT_FRONTEND_ID=0fb07aed-a0ce-4a77-83b2-6c0c80477f5c
AGENT_INTEGRATOR_ID=ae6ffb0b-ffd0-4a89-aa88-ce4dbc9d704f
AGENT_QA_ID=9a76bf1b-061e-4266-8d70-2db1fe73a5b9
AGENT_DEVOPS_ID=08de6f7b-a2e2-44f4-84a6-3201b900bfdc
```

---

## 📚 Example Session

```
USER: (Selects Agent 1: The Architect)
      "Plan a todo app with Next.js and Supabase"

ARCHITECT: [Creates detailed plan with file structure, DB schema, API routes]

USER: (Selects Agent 2: Backend Engineer)
      "Build the backend from the plan"

BACKEND: [Creates `/api/todos` routes, Supabase schema, validation]

USER: (Selects Agent 3: Frontend Engineer)
      "Build the todo UI"

FRONTEND: [Creates TodoList, TodoItem components, connects to API]

USER: (Selects Agent 4: The Integrator)
      "Verify everything works together"

INTEGRATOR: [Tests API calls, fixes env vars, confirms integration]

USER: (Selects Agent 5: QA)
      "Check for bugs and edge cases"

QA: [Adds error handling, validates empty states, secures endpoints]

USER: (Selects Agent 6: DevOps)
      "Deploy to Vercel"

DEVOPS: [Creates vercel.json, provides deployment commands]
```

---

## 🎉 Happy Coding!

The 6-agent system transforms HeftCoder into a **full development team** at your fingertips. Each agent is an expert in its domain, ensuring high-quality, production-ready code every time.
