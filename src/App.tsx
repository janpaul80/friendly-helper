import { Suspense, lazy } from "react";
import { Toaster } from "./components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { usePageTracking } from "./hooks/useAnalytics";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load pages that require Supabase to prevent blocking the main bundle
const Workspace = lazy(() => import("./pages/Workspace"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const About = lazy(() => import("./pages/About"));
const Documentation = lazy(() => import("./pages/Documentation"));
const ApiReference = lazy(() => import("./pages/ApiReference"));
const Community = lazy(() => import("./pages/Community"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Security = lazy(() => import("./pages/Security"));
const Referrals = lazy(() => import("./pages/Referrals"));
const Pricing = lazy(() => import("./pages/Pricing"));
const FeatureIDE = lazy(() => import("./pages/features/IDE"));
const FeatureCLI = lazy(() => import("./pages/features/CLI"));

const queryClient = new QueryClient();

// Loading component for lazy routes
const PageLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="h-8 w-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Analytics wrapper component
function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  usePageTracking();
  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <AnalyticsProvider>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/api-reference" element={<ApiReference />} />
              <Route path="/community" element={<Community />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/security" element={<Security />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/features/ide" element={<FeatureIDE />} />
              <Route path="/features/cli" element={<FeatureCLI />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/signup" element={<Auth />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/workspace/new" element={<Workspace />} />
              <Route path="/workspace/:id" element={<Workspace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AnalyticsProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
