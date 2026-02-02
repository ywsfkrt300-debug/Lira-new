// This is a serverless function to handle electricity bill calculations.

// --- START: Copied from frontend types.ts and constants.tsx ---
type Language = 'ar' | 'en';

interface ElectricityTier {
  limit: number | null;
  price: number;
}

interface ElectricityTariff {
  id: string;
  name: { [key in Language]: string };
  type: 'tiered' | 'flat';
  tiers?: ElectricityTier[];
  rate?: number;
}

const ELECTRICITY_TARIFFS: ElectricityTariff[] = [
  {
    id: 'household',
    name: { ar: 'منزلي (دورة واحدة)', en: 'Household' },
    type: 'tiered',
    tiers: [
      { limit: 300, price: 600 },
      { limit: null, price: 1400 }, // null limit means "and above"
    ]
  },
  { id: 'commercial', name: { ar: 'تجاري وحرفي', en: 'Commercial' }, type: 'flat', rate: 1400 },
  { id: 'billboards', name: { ar: 'لوحات إعلان', en: 'Billboards' }, type: 'flat', rate: 1800 },
  { id: 'charity', name: { ar: 'جمعيات خيرية', en: 'Charities' }, type: 'flat', rate: 1400 },
  { id: 'worship', name: { ar: 'دور عبادة', en: 'Places of Worship' }, type: 'flat', rate: 1400 },
  { id: 'tourism', name: { ar: 'سياحي وفنادق', en: 'Tourism' }, type: 'flat', rate: 1400 },
  { id: 'research', name: { ar: 'بحوث علمية', en: 'Scientific Research' }, type: 'flat', rate: 1400 },
  { id: 'official', name: { ar: 'دوائر رسمية', en: 'Official Depts.' }, type: 'flat', rate: 1400 },
  { id: 'public_lighting', name: { ar: 'إنارة عامة', en: 'Public Lighting' }, type: 'flat', rate: 1400 },
  { id: 'public_hospital', name: { ar: 'مشفى عام', en: 'Public Hospital' }, type: 'flat', rate: 1400 },
  { id: 'industrial', name: { ar: 'صناعي', en: 'Industrial' }, type: 'flat', rate: 1400 },
  { id: 'agricultural', name: { ar: 'زراعي وري', en: 'Agricultural' }, type: 'flat', rate: 1400 },
];
// --- END: Copied types and constants ---


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
    const consumptionStr = searchParams.get('consumption');
    const tariffId = searchParams.get('tariffId');

    if (!consumptionStr) {
      return new Response(JSON.stringify({ error: "Missing required parameter: consumption" }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }
    if (!tariffId) {
        return new Response(JSON.stringify({ error: "Missing required parameter: tariffId" }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const consumption = parseFloat(consumptionStr);
    if (isNaN(consumption) || consumption < 0) {
      return new Response(JSON.stringify({ error: "Invalid 'consumption' parameter. Must be a non-negative number." }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    const selectedTariff = ELECTRICITY_TARIFFS.find(tariff => tariff.id === tariffId);
    if (!selectedTariff) {
        return new Response(JSON.stringify({ error: `Invalid 'tariffId' parameter. Valid IDs are: ${ELECTRICITY_TARIFFS.map(t => t.id).join(', ')}` }), { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }

    // Calculation Logic (copied and adapted from ElectricityCalculator.tsx)
    const result: { total: number; breakdown: any[] } = { total: 0, breakdown: [] };

    if (selectedTariff.type === 'flat' && selectedTariff.rate) {
        result.total = consumption * selectedTariff.rate;
        result.breakdown.push({
            tier: `استهلاك`, // "Consumption"
            consumption: consumption,
            rate: selectedTariff.rate,
            cost: result.total,
        });
    } else if (selectedTariff.type === 'tiered' && selectedTariff.tiers) {
        let remainingCons = consumption;
        let lastLimit = 0;

        for (let i = 0; i < selectedTariff.tiers.length; i++) {
            const tier = selectedTariff.tiers[i];
            const tierLimit = tier.limit === null ? Infinity : tier.limit;
            
            const consumptionInTier = Math.min(remainingCons, tierLimit - lastLimit);
            
            if (consumptionInTier > 0) {
                const cost = consumptionInTier * tier.price;
                result.total += cost;
                result.breakdown.push({
                    tier: `الشريحة ${i + 1}`, // "Tier X"
                    consumption: consumptionInTier,
                    rate: tier.price,
                    cost: cost,
                });
                remainingCons -= consumptionInTier;
                lastLimit = tierLimit;
            }

            if (remainingCons <= 0) break;
        }
    }
    
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Error in /api/electricity handler:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.', details: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  }
}
