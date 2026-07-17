import { useState, useMemo } from "react";
import type { Tool } from "~/data/tools";
import {
  getAffiliateUrl,
  hasAffiliateProgram,
  affiliateLinkAttrs,
  AffiliateBadge,
} from "~/utils/affiliate";

type SortKey = "name" | "free_value" | "free_words" | "free_images" | "paid_price" | "requires_cc";

interface ToolComparisonProps {
  tools: Tool[];
  className?: string;
}

export default function ToolComparison({ tools, className }: ToolComparisonProps) {
  // Auto-detect category: if all tools are AI Image Generators, show image metrics
  const isImageCategory = tools.length > 0 && tools.every((t) => t.category === "AI Image Generators");

  const defaultSort: SortKey = isImageCategory ? "free_images" : "free_words";
  const [sortKey, setSortKey] = useState<SortKey>(defaultSort);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sorted = useMemo(() => {
    const arr = [...tools];
    arr.sort((a, b) => {
      let va: number | string = 0;
      let vb: number | string = 0;
      switch (sortKey) {
        case "name":
          va = a.name;
          vb = b.name;
          break;
        case "free_value":
          va = a.free_tier_value_score;
          vb = b.free_tier_value_score;
          break;
        case "free_words":
          va = a.free_tier_limits.words_per_month ?? 0;
          vb = b.free_tier_limits.words_per_month ?? 0;
          break;
        case "free_images":
          va = a.free_tier_limits.images_per_month ?? 0;
          vb = b.free_tier_limits.images_per_month ?? 0;
          break;
        case "paid_price":
          va = a.pricing_tiers.find((t) => t.price_monthly > 0)?.price_monthly ?? 999;
          vb = b.pricing_tiers.find((t) => t.price_monthly > 0)?.price_monthly ?? 999;
          break;
        case "requires_cc":
          va = a.requires_credit_card ? 1 : 0;
          vb = b.requires_credit_card ? 1 : 0;
          break;
      }
      if (typeof va === "string" && typeof vb === "string") {
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      return 0;
    });
    return arr;
  }, [tools, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "requires_cc" ? "asc" : "desc");
    }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <span className="ml-1 text-gray-300">↕</span>;
    return <span className="ml-1 text-indigo-600">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const firstPaidPrice = (tool: Tool): string => {
    const tier = tool.pricing_tiers.find((t) => t.price_monthly > 0);
    return tier ? `$${tier.price_monthly}/mo` : "N/A";
  };

  const freeWordsDisplay = (tool: Tool): string => {
    const w = tool.free_tier_limits.words_per_month;
    if (w === undefined || w === 0) return "—";
    if (w >= 1000) return `${(w / 1000).toFixed(0)}K/mo`;
    return `${w}/mo`;
  };

  const freeImagesDisplay = (tool: Tool): string => {
    const i = tool.free_tier_limits.images_per_month;
    if (i === undefined || i === 0) return "—";
    if (i >= 1000) return `${(i / 1000).toFixed(0)}K/mo`;
    return `${i}/mo`;
  };

  const freeLimitsDisplay = (tool: Tool): { value: string; label: string } => {
    if (isImageCategory) {
      const i = tool.free_tier_limits.images_per_month;
      if (i === undefined || i === 0) return { value: "—", label: "" };
      return { value: `${i}/mo`, label: "images" };
    }
    const w = tool.free_tier_limits.words_per_month;
    if (w === undefined || w === 0) return { value: "—", label: "" };
    if (w >= 1000) return { value: `${(w / 1000).toFixed(0)}K/mo`, label: "words" };
    return { value: `${w}/mo`, label: "words" };
  };

  const scoreColor = (score: number): string => {
    if (score >= 7) return "bg-green-100 text-green-800";
    if (score >= 4) return "bg-amber-100 text-amber-800";
    return "bg-red-100 text-red-800";
  };

  // --- desktop table columns ---
  interface ColDef {
    key: SortKey | "cta";
    label: string;
    sortable: boolean;
    className?: string;
  }

  const freeLimitLabel = isImageCategory ? "Free Images" : "Free Words";
  const activeFreeSortKey: SortKey = isImageCategory ? "free_images" : "free_words";

  const columns: ColDef[] = [
    { key: "name", label: "Tool", sortable: true, className: "text-left" },
    { key: activeFreeSortKey, label: freeLimitLabel, sortable: true, className: "text-left" },
    { key: "paid_price", label: "Paid From", sortable: true, className: "text-left" },
    { key: "requires_cc", label: "No CC?", sortable: true, className: "text-center" },
    { key: "free_value", label: "Free Score", sortable: true, className: "text-center" },
    { key: "cta", label: "", sortable: false, className: "text-right" },
  ];

  const renderFreeLimitCell = (tool: Tool) => {
    if (isImageCategory) {
      return (
        <>
          <span className="font-medium">{freeImagesDisplay(tool)}</span>
          <p className="text-xs text-gray-400 mt-0.5 max-w-40">
            {tool.free_tier_limits.description.slice(0, 60)}…
          </p>
        </>
      );
    }
    return (
      <>
        <span className="font-medium">{freeWordsDisplay(tool)}</span>
        <p className="text-xs text-gray-400 mt-0.5 max-w-40">
          {tool.free_tier_limits.description.slice(0, 60)}…
        </p>
      </>
    );
  };

  return (
    <div className={className}>
      {/* ---- Desktop Table ---- */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 font-semibold text-gray-600 ${col.className} ${
                    col.sortable ? "cursor-pointer select-none hover:text-indigo-600" : ""
                  }`}
                  onClick={() => col.sortable && toggleSort(col.key as SortKey)}
                >
                  {col.label}
                  {col.sortable && <SortIcon column={col.key as SortKey} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((tool) => (
              <tr
                key={tool.slug}
                className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{toolIcon(tool.slug)}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{tool.name}</p>
                      <p className="text-xs text-gray-500 max-w-48 truncate">
                        {tool.description.slice(0, 80)}…
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-gray-700">
                  {renderFreeLimitCell(tool)}
                </td>
                <td className="px-4 py-4 font-medium text-gray-900">
                  {firstPaidPrice(tool)}
                </td>
                <td className="px-4 py-4 text-center">
                  {tool.requires_credit_card ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                      ✕ Required
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                      ✓ Not required
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-center">
                  <span
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${scoreColor(tool.free_tier_value_score)}`}
                  >
                    {tool.free_tier_value_score}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <AffiliateCta tool={tool} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---- Mobile Cards ---- */}
      <div className="md:hidden space-y-4">
        {sorted.map((tool) => (
          <div
            key={tool.slug}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{toolIcon(tool.slug)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{tool.description.slice(0, 100)}…</p>
                </div>
              </div>
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${scoreColor(tool.free_tier_value_score)}`}
              >
                {tool.free_tier_value_score}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-400">Free Tier</p>
                {isImageCategory ? (
                  <p className="font-medium text-gray-900">{freeImagesDisplay(tool)}</p>
                ) : (
                  <p className="font-medium text-gray-900">{freeWordsDisplay(tool)}</p>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400">Paid From</p>
                <p className="font-medium text-gray-900">{firstPaidPrice(tool)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Credit Card</p>
                {tool.requires_credit_card ? (
                  <span className="text-red-600 font-medium">Required</span>
                ) : (
                  <span className="text-green-600 font-medium">Not required</span>
                )}
              </div>
              <div>
                <p className="text-xs text-gray-400">Free Score</p>
                <p className="font-medium text-gray-900">{tool.free_tier_value_score}/10</p>
              </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
              {tool.free_tier_limits.description}
            </p>

            <div className="mt-4">
              <AffiliateCta tool={tool} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AffiliateCta({ tool }: { tool: Tool }) {
  const url = getAffiliateUrl(tool.slug);
  if (!url) {
    return (
      <span className="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-400">
        No affiliate program
      </span>
    );
  }
  return (
    <div className="flex flex-col items-end gap-1">
      <a
        href={url}
        {...affiliateLinkAttrs}
        className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
      >
        Try {tool.name} →
        <AffiliateBadge />
      </a>
    </div>
  );
}

/** Simple emoji icons per tool for visual differentiation */
function toolIcon(slug: string): string {
  const map: Record<string, string> = {
    "jasper-ai": "🧠",
    "copy-ai": "📝",
    writesonic: "⚡",
    rytr: "✍️",
    anyword: "📊",
    chatgpt: "🤖",
    "leonardo-ai": "🎨",
    "canva-ai": "🖼️",
    "adobe-firefly": "🔥",
    runwayml: "🎬",
    midjourney: "🖌️",
    "dall-e": "🤖",
  };
  return map[slug] ?? "🔧";
}
