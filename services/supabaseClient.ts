
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = 'https://mewvdzovclfhezlemwjg.supabase.co';
// This is the correct, public anonymous key for the Supabase project.
// The previous key was incorrect and caused connection failures.
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
    console.warn(`Supabase client not available, skipping trackEvent for '${eventType}'.`);
    return;
  }

  const trackUrl = `${supabaseUrl}/functions/v1/track-event`;

  try {
    // Both 'apikey' and 'Authorization' headers are required. 'apikey' is for the Supabase gateway,
    // and 'Authorization' is for the Edge Function itself. For anonymous users, the token is the anon key.
    const response = await fetch(trackUrl, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ event_type: eventType })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Edge Function returned a non-2xx status code: ${response.status} ${response.statusText} - ${errorText}`);
    }
  } catch (e: any) {
    console.error(`Error invoking track-event function (${eventType}):`, e.message);
  }
};