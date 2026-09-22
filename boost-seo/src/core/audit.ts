// ============================================================
// @boostengine/seo — v1.1.0 — SEO Audit & Scoring Engine
// Analyzes page metadata and returns actionable recommendations
// ============================================================

import type { SEOAuditResult } from './types';

/**
 * Performs a comprehensive SEO quality audit on a page's metadata.
 * Checks title length (50-60 chars), description length (120-160 chars),
 * H1 presence, OpenGraph tags, and canonical tag integrity.
 * Returns a score 0-100 with actionable recommendations.
 */
export function auditPageSEO(input: {
  title: string;
  description: string;
  h1?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  pageUrl?: string;
}): SEOAuditResult {
  const recommendations: string[] = [];
  let score = 100;

  // === Title Audit ===
  const titleLen = input.title?.length || 0;
  let titleOk = false;
  let titleMsg = '';
  if (!input.title) {
    titleMsg = '❌ Missing <title> tag';
    recommendations.push('Add a <title> tag (50-60 characters recommended)');
    score -= 20;
  } else if (titleLen < 30) {
    titleMsg = `⚠️ Title too short (${titleLen} chars). Aim for 50-60.`;
    recommendations.push(`Increase title length to 50-60 characters (current: ${titleLen})`);
    score -= 10;
  } else if (titleLen > 70) {
    titleMsg = `⚠️ Title too long (${titleLen} chars). Max 60 is ideal.`;
    recommendations.push(`Trim title to under 60 characters (current: ${titleLen})`);
    score -= 5;
  } else if (titleLen >= 50 && titleLen <= 60) {
    titleMsg = `✅ Title length is optimal (${titleLen} chars)`;
    titleOk = true;
  } else {
    titleMsg = `⚠️ Title length is ${titleLen} chars. Consider 50-60 range.`;
    titleOk = true;
  }

  // === Description Audit ===
  const descLen = input.description?.length || 0;
  let descOk = false;
  let descMsg = '';
  if (!input.description) {
    descMsg = '❌ Missing meta description';
    recommendations.push('Add a meta description (120-160 characters recommended)');
    score -= 20;
  } else if (descLen < 80) {
    descMsg = `⚠️ Description too short (${descLen} chars). Aim for 120-160.`;
    recommendations.push(`Increase description length to 120-160 characters (current: ${descLen})`);
    score -= 10;
  } else if (descLen > 170) {
    descMsg = `⚠️ Description too long (${descLen} chars). Max 160 is ideal.`;
    recommendations.push(`Trim description to under 160 characters (current: ${descLen})`);
    score -= 5;
  } else if (descLen >= 120 && descLen <= 160) {
    descMsg = `✅ Description length is optimal (${descLen} chars)`;
    descOk = true;
  } else {
    descMsg = `⚠️ Description length is ${descLen} chars. Consider 120-160 range.`;
    descOk = true;
  }

  // === H1 Audit ===
  let h1Ok = false;
  let h1Msg = '';
  if (!input.h1) {
    h1Msg = '❌ Missing <h1> tag';
    recommendations.push('Add an <h1> tag with primary keyword');
    score -= 15;
  } else {
    h1Msg = `✅ <h1> tag present: "${input.h1.substring(0, 60)}"`;
    h1Ok = true;
  }

  // === OpenGraph Audit ===
  let ogOk = false;
  let ogMsg = '';
  const ogChecks: string[] = [];
  if (!input.ogTitle) ogChecks.push('og:title');
  if (!input.ogDescription) ogChecks.push('og:description');
  if (!input.ogImage) ogChecks.push('og:image');

  if (ogChecks.length === 0) {
    ogMsg = '✅ All OpenGraph tags present (title, description, image)';
    ogOk = true;
  } else if (ogChecks.length >= 2) {
    ogMsg = `❌ Missing OpenGraph tags: ${ogChecks.join(', ')}`;
    recommendations.push(`Add missing OpenGraph meta tags: ${ogChecks.join(', ')}`);
    score -= 15;
  } else {
    ogMsg = `⚠️ Missing OpenGraph tag: ${ogChecks[0]}`;
    recommendations.push(`Add missing OpenGraph meta tag: ${ogChecks[0]}`);
    score -= 8;
  }

  // === Canonical Audit ===
  let canonicalOk = false;
  let canonicalMsg = '';
  if (!input.canonical) {
    canonicalMsg = '❌ Missing canonical URL';
    recommendations.push('Add a canonical URL tag to prevent duplicate content issues');
    score -= 15;
  } else if (input.pageUrl && !input.canonical.includes(input.pageUrl.replace(/\/$/, ''))) {
    canonicalMsg = `⚠️ Canonical "${input.canonical}" doesn't match page URL "${input.pageUrl}"`;
    recommendations.push('Ensure canonical URL matches the page URL');
    score -= 10;
  } else {
    canonicalMsg = `✅ Canonical URL present: "${input.canonical}"`;
    canonicalOk = true;
  }

  // Clamp score
  score = Math.max(0, Math.min(100, score));

  return {
    score,
    title: { ok: titleOk, length: titleLen, message: titleMsg },
    description: { ok: descOk, length: descLen, message: descMsg },
    h1: { ok: h1Ok, message: h1Msg },
    openGraph: { ok: ogOk, message: ogMsg },
    canonical: { ok: canonicalOk, message: canonicalMsg },
    recommendations,
  };
}