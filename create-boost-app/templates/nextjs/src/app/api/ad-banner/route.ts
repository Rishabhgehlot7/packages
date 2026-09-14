import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AdBanner from '@/models/AdBanner';

export async function GET() {
  try {
    await connectDB();
    const banner = await AdBanner.findOne({ isActive: true }).lean();
    return NextResponse.json({
      success: true,
      data: banner ? { ...banner, id: banner._id.toString() } : null,
    });
  } catch (error: any) {
    console.error('Error fetching ad banner:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch ad banner' },
      { status: 500 }
    );
  }
}
