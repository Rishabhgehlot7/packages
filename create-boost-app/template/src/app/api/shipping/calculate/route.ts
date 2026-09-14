import { NextRequest, NextResponse } from 'next/server';
import { getCityFromPincode } from '@/lib/geo';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pincode, subtotal = 0, isCod = false } = body;

    if (!pincode || typeof pincode !== 'string' || pincode.trim().length < 6) {
      return NextResponse.json(
        { success: false, error: 'Valid 6-digit Indian pincode is required' },
        { status: 400 }
      );
    }

    const cleanPin = pincode.trim();
    const geo = getCityFromPincode(cleanPin);

    // Dynamic Delivery Estimation based on Metro vs Non-Metro
    const metroPrefixes = ['11', '40', '41', '56', '50', '60', '70', '38', '12', '20'];
    const isMetro = metroPrefixes.some((prefix) => cleanPin.startsWith(prefix));

    const standardDays = isMetro ? 2 : 4;
    const expressDays = isMetro ? 1 : 2;

    const now = new Date();
    const standardDate = new Date(now.getTime() + standardDays * 24 * 60 * 60 * 1000);
    const expressDate = new Date(now.getTime() + expressDays * 24 * 60 * 60 * 1000);

    const formatDate = (d: Date) =>
      d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

    const isFreeShipping = subtotal >= 999;
    const standardRate = isFreeShipping ? 0 : 79;
    const expressRate = 129;

    // Smart RTO Fraud Detection heuristic
    const highRiskPrefixes = ['78', '79', '85']; // remote zones example
    const rtoRisk: 'low' | 'medium' | 'high' = highRiskPrefixes.some((p) => cleanPin.startsWith(p))
      ? 'medium'
      : 'low';

    return NextResponse.json({
      success: true,
      data: {
        pincode: cleanPin,
        city: geo.city,
        state: geo.state,
        isServiceable: true,
        codAvailable: true,
        rtoRisk,
        rates: {
          standard: {
            carrier: 'Shiprocket / Delhivery Surface',
            rate: standardRate,
            days: standardDays,
            deliveryDate: formatDate(standardDate),
            isFree: isFreeShipping,
          },
          express: {
            carrier: 'Bluedart / Delhivery Air',
            rate: expressRate,
            days: expressDays,
            deliveryDate: formatDate(expressDate),
            isFree: false,
          },
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Shipping calculation failed' },
      { status: 500 }
    );
  }
}
