'use strict';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/core/schema.ts
function generateProductJsonLd(product) {
  const currency = product.currency || "INR";
  let availabilityUrl = "https://schema.org/InStock";
  if (product.availability === "out_of_stock") availabilityUrl = "https://schema.org/OutOfStock";
  else if (product.availability === "preorder") availabilityUrl = "https://schema.org/PreOrder";
  const offer = {
    "@type": "Offer",
    url: product.url,
    priceCurrency: currency,
    price: product.price,
    itemCondition: product.condition === "used" ? "https://schema.org/UsedCondition" : product.condition === "refurbished" ? "https://schema.org/RefurbishedCondition" : "https://schema.org/NewCondition",
    availability: availabilityUrl,
    seller: { "@type": "Organization", name: product.brand || "Store" }
  };
  if (product.returnPolicy) {
    const rp = product.returnPolicy;
    offer.hasMerchantReturnPolicy = {
      "@type": "MerchantReturnPolicy",
      ...rp.applicableCountry ? { applicableCountry: rp.applicableCountry } : {},
      ...rp.returnPolicyCategory ? { returnPolicyCategory: rp.returnPolicyCategory } : { returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow" },
      ...rp.merchantReturnDays ? { merchantReturnDays: rp.merchantReturnDays } : {},
      ...rp.returnMethod ? { returnMethod: rp.returnMethod } : { returnMethod: "https://schema.org/ReturnByMail" },
      ...rp.returnFees ? { returnFees: rp.returnFees } : { returnFees: "https://schema.org/FreeReturn" }
    };
  }
  if (product.shippingDetails) {
    const sd = product.shippingDetails;
    const deliveryTime = {
      "@type": "ShippingDeliveryTime",
      handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
      transitTime: {
        "@type": "QuantitativeValue",
        ...sd.deliveryTime ? { minValue: sd.deliveryTime.minDays, maxValue: sd.deliveryTime.maxDays } : { minValue: 3, maxValue: 7 },
        unitCode: "DAY"
      }
    };
    offer.shippingDetails = {
      "@type": "OfferShippingDetails",
      shippingDestination: sd.shippingDestination ? sd.shippingDestination.map((d) => ({ "@type": "DefinedRegion", addressCountry: d })) : [{ "@type": "DefinedRegion", addressCountry: "IN" }],
      shippingRate: sd.shippingRate ? { "@type": "MonetaryAmount", value: sd.shippingRate.price, currency: sd.shippingRate.currency || currency } : { "@type": "MonetaryAmount", value: 0, currency },
      deliveryTime
    };
  }
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    offers: offer
  };
  if (product.brand) schema.brand = { "@type": "Brand", name: product.brand };
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
      reviewRating: { "@type": "Rating", ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      author: { "@type": "Person", name: r.author },
      ...r.body ? { reviewBody: r.body } : {},
      ...r.datePublished ? { datePublished: r.datePublished } : {}
    }));
  }
  return schema;
}
function generateBreadcrumbJsonLd(items) {
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
function generateFaqJsonLd(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer }
    }))
  };
}
function generateHowToJsonLd(name, description, steps, totalTime) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    ...totalTime ? { totalTime } : {},
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...s.image ? { image: s.image } : {},
      ...s.url ? { url: s.url } : {}
    }))
  };
}
function generateArticleJsonLd(article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    url: article.url,
    image: article.image,
    datePublished: article.datePublished,
    ...article.dateModified ? { dateModified: article.dateModified } : {},
    author: {
      "@type": "Person",
      name: article.authorName,
      ...article.authorUrl ? { url: article.authorUrl } : {}
    },
    publisher: {
      "@type": "Organization",
      name: article.publisherName,
      logo: { "@type": "ImageObject", url: article.publisherLogo }
    }
  };
}
function generateOrganizationJsonLd(org) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    url: org.url,
    logo: org.logo
  };
  if (org.description) schema.description = org.description;
  if (org.contactPoint) {
    schema.contactPoint = {
      "@type": "ContactPoint",
      telephone: org.contactPoint.telephone,
      contactType: org.contactPoint.contactType,
      ...org.contactPoint.areaServed ? { areaServed: org.contactPoint.areaServed } : {}
    };
  }
  if (org.sameAs && org.sameAs.length > 0) schema.sameAs = org.sameAs;
  if (org.address) {
    schema.address = { "@type": "PostalAddress", ...org.address };
  }
  return schema;
}
function generateLocalBusinessJsonLd(business) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: business.name,
    url: business.url,
    logo: business.logo,
    ...business.description ? { description: business.description } : {},
    ...business.priceRange ? { priceRange: business.priceRange } : {},
    ...business.images ? { image: business.images } : {}
  };
  if (business.contactPoint) schema.telephone = business.contactPoint.telephone;
  if (business.address) schema.address = { "@type": "PostalAddress", ...business.address };
  if (business.sameAs && business.sameAs.length > 0) schema.sameAs = business.sameAs;
  if (business.openingHours && business.openingHours.length > 0) {
    schema.openingHoursSpecification = business.openingHours.map((oh) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: oh.dayOfWeek,
      opens: oh.opens,
      closes: oh.closes
    }));
  }
  if (business.servesCuisine) schema.servesCuisine = business.servesCuisine;
  return schema;
}
function generateItemListJsonLd(items, listType = "ItemList") {
  return {
    "@context": "https://schema.org",
    "@type": listType,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: item.name,
        url: item.url,
        ...item.image ? { image: item.image } : {}
      }
    }))
  };
}
function toScriptTag(schema) {
  return `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`;
}
var JsonLdGenerator = class {
};
__publicField(JsonLdGenerator, "product", generateProductJsonLd);
__publicField(JsonLdGenerator, "breadcrumbs", generateBreadcrumbJsonLd);
__publicField(JsonLdGenerator, "faq", generateFaqJsonLd);
__publicField(JsonLdGenerator, "howTo", generateHowToJsonLd);
__publicField(JsonLdGenerator, "article", generateArticleJsonLd);
__publicField(JsonLdGenerator, "organization", generateOrganizationJsonLd);
__publicField(JsonLdGenerator, "localBusiness", generateLocalBusinessJsonLd);
__publicField(JsonLdGenerator, "itemList", generateItemListJsonLd);
__publicField(JsonLdGenerator, "toScriptTag", toScriptTag);

