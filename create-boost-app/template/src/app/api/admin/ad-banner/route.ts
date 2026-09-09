import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AdBanner from '@/models/AdBanner';

export async function GET() {
  try {
    await connectDB();
    let banner = await AdBanner.findOne().lean();
    if (!banner) {
      // Create initial default ad banner
      const created = await AdBanner.create({
        text: '🔥 Free Express Shipping on orders above ₹999 | Use Code: BOOSTFIRST',
        backgroundColor: '#4f46e5',
        textColor: '#ffffff',
        link: '/shop',
        isActive: true,
        showCloseButton: true,
      });
      banner = created.toObject();
    }

    return NextResponse.json({
      success: true,
      data: { ...banner, id: (banner as any)._id?.toString() },
    });
  } catch (error: any) {
    console.error('Error fetching admin ad banner:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch ad banner' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    let banner = await AdBanner.findOne();
    if (banner) {
      banner.text = body.text !== undefined ? body.text : banner.text;
      banner.backgroundColor = body.backgroundColor || banner.backgroundColor;
      banner.textColor = body.textColor || banner.textColor;
      banner.link = body.link !== undefined ? body.link : banner.link;
      banner.isActive = body.isActive !== undefined ? body.isActive : banner.isActive;
      banner.showCloseButton =
        body.showCloseButton !== undefined ? body.showCloseButton : banner.showCloseButton;
      await banner.save();
    } else {
      banner = await AdBanner.create(body);
    }

    return NextResponse.json({
      success: true,
      data: { ...banner.toObject(), id: banner._id.toString() },
    });
  } catch (error: any) {
    console.error('Error updating ad banner:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update ad banner' },
      { status: 500 }
    );
  }
}
