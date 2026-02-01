import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Zap } from 'lucide-react';
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

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 bg-orange-600 rounded-lg flex items-center justify-center text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]">
            <Zap size={24} fill="currentColor" />
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">HeftCoder</span>
        </div>

        {/* Clerk Component */}
        <div className="clerk-container">
          {mode === 'sign-in' ? (
            <SignIn
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-xl p-6',
                  headerTitle: 'text-white text-xl font-semibold text-center',
                  headerSubtitle: 'text-gray-400 text-sm text-center',
                  socialButtonsBlockButton: 'bg-[#2a2a3e] border border-white/10 text-white hover:bg-[#3a3a4e] transition-colors rounded-lg py-2.5',
                  socialButtonsBlockButtonText: 'text-white font-medium text-sm',
                  socialButtonsProviderIcon: 'w-5 h-5',
                  dividerLine: 'bg-white/10',
                  dividerText: 'text-gray-500 text-sm',
                  formFieldLabel: 'text-white text-sm font-medium',
                  formFieldInput: 'bg-[#2a2a3e] border border-white/10 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-violet-500 rounded-lg py-2.5',
                  formButtonPrimary: 'bg-violet-600 hover:bg-violet-700 text-white font-medium transition-all rounded-lg py-2.5 normal-case',
                  footerActionLink: 'text-violet-400 hover:text-violet-300',
                  identityPreviewEditButton: 'text-violet-400',
                  formFieldInputShowPasswordButton: 'text-gray-400 hover:text-white',
                  otpCodeFieldInput: 'bg-[#2a2a3e] border border-white/10 text-white',
                  alert: 'bg-red-500/10 border border-red-500/20 text-red-400',
                  alertText: 'text-red-400',
                  footer: 'hidden',
                },
                layout: {
                  socialButtonsPlacement: 'top',
                  socialButtonsVariant: 'blockButton',
                },
              }}
              signUpUrl="/signup"
              forceRedirectUrl="/dashboard"
            />
          ) : (
            <SignUp
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  card: 'bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-xl p-6',
                  headerTitle: 'text-white text-xl font-semibold text-center',
                  headerSubtitle: 'text-gray-400 text-sm text-center',
                  socialButtonsBlockButton: 'bg-[#2a2a3e] border border-white/10 text-white hover:bg-[#3a3a4e] transition-colors rounded-lg py-2.5',
                  socialButtonsBlockButtonText: 'text-white font-medium text-sm',
                  socialButtonsProviderIcon: 'w-5 h-5',
                  dividerLine: 'bg-white/10',
                  dividerText: 'text-gray-500 text-sm',
                  formFieldLabel: 'text-white text-sm font-medium',
                  formFieldInput: 'bg-[#2a2a3e] border border-white/10 text-white placeholder-gray-500 focus:border-violet-500 focus:ring-violet-500 rounded-lg py-2.5',
                  formButtonPrimary: 'bg-violet-600 hover:bg-violet-700 text-white font-medium transition-all rounded-lg py-2.5 normal-case',
                  footerActionLink: 'text-violet-400 hover:text-violet-300',
                  identityPreviewEditButton: 'text-violet-400',
                  formFieldInputShowPasswordButton: 'text-gray-400 hover:text-white',
                  otpCodeFieldInput: 'bg-[#2a2a3e] border border-white/10 text-white',
                  alert: 'bg-red-500/10 border border-red-500/20 text-red-400',
                  alertText: 'text-red-400',
                  footer: 'hidden',
                },
                layout: {
                  socialButtonsPlacement: 'top',
                  socialButtonsVariant: 'blockButton',
                },
              }}
              signInUrl="/auth"
              forceRedirectUrl="/dashboard"
            />
          )}
        </div>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              if (mode === 'sign-in') {
                navigate('/signup');
              } else {
                navigate('/auth');
              }
            }}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            {mode === 'sign-in'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
