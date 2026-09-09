import { NextResponse } from 'next/server';
import { db } from '@/data/db';

export async function GET() {
  try {
    const stats = db.getStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
