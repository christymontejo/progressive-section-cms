// ===========================================
// SITE CONFIGURATION
// Reads from src/content/settings/site.json
// ===========================================

import siteData from '../content/settings/site.json';

export const siteConfig = {
  // Business Information
  business: {
    name: siteData.business?.name || "Dealer Template 8",
    fullName: siteData.business?.fullName || "Dealer Template 8",
    tagline: siteData.business?.tagline || "Premium Marketing Solutions",
    description: siteData.business?.description || "Premium marketing solutions including website design, social media management, and indoor billboard advertising.",
  },

  // Location
  location: {
    city: siteData.location?.city || "Denver",
    state: siteData.location?.state || "CO",
    address: siteData.location?.address || "Denver, CO",
    fullAddress: siteData.location?.fullAddress || "Denver, CO",
  },

  // Contact
  contact: {
    email: siteData.contact?.email || "dealertemplate8@email.com",
    phone: siteData.contact?.phone || "9034201090",
    phoneFormatted: siteData.contact?.phoneFormatted || "903-420-1090",
  },

  // Brand Colors
  colors: {
    primary: siteData.colors?.primary || "#1a2b5c",
    secondary: siteData.colors?.secondary || "#00bba9",
    tertiary: siteData.colors?.tertiary || "#00bba9",
    quaternary: siteData.colors?.quaternary || "#ffffff",
  },

  // Logo
  logo: {
    src: siteData.logo?.src || "/logo/dealer-logo-small.webp",
    alt: siteData.logo?.alt || "Dealer Template 8 Logo",
  },

  // Social Media
  social: {
    facebook: siteData.social?.facebook || "",
    instagram: siteData.social?.instagram || "",
    linkedin: siteData.social?.linkedin || "",
    twitter: siteData.social?.twitter || "",
    youtube: siteData.social?.youtube || "",
  },

  // SEO
  seo: {
    siteName: siteData.seo?.siteName || "Dealer Template 8",
    defaultTitle: siteData.seo?.defaultTitle || "Dealer Template 8",
    defaultDescription: siteData.seo?.defaultDescription || "Premium marketing solutions including website design, social media management, and indoor billboard advertising.",
    keywords: siteData.seo?.keywords || "Denver marketing agency, digital marketing Denver",
    siteUrl: siteData.seo?.siteUrl || "https://dealer-template-8.vercel.app",
    ogImage: siteData.seo?.ogImage || "/logo/dealer-logo-small.webp",
    twitterHandle: siteData.seo?.twitterHandle || "@dealer-template-8",
  },

  // Analytics
  analytics: {
    googleAnalyticsId: siteData.analytics?.googleAnalyticsId || "",
  },
}

// Helper to get location-aware text
export function getLocationText(text: string) {
  return text
    .replaceAll("{city}", siteConfig.location.city)
    .replaceAll("{state}", siteConfig.location.state)
    .replaceAll("{business}", siteConfig.business.name)
    .replaceAll("{email}", siteConfig.contact.email)
    .replaceAll("{phone}", siteConfig.contact.phone)
    .replaceAll("{phoneFormatted}", siteConfig.contact.phoneFormatted)
}

// Recursively replace {city}, {state}, {business} in all string values of an object/array
export function localizeData<T>(data: T): T {
  if (typeof data === "string") return getLocationText(data) as T
  if (Array.isArray(data)) return data.map(item => localizeData(item)) as T
  if (data !== null && typeof data === "object") {
    const result: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(data)) {
      result[key] = localizeData(value)
    }
    return result as T
  }
  return data
}
