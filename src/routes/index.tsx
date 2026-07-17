import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { readFile } from "node:fs/promises";
import { tools } from "~/data/tools";

const getSiteConfig = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const cfg = JSON.parse(await readFile("site.json", "utf8")) as {
      businessName?: string;
      description?: string;
    };
    return {
      businessName: cfg.businessName?.trim() ?? "ZeroBuild",
      description:
        cfg.description?.trim() ??
        "We find, build, and document zero-cost passive income streams.",
    };
  } catch {
    return {
      businessName: "ZeroBuild",
      description: "We find, build, and document zero-cost passive income streams.",
    };
  }
});

export const Route = createFileRoute("/")({
  loader: () => getSiteConfig(),
  component: Home,
});

function Home() {
  const site = Route.useLoaderData();

  // Featured tools for the homepage
  const featuredTools = tools.filter(
    (t) => t.truly_free && t.slug !== "chatgpt"
  ).slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-4xl px-6 pb-20 pt-20 sm:pt-28 text-center">
          <span className="inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
            🔍 No fluff. No credit card needed.
          </span>
          <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Find the Best AI Tools —{" "}
            <span className="text-indigo-600">Tested & Compared</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-gray-600 sm:text-xl">
            We test AI tools side-by-side with the same prompts, same tasks, and
            same criteria. Compare free tier limits, real pricing, and output
            quality — all verified, all transparent.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/compare/ai-writing-tools"
              className="rounded-xl bg-indigo-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Compare AI Writing Tools →
            </Link>
            <Link
              to="/compare/ai-image-generators"
              className="rounded-xl bg-purple-600 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-purple-700 transition-colors"
            >
              Compare AI Image Generators →
            </Link>
            <Link
              to="/compare"
              className="rounded-xl border border-gray-200 px-8 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              See all comparisons
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How We Compare Tools
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Test Free Tiers",
                body: "We sign up for every free tier ourselves — no credit cards, no sneaky trials. We verify the actual limits, features, and catch the fine print.",
              },
              {
                step: "2",
                title: "Same Prompt, Fair Test",
                body: "Every tool gets the same prompt. Same task, same criteria. We evaluate output quality, speed, and ease of use apples-to-apples.",
              },
              {
                step: "3",
                title: "Transparent Results",
                body: "We publish side-by-side comparisons with real output samples, real pricing data, and honest affiliate links — so you can decide for yourself.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center sm:text-left"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                  {item.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Free Tools */}
      <section className="bg-gray-50 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Best Free AI Writing Tools
              </h2>
              <p className="mt-2 text-gray-600">
                These tools offer genuine free tiers — no credit card, no trial
                expiration. Start writing today.
              </p>
            </div>
            <Link
              to="/compare/ai-writing-tools"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Full comparison →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {featuredTools.map((tool) => (
              <Link
                key={tool.slug}
                to="/compare/ai-writing-tools"
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-200"
              >
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Free Tier
                  </span>
                  <span className="text-xs text-gray-400">No CC</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {tool.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {tool.description.slice(0, 120)}…
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-800">
                    {tool.free_tier_value_score}
                  </span>
                  <span className="text-xs text-gray-500">Free Value Score</span>
                </div>
                <p className="mt-2 text-xs text-indigo-600 font-medium">
                  {tool.free_tier_limits.words_per_month
                    ? `${(tool.free_tier_limits.words_per_month / 1000).toFixed(0)}K words/mo free`
                    : "Free tier available"}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Free Image Tools */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Best Free AI Image Generators
              </h2>
              <p className="mt-2 text-gray-600">
                These tools offer genuine free tiers — no credit card, no trial
                expiration. Start creating images today.
              </p>
            </div>
            <Link
              to="/compare/ai-image-generators"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              Full comparison →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {tools
              .filter((t) => t.category === "AI Image Generators" && t.truly_free)
              .slice(0, 3)
              .map((tool) => (
                <Link
                  key={tool.slug}
                  to="/compare/ai-image-generators"
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-indigo-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      Free Tier
                    </span>
                    <span className="text-xs text-gray-400">No CC</span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {tool.description.slice(0, 120)}…
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-800">
                      {tool.free_tier_value_score}
                    </span>
                    <span className="text-xs text-gray-500">Free Value Score</span>
                  </div>
                  <p className="mt-2 text-xs text-indigo-600 font-medium">
                    {tool.free_tier_limits.images_per_month
                      ? `${tool.free_tier_limits.images_per_month} images/mo free`
                      : "Free tier available"}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Email Subscribe Section */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Get new comparisons delivered
          </h2>
          <p className="mt-3 text-gray-600">
            One email per new comparison — no spam, no courses, no upsells. Just
            honest tool reviews and real side-by-side data.
          </p>
          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="you@email.com"
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-base placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors sm:flex-shrink-0"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-3 text-xs text-gray-400">
            No spam, ever. We'll only email when a new comparison goes live.
          </p>
        </div>
      </section>
    </>
  );
}
