import { useUser, useAuth } from '@clerk/clerk-react';

/**
 * Custom hook that provides Clerk user data in a format compatible with 
 * the existing codebase that was using Supabase auth
 */
export function useClerkUser() {
  const { user, isLoaded: userLoaded } = useUser();
  const { isLoaded: authLoaded, isSignedIn, signOut } = useAuth();

  const isLoaded = userLoaded && authLoaded;

  // Transform Clerk user to match Supabase user shape for compatibility
  const transformedUser = user ? {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress || '',
    user_metadata: {
      full_name: user.fullName,
      avatar_url: user.imageUrl,
    },
    created_at: user.createdAt?.toISOString() || '',
  } : null;

  return {
    user: transformedUser,
    isLoaded,
    isSignedIn: isSignedIn ?? false,
    signOut,
    // Original Clerk user for full access
    clerkUser: user,
  };
}
