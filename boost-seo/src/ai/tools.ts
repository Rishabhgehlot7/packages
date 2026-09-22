import {
  generateProductJsonLd, generateBreadcrumbJsonLd, generateFaqJsonLd,
  generateHowToJsonLd, generateArticleJsonLd, generateOrganizationJsonLd,
  generateLocalBusinessJsonLd, generateItemListJsonLd,
  generateMerchantFeed, generateSitemapXml, auditPageSEO,
} from '../core/index';
import type { SEOProduct, BreadcrumbItem, FAQItem, HowToStep, ArticleItem, OrganizationConfig, LocalBusinessConfig, SitemapEntry, FeedStoreInfo } from '../core/index';

export interface AIToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (args: Record<string, any>) => any;
}

export const generateJsonLdSchemaTool: AIToolDefinition = {
  name: 'generate_jsonld_schema',
  description: 'Generate valid JSON-LD for Schema.org entity types',
  parameters: {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['Product', 'BreadcrumbList', 'FAQPage', 'HowTo', 'Article', 'Organization', 'LocalBusiness', 'ItemList'], description: 'Schema.org type' },
      data: { type: 'object', description: 'Data for the schema entity' },
    },
    required: ['type', 'data'],
  },
  execute: (args) => {
    const { type, data } = args;
    switch (type) {
      case 'Product': return generateProductJsonLd(data as SEOProduct);
      case 'BreadcrumbList': return generateBreadcrumbJsonLd(data.items as BreadcrumbItem[]);
      case 'FAQPage': return generateFaqJsonLd(data.faqs as FAQItem[]);
      case 'HowTo': return generateHowToJsonLd(data.name, data.description, data.steps as HowToStep[], data.totalTime);
      case 'Article': return generateArticleJsonLd(data as ArticleItem);
      case 'Organization': return generateOrganizationJsonLd(data as OrganizationConfig);
      case 'LocalBusiness': return generateLocalBusinessJsonLd(data as LocalBusinessConfig);
      case 'ItemList': return generateItemListJsonLd(data.items || [], data.listType);
      default: throw new Error('Unknown schema type');
    }
  },
};
export const generateMerchantFeedTool: AIToolDefinition = {
  name: 'generate_merchant_feed',
  description: 'Generate a Google Merchant Center RSS 2.0 XML feed from an array of products',
  parameters: {
    type: 'object',
    properties: {
      store: { type: 'object', properties: { title: { type: 'string' }, link: { type: 'string' }, description: { type: 'string' } }, required: ['title', 'link', 'description'] },
      products: { type: 'array', items: { type: 'object' } },
    },
    required: ['store', 'products'],
  },
  execute: (args) => generateMerchantFeed(args.store as FeedStoreInfo, args.products as SEOProduct[]),
};

export const optimizeMetaTagsTool: AIToolDefinition = {
  name: 'optimize_meta_tags',
  description: 'Analyze product/page data and generate high-CTR optimized title and meta description',
  parameters: {
    type: 'object',
    properties: {
      productName: { type: 'string' }, productDescription: { type: 'string' },
      brand: { type: 'string' }, category: { type: 'string' }, price: { type: 'number' },
      siteName: { type: 'string' },
    },
    required: ['productName', 'productDescription', 'siteName'],
  },
  execute: (args) => {
    const { productName, productDescription, brand, category, price, siteName } = args;
    let title = productName;
    if (brand) title = brand + ' ' + title;
    if (title.length < 40 && category) title = title + ' - ' + category;
    title = title + ' | ' + siteName;
    if (title.length > 60) {
      title = productName + ' | ' + siteName;
      if (title.length > 60) title = productName.substring(0, 55) + '...';
    }
    let desc = productDescription;
    if (desc.length < 90 && brand) desc = desc + ' From ' + brand + '.';
    if (desc.length < 90 && price) desc = desc + ' Starting at $' + price + '.';
    if (desc.length > 160) desc = desc.substring(0, 157) + '...';
    return { title, description: desc, titleLength: title.length, descriptionLength: desc.length, recommendations: [] };
  },
};

export const generateSitemapXmlTool: AIToolDefinition = {
  name: 'generate_sitemap_xml',
  description: 'Generate a standard XML sitemap with support for image extensions',
  parameters: {
    type: 'object',
    properties: {
      entries: {
        type: 'array',
        items: { type: 'object', properties: { loc: { type: 'string' }, lastmod: { type: 'string' }, changefreq: { type: 'string', enum: ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'] }, priority: { type: 'number' }, images: { type: 'array', items: { type: 'string' } } }, required: ['loc'] },
      },
    },
    required: ['entries'],
  },
  execute: (args) => generateSitemapXml(args.entries as SitemapEntry[]),
};

export const auditPageSeoTool: AIToolDefinition = {
  name: 'audit_page_seo',
  description: 'Perform automated SEO quality audit on page metadata, returning a score and actionable checklist',
  parameters: {
    type: 'object',
    properties: {
      title: { type: 'string' }, description: { type: 'string' },
      h1: { type: 'string' }, ogTitle: { type: 'string' }, ogDescription: { type: 'string' },
      ogImage: { type: 'string' }, canonical: { type: 'string' }, pageUrl: { type: 'string' },
    },
    required: ['title', 'description'],
  },
  execute: (args) => auditPageSEO(args as { title: string; description: string; h1?: string; ogTitle?: string; ogDescription?: string; ogImage?: string; canonical?: string; pageUrl?: string; }),
};

export const allAITools: AIToolDefinition[] = [
  generateJsonLdSchemaTool,
  generateMerchantFeedTool,
  optimizeMetaTagsTool,
  generateSitemapXmlTool,
  auditPageSeoTool,
];