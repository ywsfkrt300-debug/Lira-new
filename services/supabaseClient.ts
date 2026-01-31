
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = 'https://mewvdzovclfhezlemwjg.supabase.co';
// Public anonymous key for the Supabase project.
const supabaseAnonKey = 'sb_publishable_efzLvxV0Rf9GKpZKf4Jm6Q_4XVcX1xR';

let supabase: SupabaseClient | null = null;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL or anonymous key is missing.');
  }
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log("Supabase client initialized successfully.");
} catch (error) {
  console.error("Failed to create Supabase client:", error);
  supabase = null;
}

export { supabase };

export const trackEvent = async (eventType: 'PAGE_VIEW' | 'CONVERSION_OP') => {
  if (!supabase) {
    // Supabase client is not available, do not track.
    return;
  }
  try {
    // The RLS policy on the `analytics` table should allow anonymous inserts.
    const { error } = await supabase.from('analytics').insert([{ event_type: eventType }]);
    if (error) {
      // Silently fail to avoid disrupting user experience.
      // console.error('Error tracking event:', error.message);
    }
  } catch (e) {
     // Silently fail
     // console.error('Exception tracking event:', e);
  }
};