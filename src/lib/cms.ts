// Shared constants/helpers between keystatic.config.ts (Node, outside Vite -
// uses process.env directly) and Astro app code (middleware, admin pages,
// API routes - must use import.meta.env). This module only exports plain
// values plus one import.meta.env-based helper; keystatic.config.ts imports
// only the plain constants from it, never isProductionCms().
export const CMS_REPO_OWNER = "chrischiii21";
export const CMS_REPO_NAME = "progressive-keystatic";
export const CMS_REPO = `${CMS_REPO_OWNER}/${CMS_REPO_NAME}`;
export const CMS_BRANCH = "main";

export function isProductionCms(): boolean {
  return import.meta.env.PROD;
}
