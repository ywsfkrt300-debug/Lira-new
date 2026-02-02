import { RatesResponse } from '../types';

const API_URL = 'https://lirascope.syria-cloud.sy/api/v1/rates/latest';

export const fetchLatestRates = async (lang: string = 'ar'): Promise<RatesResponse> => {
  try {
    const url = `${API_URL}?lang=${lang}&currencies=USD,EUR,TRY`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Adapt the external API response to our internal RatesResponse structure
    const transformedData: RatesResponse = {
      cbsRates: data.cbsRates || [],
      blackMarketRates: data.marketRates || [], // The external API uses 'marketRates'
      timestampUtc: data.timestampUtc || new Date().toISOString(),
    };

    if (data.error) {
        throw new Error(data.error);
    }
    return transformedData;

  } catch (error) {
    console.error('Error fetching rates directly from LiraScope API:', error);
    return {
      cbsRates: [],
      blackMarketRates: [],
      timestampUtc: new Date().toISOString(),
      error: 'Failed to fetch rates from external source.',
    };
  }
};
