// "Smart Hybrid" relational data for promo cards that link to a real page
// (home.json's hero cards, navbar.json's megamenu "featured" cards):
// link, image, AND title are all pulled live from the linked
// Solutions/Indoor Billboards entry via a Keystatic fields.relationship
// value (the target entry's slug), so all three automatically follow that
// page if it's ever updated, renamed, or moved. Only the description/
// blurb stays independent, curated marketing copy (fields.text in
// keystatic.config.ts) - that's the one thing this round's instructions
// explicitly want decoupled.
//
// Neither target collection has its own dedicated "featured image" field -
// every entry does have a real `hero` section image, which is what's used
// here as the synced image source. Title is the entry's own top-level
// `title` (the same field that generates its slug).
//
// The front-end reads plain JSON directly (no astro:content collections in
// this project - see src/content.config.ts, which is dead code), so the
// lookups below are plain slug -> entry maps built with import.meta.glob
// rather than astro:content's reference()/getEntry().
//
// "Solutions" is 3 separate real Keystatic collections
// (solutionsFoundational/solutionsLeadGen/solutionsBranding), one per real
// subfolder, so a relationship value is only ever unique within its own
// subfolder (fields.relationship can't span multiple collections) - hence
// 3 separate slug maps/category prefixes below instead of 1 combined map.
function bySlug(baseDir: string): Record<string, any> {
  const modules = import.meta.glob("/src/data/pages/**/*.json", {
    eager: true,
    import: "default",
  }) as Record<string, any>;
  const map: Record<string, any> = {};
  for (const [filePath, data] of Object.entries(modules)) {
    if (!filePath.startsWith(baseDir + "/")) continue;
    const slug = filePath.replace(baseDir + "/", "").replace(/\.json$/, "");
    map[slug] = data;
  }
  return map;
}

const SOLUTIONS_CATEGORIES = {
  solutionsFoundationalLink: "foundational",
  solutionsLeadGenLink: "lead-gen",
  solutionsBrandingLink: "branding-awareness",
} as const;

const solutionsBySlugByCategory: Record<string, Record<string, any>> = Object.fromEntries(
  Object.values(SOLUTIONS_CATEGORIES).map((category) => [
    category,
    bySlug(`/src/data/pages/solutions/${category}`),
  ])
);
const indoorBillboardsBySlug = bySlug("/src/data/pages/indoor-billboards");

function heroImageOf(entry: any): string | undefined {
  const hero = (entry?.sections || []).find((s: any) => s.discriminant === "hero");
  return hero?.value?.image;
}

export interface RelatableCard {
  title?: string;
  href?: string;
  solutionsFoundationalLink?: string | null;
  solutionsLeadGenLink?: string | null;
  solutionsBrandingLink?: string | null;
  indoorBillboardLink?: string | null;
}

function solutionsLinkOf(card: RelatableCard): { category: string; slug: string } | undefined {
  for (const key of Object.keys(SOLUTIONS_CATEGORIES) as (keyof typeof SOLUTIONS_CATEGORIES)[]) {
    const slug = card[key];
    if (slug) return { category: SOLUTIONS_CATEGORIES[key], slug };
  }
  return undefined;
}

function linkedEntry(card: RelatableCard): any {
  const solutionsLink = solutionsLinkOf(card);
  if (solutionsLink) return solutionsBySlugByCategory[solutionsLink.category][solutionsLink.slug];
  if (card.indoorBillboardLink) return indoorBillboardsBySlug[card.indoorBillboardLink];
  return undefined;
}

export function resolveCardHref(card: RelatableCard): string {
  const solutionsLink = solutionsLinkOf(card);
  if (solutionsLink) return `/solutions/${solutionsLink.category}/${solutionsLink.slug}`;
  if (card.indoorBillboardLink) return `/indoor-billboards/${card.indoorBillboardLink}`;
  return card.href ?? "#";
}

export function resolveCardImage(card: RelatableCard): string | undefined {
  return heroImageOf(linkedEntry(card));
}

export function resolveCardTitle(card: RelatableCard): string | undefined {
  return linkedEntry(card)?.title ?? card.title;
}
