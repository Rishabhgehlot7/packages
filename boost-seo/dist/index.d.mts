interface SEOProductReview {
    author: string;
    rating: number;
    body?: string;
    datePublished?: string;
}
interface SEOProduct {
    id: string;
    title: string;
    description: string;
    url: string;
    images: string[];
    price: number;
    currency?: string;
    availability?: 'in_stock' | 'out_of_stock' | 'preorder';
    sku?: string;
    gtin?: string;
    mpn?: string;
    brand?: string;
    category?: string;
    condition?: 'new' | 'refurbished' | 'used';
    rating?: {
        value: number;
        count: number;
    };
    reviews?: SEOProductReview[];
}
interface BreadcrumbItem {
    name: string;
    url: string;
}
interface OrganizationConfig {
    name: string;
    url: string;
    logo: string;
    contactPoint?: {
        telephone: string;
        contactType: string;
        areaServed?: string;
    };
    sameAs?: string[];
}
interface FAQItem {
    question: string;
    answer: string;
}
interface SitemapEntry {
    loc: string;
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
}

declare class JsonLdGenerator {
    /**
     * Generates Schema.org Product JSON-LD for rich snippets in Google Search
     */
    static product(product: SEOProduct): Record<string, any>;
    /**
     * Generates Schema.org BreadcrumbList JSON-LD
     */
    static breadcrumbs(items: BreadcrumbItem[]): Record<string, any>;
    /**
     * Generates Schema.org Organization JSON-LD
     */
    static organization(org: OrganizationConfig): Record<string, any>;
    /**
     * Generates Schema.org FAQPage JSON-LD
     */
    static faq(faqs: FAQItem[]): Record<string, any>;
    /**
     * Helper to format any Schema.org object into an HTML <script> tag
     */
    static toScriptTag(schema: Record<string, any>): string;
}

interface FeedStoreInfo {
    title: string;
    link: string;
    description: string;
}
declare class ProductFeedGenerator {
    private static escapeXml;
    private static escapeCsv;
    /**
     * Generates a fully compliant Google Merchant Center RSS 2.0 XML Feed
     */
    static googleMerchantXml(store: FeedStoreInfo, products: SEOProduct[]): string;
    /**
     * Generates Meta / Facebook Commerce Manager Product Catalog CSV
     */
    static metaCatalogCsv(products: SEOProduct[]): string;
}

declare class SitemapGenerator {
    /**
     * Generates a standard XML sitemap
     */
    static generateXml(entries: SitemapEntry[]): string;
}

interface NextMetadataOptions {
    siteName?: string;
    twitterHandle?: string;
    locale?: string;
}
declare class NextSeoHelper {
    /**
     * Generates Next.js App Router compatible Metadata object for a product page
     */
    static generateProductMetadata(product: SEOProduct, options?: NextMetadataOptions): {
        title: string;
        description: string;
        alternates: {
            canonical: string;
        };
        openGraph: {
            title: string;
            description: string;
            url: string;
            siteName: string;
            images: {
                url: string;
                alt: string;
            }[];
            locale: string;
            type: string;
        };
        twitter: {
            card: string;
            title: string;
            description: string;
            images: string[];
            creator: string | undefined;
        };
        other: {
            'product:brand'?: string | undefined;
            'product:price:amount': string;
            'product:price:currency': string;
            'product:availability': "in_stock" | "out_of_stock" | "preorder";
        };
    };
}

export { type BreadcrumbItem, type FAQItem, type FeedStoreInfo, JsonLdGenerator, type NextMetadataOptions, NextSeoHelper, type OrganizationConfig, ProductFeedGenerator, type SEOProduct, type SEOProductReview, type SitemapEntry, SitemapGenerator };
