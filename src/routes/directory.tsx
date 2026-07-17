import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { tools } from "~/data/tools";
import { freeTools, directoryCategories } from "~/data/free-tools";
import type { FreeTool } from "~/data/free-tools";
import type { Tool } from "~/data/tools";

// ---- Unified display type ----
interface DirectoryTool {
  name: string;
  slug: string;
  category: string;
  free_tier_summary: string;
  classification: "truly_free" | "freemium" | "trial_ware";
  requires_credit_card: boolean;
  affiliate_program: boolean;
  affiliate_url?: string;
  best_for: string;
  url: string;
  free_tier_value_score: number;
  source: "main" | "free";
}

// ---- Map tools from main DB that appear in the directory ----
const mainDbToolSlugs = new Set([
  "chatgpt",
  "writesonic",
  "leonardo-ai",
  "canva-ai",
  "adobe-firefly",
  "runwayml",
]);

// Category mapping from main DB categories to directory categories
const categoryMap: Record<string, string> = {
  "AI Writing": "Writing",
  "AI Image Generators": "Image",
  // RunwayML is categorized as Image in main DB but Video in directory research
};

// Research-based overrides for tools from the main DB (per free-tools-directory.md)
const mainDbOverrides: Record<string, {
  category: string;
  classification: "truly_free" | "freemium" | "trial_ware";
  best_for: string;
}> = {
  chatgpt: { category: "Writing", classification: "truly_free", best_for: "General-purpose writing, brainstorming, quick drafts" },
  writesonic: { category: "Writing", classification: "freemium", best_for: "SEO articles, long-form content, marketing copy" },
  "leonardo-ai": { category: "Image", classification: "freemium", best_for: "Game assets, marketing visuals, product mockups" },
  "canva-ai": { category: "Image", classification: "freemium", best_for: "Small business owners, social media" },
  "adobe-firefly": { category: "Image", classification: "freemium", best_for: "Designers in Adobe ecosystem" },
  runwayml: { category: "Video", classification: "trial_ware", best_for: "Professional video generation" },
};

function toolToDirectoryTool(t: Tool): DirectoryTool {
  const override = mainDbOverrides[t.slug];
  const dirCategory = override?.category ?? categoryMap[t.category] ?? t.category;
  const classification = override?.classification ?? "freemium";

  return {
    name: t.name,
    slug: t.slug,
    category: dirCategory,
    free_tier_summary: t.free_tier_limits.description,
    classification,
    requires_credit_card: t.requires_credit_card,
    affiliate_program: !!t.affiliate_link,
    affiliate_url: t.affiliate_link,
    best_for: override?.best_for ?? (dirCategory === "Writing" ? "Content creation" : "Creative work"),
    url: t.url,
    free_tier_value_score: t.free_tier_value_score,
    source: "main",
  };
}

function freeToolToDirectoryTool(t: FreeTool): DirectoryTool {
  return { ...t, source: "free" };
}

// Build the combined directory
function buildDirectory(): DirectoryTool[] {
  const fromMain = tools
    .filter((t) => mainDbToolSlugs.has(t.slug))
    .map(toolToDirectoryTool);

  const fromFree = freeTools.map(freeToolToDirectoryTool);

  return [...fromMain, ...fromFree].sort(
    (a, b) => b.free_tier_value_score - a.free_tier_value_score
  );
}

