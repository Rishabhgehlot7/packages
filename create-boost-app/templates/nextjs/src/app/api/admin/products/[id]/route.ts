import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import { db } from '@/data/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check MongoDB first
    try {
      const conn = await dbConnect();
      if (conn && Product) {
        const mongoProd = await Product.findOne({ id }).lean();
        if (mongoProd) {
          return NextResponse.json({ success: true, source: 'mongodb', data: mongoProd });
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB single product fetch error:', dbErr);
    }

    // In-memory fallback
    const product = db.getProductById(id);
    if (!product) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, source: 'in-memory', data: product });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error fetching product' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Update in MongoDB
    try {
      const conn = await dbConnect();
      if (conn && Product) {
        await Product.findOneAndUpdate({ id }, body, { new: true });
      }
    } catch (dbErr) {
      console.warn('MongoDB product PUT error:', dbErr);
    }

    const updated = db.updateProduct(id, body);
    return NextResponse.json({ success: true, data: updated || { id, ...body } });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error updating product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete from MongoDB
    try {
      const conn = await dbConnect();
      if (conn && Product) {
        await Product.deleteOne({ id });
      }
    } catch (dbErr) {
      console.warn('MongoDB product DELETE error:', dbErr);
    }

    const success = db.deleteProduct(id);
    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error deleting product' },
      { status: 500 }
    );
  }
}

