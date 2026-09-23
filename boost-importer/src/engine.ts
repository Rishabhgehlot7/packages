import {
  SourcePlatform,
  ImportProduct,
  ImportVariant,
  ImportResult,
  ImportError,
  ExportOptions,
} from './types';

/**
 * High-performance RFC 4180 compliant CSV parser that handles quotes and multiline cells.
 */
export function parseCsvString(csv: string): Record<string, string>[] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    const nextChar = csv[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentCell.trim());
      if (currentRow.length > 0 && currentRow.some((c) => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) return [];

  const headers = rows[0].map((h) => h.trim());
  const records: Record<string, string>[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const record: Record<string, string> = {};
    for (let h = 0; h < headers.length; h++) {
      record[headers[h]] = row[h] || '';
    }
    records.push(record);
  }

  return records;
}

/**
 * Auto-detects platform schema (Shopify vs WooCommerce vs Magento vs Custom).
 */
export function detectPlatformSchema(headers: string[]): SourcePlatform {
  const lower = headers.map((h) => h.toLowerCase());

  if (lower.includes('handle') && lower.includes('variant sku')) {
    return 'shopify';
  }
  if (lower.includes('type') && lower.includes('tax:product_cat') || (lower.includes('sku') && lower.includes('regular_price'))) {
    return 'woocommerce';
  }
  if (lower.includes('attribute_set_code') || lower.includes('product_websites')) {
    return 'magento';
  }
  return 'custom_csv';
}

/**
 * Imports and groups Shopify exported CSV rows into complete products with variant matrix.
 */
export function mapShopifyCsv(rows: Record<string, string>[]): ImportResult {
  const productsMap = new Map<string, ImportProduct>();
  const errors: ImportError[] = [];

  rows.forEach((row, idx) => {
    const handle = row['Handle'] || row['handle'] || '';
    if (!handle) {
      errors.push({ row: idx + 2, identifier: 'UNKNOWN', message: 'Missing Handle column.' });
      return;
    }

    const title = row['Title'] || row['title'] || handle;
    const bodyHtml = row['Body (HTML)'] || row['body_html'] || '';
    const category = row['Product Category'] || row['Type'] || 'General';
    const tags = (row['Tags'] || '').split(',').map((t) => t.trim()).filter(Boolean);
    const imageSrc = row['Image Src'] || row['image_src'] || '';

    const variantSku = row['Variant SKU'] || row['variant_sku'] || `${handle}-var-${idx}`;
    const variantPrice = parseFloat(row['Variant Price'] || row['variant_price'] || '0') || 0;
    const compareAtPrice = parseFloat(row['Variant Compare At Price'] || '0') || undefined;
    const variantStock = parseInt(row['Variant Inventory Qty'] || '0', 10) || 0;
    const barcode = row['Variant Barcode'] || '';

    const option1Name = row['Option1 Name'];
    const option1Value = row['Option1 Value'];
    const option2Name = row['Option2 Name'];
    const option2Value = row['Option2 Value'];

    const options: Record<string, string> = {};
    if (option1Name && option1Value && option1Value !== 'Default Title') {
      options[option1Name] = option1Value;
    }
    if (option2Name && option2Value) {
      options[option2Name] = option2Value;
    }

    const variant: ImportVariant = {
      sku: variantSku,
      title: Object.values(options).join(' / ') || 'Default',
      price: variantPrice,
      salePrice: compareAtPrice && compareAtPrice > variantPrice ? variantPrice : undefined,
      stock: variantStock,
      barcode,
      options,
      images: imageSrc ? [imageSrc] : [],
    };

    if (!productsMap.has(handle)) {
      productsMap.set(handle, {
        title,
        slug: handle,
        description: bodyHtml,
        category,
        tags,
        price: variantPrice,
        sku: variantSku,
        barcode,
        stock: variantStock,
        variants: [variant],
        images: imageSrc ? [imageSrc] : [],
        isActive: true,
      });
    } else {
      const existing = productsMap.get(handle)!;
      existing.variants.push(variant);
      existing.stock += variantStock;
      if (imageSrc && !existing.images.includes(imageSrc)) {
        existing.images.push(imageSrc);
      }
    }
  });

  const products = Array.from(productsMap.values());
  const totalVariants = products.reduce((acc, p) => acc + p.variants.length, 0);

  return {
    platform: 'shopify',
    totalRowsProcessed: rows.length,
    productsCreated: products.length,
    variantsCreated: totalVariants,
    products,
    errors,
  };
}

