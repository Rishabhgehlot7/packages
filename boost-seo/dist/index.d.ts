/** Product review from a customer */
interface SEOProductReview {
    author: string;
    rating: number;
    body?: string;
    datePublished?: string;
}
/** Core product shape used across all generators */
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
    googleProductCategory?: string;
    condition?: 'new' | 'refurbished' | 'used';
    weight?: string;
    color?: string;
    size?: string;
    material?: string;
    rating?: {
        value: number;
        count: number;
    };
    reviews?: SEOProductReview[];
    /** Merchant return policy */
    returnPolicy?: {
        applicableCountry?: string;
        returnPolicyCategory?: string;
        merchantReturnDays?: number;
        returnMethod?: string;
        returnFees?: string;
    };
    /** Shipping details */
    shippingDetails?: {
        shippingRate?: ShippingRate;
        shippingDestination?: string[];
        deliveryTime?: {
            minDays: number;
            maxDays: number;
        };
    };
}
interface ShippingRate {
    price: number;
    currency: string;
    free?: boolean;
    freeOver?: number;
}
/** Breadcrumb item for BreadcrumbList schema */
interface BreadcrumbItem {
    name: string;
    url: string;
}
/** Organization schema configuration */
interface OrganizationConfig {
    name: string;
    url: string;
    logo: string;
    description?: string;
    contactPoint?: {
        telephone: string;
        contactType: string;
        areaServed?: string;
    };
    sameAs?: string[];
    address?: {
        streetAddress: string;
        addressLocality: string;
        addressRegion: string;
        postalCode: string;
        addressCountry: string;
    };
}
/** LocalBusiness extends Organization */
interface LocalBusinessConfig extends OrganizationConfig {
    priceRange?: string;
    openingHours?: {
        dayOfWeek: string[];
        opens: string;
        closes: string;
    }[];
    servesCuisine?: string;
    images?: string[];
}
/** FAQ entry */
interface FAQItem {
    question: string;
    answer: string;
}
/** HowTo step */
interface HowToStep {
    name: string;
    text: string;
    image?: string;
    url?: string;
}
/** Article metadata */
interface ArticleItem {
    headline: string;
    description: string;
    url: string;
    image: string;
    datePublished: string;
    dateModified?: string;
    authorName: string;
    authorUrl?: string;
    publisherName: string;
    publisherLogo: string;
}
/** Sitemap entry */
interface SitemapEntry {
    loc: string;
    lastmod?: string;
    changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
    images?: string[];
}
/** Next.js metadata options */
interface NextMetadataOptions {
    siteName?: string;
    twitterHandle?: string;
    locale?: string;
    titleTemplate?: string;
    description?: string;
    alternates?: Record<string, string>;
    robots?: {
        index?: boolean;
        follow?: boolean;
        noarchive?: boolean;
    };
}
/** SEO Audit result */
interface SEOAuditResult {
    score: number;
    title: {
        ok: boolean;
        length: number;
        message: string;
    };
    description: {
        ok: boolean;
        length: number;
        message: string;
    };
    h1: {
        ok: boolean;
        message: string;
    };
    openGraph: {
        ok: boolean;
        message: string;
    };
    canonical: {
        ok: boolean;
        message: string;
    };
    recommendations: string[];
}
/** Feed store info for Merchant Center */
interface FeedStoreInfo {
    title: string;
    link: string;
    description: string;
}

/**
 * Generates Schema.org Product JSON-LD with Offer, AggregateRating, Review,
 * MerchantReturnPolicy, and ShippingDetails support.
 */
declare function generateProductJsonLd(product: SEOProduct): Record<string, any>;
/**
 * Generates Schema.org BreadcrumbList JSON-LD
 */
declare function generateBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, any>;
/**
 * Generates Schema.org FAQPage JSON-LD
 */
declare function generateFaqJsonLd(faqs: FAQItem[]): Record<string, any>;
/**
 * Generates Schema.org HowTo JSON-LD
 */
declare function generateHowToJsonLd(name: string, description: string, steps: HowToStep[], totalTime?: string): Record<string, any>;
/**
 * Generates Schema.org Article JSON-LD
 */
declare function generateArticleJsonLd(article: ArticleItem): Record<string, any>;
/**
 * Generates Schema.org Organization JSON-LD
 */
declare function generateOrganizationJsonLd(org: OrganizationConfig): Record<string, any>;
/**
 * Generates Schema.org LocalBusiness JSON-LD
 */
declare function generateLocalBusinessJsonLd(business: LocalBusinessConfig): Record<string, any>;
/**
 * Generates Schema.org ItemList JSON-LD
 */
declare function generateItemListJsonLd(items: {
    name: string;
    url: string;
    image?: string;
}[], listType?: 'ItemList' | 'ProductList'): Record<string, any>;
/**
 * Helper to format any Schema.org object into an HTML <script> tag
 */
