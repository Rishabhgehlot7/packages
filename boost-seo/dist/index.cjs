'use strict';

// src/jsonld.ts
var JsonLdGenerator = class {
  /**
   * Generates Schema.org Product JSON-LD for rich snippets in Google Search
   */
  static product(product) {
    const currency = product.currency || "INR";
    let availabilityUrl = "https://schema.org/InStock";
    if (product.availability === "out_of_stock") {
      availabilityUrl = "https://schema.org/OutOfStock";
    } else if (product.availability === "preorder") {
      availabilityUrl = "https://schema.org/PreOrder";
    }
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: product.description,
      image: product.images,
      offers: {
        "@type": "Offer",
        url: product.url,
        priceCurrency: currency,
        price: product.price,
        itemCondition: product.condition === "used" ? "https://schema.org/UsedCondition" : product.condition === "refurbished" ? "https://schema.org/RefurbishedCondition" : "https://schema.org/NewCondition",
        availability: availabilityUrl,
        seller: {
          "@type": "Organization",
          name: product.brand || "Store"
        }
      }
    };
    if (product.brand) {
      schema.brand = {
        "@type": "Brand",
        name: product.brand
      };
    }
    if (product.sku) schema.sku = product.sku;
    if (product.gtin) schema.gtin = product.gtin;
    if (product.mpn) schema.mpn = product.mpn;
    if (product.category) schema.category = product.category;
    if (product.rating && product.rating.count > 0) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: product.rating.value,
        reviewCount: product.rating.count,
        bestRating: 5,
        worstRating: 1
      };
    }
    if (product.reviews && product.reviews.length > 0) {
      schema.review = product.reviews.map((r) => ({
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1
        },
        author: {
          "@type": "Person",
          name: r.author
        },
        ...r.body ? { reviewBody: r.body } : {},
        ...r.datePublished ? { datePublished: r.datePublished } : {}
      }));
    }
    return schema;
  }
  /**
   * Generates Schema.org BreadcrumbList JSON-LD
   */
  static breadcrumbs(items) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };
  }
  /**
   * Generates Schema.org Organization JSON-LD
   */
  static organization(org) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: org.name,
      url: org.url,
      logo: org.logo
    };
    if (org.contactPoint) {
      schema.contactPoint = {
        "@type": "ContactPoint",
        telephone: org.contactPoint.telephone,
        contactType: org.contactPoint.contactType,
        ...org.contactPoint.areaServed ? { areaServed: org.contactPoint.areaServed } : {}
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
  static faq(faqs) {
    return {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.answer
        }
      }))
    };
  }
  /**
   * Helper to format any Schema.org object into an HTML <script> tag
   */
  static toScriptTag(schema) {
    return `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`;
  }
};

