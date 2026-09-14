import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Banner from '@/models/Banner';

export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find({
      isActive: true,
      isDeleted: { $ne: true },
    })
      .sort({ desktopOrder: 1, createdAt: -1 })
      .lean();

    const heroBanners = banners.filter((b) => b.isHeroBanner);
    const promotionalBanners = banners.filter((b) => !b.isHeroBanner);

    return NextResponse.json({
      success: true,
      data: banners.map((b) => ({
        ...b,
        id: b._id.toString(),
        desktopImage: b.desktopImage || b.image,
        mobileImage: b.mobileImage || b.desktopImage || b.image,
      })),
      hero: heroBanners.map((b) => ({
        ...b,
        id: b._id.toString(),
        desktopImage: b.desktopImage || b.image,
        mobileImage: b.mobileImage || b.desktopImage || b.image,
      })),
      promotional: promotionalBanners.map((b) => ({
        ...b,
        id: b._id.toString(),
        desktopImage: b.desktopImage || b.image,
        mobileImage: b.mobileImage || b.desktopImage || b.image,
      })),
      total: banners.length,
      source: 'mongodb',
    });
  } catch (error: any) {
    console.error('Error fetching public banners:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}
