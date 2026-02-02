// This is a serverless function that will be deployed to handle API requests.
// It acts as a proxy to the LiraScope API to hide the source and handle CORS.

const API_URL = 'https://lirascope.syria-cloud.sy/api/v1/rates/latest';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req: Request) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const { searchParams } = url;
  const currencies = searchParams.get('currencies');
  const lang = searchParams.get('lang') || 'ar';

  try {
    const fetchUrl = `${API_URL}?lang=${lang}${currencies ? `&currencies=${currencies}` : '&currencies=USD,EUR,TRY'}`;
    const apiResponse = await fetch(fetchUrl);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      console.error(`LiraScope API error: ${apiResponse.status} ${apiResponse.statusText}`, errorText);
      throw new Error(`External API request failed with status ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    const responseData = {
      cbsRates: data.cbsRates || [],
      blackMarketRates: data.marketRates || [],
      timestampUtc: data.timestampUtc || new Date().toISOString(),
    };

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in /api/rates handler:', error);
    const errorResponse = {
      error: 'Failed to fetch rates.',
      details: error.message,
    };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}
