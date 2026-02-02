import { RatesResponse } from '../types';

const API_URL = '/api/rates'; // Use our own API endpoint

export const fetchLatestRates = async (lang: string = 'ar'): Promise<RatesResponse> => {
  try {
    // Currencies are now handled by the API by default if not specified
    const url = `${API_URL}?lang=${lang}`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    
    // The response from our API already matches the RatesResponse structure
    const data: RatesResponse = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;

  } catch (error) {
    console.error('Error fetching rates from internal API:', error);
    return {
      cbsRates: [],
      blackMarketRates: [],
      timestampUtc: new Date().toISOString(),
      error: 'Failed to fetch rates from internal API.',
    };
  }
};
