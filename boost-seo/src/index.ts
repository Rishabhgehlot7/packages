// ============================================================
// @boostengine/seo v1.1.0 — Industry-King eCommerce SEO Engine
// JSON-LD, Google Merchant Feed, Sitemaps, Next.js Metadata,
// AI Agent Toolkit, React Hooks & Components
// ============================================================

// Core Engine
export {
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
  generateFaqJsonLd,
  generateHowToJsonLd,
  generateArticleJsonLd,
  generateOrganizationJsonLd,
  generateLocalBusinessJsonLd,
  generateItemListJsonLd,
  toScriptTag,
  JsonLdGenerator,
  generateMerchantFeed,
  generateMetaCatalogCsv,
  ProductFeedGenerator,
  generateSitemapXml,
  generateRobotsTxt,
  SitemapGenerator,
  generateNextMetadata,
  NextSeoHelper,
  auditPageSEO,
} from './core/index';

// AI Agent Toolkit (re-exported from the AI module)
export {
  generateJsonLdSchemaTool,
  generateMerchantFeedTool,
  optimizeMetaTagsTool,
  generateSitemapXmlTool,
  auditPageSeoTool,
  allAITools,
  findTool,
  executeToolCall,
  toOpenAIFunctions,
  toAnthropicTools,
} from './ai/index';

// Re-export all types from core
export type {
  SEOProduct,
  SEOProductReview,
  BreadcrumbItem,
  OrganizationConfig,
  LocalBusinessConfig,
  FAQItem,
  HowToStep,
  ArticleItem,
  SitemapEntry,
  NextMetadataOptions,
  SEOAuditResult,
  FeedStoreInfo,
  ShippingRate,
} from './core/index';