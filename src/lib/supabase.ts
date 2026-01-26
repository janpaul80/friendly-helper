import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Lovable Cloud Supabase project configuration
// These values are from the Cloud project info
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ythuhewbaulqirjrkgly.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0aHVoZXdiYXVscWlyanJrZ2x5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzOTkwMDgsImV4cCI6MjA4NDk3NTAwOH0.lbkprUMf_qkyzQOBqSOboipowjA0K8HZ2yaPglwe8MI";

// Create and export the Supabase client with fallback values
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