// src/core/feeds.ts
function escapeXml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
function escapeCsv(field) {
  if (field === void 0 || field === null) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}
function generateMerchantFeed(store, products) {
  const itemsXml = products.map((p) => {
    const currency = p.currency || "INR";
    let availability = "in_stock";
    if (p.availability === "out_of_stock") availability = "out_of_stock";
    if (p.availability === "preorder") availability = "preorder";
    const mainImage = p.images[0] || "";
    const additionalImages = p.images.slice(1);
    let item = `    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <g:title>${escapeXml(p.title)}</g:title>
      <g:description>${escapeXml(p.description)}</g:description>
      <g:link>${escapeXml(p.url)}</g:link>
      <g:image_link>${escapeXml(mainImage)}</g:image_link>
      <g:condition>${p.condition || "new"}</g:condition>
      <g:availability>${availability}</g:availability>
      <g:price>${p.price.toFixed(2)} ${currency}</g:price>`;
    if (p.brand) item += `
      <g:brand>${escapeXml(p.brand)}</g:brand>`;
    if (p.googleProductCategory) {
      item += `
      <g:google_product_category>${escapeXml(p.googleProductCategory)}</g:google_product_category>`;
    }
    if (p.gtin) item += `
      <g:gtin>${escapeXml(p.gtin)}</g:gtin>`;
    if (p.mpn) item += `
      <g:mpn>${escapeXml(p.mpn)}</g:mpn>`;
    if (p.sku) item += `
      <g:sku>${escapeXml(p.sku)}</g:sku>`;
    if (p.color) item += `
      <g:color>${escapeXml(p.color)}</g:color>`;
    if (p.size) item += `
      <g:size>${escapeXml(p.size)}</g:size>`;
    if (p.material) item += `
      <g:material>${escapeXml(p.material)}</g:material>`;
    if (p.shippingDetails && p.shippingDetails.shippingRate) {
      const sr = p.shippingDetails.shippingRate;
      item += `
      <g:shipping>
        <g:country>${p.shippingDetails.shippingDestination?.[0] || "IN"}</g:country>
        <g:service>Standard</g:service>
        <g:price>${sr.price.toFixed(2)} ${sr.currency || currency}</g:price>
      </g:shipping>`;
    }
    for (const addImg of additionalImages) {
      item += `
      <g:additional_image_link>${escapeXml(addImg)}</g:additional_image_link>`;
    }
    item += "\n    </item>";
    return item;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${escapeXml(store.title)}</title>
    <link>${escapeXml(store.link)}</link>
    <description>${escapeXml(store.description)}</description>
${itemsXml}
  </channel>
</rss>`;
}
function generateMetaCatalogCsv(products) {
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
    let availability = "in stock";
    if (p.availability === "out_of_stock") availability = "out of stock";
    if (p.availability === "preorder") availability = "available for order";
    return [
      escapeCsv(p.id),
      escapeCsv(p.title),
      escapeCsv(p.description),
      escapeCsv(availability),
      escapeCsv(p.condition || "new"),
      escapeCsv(`${p.price.toFixed(2)} ${p.currency || "INR"}`),
      escapeCsv(p.url),
      escapeCsv(p.images[0] || ""),
      escapeCsv(p.brand || "")
    ].join(",");
  });
  return [headers.join(","), ...rows].join("\n");
}
var ProductFeedGenerator = class {
};
__publicField(ProductFeedGenerator, "googleMerchantXml", generateMerchantFeed);
__publicField(ProductFeedGenerator, "metaCatalogCsv", generateMetaCatalogCsv);

// src/core/sitemap.ts
function escapeXml2(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function generateSitemapXml(entries) {
  const hasImages = entries.some((e) => e.images && e.images.length > 0);
  const urlsXml = entries.map((e) => {
    let entry = `  <url>
    <loc>${escapeXml2(e.loc)}</loc>`;
    if (e.lastmod) entry += `
    <lastmod>${e.lastmod}</lastmod>`;
    if (e.changefreq) entry += `
    <changefreq>${e.changefreq}</changefreq>`;
    if (e.priority !== void 0) entry += `
    <priority>${e.priority.toFixed(1)}</priority>`;
    if (e.images && e.images.length > 0) {
      for (const img of e.images) {
        entry += `
    <image:image>
      <image:loc>${escapeXml2(img)}</image:loc>
    </image:image>`;
      }
    }
    entry += "\n  </url>";
    return entry;
  }).join("\n");
  const xmlns = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  const imageXmlns = 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${xmlns}${hasImages ? ` ${imageXmlns}` : ""}>
${urlsXml}
</urlset>`;
}
function generateRobotsTxt(options) {
  const ua = options.userAgent || "*";
  const lines = [`User-agent: ${ua}`];
  if (options.disallow && options.disallow.length > 0) {
    for (const d of options.disallow) lines.push(`Disallow: ${d}`);
  } else {
    lines.push("Disallow:");
  }
  if (options.allow && options.allow.length > 0) {
    for (const a of options.allow) lines.push(`Allow: ${a}`);
  }
  if (options.crawlDelay !== void 0) {
    lines.push(`Crawl-delay: ${options.crawlDelay}`);
  }
  if (options.sitemap) {
    lines.push("");
    lines.push(`Sitemap: ${options.sitemap}`);
  }
  return lines.join("\n") + "\n";
}
var SitemapGenerator = class {
};
__publicField(SitemapGenerator, "generateXml", generateSitemapXml);
__publicField(SitemapGenerator, "generateRobotsTxt", generateRobotsTxt);

// src/core/metadata.ts
function generateNextMetadata(product, options = {}) {
  const siteName = options.siteName || product.brand || "Store";
  const currency = product.currency || "INR";
  const meta = {
    title: options.titleTemplate ? options.titleTemplate.replace("%s", product.title) : `${product.title} | ${siteName}`,
    description: product.description,
    alternates: {
      canonical: product.url,
      ...options.alternates ? options.alternates : {}
    },
    openGraph: {
      title: product.title,
      description: product.description,
      url: product.url,
      siteName,
      images: product.images.map((img) => ({ url: img, alt: product.title })),
      locale: options.locale || "en_IN",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.description,
      images: product.images.slice(0, 1),
      ...options.twitterHandle ? { creator: options.twitterHandle } : {}
    },
    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": currency,
      "product:availability": product.availability || "in_stock",
      ...product.brand ? { "product:brand": product.brand } : {}
    }
  };
  if (options.robots) {
    const { index, follow, noarchive } = options.robots;
    meta.robots = {};
    if (index !== void 0) meta.robots.index = index;
    if (follow !== void 0) meta.robots.follow = follow;
    if (noarchive !== void 0) meta.robots.noarchive = noarchive;
  }
  return meta;
}
var NextSeoHelper = class {
};
__publicField(NextSeoHelper, "generateProductMetadata", generateNextMetadata);

// src/core/audit.ts
function auditPageSEO(input) {
  const recommendations = [];
  let score = 100;
  const titleLen = input.title?.length || 0;
  let titleOk = false;
  let titleMsg = "";
  if (!input.title) {
    titleMsg = "\u274C Missing <title> tag";
    recommendations.push("Add a <title> tag (50-60 characters recommended)");
    score -= 20;
  } else if (titleLen < 30) {
    titleMsg = `\u26A0\uFE0F Title too short (${titleLen} chars). Aim for 50-60.`;
    recommendations.push(`Increase title length to 50-60 characters (current: ${titleLen})`);
    score -= 10;
  } else if (titleLen > 70) {
    titleMsg = `\u26A0\uFE0F Title too long (${titleLen} chars). Max 60 is ideal.`;
    recommendations.push(`Trim title to under 60 characters (current: ${titleLen})`);
    score -= 5;
  } else if (titleLen >= 50 && titleLen <= 60) {
    titleMsg = `\u2705 Title length is optimal (${titleLen} chars)`;
    titleOk = true;
  } else {
    titleMsg = `\u26A0\uFE0F Title length is ${titleLen} chars. Consider 50-60 range.`;
    titleOk = true;
  }
  const descLen = input.description?.length || 0;
  let descOk = false;
  let descMsg = "";
  if (!input.description) {
    descMsg = "\u274C Missing meta description";
    recommendations.push("Add a meta description (120-160 characters recommended)");
    score -= 20;
  } else if (descLen < 80) {
    descMsg = `\u26A0\uFE0F Description too short (${descLen} chars). Aim for 120-160.`;
    recommendations.push(`Increase description length to 120-160 characters (current: ${descLen})`);
    score -= 10;
  } else if (descLen > 170) {
    descMsg = `\u26A0\uFE0F Description too long (${descLen} chars). Max 160 is ideal.`;
    recommendations.push(`Trim description to under 160 characters (current: ${descLen})`);
    score -= 5;
  } else if (descLen >= 120 && descLen <= 160) {
    descMsg = `\u2705 Description length is optimal (${descLen} chars)`;
    descOk = true;
  } else {
    descMsg = `\u26A0\uFE0F Description length is ${descLen} chars. Consider 120-160 range.`;
    descOk = true;
  }
  let h1Ok = false;
  let h1Msg = "";
  if (!input.h1) {
    h1Msg = "\u274C Missing <h1> tag";
    recommendations.push("Add an <h1> tag with primary keyword");
    score -= 15;
  } else {
    h1Msg = `\u2705 <h1> tag present: "${input.h1.substring(0, 60)}"`;
    h1Ok = true;
  }
  let ogOk = false;
  let ogMsg = "";
  const ogChecks = [];
  if (!input.ogTitle) ogChecks.push("og:title");
  if (!input.ogDescription) ogChecks.push("og:description");
  if (!input.ogImage) ogChecks.push("og:image");
  if (ogChecks.length === 0) {
    ogMsg = "\u2705 All OpenGraph tags present (title, description, image)";
    ogOk = true;
  } else if (ogChecks.length >= 2) {
    ogMsg = `\u274C Missing OpenGraph tags: ${ogChecks.join(", ")}`;
    recommendations.push(`Add missing OpenGraph meta tags: ${ogChecks.join(", ")}`);
    score -= 15;
  } else {
    ogMsg = `\u26A0\uFE0F Missing OpenGraph tag: ${ogChecks[0]}`;
    recommendations.push(`Add missing OpenGraph meta tag: ${ogChecks[0]}`);
    score -= 8;
  }
  let canonicalOk = false;
  let canonicalMsg = "";
  if (!input.canonical) {
    canonicalMsg = "\u274C Missing canonical URL";
    recommendations.push("Add a canonical URL tag to prevent duplicate content issues");
    score -= 15;
  } else if (input.pageUrl && !input.canonical.includes(input.pageUrl.replace(/\/$/, ""))) {
    canonicalMsg = `\u26A0\uFE0F Canonical "${input.canonical}" doesn't match page URL "${input.pageUrl}"`;
    recommendations.push("Ensure canonical URL matches the page URL");
    score -= 10;
  } else {
    canonicalMsg = `\u2705 Canonical URL present: "${input.canonical}"`;
    canonicalOk = true;
  }
  score = Math.max(0, Math.min(100, score));
  return {
    score,
    title: { ok: titleOk, length: titleLen, message: titleMsg },
    description: { ok: descOk, length: descLen, message: descMsg },
    h1: { ok: h1Ok, message: h1Msg },
    openGraph: { ok: ogOk, message: ogMsg },
    canonical: { ok: canonicalOk, message: canonicalMsg },
    recommendations
  };
}

// src/ai/tools.ts
var generateJsonLdSchemaTool = {
  name: "generate_jsonld_schema",
  description: "Generate valid JSON-LD for Schema.org entity types",
  parameters: {
    type: "object",
    properties: {
      type: { type: "string", enum: ["Product", "BreadcrumbList", "FAQPage", "HowTo", "Article", "Organization", "LocalBusiness", "ItemList"], description: "Schema.org type" },
      data: { type: "object", description: "Data for the schema entity" }
    },
    required: ["type", "data"]
  },
  execute: (args) => {
    const { type, data } = args;
    switch (type) {
      case "Product":
        return generateProductJsonLd(data);
      case "BreadcrumbList":
        return generateBreadcrumbJsonLd(data.items);
      case "FAQPage":
        return generateFaqJsonLd(data.faqs);
      case "HowTo":
        return generateHowToJsonLd(data.name, data.description, data.steps, data.totalTime);
      case "Article":
        return generateArticleJsonLd(data);
      case "Organization":
        return generateOrganizationJsonLd(data);
      case "LocalBusiness":
        return generateLocalBusinessJsonLd(data);
      case "ItemList":
        return generateItemListJsonLd(data.items || [], data.listType);
      default:
        throw new Error("Unknown schema type");
    }
  }
};
var generateMerchantFeedTool = {
  name: "generate_merchant_feed",
  description: "Generate a Google Merchant Center RSS 2.0 XML feed from an array of products",
  parameters: {
    type: "object",
    properties: {
      store: { type: "object", properties: { title: { type: "string" }, link: { type: "string" }, description: { type: "string" } }, required: ["title", "link", "description"] },
      products: { type: "array", items: { type: "object" } }
    },
    required: ["store", "products"]
  },
  execute: (args) => generateMerchantFeed(args.store, args.products)
};
var optimizeMetaTagsTool = {
  name: "optimize_meta_tags",
  description: "Analyze product/page data and generate high-CTR optimized title and meta description",
  parameters: {
    type: "object",
    properties: {
      productName: { type: "string" },
      productDescription: { type: "string" },
      brand: { type: "string" },
      category: { type: "string" },
      price: { type: "number" },
      siteName: { type: "string" }
    },
    required: ["productName", "productDescription", "siteName"]
  },
  execute: (args) => {
    const { productName, productDescription, brand, category, price, siteName } = args;
    let title = productName;
    if (brand) title = brand + " " + title;
    if (title.length < 40 && category) title = title + " - " + category;
    title = title + " | " + siteName;
    if (title.length > 60) {
      title = productName + " | " + siteName;
      if (title.length > 60) title = productName.substring(0, 55) + "...";
    }
    let desc = productDescription;
    if (desc.length < 90 && brand) desc = desc + " From " + brand + ".";
    if (desc.length < 90 && price) desc = desc + " Starting at $" + price + ".";
    if (desc.length > 160) desc = desc.substring(0, 157) + "...";
    return { title, description: desc, titleLength: title.length, descriptionLength: desc.length, recommendations: [] };
  }
};
var generateSitemapXmlTool = {
  name: "generate_sitemap_xml",
  description: "Generate a standard XML sitemap with support for image extensions",
  parameters: {
    type: "object",
    properties: {
      entries: {
        type: "array",
        items: { type: "object", properties: { loc: { type: "string" }, lastmod: { type: "string" }, changefreq: { type: "string", enum: ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"] }, priority: { type: "number" }, images: { type: "array", items: { type: "string" } } }, required: ["loc"] }
      }
    },
    required: ["entries"]
  },
  execute: (args) => generateSitemapXml(args.entries)
};
var auditPageSeoTool = {
  name: "audit_page_seo",
  description: "Perform automated SEO quality audit on page metadata, returning a score and actionable checklist",
  parameters: {
    type: "object",
    properties: {
      title: { type: "string" },
      description: { type: "string" },
      h1: { type: "string" },
      ogTitle: { type: "string" },
      ogDescription: { type: "string" },
      ogImage: { type: "string" },
      canonical: { type: "string" },
      pageUrl: { type: "string" }
    },
    required: ["title", "description"]
  },
  execute: (args) => auditPageSEO(args)
};
var allAITools = [
  generateJsonLdSchemaTool,
  generateMerchantFeedTool,
  optimizeMetaTagsTool,
  generateSitemapXmlTool,
  auditPageSeoTool
];

// src/ai/agent.ts
function findTool(name) {
  return allAITools.find((t) => t.name === name);
}
function executeToolCall(name, args) {
  const tool = findTool(name);
  if (!tool) {
    throw new Error(`Unknown AI tool: "${name}". Available tools: ${allAITools.map((t) => t.name).join(", ")}`);
  }
  return tool.execute(args);
}
function toOpenAIFunctions() {
  return allAITools.map((tool) => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }
  }));
}
function toAnthropicTools() {
  return allAITools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.parameters
  }));
}

