
import { RatesResponse, Language, ExchangeRate } from '../types';

const API_URL = 'https://lirascope.syria-cloud.sy/api/v1/rates/latest';

const currencyNames: Record<string, { ar: string, en: string }> = {
    'USD': { ar: 'الدولار الأمريكي', en: 'US Dollar' },
    'EUR': { ar: 'اليورو', en: 'Euro' },
    'TRY': { ar: 'الليرة التركية', en: 'Turkish Lira' },
};

const transformRates = (rates: any[], lang: Language): ExchangeRate[] => {
    if (!rates || !Array.isArray(rates)) return [];
    
    // The API returns currency codes (e.g., 'USD'). This maps them to full names.
    return rates.map(rate => ({
        ...rate,
        currency: lang === 'ar' 
            ? (currencyNames[rate.currency]?.ar || rate.currency) 
            : (currencyNames[rate.currency]?.en || rate.currency)
    }));
};

export const fetchLatestRates = async (lang: Language = 'ar'): Promise<RatesResponse> => {
  try {
    // Fetch rates specifically for US Dollar, Euro, and Turkish Lira as requested.
    const url = `${API_URL}?lang=${lang}&currencies=USD,EUR,TRY`;
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    
    const data = await response.json();

    if (data.error) {
        throw new Error(data.error);
    }
    
    const transformedData: RatesResponse = {
      cbsRates: transformRates(data.cbsRates, lang),
      blackMarketRates: transformRates(data.marketRates, lang), // External API uses 'marketRates'
      timestampUtc: data.timestampUtc || new Date().toISOString(),
    };

    return transformedData;

  } catch (error) {
    console.error('Error fetching and transforming rates:', error);
    return {
      cbsRates: [],
      blackMarketRates: [],
      timestampUtc: new Date().toISOString(),
      error: 'Failed to fetch rates from external source.',
    };
  }
};