// src/feeds.ts
var ProductFeedGenerator = class {
  static escapeXml(unsafe) {
    return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }
  static escapeCsv(field) {
    if (field === void 0 || field === null) return '""';
    const str = String(field).replace(/"/g, '""');
    return `"${str}"`;
  }
  /**
   * Generates a fully compliant Google Merchant Center RSS 2.0 XML Feed
   */
  static googleMerchantXml(store, products) {
    const itemsXml = products.map((p) => {
      const currency = p.currency || "INR";
      let availability = "in_stock";
      if (p.availability === "out_of_stock") availability = "out_of_stock";
      if (p.availability === "preorder") availability = "preorder";
      const mainImage = p.images[0] || "";
      const additionalImages = p.images.slice(1);
      let item = `    <item>
      <g:id>${this.escapeXml(p.id)}</g:id>
      <g:title>${this.escapeXml(p.title)}</g:title>
      <g:description>${this.escapeXml(p.description)}</g:description>
      <g:link>${this.escapeXml(p.url)}</g:link>
      <g:image_link>${this.escapeXml(mainImage)}</g:image_link>
      <g:condition>${p.condition || "new"}</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${p.price.toFixed(2)} ${currency}</g:price>`;
      if (p.brand) {
        item += `
      <g:brand>${this.escapeXml(p.brand)}</g:brand>`;
      }
      if (p.category) {
        item += `
      <g:product_type>${this.escapeXml(p.category)}</g:product_type>`;
      }
      if (p.gtin) {
        item += `
      <g:gtin>${this.escapeXml(p.gtin)}</g:gtin>`;
      }
      if (p.mpn) {
        item += `
      <g:mpn>${this.escapeXml(p.mpn)}</g:mpn>`;
      }
      for (const addImg of additionalImages) {
        item += `
      <g:additional_image_link>${this.escapeXml(addImg)}</g:additional_image_link>`;
      }
      item += "\n    </item>";
      return item;
    }).join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${this.escapeXml(store.title)}</title>
    <link>${this.escapeXml(store.link)}</link>
    <description>${this.escapeXml(store.description)}</description>
${itemsXml}
  </channel>
</rss>`;
  }
  /**
   * Generates Meta / Facebook Commerce Manager Product Catalog CSV
   */
  static metaCatalogCsv(products) {
    const headers = [
      "id",
      "title",
      "description",
      "availability",
      "condition",
      "price",
      "link",
      "image_link",
      "brand"
    ];
    const rows = products.map((p) => {
      const currency = p.currency || "INR";
      let availability = "in stock";
      if (p.availability === "out_of_stock") availability = "out of stock";
      if (p.availability === "preorder") availability = "available for order";
      return [
        this.escapeCsv(p.id),
        this.escapeCsv(p.title),
        this.escapeCsv(p.description),
        this.escapeCsv(availability),
        this.escapeCsv(p.condition || "new"),
        this.escapeCsv(`${p.price.toFixed(2)} ${currency}`),
        this.escapeCsv(p.url),
        this.escapeCsv(p.images[0] || ""),
        this.escapeCsv(p.brand || "")
      ].join(",");
    });
    return [headers.join(","), ...rows].join("\n");
  }
};

// src/sitemap.ts
var SitemapGenerator = class {
  /**
   * Generates a standard XML sitemap
   */
  static generateXml(entries) {
    const urlsXml = entries.map((e) => {
      let entry = `  <url>
    <loc>${e.loc}</loc>`;
      if (e.lastmod) {
        entry += `
    <lastmod>${e.lastmod}</lastmod>`;
      }
      if (e.changefreq) {
        entry += `
    <changefreq>${e.changefreq}</changefreq>`;
      }
      if (e.priority !== void 0) {
        entry += `
    <priority>${e.priority.toFixed(1)}</priority>`;
      }
      entry += "\n  </url>";
      return entry;
    }).join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
  }
};

// src/next.ts
var NextSeoHelper = class {
  /**
   * Generates Next.js App Router compatible Metadata object for a product page
   */
  static generateProductMetadata(product, options = {}) {
    const siteName = options.siteName || product.brand || "Store";
    const currency = product.currency || "INR";
    return {
      title: `${product.title} | ${siteName}`,
      description: product.description,
      alternates: {
        canonical: product.url
      },
      openGraph: {
        title: product.title,
        description: product.description,
        url: product.url,
        siteName,
        images: product.images.map((img) => ({
          url: img,
          alt: product.title
        })),
        locale: options.locale || "en_IN",
        type: "website"
      },
      twitter: {
        card: "summary_large_image",
        title: product.title,
        description: product.description,
        images: product.images.slice(0, 1),
        creator: options.twitterHandle
      },
      other: {
        "product:price:amount": product.price.toString(),
        "product:price:currency": currency,
        "product:availability": product.availability || "in_stock",
        ...product.brand ? { "product:brand": product.brand } : {}
      }
    };
  }
};

exports.JsonLdGenerator = JsonLdGenerator;
exports.NextSeoHelper = NextSeoHelper;
exports.ProductFeedGenerator = ProductFeedGenerator;
exports.SitemapGenerator = SitemapGenerator;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map