import { SEOProduct, BreadcrumbItem, OrganizationConfig, FAQItem } from './types';

export class JsonLdGenerator {
  /**
   * Generates Schema.org Product JSON-LD for rich snippets in Google Search
   */
  static product(product: SEOProduct): Record<string, any> {
    const currency = product.currency || 'INR';

    let availabilityUrl = 'https://schema.org/InStock';
    if (product.availability === 'out_of_stock') {
      availabilityUrl = 'https://schema.org/OutOfStock';
    } else if (product.availability === 'preorder') {
      availabilityUrl = 'https://schema.org/PreOrder';
    }

    const schema: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.description,
      image: product.images,
      offers: {
        '@type': 'Offer',
        url: product.url,
        priceCurrency: currency,
        price: product.price,
        itemCondition:
          product.condition === 'used'
            ? 'https://schema.org/UsedCondition'
            : product.condition === 'refurbished'
            ? 'https://schema.org/RefurbishedCondition'
            : 'https://schema.org/NewCondition',
        availability: availabilityUrl,
        seller: {
          '@type': 'Organization',
          name: product.brand || 'Store',
        },
      },
    };

    if (product.brand) {
      schema.brand = {
        '@type': 'Brand',
        name: product.brand,
      };
    }

    if (product.sku) schema.sku = product.sku;
    if (product.gtin) schema.gtin = product.gtin;
    if (product.mpn) schema.mpn = product.mpn;
    if (product.category) schema.category = product.category;

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
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
        author: {
          '@type': 'Person',
          name: r.author,
        },
        ...(r.body ? { reviewBody: r.body } : {}),
        ...(r.datePublished ? { datePublished: r.datePublished } : {}),
      }));
    }

    return schema;
  }

  /**
   * Generates Schema.org BreadcrumbList JSON-LD
   */
  static breadcrumbs(items: BreadcrumbItem[]): Record<string, any> {
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
   * Generates Schema.org Organization JSON-LD
   */
  static organization(org: OrganizationConfig): Record<string, any> {
    const schema: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: org.name,
      url: org.url,
      logo: org.logo,
    };

    if (org.contactPoint) {
      schema.contactPoint = {
        '@type': 'ContactPoint',
        telephone: org.contactPoint.telephone,
        contactType: org.contactPoint.contactType,
        ...(org.contactPoint.areaServed ? { areaServed: org.contactPoint.areaServed } : {}),
      };
    }

    if (org.sameAs && org.sameAs.length > 0) {
      schema.sameAs = org.sameAs;
    }

    return schema;
  }

  /**
   * Generates Schema.org FAQPage JSON-LD
   */
  static faq(faqs: FAQItem[]): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer,
        },
      })),
    };
  }

  /**
   * Helper to format any Schema.org object into an HTML <script> tag
   */
  static toScriptTag(schema: Record<string, any>): string {
    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
  }
}
