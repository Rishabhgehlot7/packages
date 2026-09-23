import { importCatalogFromCsv, exportCatalogToCsv } from './engine';
import { ImportProduct } from './types';

/**
 * AI Agent Tool: Parses raw CSV content and returns structured product JSON.
 */
export function parseCatalogCsvTool(params: { csvContent: string }) {
  const result = importCatalogFromCsv(params.csvContent);

  return {
    detectedPlatform: result.platform,
    totalRows: result.totalRowsProcessed,
    productsCreated: result.productsCreated,
    variantsCreated: result.variantsCreated,
    sampleProducts: result.products.slice(0, 3).map((p) => ({
      title: p.title,
      slug: p.slug,
      price: `₹${p.price}`,
      variantsCount: p.variants.length,
      imagesCount: p.images.length,
    })),
    errorsCount: result.errors.length,
    errors: result.errors.slice(0, 5),
  };
}

/**
 * AI Agent Tool: Exports products to CSV string.
 */
export function exportCatalogCsvTool(params: { products: ImportProduct[] }) {
  const csv = exportCatalogToCsv(params.products);
  return {
    csvContent: csv,
    rowCount: params.products.length,
    format: 'Shopify-compatible CSV',
  };
}
