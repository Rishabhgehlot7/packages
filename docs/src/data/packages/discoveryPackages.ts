import { PackageDoc } from '../../types';

export const discoveryPackages: PackageDoc[] = [
  {
    id: 'boost-search',
    name: '@boostengine/search',
    categoryId: 'discovery',
    version: '1.1.0',
    description: 'Typo-tolerant instant client & server search engine with multi-faceted filtering, live facet aggregations, and URL query synchronization.',
    badge: 'Instant Search',
    npmInstall: 'npm i @boostengine/search',
    bundleSize: '5.8 KB',
    useCase: 'Gives shoppers lightning-fast sub-5ms search with typo tolerance without paying $500/mo for Algolia.',
    features: [
      'Levenshtein typo-tolerance algorithm (e.g. "shrt" finds "shirt")',
      'Multi-facet filtering: Category, Brand, Size, Color, Price Range',
      'Dynamic facet counts (e.g. shows "Cotton (14)", "Polyester (6)")',
      'Zero external server dependency — runs client-side or on Node.js'
    ],
    apiMethods: [
      {
        name: 'searchCatalog',
        signature: 'searchCatalog(query: string, items: Product[], filters?: SearchFilters): SearchResult',
        description: 'Searches product array and returns ranked matches + facet counts.',
        params: [
          { name: 'query', type: 'string', description: 'Search term', required: true },
          { name: 'items', type: 'Product[]', description: 'Catalog items array', required: true }
        ],
        returns: 'SearchResult with hits, totalCount, and facetCounts'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Root Engine + ./react',
        language: 'typescript',
        code: `import { searchCatalog } from '@boostengine/search';
import { SearchProvider, useSearch, useSearchAutocomplete, useURLSearchSync } from '@boostengine/search/react';

// Server: headless typo-tolerant search with facets
const result = searchCatalog('sneker', products, { filters: { priceMax: 4000 } });

// Client: live search box with URL-synced filters
export function SearchBox() {
  const { results, query, setQuery, facets } = useSearch();
  useURLSearchSync(); // ?q=...&priceMax=...
  return <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" />;
}`
      },
      {
        title: 'Typo-Tolerant Search with Facets',
        language: 'typescript',
        code: `import { searchCatalog } from '@boostengine/search';

const result = searchCatalog('sneker', [] as any, {
  filters: { priceMax: 4000, inStockOnly: true }
} as any);

console.log(\`Found \${result.totalCount} products matching 'sneker':\`);`
      }
    ]
  },
  {
    id: 'boost-seo',
    name: '@boostengine/seo',
    categoryId: 'discovery',
    version: '1.1.0',
    description: 'Full eCommerce SEO Suite: Schema.org Product/Breadcrumbs/FAQ JSON-LD generator, Google Merchant Center XML feed, and Meta Catalog CSV exporter.',
    badge: 'SEO & Feeds',
    npmInstall: 'npm i @boostengine/seo',
    bundleSize: '4.6 KB',
    useCase: 'Powers Google Shopping product sync and rich search snippets with price, stock, and star ratings.',
    features: [
      'Automated Schema.org Product, Offer & AggregateRating JSON-LD',
      'Google Merchant Center compliant RSS 2.0 / XML Product Feed generator',
      'Meta Facebook/Instagram Catalog CSV export formatter',
      'Dynamic OpenGraph (OG) image metadata generators'
    ],
    apiMethods: [
      {
        name: 'generateProductJsonLd',
        signature: 'generateProductJsonLd(product: Product, brand: BrandInfo): string',
        description: 'Returns schema.org JSON-LD string ready for Next.js head.',
        params: [
          { name: 'product', type: 'Product', description: 'Product entity with title, price, mrp, sku, reviews', required: true }
        ],
        returns: 'string - JSON-LD payload'
      },
      {
        name: 'generateGoogleMerchantXml',
        signature: 'generateGoogleMerchantXml(products: Product[]): string',
        description: 'Generates valid XML feed for Google Merchant Center shopping sync.',
        params: [
          { name: 'products', type: 'Product[]', description: 'Catalog items', required: true }
        ],
        returns: 'string - Valid XML feed'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Root + ./react + ./ai',
        language: 'typescript',
        code: `// Root: JSON-LD, sitemaps, Google Merchant XML, Meta Catalog CSV
import { generateProductJsonLd, generateGoogleMerchantXml, generateSitemapXml } from '@boostengine/seo';

// ./react: Next.js metadata hooks
import { useProductJsonLd, useBreadcrumbJsonLd, useMetaTags } from '@boostengine/seo/react';

// ./ai: AI SEO toolkit (agent-ready tool definitions)
import { seoTools, auditPageSeoTool } from '@boostengine/seo/ai';

// Example from the task spec:
const jsonLd = generateProductJsonLd(product, { name: 'BootsIndia', url: 'https://bootsindia.com' });
const richSnippet = useProductJsonLd(jsonLd); // <script type="application/ld+json">
const audit = auditPageSeoTool('/products/linen-kurti'); // audit for SEO health`
      },
      {
        title: 'Next.js App Router SEO Integration',
        language: 'typescript',
        code: `import { generateProductJsonLd } from '@boostengine/seo';

export function ProductSEO({ product }: any) {
  const jsonLd = generateProductJsonLd(product, { name: 'BootsIndia', url: 'https://bootsindia.com' } as any);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd }}
    />
  );
}`
      }
    ]
  },
  {
    id: 'boost-analytics',
    name: '@boostengine/analytics',
    categoryId: 'discovery',
    version: '1.1.0',
    description: 'Unified eCommerce Analytics Tracker broadcasting events across GA4, Meta Pixel, PostHog, and Mixpanel with multi-destination support and React hydration.',
    badge: 'Multi-Destination Pixel',
    npmInstall: 'npm i @boostengine/analytics',
    bundleSize: '5.0 KB',
    useCase: 'Fire 1 event in your code (e.g. `trackAddToCart`) and automatically notify GA4, Meta Pixel, PostHog, and Mixpanel simultaneously.',
    features: [
      'Unified tracking calls: trackViewItem, trackAddToCart, trackPurchase',
      'Multi-destination broadcasting: GA4, Meta Pixel, PostHog & Mixpanel in 1 call',
      'Full currency and tax support for Meta Pixel & Google Analytics 4',
      'Deduplication support between browser Pixel and Server Conversions API (CAPI)',
      'Customer Data Platform (CDP) style event routing with middleware pipeline'
    ],
    apiMethods: [
      {
        name: 'trackPurchase',
        signature: 'trackPurchase(order: OrderAnalyticsPayload): void',
        description: 'Broadcasts Purchase event to all configured analytics pixels.',
        params: [
          { name: 'order', type: 'OrderAnalyticsPayload', description: 'orderId, value, currency, tax, shipping, items array', required: true }
        ],
        returns: 'void'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Root + ./react + ./agent',
        language: 'typescript',
        code: `import { trackViewItem, trackAddToCart, trackPurchase } from '@boostengine/analytics';

// ./react: hydration-safe analytics provider for React apps
import { AnalyticsProvider, useAnalytics } from '@boostengine/analytics/react';

// ./agent: broadcast a purchase to every configured destination (GA4 + Meta + PostHog + Mixpanel)
trackPurchase({
  orderId: 'ORD-1001',
  value: 2499,
  currency: 'INR',
  tax: 120,
  shipping: 0,
  items: [{ item_id: 'SKU-001', item_name: 'Linen Kurti', price: 1499, quantity: 1 }]
} as any);`
      },
      {
        title: '1-Line Omnichannel Event Tracking',
        language: 'typescript',
        code: `import { trackAddToCart } from '@boostengine/analytics';

// Broadcast to Meta Pixel + GA4 + TikTok + Pinterest in 1 line
trackAddToCart({
  item_id: 'SKU-001',
  item_name: 'Linen Kurti',
  price: 1499,
  currency: 'INR',
  quantity: 1
} as any);`
      }
    ]
  },
  {
    id: 'boost-collections',
    name: '@boostengine/collections',
    categoryId: 'discovery',
    version: '1.2.0',
    description: 'API Collection & Mock Suite: Postman v2.1, OpenAPI 3.0, Bruno exporters, one-line cURL generator, and an ./ai toolkit for agent-driven API workflows.',
    badge: 'API Tooling Suite',
    npmInstall: 'npm i @boostengine/collections',
    bundleSize: '3.9 KB',
    useCase: 'Generate Postman / OpenAPI / Bruno / cURL artifacts from a single product-definition and drive the whole collection toolkit from a chat agent.',
    features: [
      'Official Postman v2.1 collection JSON export',
      'OpenAPI 3.0 schema export for CI / SDK codegen',
      'Bruno (hoffman) collection export for git-native API testing',
      'One-line cURL request generator',
      './ai agent toolkit (collectionTools, executeCollectionTool) for LLM-driven API setup'
    ],
    apiMethods: [
      {
        name: 'exportCollection',
        signature: 'exportCollection(platform: string): PostmanCollection',
        description: 'Returns loaded collection JSON for specified provider.',
        params: [
          { name: 'platform', type: 'string', description: 'razorpay | shiprocket | cashfree | delhivery | boostengine', required: true }
        ],
        returns: 'PostmanCollection object'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Root Exporters + ./ai Toolkit',
        language: 'typescript',
        code: `// Root: Postman v2.1, OpenAPI 3.0, Bruno, and cURL generation
import { getCollection, exportToOpenAPI, exportToBruno, generateCurl, listCollections } from '@boostengine/collections';

// ./ai: agent-ready collection toolkit (OpenAI / MCP compatible)
import { collectionTools, executeCollectionTool, getCollectionSystemPrompt } from '@boostengine/collections/ai';

const postman = getCollection('shiprocket');   // Postman v2.1 collection
const openApi = exportToOpenAPI('boostengine'); // OpenAPI 3.0 (v1.2.0)
const bruno = exportToBruno('cart');           // git-native Bruno collection
const curl = generateCurl(getCollection('payments').requests[0] as any); // 1-line cURL

// Let an LLM agent generate & run API requests:
const toolResult = executeCollectionTool('export_collection', { platform: 'catalog' });`
      },
      {
        title: 'Export Collection for Postman Runner',
        language: 'typescript',
        code: `import { exportCollection } from '@boostengine/collections';

const postmanJson = exportCollection('shiprocket');
// Save or pipe to Newman CLI for automated regression testing`
      }
    ]
  }
];
