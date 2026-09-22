import type {
  SEOProduct,
  BreadcrumbItem,
  OrganizationConfig,
  LocalBusinessConfig,
  FAQItem,
  HowToStep,
  ArticleItem,
} from './types';

/**
 * Generates Schema.org Product JSON-LD with Offer, AggregateRating, Review,
 * MerchantReturnPolicy, and ShippingDetails support.
 */
export function generateProductJsonLd(product: SEOProduct): Record<string, any> {
  const currency = product.currency || 'INR';
  let availabilityUrl = 'https://schema.org/InStock';
  if (product.availability === 'out_of_stock') availabilityUrl = 'https://schema.org/OutOfStock';
  else if (product.availability === 'preorder') availabilityUrl = 'https://schema.org/PreOrder';

  const offer: Record<string, any> = {
    '@type': 'Offer',
    url: product.url,
    priceCurrency: currency,
    price: product.price,
    itemCondition: product.condition === 'used'
      ? 'https://schema.org/UsedCondition'
      : product.condition === 'refurbished'
        ? 'https://schema.org/RefurbishedCondition'
        : 'https://schema.org/NewCondition',
    availability: availabilityUrl,
    seller: { '@type': 'Organization', name: product.brand || 'Store' },
  };

  if (product.returnPolicy) {
    const rp = product.returnPolicy;
    offer.hasMerchantReturnPolicy = {
      '@type': 'MerchantReturnPolicy',
      ...(rp.applicableCountry ? { applicableCountry: rp.applicableCountry } : {}),
      ...(rp.returnPolicyCategory ? { returnPolicyCategory: rp.returnPolicyCategory }
        : { returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow' }),
      ...(rp.merchantReturnDays ? { merchantReturnDays: rp.merchantReturnDays } : {}),
      ...(rp.returnMethod ? { returnMethod: rp.returnMethod }
        : { returnMethod: 'https://schema.org/ReturnByMail' }),
      ...(rp.returnFees ? { returnFees: rp.returnFees }
        : { returnFees: 'https://schema.org/FreeReturn' }),
    };
  }

  if (product.shippingDetails) {
    const sd = product.shippingDetails;
    const deliveryTime: Record<string, any> = {
      '@type': 'ShippingDeliveryTime',
      handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
      transitTime: {
        '@type': 'QuantitativeValue',
        ...(sd.deliveryTime
          ? { minValue: sd.deliveryTime.minDays, maxValue: sd.deliveryTime.maxDays }
          : { minValue: 3, maxValue: 7 }),
        unitCode: 'DAY',
      },
    };
    offer.shippingDetails = {
      '@type': 'OfferShippingDetails',
      shippingDestination: sd.shippingDestination
        ? sd.shippingDestination.map((d) => ({ '@type': 'DefinedRegion', addressCountry: d }))
        : [{ '@type': 'DefinedRegion', addressCountry: 'IN' }],
      shippingRate: sd.shippingRate
        ? { '@type': 'MonetaryAmount', value: sd.shippingRate.price, currency: sd.shippingRate.currency || currency }
        : { '@type': 'MonetaryAmount', value: 0, currency },
      deliveryTime,
    };
  }

  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images,
    offers: offer,
  };

  if (product.brand) schema.brand = { '@type': 'Brand', name: product.brand };
  if (product.sku) schema.sku = product.sku;
  if (product.gtin) schema.gtin = product.gtin;
  if (product.mpn) schema.mpn = product.mpn;
  if (product.category) schema.category = product.category;
  if (product.color) schema.color = product.color;
  if (product.size) schema.size = product.size;
  if (product.material) schema.material = product.material;
  if (product.weight) schema.weight = product.weight;

  if (product.rating && product.rating.count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.value,
      reviewCount: product.rating.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (product.reviews && product.reviews.length > 0) {
    schema.review = product.reviews.map((r) => ({
      '@type': 'Review',
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      author: { '@type': 'Person', name: r.author },
      ...(r.body ? { reviewBody: r.body } : {}),
      ...(r.datePublished ? { datePublished: r.datePublished } : {}),
    }));
  }

  return schema;
}
/**
 * Generates Schema.org BreadcrumbList JSON-LD
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generates Schema.org FAQPage JSON-LD
 */
export function generateFaqJsonLd(faqs: FAQItem[]): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/**
 * Generates Schema.org HowTo JSON-LD
 */
export function generateHowToJsonLd(
  name: string,
  description: string,
  steps: HowToStep[],
  totalTime?: string
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name,
    description,
    ...(totalTime ? { totalTime } : {}),
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.image ? { image: s.image } : {}),
      ...(s.url ? { url: s.url } : {}),
    })),
  };
}

