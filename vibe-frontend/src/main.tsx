import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import Login from './pages/Login.tsx'
import Dashboard from './pages/Dashboard.tsx'
import Workspace from './pages/Workspace.tsx'
import About from './pages/About.tsx'
import Features from './pages/Features.tsx'
import Pricing from './pages/Pricing.tsx'
import Docs from './pages/Docs.tsx'
import API from './pages/API.tsx'
import Community from './pages/Community.tsx'
import Privacy from './pages/Privacy.tsx'
import Terms from './pages/Terms.tsx'
import Security from './pages/Security.tsx'
import Explore from './pages/Explore.tsx'
import Tutorials from './pages/Tutorials.tsx'
import Blog from './pages/Blog.tsx'
import InviteHandler from './pages/InviteHandler.tsx'

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/login', element: <Login /> },
  { path: '/dashboard', element: <Dashboard /> },
  { path: '/workspace', element: <Workspace /> },
  { path: '/workspace/:projectId', element: <Workspace /> },
  { path: '/about', element: <About /> },
  // Product pages
  { path: '/features', element: <Features /> },
  { path: '/pricing', element: <Pricing /> },
  // Resource pages
  { path: '/docs', element: <Docs /> },
  { path: '/api', element: <API /> },
  { path: '/community', element: <Community /> },
  // Legal pages
  { path: '/privacy', element: <Privacy /> },
  { path: '/terms', element: <Terms /> },
  { path: '/security', element: <Security /> },
  // Dashboard nav pages
  { path: '/explore', element: <Explore /> },
  { path: '/tutorials', element: <Tutorials /> },
  { path: '/blog', element: <Blog /> },
  // Redirect routes
  { path: '/products', element: <App /> },
  { path: '/for-work', element: <App /> },
  { path: '/resources', element: <App /> },
  { path: '/careers', element: <App /> },
  { path: '/invite/:referralCode', element: <InviteHandler /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)


