import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = 'https://mewvdzovclfhezlemwjg.supabase.co';
// The Supabase key is now hardcoded into the application as requested.
const supabaseAnonKey = 'sb_publishable_efzLvxV0Rf9GKpZKf4Jm6Q_4XVcX1xR';

let supabase: SupabaseClient | null = null;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or anonymous key is missing.');
  }
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("Supabase client initialized with hardcoded key.");
} catch (error) {
  console.error("Failed to create Supabase client:", error);
  supabase = null;
}

export { supabase };

// The concept of a "fallback key" is no longer relevant. This export is removed.
// export const usingFallbackKey = false;

export const trackEvent = async (eventType: 'PAGE_VIEW' | 'CONVERSION_OP') => {
  if (!supabase) {
    console.warn(`Supabase client not available, skipping trackEvent for '${eventType}'.`);
    return;
  }

  try {
    const { error } = await supabase.from('analytics').insert([{ event_type: eventType }]);
    
    if (error) {
      // Don't throw, but log as it's a non-critical background task.
      console.error(`Supabase analytics error (${eventType}):`, error.message);
    }
  } catch (e: any) {
    console.error(`Exception during Supabase analytics call (${eventType}):`, e.message);
  }
};