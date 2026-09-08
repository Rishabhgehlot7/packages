import { SEOProduct } from './types';

export interface FeedStoreInfo {
  title: string;
  link: string;
  description: string;
}

export class ProductFeedGenerator {
  private static escapeXml(unsafe: string): string {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private static escapeCsv(field: string | number | undefined): string {
    if (field === undefined || field === null) return '""';
    const str = String(field).replace(/"/g, '""');
    return `"${str}"`;
  }

  /**
   * Generates a fully compliant Google Merchant Center RSS 2.0 XML Feed
   */
  static googleMerchantXml(store: FeedStoreInfo, products: SEOProduct[]): string {
    const itemsXml = products
      .map((p) => {
        const currency = p.currency || 'INR';
        let availability = 'in_stock';
        if (p.availability === 'out_of_stock') availability = 'out_of_stock';
        if (p.availability === 'preorder') availability = 'preorder';

        const mainImage = p.images[0] || '';
        const additionalImages = p.images.slice(1);

        let item = `    <item>
      <g:id>${this.escapeXml(p.id)}</g:id>
      <g:title>${this.escapeXml(p.title)}</g:title>
      <g:description>${this.escapeXml(p.description)}</g:description>
      <g:link>${this.escapeXml(p.url)}</g:link>
      <g:image_link>${this.escapeXml(mainImage)}</g:image_link>
      <g:condition>${p.condition || 'new'}</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${p.price.toFixed(2)} ${currency}</g:price>`;

        if (p.brand) {
          item += `\n      <g:brand>${this.escapeXml(p.brand)}</g:brand>`;
        }
        if (p.category) {
          item += `\n      <g:product_type>${this.escapeXml(p.category)}</g:product_type>`;
        }
        if (p.gtin) {
          item += `\n      <g:gtin>${this.escapeXml(p.gtin)}</g:gtin>`;
        }
        if (p.mpn) {
          item += `\n      <g:mpn>${this.escapeXml(p.mpn)}</g:mpn>`;
        }

        for (const addImg of additionalImages) {
          item += `\n      <g:additional_image_link>${this.escapeXml(addImg)}</g:additional_image_link>`;
        }

        item += '\n    </item>';
        return item;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${this.escapeXml(store.title)}</title>
    <link>${this.escapeXml(store.link)}</link>
    <description>${this.escapeXml(store.description)}</description>
${itemsXml}
  </channel>
</rss>`;
  }

  /**
   * Generates Meta / Facebook Commerce Manager Product Catalog CSV
   */
  static metaCatalogCsv(products: SEOProduct[]): string {
    const headers = [
      'id',
      'title',
      'description',
      'availability',
      'condition',
      'price',
      'link',
      'image_link',
      'brand',
    ];

    const rows = products.map((p) => {
      const currency = p.currency || 'INR';
      let availability = 'in stock';
      if (p.availability === 'out_of_stock') availability = 'out of stock';
      if (p.availability === 'preorder') availability = 'available for order';

      return [
        this.escapeCsv(p.id),
        this.escapeCsv(p.title),
        this.escapeCsv(p.description),
        this.escapeCsv(availability),
        this.escapeCsv(p.condition || 'new'),
        this.escapeCsv(`${p.price.toFixed(2)} ${currency}`),
        this.escapeCsv(p.url),
        this.escapeCsv(p.images[0] || ''),
        this.escapeCsv(p.brand || ''),
      ].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }
}
