/**
 * @boostengine/importer - Core Types & Interfaces
 */

export type SourcePlatform =
  | 'shopify'
  | 'woocommerce'
  | 'magento'
  | 'custom_csv'
  | 'custom_json';

export interface ImportVariant {
  sku: string;
  title?: string;
  price: number;
  salePrice?: number;
  stock: number;
  barcode?: string;
  options: Record<string, string>; // e.g. { "Size": "M", "Color": "Black" }
  images?: string[];
  weightKg?: number;
}

export interface ImportProduct {
  id?: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  category?: string;
  tags?: string[];
  price: number;
  salePrice?: number;
  costPrice?: number;
  sku: string;
  barcode?: string;
  hsnCode?: string;
  gstRate?: number;
  stock: number;
  variants: ImportVariant[];
  images: string[];
  weightKg?: number;
  isActive?: boolean;
}

export interface ImportError {
  row: number;
  identifier: string;
  message: string;
}

export interface ImportResult {
  platform: SourcePlatform;
  totalRowsProcessed: number;
  productsCreated: number;
  variantsCreated: number;
  products: ImportProduct[];
  errors: ImportError[];
}

export interface ExportOptions {
  format?: 'csv' | 'json';
  includeVariants?: boolean;
  fields?: string[];
}
