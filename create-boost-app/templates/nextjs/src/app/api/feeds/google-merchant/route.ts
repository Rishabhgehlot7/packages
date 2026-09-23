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
      .select('name slug description price salePrice media brand category hsnCode variants')
      .limit(500)
      .lean();

    let itemsXml = '';

    if (products && products.length > 0) {
      itemsXml = products
        .map((p: any) => {
          const finalPrice = (p.salePrice && p.salePrice < p.price ? p.salePrice : p.price) || 999;
          const imageUrl = p.media?.[0]?.url || `${origin}/images/placeholder.jpg`;
          const productLink = `${origin}/products/${p.slug}`;
          const cleanDesc = (p.description || p.name || '')
            .replace(/<[^>]*>?/gm, '')
            .replace(/[<>&'"]/g, (c: string) => {
              switch (c) {
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '&': return '&amp;';
                case '\'': return '&apos;';
                case '"': return '&quot;';
                default: return c;
              }
            });

          return `
    <item>
      <g:id>${p._id}</g:id>
      <g:title><![CDATA[${p.name}]]></g:title>
      <g:description><![CDATA[${cleanDesc}]]></g:description>
      <g:link>${productLink}</g:link>
      <g:image_link>${imageUrl}</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>${finalPrice.toFixed(2)} INR</g:price>
      <g:condition>new</g:condition>
      <g:brand><![CDATA[${p.brand || 'BoostStore'}]]></g:brand>
      <g:google_product_category>Apparel &amp; Accessories</g:google_product_category>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
        })
        .join('');
    } else {
      // Fallback demo feed
      itemsXml = `
    <item>
      <g:id>boost-demo-1</g:id>
      <g:title><![CDATA[Boost Premium Wireless Earbuds]]></g:title>
      <g:description><![CDATA[Active Noise Cancelling Wireless Earbuds with 40-hour battery life.]]></g:description>
      <g:link>${origin}/products/wireless-earbuds</g:link>
      <g:image_link>${origin}/images/earbuds.jpg</g:image_link>
      <g:availability>in_stock</g:availability>
      <g:price>2499.00 INR</g:price>
      <g:condition>new</g:condition>
      <g:brand>BoostStore</g:brand>
      <g:google_product_category>Electronics &gt; Audio &gt; Headphones</g:google_product_category>
      <g:identifier_exists>no</g:identifier_exists>
    </item>`;
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>BoostCommerce Storefront Product Feed</title>
    <link>${origin}</link>
    <description>Live Google Merchant Center XML Feed powered by @boostengine/seo</description>
    ${itemsXml}
  </channel>
</rss>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error: any) {
    return new Response(`<?xml version="1.0"?><error>${error.message}</error>`, {
      status: 500,
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}
