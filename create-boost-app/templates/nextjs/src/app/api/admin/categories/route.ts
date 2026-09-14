import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Category from '@/models/Category';

// GET all categories and subcategories for admin console
export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({ isDeleted: { $ne: true } })
      .populate('parent', 'name slug')
      .sort({ displayOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: categories.map((c) => ({
        ...c,
        id: c._id.toString(),
      })),
      total: categories.length,
    });
  } catch (error: any) {
    console.error('Error fetching admin categories:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST: Create a new category or subcategory
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Category name is required' },
        { status: 400 }
      );
    }

    const slug =
      body.slug ||
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newCategory = await Category.create({
      name: body.name,
      slug,
      image: body.image || '',
      description: body.description || '',
      parent: body.parent || null,
      parents: body.parent ? [body.parent] : [],
      displayOrder: Number(body.displayOrder) || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
      isDeleted: false,
    });

    return NextResponse.json(
      {
        success: true,
        data: { ...newCategory.toObject(), id: newCategory._id.toString() },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}

// PATCH / PUT: Update category
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    if (updates.parent === '') {
      updates.parent = null;
      updates.parents = [];
    } else if (updates.parent) {
      updates.parents = [updates.parent];
    }

    const updated = await Category.findByIdAndUpdate(id, updates, { new: true });
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { ...updated.toObject(), id: updated._id.toString() },
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE: Soft delete category
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Soft delete
    await Category.findByIdAndUpdate(id, { isDeleted: true, isActive: false });

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
}
