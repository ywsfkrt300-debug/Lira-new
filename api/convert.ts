// This is a serverless function to handle currency conversion logic.

const CONVERSION_RATE = 100; // 1 New = 100 Old

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const { searchParams } = url;
    const amountStr = searchParams.get('amount');
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!amountStr) {
      return new Response(JSON.stringify({ error: "Missing required parameter: amount" }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }
    if (!from || !['old', 'new'].includes(from)) {
      return new Response(JSON.stringify({ error: "Invalid 'from' parameter. Must be 'old' or 'new'." }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }
    if (!to || !['old', 'new'].includes(to)) {
      return new Response(JSON.stringify({ error: "Invalid 'to' parameter. Must be 'old' or 'new'." }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const amount = parseFloat(amountStr);
    if (isNaN(amount)) {
      return new Response(JSON.stringify({ error: "Invalid 'amount' parameter. Must be a number." }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    let result = amount;
    if (from === 'old' && to === 'new') {
      result = amount / CONVERSION_RATE;
    } else if (from === 'new' && to === 'old') {
      result = amount * CONVERSION_RATE;
    }

    const responseData = {
      input: { amount: amount, from: from },
      output: { amount: result, to: to },
      rate: CONVERSION_RATE,
    };
    
    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error('Error in /api/convert handler:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}
