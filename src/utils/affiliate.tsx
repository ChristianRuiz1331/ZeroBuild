import type { ReactNode } from "react";
import { getTool } from "~/data/tools";

/**
 * Generate an affiliate URL for a tool, with proper tracking parameters.
 * Returns undefined if the tool has no affiliate program.
 */
export function getAffiliateUrl(slug: string): string | undefined {
  const tool = getTool(slug);
  if (!tool?.affiliate_link) return undefined;
  return tool.affiliate_link;
}

/**
 * Returns the affiliate network name for a tool, if any.
 */
export function getAffiliateNetwork(slug: string): string | undefined {
  const tool = getTool(slug);
  return tool?.affiliate_network;
}

/**
 * Returns the commission rate description for a tool.
 */
export function getCommissionRate(slug: string): string | undefined {
  const tool = getTool(slug);
  return tool?.commission_rate;
}

/**
 * HTML attributes for affiliate links — rel="nofollow sponsored" for SEO compliance.
 */
export const affiliateLinkAttrs = {
  rel: "nofollow sponsored",
  target: "_blank",
} as const;

/**
 * Whether a tool has an active affiliate program.
 */
export function hasAffiliateProgram(slug: string): boolean {
  const tool = getTool(slug);
  return !!tool?.affiliate_link;
}

/**
 * FTC-compliant affiliate disclosure text.
 * Include near affiliate links to comply with FTC guidelines.
 */
export function AffiliateDisclosure({ className }: { className?: string }) {
  return (
    <p className={`text-xs text-gray-400 italic ${className ?? ""}`}>
      Some links on this page are affiliate links. If you click and sign up, we
      may earn a commission at no extra cost to you. We only recommend tools we
      have tested and believe are genuinely useful.
    </p>
  );
}

/**
 * Inline disclosure badge for use next to individual affiliate links.
 */
export function AffiliateBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700 border border-amber-200">
      Affiliate
    </span>
  );
}