// ---- FAQ structured data ----
function faqStructuredData() {
  const faqs = [
    {
      q: "What makes a tool 'truly free' vs 'freemium'?",
      a: "Truly Free tools can be used indefinitely without payment or credit card. Freemium tools offer a free tier with clear usage limits — still usable long-term, just with caps. Trial-ware tools give you full access for a limited time before requiring payment.",
    },
    {
      q: "Do any of these AI tools require a credit card?",
      a: "None of the 20 tools in our directory require a credit card to start using the free tier. We specifically curate tools that let you sign up and start using them immediately with just an email address.",
    },
    {
      q: "How do you make money from this directory?",
      a: "Some tools have affiliate programs — if you sign up for a paid plan through our links, we may earn a commission at no extra cost to you. We mark these clearly with an 'Earns commission' badge. Our recommendations remain honest and data-driven regardless of affiliate status.",
    },
    {
      q: "How often is this directory updated?",
      a: "We regularly spot-check tool limits and pricing. Last updated July 2026. If you spot something that's changed, let us know — we verify and update within 48 hours.",
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

// ---- Route ----
export const Route = createFileRoute("/directory")({
  head: () => ({
    meta: [
      {
        title:
          "Free AI Tools That Actually Work — ZeroBuild's Tested Directory (2026)",
      },
      {
        name: "description",
        content:
          "20 genuinely free AI tools tested and verified. Filter by category, see what's truly free vs freemium, no credit card required.",
      },
      {
        property: "og:title",
        content:
          "Free AI Tools That Actually Work — ZeroBuild's Tested Directory (2026)",
      },
      {
        property: "og:description",
        content:
          "20 genuinely free AI tools tested and verified. Filter by category, see what's truly free vs freemium, no credit card required.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(faqStructuredData()),
      },
    ],
  }),
  component: DirectoryPage,
});

// ---- Classification config ----
const classificationConfig: Record<
  string,
  { label: string; badgeClass: string }
> = {
  truly_free: {
    label: "Truly Free",
    badgeClass:
      "bg-green-100 text-green-800 border-green-200",
  },
  freemium: {
    label: "Freemium",
    badgeClass:
      "bg-amber-100 text-amber-800 border-amber-200",
  },
  trial_ware: {
    label: "Trial-ware",
    badgeClass: "bg-red-100 text-red-700 border-red-200",
  },
};

// ---- Component ----
function DirectoryPage() {
  const allTools = useMemo(() => buildDirectory(), []);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [classificationFilter, setClassificationFilter] = useState<string>("");
  const [noCCOnly, setNoCCOnly] = useState(false);

  const filtered = useMemo(() => {
    let results = [...allTools];

    if (activeCategory !== "All") {
      results = results.filter((t) => t.category === activeCategory);
    }

    if (classificationFilter) {
      results = results.filter(
        (t) => t.classification === classificationFilter
      );
    }

    if (noCCOnly) {
      results = results.filter((t) => !t.requires_credit_card);
    }

    return results;
  }, [allTools, activeCategory, classificationFilter, noCCOnly]);

  // Stats
  const stats = useMemo(() => {
    const trulyFree = allTools.filter(
      (t) => t.classification === "truly_free"
    ).length;
    const withAffiliate = allTools.filter((t) => t.affiliate_program).length;
    return { total: allTools.length, trulyFree, withAffiliate };
  }, [allTools]);

  return (
    <div className="min-h-dvh">
      {/* Page Header */}
      <section className="border-b border-gray-100 bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-5xl px-6 pb-12 pt-16 sm:pt-20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Free AI Tools Directory
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                20 genuinely free AI tools tested and verified — filter by
                category, see what's truly free vs freemium, no credit card
                required.
              </p>
            </div>
            <Link
              to="/compare"
              className="inline-flex items-center gap-1.5 self-start rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors sm:self-center"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              See side-by-side comparisons
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 flex flex-wrap gap-4 rounded-xl border border-gray-200 bg-white px-5 py-4 text-sm shadow-sm">
            <StatBadge
              label="tools tracked"
              value={stats.total}
              color="indigo"
            />
            <StatBadge
              label="truly free"
              value={stats.trulyFree}
              color="green"
            />
            <StatBadge
              label="with affiliate programs"
              value={stats.withAffiliate}
              color="purple"
            />
          </div>
        </div>
      </section>

      {/* Filters & Content */}
      <section className="mx-auto max-w-5xl px-6 py-10">
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          {directoryCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Classification toggles + No CC toggle */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-sm text-gray-500">Classification:</span>
          {[
            { value: "", label: "All" },
            { value: "truly_free", label: "Truly Free" },
            { value: "freemium", label: "Freemium" },
            { value: "trial_ware", label: "Trial-ware" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setClassificationFilter(opt.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                classificationFilter === opt.value
                  ? "bg-gray-900 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}

          <span className="ml-2 h-5 w-px bg-gray-200" />

          <button
            onClick={() => setNoCCOnly(!noCCOnly)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              noCCOnly
                ? "bg-green-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            No credit card required
          </button>

          {/* Active filter summary */}
          <span className="ml-auto text-xs text-gray-400">
            {filtered.length} of {allTools.length} tools
          </span>
        </div>

        {/* Results Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <p className="text-gray-400 text-lg">No tools match your filters.</p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setClassificationFilter("");
                  setNoCCOnly(false);
                }}
                className="mt-3 text-sm text-indigo-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            filtered.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="border-t border-gray-100 bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="mt-10 space-y-6">
            {[
              {
                q: "What makes a tool 'truly free' vs 'freemium'?",
                a: "Truly Free tools can be used indefinitely without payment or credit card — no time limit, no expiration. Freemium tools offer a free tier with clear usage limits (e.g., 10,000 words/month) but are still usable long-term within those caps. Trial-ware gives full access for a limited time before requiring payment.",
              },
              {
                q: "Do any of these AI tools require a credit card?",
                a: "None of the 20 tools in our directory require a credit card to start using the free tier. We specifically curate tools that let you sign up and start using them immediately — just an email address is enough.",
              },
              {
                q: "How do you make money from this directory?",
                a: "Some tools have affiliate programs — if you sign up for a paid plan through our links, we may earn a commission at no extra cost to you. We mark these clearly with an 'Earns commission' badge. Our recommendations remain honest and data-driven regardless of affiliate status.",
              },
              {
                q: "How often is this directory updated?",
                a: "We regularly spot-check tool limits and pricing. Last updated July 2026. If you spot something that's changed, reach out — we verify and update within 48 hours.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <h3 className="text-base font-semibold text-gray-900">
                  {faq.q}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ---- Sub-components ----

function StatBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "indigo" | "green" | "purple";
}) {
  const colorMap = {
    indigo: "bg-indigo-100 text-indigo-700",
    green: "bg-green-100 text-green-700",
    purple: "bg-purple-100 text-purple-700",
  };
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${colorMap[color]}`}
      >
        {value}
      </span>
      <span className="text-gray-500">{label}</span>
    </div>
  );
}

function ToolCard({ tool }: { tool: DirectoryTool }) {
  const config = classificationConfig[tool.classification] ?? classificationConfig.freemium;

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-indigo-200">
      {/* Header: name + classification badge */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-gray-900 leading-tight">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-indigo-600 transition-colors"
          >
            {tool.name}
          </a>
        </h3>
        <span
          className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${config.badgeClass}`}
        >
          {config.label}
        </span>
      </div>

      {/* Category badge */}
      <div className="mt-2">
        <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
          {tool.category}
        </span>
      </div>

      {/* Free tier summary */}
      <p className="mt-3 text-sm leading-relaxed text-gray-600 flex-1">
        {tool.free_tier_summary}
      </p>

      {/* Best for */}
      <p className="mt-2 text-xs text-gray-400">
        <span className="font-medium text-gray-500">Best for:</span>{" "}
        {tool.best_for}
      </p>

      {/* Score */}
      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700">
          {tool.free_tier_value_score}
        </span>
        <span className="text-xs text-gray-400">Free Value Score</span>
      </div>

      {/* Footer: CC badge + Affiliate indicator + CTA */}
      <div className="mt-3 flex items-center gap-2 border-t border-gray-100 pt-3">
        {/* CC Required badge */}
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
            tool.requires_credit_card
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              tool.requires_credit_card ? "bg-red-500" : "bg-green-500"
            }`}
          />
          CC: {tool.requires_credit_card ? "Required" : "Not Required"}
        </span>

        {/* Affiliate indicator */}
        {tool.affiliate_program && (
          <span
            className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-medium text-purple-600 border border-purple-100"
            title="We may earn a commission if you upgrade through this link"
          >
            Earns commission
          </span>
        )}

        {/* CTA button / link */}
        <a
          href={tool.affiliate_url || tool.url}
          target="_blank"
          rel={tool.affiliate_program ? "nofollow sponsored" : "noopener noreferrer"}
          className={`ml-auto inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            tool.affiliate_program
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {tool.affiliate_program ? "Try it free" : "Visit"}
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
