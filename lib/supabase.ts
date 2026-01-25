import { createClient } from '@supabase/supabase-js';

// Support both Vite and Next.js environments
const getEnvVar = (viteKey: string, nextKey: string, fallbackKey?: string): string => {
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
    if (typeof process !== 'undefined' && process.env) {
      return (process.env[nextKey] || (fallbackKey ? process.env[fallbackKey] : '')) as string;
    }
  } catch {
    // process not available
  }
  
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_PUBLISHABLE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const createServiceClient = () => {
  // Service client is only for server-side use
  try {
    if (typeof process !== 'undefined' && process.env?.SUPABASE_SERVICE_ROLE_KEY) {
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
      return createClient(supabaseUrl, serviceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
    }
  } catch {
    // process not available
  }
  console.warn('createServiceClient should only be called server-side');
  return supabase; // Fallback to regular client
};
