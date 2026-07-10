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
// lookup below is a plain slug -> entry map built with import.meta.glob
// rather than astro:content's reference()/getEntry().
const solutionsModules = import.meta.glob("/src/data/pages/solutions/**/*.json", {
  eager: true,
  import: "default",
}) as Record<string, any>;
const indoorBillboardsModules = import.meta.glob("/src/data/pages/indoor-billboards/*.json", {
  eager: true,
  import: "default",
}) as Record<string, any>;

function bySlug(modules: Record<string, any>, baseDir: string): Record<string, any> {
  const map: Record<string, any> = {};
  for (const [filePath, data] of Object.entries(modules)) {
    const slug = filePath
      .replace(baseDir, "")
      .replace(/^\//, "")
      .replace(/\.json$/, "");
    map[slug] = data;
  }
  return map;
}

const solutionsBySlug = bySlug(solutionsModules, "/src/data/pages/solutions");
const indoorBillboardsBySlug = bySlug(indoorBillboardsModules, "/src/data/pages/indoor-billboards");

function heroImageOf(entry: any): string | undefined {
  const hero = (entry?.sections || []).find((s: any) => s.discriminant === "hero");
  return hero?.value?.image;
}

export interface RelatableCard {
  title?: string;
  href?: string;
  solutionsLink?: string | null;
  indoorBillboardLink?: string | null;
}

function linkedEntry(card: RelatableCard): any {
  if (card.solutionsLink) return solutionsBySlug[card.solutionsLink];
  if (card.indoorBillboardLink) return indoorBillboardsBySlug[card.indoorBillboardLink];
  return undefined;
}

export function resolveCardHref(card: RelatableCard): string {
  if (card.solutionsLink) return `/solutions/${card.solutionsLink}`;
  if (card.indoorBillboardLink) return `/indoor-billboards/${card.indoorBillboardLink}`;
  return card.href ?? "#";
}

export function resolveCardImage(card: RelatableCard): string | undefined {
  return heroImageOf(linkedEntry(card));
}

export function resolveCardTitle(card: RelatableCard): string | undefined {
  return linkedEntry(card)?.title ?? card.title;
}
