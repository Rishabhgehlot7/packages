import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { db } from '@/data/db';
import { StoreProduct, PRODUCTS as INITIAL_PRODUCTS } from '@/data/products';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const query = searchParams.get('q')?.toLowerCase();

    // Try MongoDB first
    try {
      const conn = await dbConnect();
      if (conn && Product) {
        // Auto-seed if empty
        const count = await Product.countDocuments();
        if (count === 0) {
          console.log('🌱 Seeding initial products into MongoDB...');
          await Product.insertMany(
            INITIAL_PRODUCTS.map((p) => ({
              ...p,
              tags: p.tags || [],
              images: p.images || [],
              variants: p.variants || [],
              reviews: p.reviews || [],
            }))
          );
        }

        const filter: Record<string, any> = {};
        if (category && category !== 'All') {
          filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }
        if (query) {
          filter.$or = [
            { title: { $regex: query, $options: 'i' } },
            { name: { $regex: query, $options: 'i' } },
            { brand: { $regex: query, $options: 'i' } },
            { tags: { $in: [new RegExp(query, 'i')] } },
          ];
        }

        const mongoProducts = await Product.find(filter).sort({ createdAt: -1 }).lean();
        let catMap = new Map<string, string>();
        try {
          const allCats = await Category.find({}).lean();
          allCats.forEach((c: any) => {
            if (c._id && c.name) {
              catMap.set(c._id.toString(), c.name);
            }
          });
        } catch (catErr) {
          // ignore
        }

        const normalized = mongoProducts.map((p: any) => {
          let categoryName = p.category;
          if (typeof p.category === 'object' && p.category?.name) {
            categoryName = p.category.name;
          } else if (p.category && catMap.has(p.category.toString())) {
            categoryName = catMap.get(p.category.toString());
          }

          return {
            ...p,
            id: p.id || p._id?.toString(),
            title: p.title || p.name || 'Untitled Product',
            name: p.name || p.title || 'Untitled Product',
            category: categoryName || 'General',
            price: p.salePrice || p.price || 0,
            compareAtPrice: p.compareAtPrice || (p.salePrice ? p.price : 0),
            images: (p.images && p.images.length > 0) ? p.images : (p.media?.map((m: any) => m.url) || []),
            variants: p.variants?.map((v: any) => ({
              ...v,
              id: v.id || v.sku,
              title: v.title || v.name || v.options?.map((o: any) => o.value).join(' / ') || v.sku,
              name: v.name || v.title || v.sku,
              price: v.salePrice || v.price,
              compareAtPrice: v.compareAtPrice || (v.salePrice ? v.price : 0),
              images: v.images || [],
            })) || [],
          };
        });
        if (mongoProducts && mongoProducts.length > 0) {
          return NextResponse.json({
            success: true,
            source: 'mongodb',
            count: normalized.length,
            data: normalized,
          });
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB query bypassed, using in-memory store:', dbErr);
    }

    // In-memory fallback
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

    return NextResponse.json({
      success: true,
      source: 'in-memory',
      count: products.length,
      data: products,
    });
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

    const title = body.title || body.name;
    const price = Number(body.price || body.salePrice);

    if (!title || !price) {
      return NextResponse.json(
        { success: false, error: 'Title (or Name) and price are required.' },
        { status: 400 }
      );
    }

    const images =
      Array.isArray(body.images) && body.images.length > 0
        ? body.images
        : Array.isArray(body.media) && body.media.length > 0
        ? body.media.map((m: any) => m.url)
        : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'];

    const newProduct: StoreProduct = {
      id: body.id || `prod_${Date.now()}`,
      title,
      name: title,
      description: body.description || '',
      price,
      salePrice: body.salePrice ? Number(body.salePrice) : undefined,
      compareAtPrice: Number(body.compareAtPrice || (body.salePrice ? price : price)),
      brand: body.brand || 'Boost Brand',
      category: body.category || 'General',
      tags: Array.isArray(body.tags)
        ? body.tags
        : body.tags
        ? body.tags.split(',').map((t: string) => t.trim())
        : [],
      images,
      media: Array.isArray(body.media) && body.media.length > 0 ? body.media : images.map((url: string) => ({ type: 'image', url })),
      inStock: body.inStock ?? true,
      hsnCode: body.hsnCode || '6109',
      taxRate: Number(body.taxRate || 18),
      gstRate: Number(body.gstRate || body.taxRate || 18),
      sku: body.sku || `SKU-${Date.now().toString().slice(-6)}`,
      rating: body.rating || { value: 5.0, count: 1 },
      variants: body.variants || [],
      reviews: body.reviews || [],
      highlights: body.highlights || [],
      warrantyYears: body.warrantyYears ? Number(body.warrantyYears) : 0,
      featureBanners: body.featureBanners || [],
      upsellProducts: body.upsellProducts || [],
      upsellItems: body.upsellItems || [],
      checkoutDealConfig: body.checkoutDealConfig || null,
    };

    // Save to MongoDB if available
    try {
      const conn = await dbConnect();
      if (conn && Product) {
        const slug =
          body.slug ||
          (title
            ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            : newProduct.id) + `-${Date.now().toString().slice(-4)}`;
        await Product.create({
          ...newProduct,
          slug,
        });
        console.log(`✅ Product "${newProduct.title}" saved to MongoDB`);
      }
    } catch (dbErr: any) {
      console.warn('Could not save product to MongoDB:', dbErr.message);
    }

    const saved = db.addProduct(newProduct);
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}
