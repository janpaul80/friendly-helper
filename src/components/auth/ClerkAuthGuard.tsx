import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { RefreshCw, Terminal } from 'lucide-react';

interface ClerkAuthGuardProps {
  children: React.ReactNode;
}

export function ClerkAuthGuard({ children }: ClerkAuthGuardProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/auth');
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
          <div className="absolute inset-0 w-8 h-8 bg-orange-500/30 rounded-full blur-xl animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-orange-500/50" />
          <span className="text-xs font-mono text-orange-500/50 uppercase tracking-widest">
            Authenticating...
          </span>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return <>{children}</>;
}
