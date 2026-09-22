// ============================================================
// @boostengine/seo — v1.1.0 — Sitemap & Robots.txt Builder
// Supports image extensions and advanced robots rules
// ============================================================

import type { SitemapEntry } from './types';

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 * Generates a standard XML sitemap with optional <image:image> extensions
 */
export function generateSitemapXml(entries: SitemapEntry[]): string {
  const hasImages = entries.some((e) => e.images && e.images.length > 0);

  const urlsXml = entries
    .map((e) => {
      let entry = `  <url>\n    <loc>${escapeXml(e.loc)}</loc>`;
      if (e.lastmod) entry += `\n    <lastmod>${e.lastmod}</lastmod>`;
      if (e.changefreq) entry += `\n    <changefreq>${e.changefreq}</changefreq>`;
      if (e.priority !== undefined) entry += `\n    <priority>${e.priority.toFixed(1)}</priority>`;
      if (e.images && e.images.length > 0) {
        for (const img of e.images) {
          entry += `\n    <image:image>\n      <image:loc>${escapeXml(img)}</image:loc>\n    </image:image>`;
        }
      }
      entry += '\n  </url>';
      return entry;
    })
    .join('\n');

  const xmlns = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  const imageXmlns = 'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"';

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset ${xmlns}${hasImages ? ` ${imageXmlns}` : ''}>
${urlsXml}
</urlset>`;
}

/**
 * Generates robots.txt content with Disallow/Allow rules, sitemap index, and crawl-delay
 */
export function generateRobotsTxt(options: {
  userAgent?: string;
  disallow?: string[];
  allow?: string[];
  sitemap?: string;
  crawlDelay?: number;
}): string {
  const ua = options.userAgent || '*';
  const lines: string[] = [`User-agent: ${ua}`];

  if (options.disallow && options.disallow.length > 0) {
    for (const d of options.disallow) lines.push(`Disallow: ${d}`);
  } else {
    lines.push('Disallow:');
  }

  if (options.allow && options.allow.length > 0) {
    for (const a of options.allow) lines.push(`Allow: ${a}`);
  }

  if (options.crawlDelay !== undefined) {
    lines.push(`Crawl-delay: ${options.crawlDelay}`);
  }

  if (options.sitemap) {
    lines.push('');
    lines.push(`Sitemap: ${options.sitemap}`);
  }

  return lines.join('\n') + '\n';
}

/** Backward-compatible SitemapGenerator class */
export class SitemapGenerator {
  static generateXml = generateSitemapXml;
  static generateRobotsTxt = generateRobotsTxt;
}