
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

  const trackUrl = `${supabaseUrl}/functions/v1/track-event`;

  try {
    // The error "401 - Missing authorization header" clearly indicates the 'Authorization' header is required.
    // While the `apikey` header is needed for the Supabase gateway, the function itself requires the
    // standard `Authorization: Bearer <token>` header. For anonymous calls, the token is the anon key.
    // We are adding both headers to ensure the request is properly authenticated at all levels.
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
      // The response.statusText and body might give more insight into the error.
      const errorText = await response.text();
      throw new Error(`Edge Function returned a non-2xx status code: ${response.status} ${response.statusText} - ${errorText}`);
    }
  } catch (e: any) {
    // This will catch both fetch network errors and the non-ok response error thrown above.
    console.error(`Error invoking track-event function (${eventType}):`, e.message);
  }
};
