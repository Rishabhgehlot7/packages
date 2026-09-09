import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Category from '@/models/Category';

export async function GET() {
  try {
    await connectDB();
    // Fetch all active categories that are not deleted
    const allCategories = await Category.find({
      isDeleted: { $ne: true },
      isActive: true,
    })
      .sort({ displayOrder: 1, name: 1 })
      .lean();

    // Group into parent categories and subcategories
    const parentCategories = allCategories.filter((c) => !c.parent);
    const subCategories = allCategories.filter((c) => !!c.parent);

    const tree = parentCategories.map((parent) => ({
      ...parent,
      id: parent._id.toString(),
      subcategories: subCategories
        .filter((sub) => sub.parent?.toString() === parent._id.toString())
        .map((sub) => ({
          ...sub,
          id: sub._id.toString(),
        })),
    }));

    return NextResponse.json({
      success: true,
      data: tree,
      all: allCategories.map((c) => ({ ...c, id: c._id.toString() })),
      total: allCategories.length,
      source: 'mongodb',
    });
  } catch (error: any) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