/**
 * Imports and groups WooCommerce exported CSV rows into complete products.
 */
export function mapWooCommerceCsv(rows: Record<string, string>[]): ImportResult {
  const products: ImportProduct[] = [];
  const errors: ImportError[] = [];

  rows.forEach((row, idx) => {
    const title = row['Name'] || row['name'] || '';
    const sku = row['SKU'] || row['sku'] || `woo-prod-${idx}`;
    const price = parseFloat(row['Regular price'] || row['regular_price'] || row['Price'] || '0') || 0;
    const salePrice = parseFloat(row['Sale price'] || row['sale_price'] || '0') || undefined;
    const stock = parseInt(row['Stock'] || '0', 10) || 0;
    const desc = row['Description'] || row['Short description'] || '';
    const category = row['Categories'] || 'General';
    const images = (row['Images'] || '').split(',').map((img) => img.trim()).filter(Boolean);

    if (!title && !sku) {
      errors.push({ row: idx + 2, identifier: sku, message: 'Missing product Name and SKU.' });
      return;
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `product-${idx}`;

    products.push({
      title,
      slug,
      description: desc,
      category,
      price,
      salePrice: salePrice && salePrice < price ? salePrice : undefined,
      sku,
      stock,
      variants: [
        {
          sku,
          title: 'Default',
          price,
          salePrice,
          stock,
          options: {},
          images,
        },
      ],
      images,
      isActive: true,
    });
  });

  return {
    platform: 'woocommerce',
    totalRowsProcessed: rows.length,
    productsCreated: products.length,
    variantsCreated: products.length,
    products,
    errors,
  };
}

/**
 * Universal Catalog CSV Importer with automatic platform detection.
 */
export function importCatalogFromCsv(
  csvString: string,
  forcedPlatform?: SourcePlatform
): ImportResult {
  const rows = parseCsvString(csvString);
  if (rows.length === 0) {
    return {
      platform: 'custom_csv',
      totalRowsProcessed: 0,
      productsCreated: 0,
      variantsCreated: 0,
      products: [],
      errors: [{ row: 0, identifier: 'CSV', message: 'CSV is empty or invalid format.' }],
    };
  }

  const headers = Object.keys(rows[0]);
  const platform = forcedPlatform || detectPlatformSchema(headers);

  if (platform === 'shopify') {
    return mapShopifyCsv(rows);
  }
  if (platform === 'woocommerce') {
    return mapWooCommerceCsv(rows);
  }

  // Fallback: Generic CSV Mapper
  return mapWooCommerceCsv(rows);
}

/**
 * Exports products to a clean standard CSV.
 */
export function exportCatalogToCsv(
  products: ImportProduct[],
  options: ExportOptions = {}
): string {
  const headers = [
    'Handle',
    'Title',
    'Body (HTML)',
    'Category',
    'Tags',
    'Variant SKU',
    'Variant Price',
    'Variant Compare At Price',
    'Variant Inventory Qty',
    'Image Src',
  ];

  const escapeCell = (str: any) => {
    const s = String(str || '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const lines: string[] = [headers.join(',')];

  products.forEach((p) => {
    const image1 = p.images?.[0] || '';
    const tagsStr = (p.tags || []).join(', ');

    if (p.variants && p.variants.length > 0) {
      p.variants.forEach((v) => {
        lines.push(
          [
            escapeCell(p.slug),
            escapeCell(p.title),
            escapeCell(p.description),
            escapeCell(p.category || 'General'),
            escapeCell(tagsStr),
            escapeCell(v.sku),
            v.price.toFixed(2),
            v.salePrice ? v.salePrice.toFixed(2) : '',
            v.stock.toString(),
            escapeCell(v.images?.[0] || image1),
          ].join(',')
        );
      });
    } else {
      lines.push(
        [
          escapeCell(p.slug),
          escapeCell(p.title),
          escapeCell(p.description),
          escapeCell(p.category || 'General'),
          escapeCell(tagsStr),
          escapeCell(p.sku),
          p.price.toFixed(2),
          p.salePrice ? p.salePrice.toFixed(2) : '',
          p.stock.toString(),
          escapeCell(image1),
        ].join(',')
      );
    }
  });

  return lines.join('\n');
}
