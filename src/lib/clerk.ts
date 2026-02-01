// Clerk configuration
export const CLERK_PUBLISHABLE_KEY = 'pk_live_Y2xlcmsuaGVmdGNvZGVyLmljdSQ';

// Validate the key exists
if (!CLERK_PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}
