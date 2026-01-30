import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = 'https://mewvdzovclfhezlemwjg.supabase.co';
const LOCAL_STORAGE_KEY = 'LIRATNA_SUPABASE_ANON_KEY';

// The client instance, mutable so it can be re-initialized.
let supabase: SupabaseClient | null = null;

// Function to initialize the client. Can be called on startup and later if a new key is provided.
const initializeSupabase = (key: string | null | undefined): SupabaseClient | null => {
  if (key) {
    try {
      // Create and return a new client instance
      return createClient(supabaseUrl, key);
    } catch (error) {
      console.error("Failed to create Supabase client:", error);
      // Clear a potentially bad key from storage
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return null;
    }
  }
  return null;
};

// Use the provided publishable key as a fallback.
// This ensures the app works out-of-the-box, while still allowing overrides via localStorage or environment variables.
const hardcodedKey = 'sb_publishable_efzLvxV0Rf9GKpZKf4Jm6Q_4XVcX1xR';
const initialKey = (process.env as any).SUPABASE_ANON_KEY || localStorage.getItem(LOCAL_STORAGE_KEY) || hardcodedKey;
supabase = initializeSupabase(initialKey);

if (!supabase) {
  console.warn("Configuration Warning: Supabase key not found. Supabase-dependent features will be disabled.");
}

// Function to allow setting the key from the UI
export const setAndInitializeSupabase = (key: string): boolean => {
  if (!key || key.trim() === '') {
    console.error("Attempted to set an empty Supabase key.");
    return false;
  }
  const newClient = initializeSupabase(key);
  if (newClient) {
    localStorage.setItem(LOCAL_STORAGE_KEY, key);
    supabase = newClient; // Update the exported singleton
    console.log("Supabase client successfully initialized with new key.");
    return true;
  }
  return false;
};

export { supabase };

export const trackEvent = async (eventType: 'PAGE_VIEW' | 'CONVERSION_OP') => {
  if (!supabase) return; // Gracefully do nothing if supabase is not initialized.

  try {
    const { error } = await supabase.from('analytics').insert([{ event_type: eventType }]);
    
    if (error) {
      throw error;
    }
  } catch (e: any) {
    console.error(`Supabase analytics error (${eventType}):`, e.message);
  }
};