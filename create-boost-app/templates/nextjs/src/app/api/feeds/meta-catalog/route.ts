import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const origin = url.origin || 'https://yourstore.com';

    await dbConnect();
    const products = await Product.find({ isActive: true, isDeleted: { $ne: true } })
      .select('name slug description price salePrice media brand')
      .limit(500)
      .lean();

    const headers = ['id', 'title', 'description', 'availability', 'condition', 'price', 'link', 'image_link', 'brand', 'google_product_category'];

    const escapeCsv = (str: string) => {
      const clean = (str || '').replace(/"/g, '""').replace(/\r?\n|\r/g, ' ');
      return `"${clean}"`;
    };

    let rows: string[] = [];

    if (products && products.length > 0) {
      rows = products.map((p: any) => {
        const finalPrice = (p.salePrice && p.salePrice < p.price ? p.salePrice : p.price) || 999;
        const imageUrl = p.media?.[0]?.url || `${origin}/images/placeholder.jpg`;
        const productLink = `${origin}/products/${p.slug}`;
        const cleanDesc = (p.description || p.name || '').replace(/<[^>]*>?/gm, '');

        return [
          escapeCsv(String(p._id)),
          escapeCsv(p.name),
          escapeCsv(cleanDesc),
          'in stock',
          'new',
          `${finalPrice.toFixed(2)} INR`,
          escapeCsv(productLink),
          escapeCsv(imageUrl),
          escapeCsv(p.brand || 'BoostStore'),
          escapeCsv('Apparel & Accessories'),
        ].join(',');
      });
    } else {
      rows = [
        [
          'boost-demo-1',
          escapeCsv('Boost Premium Wireless Earbuds'),
          escapeCsv('Active Noise Cancelling Wireless Earbuds with 40-hour battery life.'),
          'in stock',
          'new',
          '2499.00 INR',
          escapeCsv(`${origin}/products/wireless-earbuds`),
          escapeCsv(`${origin}/images/earbuds.jpg`),
          escapeCsv('BoostStore'),
          escapeCsv('Electronics > Audio > Headphones'),
        ].join(','),
      ];
    }

    const csvContent = [headers.join(','), ...rows].join('\n');

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="meta-catalog.csv"',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error: any) {
    return new Response(`error,${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/csv' },
    });
  }
}
