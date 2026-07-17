import { createFileRoute, Link } from "@tanstack/react-router";
import { comparisonCategories } from "~/data/tools";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      {
        title: "AI Tool Comparisons — ZeroBuild",
      },
      {
        name: "description",
        content:
          "Side-by-side comparisons of the best free and paid AI tools. Real free tier limits, pricing, and honest testing — no fluff, no credit card required to read.",
      },
      { property: "og:title", content: "AI Tool Comparisons — ZeroBuild" },
      {
        property: "og:description",
        content:
          "Side-by-side comparisons of the best free and paid AI tools. Real data, real tests, zero cost.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CompareHub,
});

function CompareHub() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24">
      {/* Hero */}
      <div className="text-center sm:text-left">
        <span className="inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
          🔍 Honest Comparisons
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          AI Tool Comparisons
        </h1>
        <p className="mt-3 text-lg text-gray-600 max-w-2xl">
          We test AI tools side-by-side with the same prompts, same tasks, same
          criteria. No sponsored placements — just real results, real free tier
          limits, and transparent affiliate links.
        </p>
      </div>

      {/* Category Cards */}
      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {comparisonCategories.map((cat) => (
          <Link
            key={cat.slug}
            to="/compare/$category"
            params={{ category: cat.slug }}
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-200"
          >
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                {cat.toolCount} tools
              </span>
            </div>
            <h2 className="mt-3 text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
              {cat.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              {cat.description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-indigo-600 group-hover:text-indigo-800 transition-colors">
              View comparison →
            </span>
          </Link>
        ))}
      </div>

      {/* Coming soon placeholder */}
      <div className="mt-10 rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <p className="text-gray-500 font-medium">More comparisons coming soon</p>
        <p className="mt-1 text-sm text-gray-400">
          AI video generators, SEO tools, free SaaS alternatives — we're testing them all.
        </p>
      </div>
    </div>
  );
}
