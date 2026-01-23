# 🧪 Quick Test Guide: 6-Agent Orchestration

## ✅ Setup Complete!

All 6 agents are configured and ready to use. Here's how to test them:

---

## 🚀 **1. Start the App**

```bash
cd C:\Users\hartm\hc\heft-coder
npm run dev
```

The app will be available at: **http://localhost:3000**

---

## 🎯 **2. Manual Testing Steps**

### **Step 1: Open the App**
1. Navigate to http://localhost:3000
2. If not logged in, use: `hello@heftcoder.icu`

### **Step 2: Select Agent 1 (The Architect)**
1. Find the **Model/Agent Selector** dropdown (usually in the top bar or chat interface)
2. Click it to open the list
3. You should see all 6 agents:
   - ✅ Agent 1: The Architect
   - ✅ Agent 2: Backend Engineer
   - ✅ Agent 3: Frontend Engineer
   - ✅ Agent 4: The Integrator
   - ✅ Agent 5: QA & Hardening
   - ✅ Agent 6: DevOps
4. **Select "Agent 1: The Architect"**

### **Step 3: Test The Architect**
Send this message:
```
Plan a real-time chat application with the following features:
- User authentication
- Real-time messaging with WebSockets
- Message history
- Online/offline status
- Next.js 15 + Supabase + Tailwind CSS
```

**Expected Response:**
The Architect should return:
- Tech stack recommendations
- File structure
- Database schema design
- API endpoint plans
- Step-by-step implementation roadmap

### **Step 4: Test Backend Engineer**
1. Switch to **Agent 2: Backend Engineer**
2. Send:
```
Implement the authentication system from the Architect's plan
```

**Expected Response:**
- Database migration files
- `/api/auth/login` and `/api/auth/register` routes
- Zod validation schemas
- Supabase configuration

### **Step 5: Test Frontend Engineer**
1. Switch to **Agent 3: Frontend Engineer**
2. Send:
```
Build the chat interface UI from the plan
```

**Expected Response:**
- React components (`ChatWindow.tsx`, `MessageList.tsx`, etc.)
- Tailwind CSS styling
- API integration code
- Loading/error states

### **Step 6: Test The Integrator**
1. Switch to **Agent 4: The Integrator**
2. Send:
```
Verify the frontend and backend are properly connected
```

**Expected Response:**
- Environment variable checks
- CORS configuration
- API endpoint verification
- Connection test results

### **Step 7: Test QA & Hardening**
1. Switch to **Agent 5: QA & Hardening**
2. Send:
```
Audit the authentication flow for security vulnerabilities
```

**Expected Response:**
- Security recommendations
- Edge case handling
- Error handling improvements
- Validation enhancements

### **Step 8: Test DevOps**
1. Switch to **Agent 6: DevOps**
2. Send:
```
Create deployment configuration for Coolify
```

**Expected Response:**
- Docker configuration
- Environment setup
- Deployment commands
- CI/CD recommendations

---

## ✅ **3. Verification Checklist**

After testing each agent, verify:

| Agent | Test Passed | Notes |
|-------|-------------|-------|
| ✅ Agent 1: The Architect | [ ] | Creates comprehensive plans |
| ✅ Agent 2: Backend Engineer | [ ] | Generates API routes and DB schemas |
| ✅ Agent 3: Frontend Engineer | [ ] | Creates UI components |
| ✅ Agent 4: The Integrator | [ ] | Fixes integration issues |
| ✅ Agent 5: QA & Hardening | [ ] | Finds security/edge cases |
| ✅ Agent 6: DevOps | [ ] | Provides deployment configs |

---

## 🐛 **Troubleshooting**

### **Agent not responding:**
- Check that `.env.local` has all 6 agent IDs
- Verify `LANGDOCK_API_KEY` is correct
- Restart the dev server: `npm run dev`

### **Wrong agent behavior:**
- Ensure you selected the correct agent in the dropdown
- Check the agent's description matches its role
- Verify agent instructions in Langdock

### **API errors:**
- Check browser console for errors
- Verify Langdock API is accessible
- Check network tab for failed requests

---

## 📊 **Expected Results**

### **Success Indicators:**
- ✅ All 6 agents appear in the dropdown
- ✅ Each agent responds with specialized output
- ✅ Backend Engineer doesn't generate UI code
- ✅ Frontend Engineer doesn't touch database schemas
- ✅ The Integrator focuses on connections, not features
- ✅ QA finds issues, not builds new features
- ✅ DevOps provides deployment configs

### **Red Flags:**
- ❌ Agent gives generic responses (not specialized)
- ❌ Backend Engineer generates React components
- ❌ Frontend Engineer creates API routes
- ❌ Multiple agents doing the same work

---

## 🎉 **Next Steps After Testing**

Once testing is complete:

1. **Build a real project** using the workflow in `/6-agent-orchestration.md`
2. **Deploy to Coolify** using Agent 6
3. **Create a demo video** showcasing the system
4. **Share feedback** on which agents work best

---

## 🔗 **Resources**

- **Full Documentation**: `/.agent/workflows/6-agent-orchestration.md`
- **Agent Registry**: `/lib/agent/registry.ts`
- **AI Engine**: `/lib/ai/engine.ts`
- **Coolify Dashboard**: http://74.208.158.106:8000/

---

**Happy Testing! 🚀**
