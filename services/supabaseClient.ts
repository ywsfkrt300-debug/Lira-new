
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
    // This function sends tracking data to the 'track-event' Edge Function.
    // The full endpoint URL is: https://mewvdzovclfhezlemwjg.supabase.co/functions/v1/track-event
    
    // The previous implementation used 'Content-Type: text/plain' as a workaround for
    // potential CORS preflight issues. However, the error "Edge Function returned a non-2xx status code"
    // suggests the request is reaching the function but is being rejected, possibly due to an
    // incorrect Content-Type or body format.
    // We are now reverting to the standard method of invoking the function, passing the body as a
    // JavaScript object. The supabase-js client will automatically stringify it and set the
    // 'Content-Type' header to 'application/json', which is the expected format for most Edge Functions.
    const { error } = await supabase.functions.invoke('track-event', {
      body: { event_type: eventType },
    });
    
    if (error) {
      // Don't throw, but log as it's a non-critical background task.
      console.error(`Error invoking track-event function (${eventType}):`, error.message);
    }
  } catch (e: any) {
    console.error(`Exception during Supabase function invocation (${eventType}):`, e.message);
  }
};
