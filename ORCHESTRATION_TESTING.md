# 🧪 ORCHESTRATION TESTING GUIDE

## ✅ Complete! Ready to Test

All components are now integrated. Here's how to test the full orchestration workflow:

---

## **Step 1: Start the Development Server**

```bash
cd C:\Users\hartm\hc\heft-coder
npm run dev
```

Wait for the server to start on `http://localhost:3000`

---

## **Step 2: Test the Orchestration API**

Open a new PowerShell terminal and test the API:

### **2.1: Check Initial State**
```powershell
curl http://localhost:3000/api/orchestration
```

**Expected Response:**
```json
{
  "success": true,
  "state": {
    "phase": "idle",
    "currentAgent": null,
    "plan": null,
    "progress": 0,
    "executionLog": []
  }
}
```

### **2.2: Start Orchestration**
```powershell
curl -X POST http://localhost:3000/api/orchestration `
  -H "Content-Type: application/json" `
  -d '{"action": "start", "userRequest": "Build a todo app"}'
```

**Expected Response:**
```json
{
  "success": true,
  "state": {
    "phase": "planning",
    "currentAgent": "agent-architect",
    "progress": 5,
    "executionLog": [...]
  }
}
```

---

## **Step 3: Test Full Workflow in the App**

### **3.1: Create or Open a Project**
1. Go to `http://localhost:3000`
2. Sign in with Clerk
3. Create a new project or open an existing one

### **3.2: Request a Plan from the Architect**
In the chat, type:
```
Plan a simple todo app with:
- User authentication
- Create, read, update, delete todos
- SQLite database
- Next.js + React frontend
```

**Expected Behavior:**
- Agent 1 (Architect) creates a detailed plan
- Plan includes stack selection, file structure, and steps
- UI shows: "🏗️ Planning (10%)"
- Execution log appears with "Creating execution plan..."

### **3.3: Approve the Plan (THIS IS THE CRITICAL TEST)**
Type in chat:
```
approved
```

**Expected Behavior (THE MAGIC):**
1. ✅ **Approval Detection**: Console shows `[Orchestration] Approval detected, triggering plan execution`
2. ✅ **Tool Call**: Architect calls `handoff_to_backend()`
3. ✅ **State Transition**: Phase changes to `building_backend`
4. ✅ **UI Update**: Status banner shows "⚙️ Building Backend (30%)"
5. ✅ **Auto-Execution**: Agent 2 (Backend) is automatically invoked
6. ✅ **Progress**: Execution log shows "Plan approved. Starting backend scaffolding..."

### **3.4: Watch the Chain Execute**
The orchestration should automatically proceed:
- **Agent 2 (Backend)**: Creates API routes, DB schema, auth → Calls `handoff_to_frontend()`
- **Agent 3 (Frontend)**: Builds UI components → Calls `handoff_to_integrator()`
- **Agent 4 (Integrator)**: Connects frontend/backend → Calls `handoff_to_qa()`
- **Agent 5 (QA)**: Tests and hardens → Calls `handoff_to_devops()`
- **Agent 6 (DevOps)**: Deploys → Calls `mark_complete()`

---

## **Step 4: Monitor Console Logs**

Open browser DevTools (F12) → Console tab. Look for:

### **Critical Success Indicators:**
```
[Orchestration] Passing handoff tools to Architect
[AIEngine] Detected tool calls: [{name: "handoff_to_backend", ...}]
[Orchestration] Tool called: handoff_to_backend
[Orchestration] Executing agent: agent-backend
[Orchestration] Calling agent-backend with prompt: ...
```

### **If You See This, It's WORKING:**
```
[Orchestration] New state: building_backend 30
```

### **If You See This, There's a Problem:**
```
[AIEngine] Response is not JSON code. Treating as Conversation/Plan.
```
(This means tool was NOT detected - check Architect's response format)

---

## **Step 5: Verify UI Components**

Check the Workspace Editor:

### **Expected UI Elements:**

1. **Status Banner** (at top of chat panel):
   ```
   ┌────────────────────────────────────────┐
   │ ⚙️ Building Backend           30%     │
   │ [============>            ]            │
   │ ⚡ Active Agent: Backend Engineer     │
   │ Recent Activity:                       │
   │ 12:05 Plan approved. Starting...       │
   └────────────────────────────────────────┘
   ```

2. **Progress Updates** every 2 seconds

3. **Execution Log** showing each phase transition

---

## **Step 6: Test Edge Cases**

### **6.1: Test Without Approval**
- Ask for a plan
- Type something other than "approved" (e.g., "looks good")
- **Expected**: No orchestration trigger, plan just displayed

### **6.2: Test Approval Keywords**
Try different approval phrases:
- `"proceed"`
- `"yes, build it"`
- `"start building"`
- `"approved"`

All should trigger orchestration.

### **6.3: Test Reset**
```powershell
curl -X POST http://localhost:3000/api/orchestration `
  -H "Content-Type: application/json" `
  -d '{"action": "reset"}'
```

**Expected**: State returns to `idle`, progress = 0

---

## **Troubleshooting**

### **Problem: Tool Calls Not Detected**

**Symptoms:**
- Console shows: `[AIEngine] Response is not JSON code`
- No orchestration state changes
- Architect repeats the plan instead of calling tool

**Solutions:**
1. Check if Langdock is returning tool calls in response
2. Verify Architect prompt includes tool syntax
3. Add explicit tool call format to prompt
4. Check `detectToolCalls()` regex patterns

### **Problem: UI Not Showing Status**

**Symptoms:**
- No status banner appears
- No progress bar visible

**Solutions:**
1. Verify `useOrchestration` hook is imported
2. Check React component mounting
3. Verify orchestration state is not `idle`
4. Check browser console for React errors

### **Problem: Agent Not Auto-Executing**

**Symptoms:**
- State changes but next agent doesn't run
- Console shows transition but no agent call

**Solutions:**
1. Check `executeAgent()` is being called
2. Verify AIEngine.generate() is receiving correct parameters
3. Check for errors in agent execution
4. Verify agent IDs exist in environment variables

---

## **Success Criteria**

✅ **The orchestration is working if:**
1. Typing "approved" triggers backend agent (not plan repeat)
2. UI shows live progress updates
3. Execution log records phase transitions
4. Console shows tool call detection
5. State advances through phases automatically

❌ **It's NOT working if:**
1. Architect dumps the plan again on approval
2. No state changes occur
3. UI remains static
4. No console logs from orchestration

---

## **Next: Deploy to Production**

Once local testing passes, proceed to:
1. Commit all changes
2. Push to GitHub
3. Deploy to Coolify
4. Test on live site

See `INTEGRATION_COMPLETE.md` for deployment steps.

---

## **Quick Smoke Test**

**Minimal test to verify it works:**

1. `npm run dev`
2. Open app → Create project
3. Type: "Plan a blog app"
4. Wait for plan
5. Type: "approved"
6. **Look for**: Status changes to "Building Backend (30%)"

If you see that status change = **SUCCESS!** 🎉

