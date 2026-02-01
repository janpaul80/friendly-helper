import { createClient } from '@supabase/supabase-js';
import type { Database } from '../integrations/supabase/types';

// Supabase configuration with fallbacks for when env vars aren't available
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://pmgqviuvrliqkipfntsn.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtZ3F2aXV2cmxpcWtpcGZudHNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NTUzODYsImV4cCI6MjA4NTUzMTM4Nn0.BNRO7W200PUHRZyUTzDbBWwKrwwMidH25XhpN5PaBEk';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
