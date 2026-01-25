import { createClient } from '@supabase/supabase-js';

// Support both Vite and Next.js environments
const getEnvVar = (viteKey: string, nextKey: string): string => {
  // Check Vite environment first (browser)
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[viteKey]) {
      return import.meta.env[viteKey];
    }
  } catch {
    // import.meta not available
  }
  
  // Check Next.js environment (server or with polyfill)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[nextKey]) {
      return process.env[nextKey] as string;
    }
  } catch {
    // process not available
  }
  
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
