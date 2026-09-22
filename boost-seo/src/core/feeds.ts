// ============================================================
// @boostengine/seo — v1.1.0 — Google Merchant Center XML Feed
// RSS 2.0 compliant feed with g: namespace elements
// ============================================================

import type { SEOProduct, FeedStoreInfo } from './types';

/** Escape XML special chars */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Escape CSV field */
function escapeCsv(field: string | number | undefined): string {
  if (field === undefined || field === null) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Generates a fully compliant Google Merchant Center RSS 2.0 XML Feed
 */
export function generateMerchantFeed(store: FeedStoreInfo, products: SEOProduct[]): string {
  const itemsXml = products
    .map((p) => {
      const currency = p.currency || 'INR';
      let availability = 'in_stock';
      if (p.availability === 'out_of_stock') availability = 'out_of_stock';
      if (p.availability === 'preorder') availability = 'preorder';

      const mainImage = p.images[0] || '';
      const additionalImages = p.images.slice(1);

      let item = `    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <g:title>${escapeXml(p.title)}</g:title>
      <g:description>${escapeXml(p.description)}</g:description>
      <g:link>${escapeXml(p.url)}</g:link>
      <g:image_link>${escapeXml(mainImage)}</g:image_link>
      <g:condition>${p.condition || 'new'}</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${p.price.toFixed(2)} ${currency}</g:price>`;

      if (p.brand) item += `\n      <g:brand>${escapeXml(p.brand)}</g:brand>`;
      if (p.googleProductCategory) {
        item += `\n      <g:google_product_category>${escapeXml(p.googleProductCategory)}</g:google_product_category>`;
      }
      if (p.gtin) item += `\n      <g:gtin>${escapeXml(p.gtin)}</g:gtin>`;
      if (p.mpn) item += `\n      <g:mpn>${escapeXml(p.mpn)}</g:mpn>`;
      if (p.sku) item += `\n      <g:sku>${escapeXml(p.sku)}</g:sku>`;
      if (p.color) item += `\n      <g:color>${escapeXml(p.color)}</g:color>`;
      if (p.size) item += `\n      <g:size>${escapeXml(p.size)}</g:size>`;
      if (p.material) item += `\n      <g:material>${escapeXml(p.material)}</g:material>`;

      // Shipping info
      if (p.shippingDetails && p.shippingDetails.shippingRate) {
        const sr = p.shippingDetails.shippingRate;
        item += `\n      <g:shipping>
        <g:country>${p.shippingDetails.shippingDestination?.[0] || 'IN'}</g:country>
        <g:service>Standard</g:service>
        <g:price>${sr.price.toFixed(2)} ${sr.currency || currency}</g:price>
      </g:shipping>`;
      }

      for (const addImg of additionalImages) {
        item += `\n      <g:additional_image_link>${escapeXml(addImg)}</g:additional_image_link>`;
      }

      item += '\n    </item>';
      return item;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${escapeXml(store.title)}</title>
    <link>${escapeXml(store.link)}</link>
    <description>${escapeXml(store.description)}</description>
${itemsXml}
  </channel>
</rss>`;
}

/**
 * Generates Meta / Facebook Commerce Manager Product Catalog CSV
 */
export function generateMetaCatalogCsv(products: SEOProduct[]): string {
  const headers = [
    'id', 'title', 'description', 'availability', 'condition', 'price',
    'link', 'image_link', 'brand',
  ];

  const rows = products.map((p) => {
    let availability = 'in stock';
    if (p.availability === 'out_of_stock') availability = 'out of stock';
    if (p.availability === 'preorder') availability = 'available for order';

    return [
      escapeCsv(p.id),
      escapeCsv(p.title),
      escapeCsv(p.description),
      escapeCsv(availability),
      escapeCsv(p.condition || 'new'),
      escapeCsv(`${p.price.toFixed(2)} ${p.currency || 'INR'}`),
      escapeCsv(p.url),
      escapeCsv(p.images[0] || ''),
      escapeCsv(p.brand || ''),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

/** Backward-compatible ProductFeedGenerator class */
export class ProductFeedGenerator {
  static googleMerchantXml = generateMerchantFeed;
  static metaCatalogCsv = generateMetaCatalogCsv;
}