declare function toScriptTag(schema: Record<string, any>): string;
/** Backward-compatible JsonLdGenerator class wrapping all functions */
declare class JsonLdGenerator {
    static product: typeof generateProductJsonLd;
    static breadcrumbs: typeof generateBreadcrumbJsonLd;
    static faq: typeof generateFaqJsonLd;
    static howTo: typeof generateHowToJsonLd;
    static article: typeof generateArticleJsonLd;
    static organization: typeof generateOrganizationJsonLd;
    static localBusiness: typeof generateLocalBusinessJsonLd;
    static itemList: typeof generateItemListJsonLd;
    static toScriptTag: typeof toScriptTag;
}

/**
 * Generates a fully compliant Google Merchant Center RSS 2.0 XML Feed
 */
declare function generateMerchantFeed(store: FeedStoreInfo, products: SEOProduct[]): string;
/**
 * Generates Meta / Facebook Commerce Manager Product Catalog CSV
 */
declare function generateMetaCatalogCsv(products: SEOProduct[]): string;
/** Backward-compatible ProductFeedGenerator class */
declare class ProductFeedGenerator {
    static googleMerchantXml: typeof generateMerchantFeed;
    static metaCatalogCsv: typeof generateMetaCatalogCsv;
}

/**
 * Generates a standard XML sitemap with optional <image:image> extensions
 */
declare function generateSitemapXml(entries: SitemapEntry[]): string;
/**
 * Generates robots.txt content with Disallow/Allow rules, sitemap index, and crawl-delay
 */
declare function generateRobotsTxt(options: {
    userAgent?: string;
    disallow?: string[];
    allow?: string[];
    sitemap?: string;
    crawlDelay?: number;
}): string;
/** Backward-compatible SitemapGenerator class */
declare class SitemapGenerator {
    static generateXml: typeof generateSitemapXml;
    static generateRobotsTxt: typeof generateRobotsTxt;
}

/**
 * Generates a full Next.js App Router Metadata object for a product page.
 * Supports title templates, OpenGraph, Twitter cards, canonical URL,
 * robots directives, and alternates/hreflang.
 */
declare function generateNextMetadata(product: SEOProduct, options?: NextMetadataOptions): Record<string, any>;
/** Backward-compatible NextSeoHelper class */
declare class NextSeoHelper {
    static generateProductMetadata: typeof generateNextMetadata;
}

/**
 * Performs a comprehensive SEO quality audit on a page's metadata.
 * Checks title length (50-60 chars), description length (120-160 chars),
 * H1 presence, OpenGraph tags, and canonical tag integrity.
 * Returns a score 0-100 with actionable recommendations.
 */
declare function auditPageSEO(input: {
    title: string;
    description: string;
    h1?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonical?: string;
    pageUrl?: string;
}): SEOAuditResult;

interface AIToolDefinition {
    name: string;
    description: string;
    parameters: Record<string, any>;
    execute: (args: Record<string, any>) => any;
}
declare const generateJsonLdSchemaTool: AIToolDefinition;
declare const generateMerchantFeedTool: AIToolDefinition;
declare const optimizeMetaTagsTool: AIToolDefinition;
declare const generateSitemapXmlTool: AIToolDefinition;
declare const auditPageSeoTool: AIToolDefinition;
declare const allAITools: AIToolDefinition[];

/**
 * Find a tool by name from the available tools registry
 */
declare function findTool(name: string): AIToolDefinition | undefined;
/**
 * Execute a tool call by name with the given arguments.
 * Returns the result directly or throws if not found.
 */
declare function executeToolCall(name: string, args: Record<string, any>): any;
/**
 * Convert all tools to OpenAI-compatible function definitions
 * (useful for direct integration with OpenAI SDK)
 */
declare function toOpenAIFunctions(): {
    type: "function";
    function: {
        name: string;
        description: string;
        parameters: Record<string, any>;
    };
}[];
/**
 * Convert all tools to Anthropic Claude-compatible tool definitions
 */
declare function toAnthropicTools(): {
    name: string;
    description: string;
    input_schema: Record<string, any>;
}[];

export { type ArticleItem, type BreadcrumbItem, type FAQItem, type FeedStoreInfo, type HowToStep, JsonLdGenerator, type LocalBusinessConfig, type NextMetadataOptions, NextSeoHelper, type OrganizationConfig, ProductFeedGenerator, type SEOAuditResult, type SEOProduct, type SEOProductReview, type ShippingRate, type SitemapEntry, SitemapGenerator, allAITools, auditPageSEO, auditPageSeoTool, executeToolCall, findTool, generateArticleJsonLd, generateBreadcrumbJsonLd, generateFaqJsonLd, generateHowToJsonLd, generateItemListJsonLd, generateJsonLdSchemaTool, generateLocalBusinessJsonLd, generateMerchantFeed, generateMerchantFeedTool, generateMetaCatalogCsv, generateNextMetadata, generateOrganizationJsonLd, generateProductJsonLd, generateRobotsTxt, generateSitemapXml, generateSitemapXmlTool, optimizeMetaTagsTool, toAnthropicTools, toOpenAIFunctions, toScriptTag };
