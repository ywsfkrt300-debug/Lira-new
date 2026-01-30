import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = 'https://mewvdzovclfhezlemwjg.supabase.co';
const LOCAL_STORAGE_KEY = 'LIRATNA_SUPABASE_ANON_KEY';
const FALLBACK_ANON_KEY = 'sb_publishable_efzLvxV0Rf9GKpZKf4Jm6Q_4XVcX1xR';

let supabase: SupabaseClient | null = null;
let usingFallbackKey = false;

const initializeSupabase = (key: string | null | undefined): SupabaseClient | null => {
  if (key) {
    try {
      return createClient(supabaseUrl, key);
    } catch (error) {
      console.error("Failed to create Supabase client:", error);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      return null;
    }
  }
  return null;
};

let keyToUse = localStorage.getItem(LOCAL_STORAGE_KEY);

if (!keyToUse) {
  keyToUse = FALLBACK_ANON_KEY;
  usingFallbackKey = true;
  console.log("Using fallback Supabase key.");
} else {
  console.log("Using Supabase key from localStorage.");
}

supabase = initializeSupabase(keyToUse);

if (!supabase) {
  console.warn("Configuration Warning: Supabase key not found or invalid. Supabase-dependent features will be disabled.");
}

export const setAndInitializeSupabase = (key: string): boolean => {
  if (!key || key.trim() === '') {
    console.error("Attempted to set an empty Supabase key.");
    return false;
  }
  const newClient = initializeSupabase(key);
  if (newClient) {
    localStorage.setItem(LOCAL_STORAGE_KEY, key);
    supabase = newClient;
    usingFallbackKey = false; // User has set their own key now
    console.log("Supabase client successfully initialized with new key.");
    return true;
  }
  return false;
};

export { supabase, usingFallbackKey };

export const trackEvent = async (eventType: 'PAGE_VIEW' | 'CONVERSION_OP') => {
  if (!supabase) return;

  try {
    const { error } = await supabase.from('analytics').insert([{ event_type: eventType }]);
    
    if (error) {
      throw error;
    }
  } catch (e: any) {
    console.error(`Supabase analytics error (${eventType}):`, e.message);
  }
};