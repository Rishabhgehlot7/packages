import { NextResponse } from 'next/server';
import { db } from '@/data/db';
import { StoreProduct } from '@/data/products';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('q')?.toLowerCase();

    let products = db.getProducts();

    if (category && category !== 'All') {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (query) {
      products = products.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({ success: true, count: products.length, data: products });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Title and price are required.' },
        { status: 400 }
      );
    }

    const newProduct: StoreProduct = {
      id: body.id || `prod_${Date.now()}`,
      title: body.title,
      description: body.description || '',
      price: Number(body.price),
      compareAtPrice: Number(body.compareAtPrice || body.price),
      brand: body.brand || 'Boost Brand',
      category: body.category || 'General',
      tags: Array.isArray(body.tags) ? body.tags : (body.tags ? body.tags.split(',').map((t: string) => t.trim()) : []),
      images: Array.isArray(body.images) && body.images.length > 0 ? body.images : [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
      ],
      inStock: body.inStock ?? true,
      hsnCode: body.hsnCode || '6109',
      taxRate: Number(body.taxRate || 18),
      sku: body.sku || `SKU-${Date.now().toString().slice(-6)}`,
      rating: body.rating || { value: 5.0, count: 1 },
      variants: body.variants || [],
      reviews: body.reviews || [],
    };

    const saved = db.addProduct(newProduct);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
