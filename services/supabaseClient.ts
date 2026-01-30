
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const supabaseUrl = 'https://mewvdzovclfhezlemwjg.supabase.co';
// This is the correct, public anonymous key for the Supabase project.
// The previous key was incorrect and has now been fixed to ensure analytics work correctly.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ld3Zkem92Y2xmaGV6bGVtd2pnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTI2MDM2NjUsImV4cCI6MjAyODE3OTY2NX0.Hl24skkn22EM1j-jwf28oADr2T5-WViFk32L9e1dxpM';

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

/**
 * Gets user's geographical coordinates using the browser's Geolocation API.
 * Returns a promise that resolves with the coordinates or null if permission is
 * denied, the API is not supported, or it times out.
 */
const getUserCoordinates = (): Promise<{ latitude: number; longitude: number } | null> => {
  return new Promise((resolve) => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          // Error or permission denied
          resolve(null);
        },
        // Options: low accuracy, 5s timeout, cache for 30 mins to reduce requests
        { enableHighAccuracy: false, timeout: 5000, maximumAge: 1000 * 60 * 30 }
      );
    } else {
      // Geolocation not supported by the browser
      resolve(null);
    }
  });
};


export const trackEvent = async (eventType: 'PAGE_VIEW' | 'CONVERSION_OP') => {
  if (!supabase) {
    console.warn(`Supabase client not available, skipping trackEvent for '${eventType}'.`);
    return;
  }
  
  // Attempt to get user location. This will prompt for permission if not already granted.
  const coordinates = await getUserCoordinates();

  const trackUrl = `${supabaseUrl}/functions/v1/track-event`;

  try {
    const payload: { event_type: string; coordinates?: { latitude: number; longitude: number } } = {
        event_type: eventType
    };

    if (coordinates) {
        payload.coordinates = coordinates;
    }

    // Both 'apikey' and 'Authorization' headers are required. 'apikey' is for the Supabase gateway,
    // and 'Authorization' is for the Edge Function itself. For anonymous users, the token is the anon key.
    const response = await fetch(trackUrl, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Edge Function returned a non-2xx status code: ${response.status} ${response.statusText} - ${errorText}`);
    }
  } catch (e: any) {
    console.error(`Error invoking track-event function (${eventType}):`, e.message);
  }
};