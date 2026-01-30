import { RatesResponse } from '../types';

const API_URL = 'https://lirascope.syria-cloud.sy/api/v1/rates/latest';

export const fetchLatestRates = async (lang: string = 'ar'): Promise<RatesResponse> => {
  try {
    const url = `${API_URL}?currencies=USD,EUR,TRY&lang=${lang}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    
    const data = await response.json();

    return {
      cbsRates: data.cbsRates || [],
      blackMarketRates: data.marketRates || [],
      timestampUtc: data.timestampUtc || new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching rates from LiraScope API:', error);
    return {
      cbsRates: [],
      blackMarketRates: [],
      timestampUtc: new Date().toISOString(),
      error: 'Failed to fetch rates. This might be a network or CORS issue.',
    };
  }
};