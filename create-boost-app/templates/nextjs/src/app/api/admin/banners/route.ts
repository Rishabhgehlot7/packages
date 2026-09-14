import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Banner from '@/models/Banner';

// GET all banners for admin console
export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find({ isDeleted: { $ne: true } })
      .sort({ desktopOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: banners.map((b) => ({
        ...b,
        id: b._id.toString(),
        desktopImage: b.desktopImage || b.image,
        mobileImage: b.mobileImage || b.desktopImage || b.image,
      })),
      total: banners.length,
    });
  } catch (error: any) {
    console.error('Error fetching admin banners:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch banners' },
      { status: 500 }
    );
  }
}

// POST: Create a new banner
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const newBanner = await Banner.create({
      title: body.title || '',
      desktopImage: body.desktopImage || '',
      mobileImage: body.mobileImage || body.desktopImage || '',
      desktopOrder: Number(body.desktopOrder) || 0,
      mobileOrder: Number(body.mobileOrder) || 0,
      link: body.link || '/shop',
      buttonText: body.buttonText || 'Shop Now',
      isActive: body.isActive !== undefined ? body.isActive : true,
      isDeleted: false,
      orientation: body.orientation || 'landscape',
      titleColor: body.titleColor || '#ffffff',
      isHeroBanner: !!body.isHeroBanner,
      isNewArrival: !!body.isNewArrival,
    });

    return NextResponse.json(
      {
        success: true,
        data: { ...newBanner.toObject(), id: newBanner._id.toString() },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create banner' },
      { status: 500 }
    );
  }
}

// PATCH: Update banner status or fields
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    const updated = await Banner.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Banner not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { ...updated.toObject(), id: updated._id.toString() },
    });
  } catch (error: any) {
    console.error('Error updating banner:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update banner' },
      { status: 500 }
    );
  }
}

// DELETE: Soft delete banner
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Banner ID is required' },
        { status: 400 }
      );
    }

    await Banner.findByIdAndUpdate(id, { isDeleted: true, isActive: false });

    return NextResponse.json({
      success: true,
      message: 'Banner removed successfully',
    });
  } catch (error: any) {
    console.error('Error deleting banner:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete banner' },
      { status: 500 }
    );
  }
}