exports.JsonLdGenerator = JsonLdGenerator;
exports.NextSeoHelper = NextSeoHelper;
exports.ProductFeedGenerator = ProductFeedGenerator;
exports.SitemapGenerator = SitemapGenerator;
exports.allAITools = allAITools;
exports.auditPageSEO = auditPageSEO;
exports.auditPageSeoTool = auditPageSeoTool;
exports.executeToolCall = executeToolCall;
exports.findTool = findTool;
exports.generateArticleJsonLd = generateArticleJsonLd;
exports.generateBreadcrumbJsonLd = generateBreadcrumbJsonLd;
exports.generateFaqJsonLd = generateFaqJsonLd;
exports.generateHowToJsonLd = generateHowToJsonLd;
exports.generateItemListJsonLd = generateItemListJsonLd;
exports.generateJsonLdSchemaTool = generateJsonLdSchemaTool;
exports.generateLocalBusinessJsonLd = generateLocalBusinessJsonLd;
exports.generateMerchantFeed = generateMerchantFeed;
exports.generateMerchantFeedTool = generateMerchantFeedTool;
exports.generateMetaCatalogCsv = generateMetaCatalogCsv;
exports.generateNextMetadata = generateNextMetadata;
exports.generateOrganizationJsonLd = generateOrganizationJsonLd;
exports.generateProductJsonLd = generateProductJsonLd;
exports.generateRobotsTxt = generateRobotsTxt;
exports.generateSitemapXml = generateSitemapXml;
exports.generateSitemapXmlTool = generateSitemapXmlTool;
exports.optimizeMetaTagsTool = optimizeMetaTagsTool;
exports.toAnthropicTools = toAnthropicTools;
exports.toOpenAIFunctions = toOpenAIFunctions;
exports.toScriptTag = toScriptTag;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map