/**
 * Generates Schema.org Article JSON-LD
 */
export function generateArticleJsonLd(article: ArticleItem): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    url: article.url,
    image: article.image,
    datePublished: article.datePublished,
    ...(article.dateModified ? { dateModified: article.dateModified } : {}),
    author: {
      '@type': 'Person',
      name: article.authorName,
      ...(article.authorUrl ? { url: article.authorUrl } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: article.publisherName,
      logo: { '@type': 'ImageObject', url: article.publisherLogo },
    },
  };
}

/**
 * Generates Schema.org Organization JSON-LD
 */
export function generateOrganizationJsonLd(org: OrganizationConfig): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    logo: org.logo,
  };

  if (org.description) schema.description = org.description;
  if (org.contactPoint) {
    schema.contactPoint = {
      '@type': 'ContactPoint',
      telephone: org.contactPoint.telephone,
      contactType: org.contactPoint.contactType,
      ...(org.contactPoint.areaServed ? { areaServed: org.contactPoint.areaServed } : {}),
    };
  }
  if (org.sameAs && org.sameAs.length > 0) schema.sameAs = org.sameAs;
  if (org.address) {
    schema.address = { '@type': 'PostalAddress', ...org.address };
  }

  return schema;
}

/**
 * Generates Schema.org LocalBusiness JSON-LD
 */
export function generateLocalBusinessJsonLd(business: LocalBusinessConfig): Record<string, any> {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    url: business.url,
    logo: business.logo,
    ...(business.description ? { description: business.description } : {}),
    ...(business.priceRange ? { priceRange: business.priceRange } : {}),
    ...(business.images ? { image: business.images } : {}),
  };

  if (business.contactPoint) schema.telephone = business.contactPoint.telephone;
  if (business.address) schema.address = { '@type': 'PostalAddress', ...business.address };
  if (business.sameAs && business.sameAs.length > 0) schema.sameAs = business.sameAs;
  if (business.openingHours && business.openingHours.length > 0) {
    schema.openingHoursSpecification = business.openingHours.map((oh) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: oh.dayOfWeek,
      opens: oh.opens,
      closes: oh.closes,
    }));
  }
  if (business.servesCuisine) schema.servesCuisine = business.servesCuisine;

  return schema;
}

/**
 * Generates Schema.org ItemList JSON-LD
 */
export function generateItemListJsonLd(
  items: { name: string; url: string; image?: string }[],
  listType: 'ItemList' | 'ProductList' = 'ItemList'
): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': listType,
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: item.name,
        url: item.url,
        ...(item.image ? { image: item.image } : {}),
      },
    })),
  };
}

/**
 * Helper to format any Schema.org object into an HTML <script> tag
 */
export function toScriptTag(schema: Record<string, any>): string {
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

/** Backward-compatible JsonLdGenerator class wrapping all functions */
export class JsonLdGenerator {
  static product = generateProductJsonLd;
  static breadcrumbs = generateBreadcrumbJsonLd;
  static faq = generateFaqJsonLd;
  static howTo = generateHowToJsonLd;
  static article = generateArticleJsonLd;
  static organization = generateOrganizationJsonLd;
  static localBusiness = generateLocalBusinessJsonLd;
  static itemList = generateItemListJsonLd;
  static toScriptTag = toScriptTag;
}