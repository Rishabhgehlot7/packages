import { SitemapEntry } from './types';

export class SitemapGenerator {
  /**
   * Generates a standard XML sitemap
   */
  static generateXml(entries: SitemapEntry[]): string {
    const urlsXml = entries
      .map((e) => {
        let entry = `  <url>\n    <loc>${e.loc}</loc>`;
        if (e.lastmod) {
          entry += `\n    <lastmod>${e.lastmod}</lastmod>`;
        }
        if (e.changefreq) {
          entry += `\n    <changefreq>${e.changefreq}</changefreq>`;
        }
        if (e.priority !== undefined) {
          entry += `\n    <priority>${e.priority.toFixed(1)}</priority>`;
        }
        entry += '\n  </url>';
        return entry;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
  }
}
