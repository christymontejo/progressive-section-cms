// ============================================
// GLOBAL SITE CONFIGURATION
// Reads from src/content/settings/site.json via siteConfig
// ============================================

import { siteConfig } from '../config/site';

export const SITE_NAME = siteConfig.business.name;
export const SITE_URL = siteConfig.seo.siteUrl;
export const SITE_DESCRIPTION = siteConfig.seo.defaultDescription;

export function getPageTitle(pageTitle?: string): string {
  if (!pageTitle) return siteConfig.seo.defaultTitle;
  return `${pageTitle} — ${siteConfig.seo.siteName}`;
}

export default siteConfig;
