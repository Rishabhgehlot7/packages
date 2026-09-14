import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { StoreProduct, PRODUCTS as INITIAL_PRODUCTS } from '@/data/products';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const query = searchParams.get('q')?.toLowerCase().trim();
    const dealOnly = searchParams.get('deal') === 'true';

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

        // Single product lookup by ID or slug
        if (id) {
          let single = null;
          // Check standard ID or _id
          try {
            single = await Product.findById(id).lean();
          } catch (e) {
            // invalid ObjectId, lookup by string id or slug
          }
          if (!single) {
            single = await Product.findOne({
              $or: [{ id: id }, { sku: id }, { slug: id }],
            }).lean();
          }

          if (single) {
            const normalized = {
              ...(single as any),
              id: (single as any).id || (single as any)._id?.toString(),
              _id: (single as any)._id?.toString(),
              images: (single as any).images?.length > 0 ? (single as any).images : [(single as any).image || '/placeholder.png'],
              rating: (single as any).rating || { value: 4.8, count: 24 },
            };
            return NextResponse.json({ success: true, source: 'mongodb', data: normalized });
          }

          // Fallback to static catalog if product exists in seed
          const fallbackProduct = INITIAL_PRODUCTS.find((p) => p.id === id || p.sku === id || p.slug === id);
          if (fallbackProduct) {
            return NextResponse.json({ success: true, source: 'fallback', data: fallbackProduct });
          }

          return NextResponse.json(
            { success: false, source: 'not_found', error: 'Product not found', data: null },
            { status: 404 }
          );
        }

        // Query filter
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
            { description: { $regex: query, $options: 'i' } },
          ];
        }

        let mongoProducts = await Product.find(filter).sort({ createdAt: -1 }).lean();

        // Optional category name map for category IDs
        try {
          const allCats = await Category.find({}).lean();
          const catMap = new Map<string, string>();
          allCats.forEach((c: any) => {
            if (c._id && c.name) catMap.set(c._id.toString(), c.name);
          });

          mongoProducts = mongoProducts.map((p: any) => {
            if (p.category && catMap.has(p.category.toString())) {
              return { ...p, category: catMap.get(p.category.toString()) };
            }
            return p;
          });
        } catch (catErr) {
          // ignore
        }

        const normalizedList = mongoProducts.map((p: any) => ({
          ...(p as any),
          id: p.id || p._id?.toString(),
          _id: p._id?.toString(),
          images: p.images?.length > 0 ? p.images : [p.image || '/placeholder.png'],
          rating: p.rating || { value: 4.8, count: 24 },
        }));

        if (dealOnly) {
          normalizedList.sort((a: any, b: any) => {
            const discA = (a.compareAtPrice - a.price) / a.compareAtPrice;
            const discB = (b.compareAtPrice - b.price) / b.compareAtPrice;
            return discB - discA;
          });
        }

        return NextResponse.json({
          success: true,
          source: 'mongodb',
          total: normalizedList.length,
          data: normalizedList,
        });
      }
    } catch (dbErr) {
      console.warn('MongoDB products fetch failed, using fallback:', dbErr);
    }

    // Static fallback if DB fails
    let fallbackList = [...INITIAL_PRODUCTS];
    if (id) {
      const found = fallbackList.find((p) => p.id === id || p.sku === id);
      return NextResponse.json({
        success: !!found,
        source: 'fallback',
        data: found || null,
      });
    }

    if (category && category !== 'All') {
      fallbackList = fallbackList.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (query) {
      fallbackList = fallbackList.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.tags?.some((t) => t.toLowerCase().includes(query))
      );
    }

    return NextResponse.json({
      success: true,
      source: 'fallback',
      total: fallbackList.length,
      data: fallbackList,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
