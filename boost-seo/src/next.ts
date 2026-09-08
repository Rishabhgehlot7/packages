import { SEOProduct } from './types';

export interface NextMetadataOptions {
  siteName?: string;
  twitterHandle?: string;
  locale?: string;
}

export class NextSeoHelper {
  /**
   * Generates Next.js App Router compatible Metadata object for a product page
   */
  static generateProductMetadata(product: SEOProduct, options: NextMetadataOptions = {}) {
    const siteName = options.siteName || product.brand || 'Store';
    const currency = product.currency || 'INR';

    return {
      title: `${product.title} | ${siteName}`,
      description: product.description,
      alternates: {
        canonical: product.url,
      },
      openGraph: {
        title: product.title,
        description: product.description,
        url: product.url,
        siteName,
        images: product.images.map((img) => ({
          url: img,
          alt: product.title,
        })),
        locale: options.locale || 'en_IN',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.title,
        description: product.description,
        images: product.images.slice(0, 1),
        creator: options.twitterHandle,
      },
      other: {
        'product:price:amount': product.price.toString(),
        'product:price:currency': currency,
        'product:availability': product.availability || 'in_stock',
        ...(product.brand ? { 'product:brand': product.brand } : {}),
      },
    };
  }
}
