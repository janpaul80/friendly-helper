import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { SEO } from '../components/SEO';

export default function ClerkAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoaded, isSignedIn } = useAuth();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');

  // Determine mode from URL
  useEffect(() => {
    if (location.pathname === '/signup') {
      setMode('sign-up');
    } else {
      setMode('sign-in');
    }
  }, [location.pathname]);

  // Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/dashboard');
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Show loading state while Clerk initializes
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-4">
        <RefreshCw className="w-8 h-8 animate-spin text-orange-500" />
        <span className="text-gray-400 text-sm">Loading authentication...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <SEO
        title={mode === 'sign-in' ? 'Sign In' : 'Sign Up'}
        description="Sign in to your HeftCoder account or create a new one."
        url="/auth"
        noindex={true}
      />
      
      <div className="w-full max-w-md">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to home
        </button>


        {/* Clerk Component */}
        <div className="clerk-container">
          {mode === 'sign-in' ? (
            <SignIn
              appearance={{
                baseTheme: undefined,
                variables: {
                  colorBackground: '#0a0a0a',
                  colorInputBackground: '#1a1a2e',
                  colorText: '#ffffff',
                  colorTextSecondary: '#9ca3af',
                  colorPrimary: '#ea580c',
                  colorInputText: '#ffffff',
                  colorNeutral: '#ffffff',
                },
                elements: {
                  rootBox: 'w-full',
                  card: 'bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-xl',
                  headerTitle: 'text-white text-xl font-semibold text-center',
                  headerSubtitle: 'text-gray-400 text-sm text-center',
                  socialButtonsBlockButton: 'bg-[#1a1a2e] border border-white/10 text-white hover:bg-[#2a2a3e] transition-colors rounded-lg py-2.5',
                  socialButtonsBlockButtonText: 'text-white font-medium text-sm',
                  socialButtonsProviderIcon: 'w-5 h-5',
                  dividerLine: 'bg-white/10',
                  dividerText: 'text-gray-500 text-sm',
                  formFieldLabel: 'text-white text-sm font-medium',
                  formFieldInput: 'bg-[#1a1a2e] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500 rounded-lg py-2.5',
                  formButtonPrimary: 'bg-orange-600 hover:bg-orange-700 text-white font-medium transition-all rounded-lg py-2.5 normal-case',
                  footerActionLink: 'text-orange-400 hover:text-orange-300',
                  identityPreviewEditButton: 'text-orange-400',
                  formFieldInputShowPasswordButton: 'text-gray-400 hover:text-white',
                  otpCodeFieldInput: 'bg-[#1a1a2e] border border-white/10 text-white',
                  alert: 'bg-red-500/10 border border-red-500/20 text-red-400',
                  alertText: 'text-red-400',
                  footer: 'hidden',
                  footerAction: 'hidden',
                  internal: 'hidden',
                  badge: 'hidden',
                  poweredBy: 'hidden',
                },
                layout: {
                  socialButtonsPlacement: 'top',
                  socialButtonsVariant: 'blockButton',
                  showOptionalFields: false,
                },
              }}
              signUpUrl="/signup"
              forceRedirectUrl="/dashboard"
            />
          ) : (
            <SignUp
              appearance={{
                baseTheme: undefined,
                variables: {
                  colorBackground: '#0a0a0a',
                  colorInputBackground: '#1a1a2e',
                  colorText: '#ffffff',
                  colorTextSecondary: '#9ca3af',
                  colorPrimary: '#ea580c',
                  colorInputText: '#ffffff',
                  colorNeutral: '#ffffff',
                },
                elements: {
                  rootBox: 'w-full',
                  card: 'bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-xl',
                  headerTitle: 'text-white text-xl font-semibold text-center',
                  headerSubtitle: 'text-gray-400 text-sm text-center',
                  socialButtonsBlockButton: 'bg-[#1a1a2e] border border-white/10 text-white hover:bg-[#2a2a3e] transition-colors rounded-lg py-2.5',
                  socialButtonsBlockButtonText: 'text-white font-medium text-sm',
                  socialButtonsProviderIcon: 'w-5 h-5',
                  dividerLine: 'bg-white/10',
                  dividerText: 'text-gray-500 text-sm',
                  formFieldLabel: 'text-white text-sm font-medium',
                  formFieldInput: 'bg-[#1a1a2e] border border-white/10 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-orange-500 rounded-lg py-2.5',
                  formButtonPrimary: 'bg-orange-600 hover:bg-orange-700 text-white font-medium transition-all rounded-lg py-2.5 normal-case',
                  footerActionLink: 'text-orange-400 hover:text-orange-300',
                  identityPreviewEditButton: 'text-orange-400',
                  formFieldInputShowPasswordButton: 'text-gray-400 hover:text-white',
                  otpCodeFieldInput: 'bg-[#1a1a2e] border border-white/10 text-white',
                  alert: 'bg-red-500/10 border border-red-500/20 text-red-400',
                  alertText: 'text-red-400',
                  footer: 'hidden',
                  footerAction: 'hidden',
                  internal: 'hidden',
                  badge: 'hidden',
                  poweredBy: 'hidden',
                },
                layout: {
                  socialButtonsPlacement: 'top',
                  socialButtonsVariant: 'blockButton',
                  showOptionalFields: false,
                },
              }}
              signInUrl="/auth"
              forceRedirectUrl="/dashboard"
            />
          )}
        </div>

      </div>
    </div>
  );
}
