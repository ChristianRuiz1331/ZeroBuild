import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import type { CalculatorInputs, CalculatorResult, CalculatorTool } from "~/utils/calculator";
import { scoreTools, inputsToQueryParams, queryParamsToInputs, ALL_FEATURES } from "~/utils/calculator";
import { affiliateLinkAttrs } from "~/utils/affiliate";

// ── Route Definition ─────────────────────────────────────────────

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content: "Calculate which AI writing tool costs you the least based on your content volume, team size, and needed features. Compare side-by-side with real pricing.",
      },
      { title: "AI Tools Pricing Calculator — Find the Best AI Writing Tool for Your Budget (2026)" },
      { property: "og:title", content: "AI Tools Pricing Calculator — Find the Best AI Writing Tool for Your Budget (2026)" },
      {
        property: "og:description",
        content: "Calculate which AI writing tool costs you the least based on your content volume, team size, and needed features. Free, interactive, and transparent.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CalculatorPage,
});

// ── Constants ─────────────────────────────────────────────────────

const USE_CASES = ["Blog posts", "Social media", "Email marketing", "SEO content", "Ad copy", "All"] as const;
const VOLUMES = [5, 10, 20, 50, 100] as const;
const TEAM_SIZES = ["1", "2-5", "6-10", "10+"] as const;
const BUDGETS = ["$0 free only", "Under $20/mo", "$20-50/mo", "$50-100/mo", "$100+/mo", "No limit"] as const;

const FEATURE_DESCRIPTIONS: Record<string, string> = {
  "Long-form content": "Blog posts, articles, whitepapers (1,500+ words)",
  "SEO optimization": "Built-in keyword research, SERP analysis, content scoring",
  "Brand voice": "Custom tone-of-voice profiles and brand guidelines",
  "Multi-language": "Support for 25+ languages beyond English",
  "API access": "Integrate with your own apps and workflows",
  "Plagiarism checker": "Built-in originality and duplicate content detection",
};

// ── Main Component ────────────────────────────────────────────────

function CalculatorPage() {
  // Read inputs from URL query params on mount
  const [inputs, setInputs] = useState<CalculatorInputs>(() => {
    if (typeof window !== "undefined") {
      return queryParamsToInputs(new URLSearchParams(window.location.search));
    }
    return defaultInputs();
  });

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [showResults, setShowResults] = useState(false);
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Compute results
  const result: CalculatorResult = useMemo(() => {
    if (!showResults) return { tools: [], summary: { cheapest: null, bestValue: null, bestFree: null } };
    return scoreTools(inputs);
  }, [inputs, showResults]);

  // Update URL query params when inputs change (after calc)
  useEffect(() => {
    if (!showResults) return;
    const qs = inputsToQueryParams(inputs);
    const newUrl = `${window.location.pathname}?${qs}`;
    window.history.replaceState(null, "", newUrl);
  }, [inputs, showResults]);

  // Share link (only compute on client to avoid SSR breakage)
  const shareUrl = useMemo(() => {
    const qs = inputsToQueryParams(inputs);
    if (typeof window !== "undefined") {
      return `${window.location.origin}/calculator?${qs}`;
    }
    return `/calculator?${qs}`;
  }, [inputs]);

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [shareUrl]);

  const handleCalculate = () => {
    setShowResults(true);
    setStep(3);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  };

  const handleReset = () => {
    setInputs(defaultInputs());
    setShowResults(false);
    setStep(1);
    window.history.replaceState(null, "", "/calculator");
  };

  const updateInput = <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const toggleFeature = (feature: string) => {
    setInputs((prev) => {
      const features = prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature];
      return { ...prev, features };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/50 to-white">
      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 pb-8 pt-16 sm:pt-24 text-center">
        <span className="inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
          🧮 Interactive Calculator
        </span>
        <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
          AI Tools Pricing Calculator
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-gray-600">
          Find the best AI writing tool for your budget, content volume, and must-have
          features — all compared side-by-side with real pricing.
        </p>
      </section>

      {/* Wizard */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          {/* Progress Bar */}
          <div className="flex items-center gap-0 px-6 pt-6 pb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <button
                  onClick={() => s <= step && setStep(s as 1 | 2 | 3)}
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all ${
                    s === step
                      ? "bg-indigo-600 text-white shadow-md"
                      : s < step
                        ? "bg-indigo-100 text-indigo-700"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {s}
                </button>
                {s < 3 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded transition-colors ${
                      s < step ? "bg-indigo-300" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Labels */}
          <div className="flex px-6 pb-6 text-xs font-medium text-gray-500">
            <span className="flex-1">What & How Much</span>
            <span className="flex-1 text-center">Budget & Features</span>
            <span className="flex-1 text-right">Results</span>
          </div>

          {/* Step 1: Use case + volume + team */}
          {step === 1 && (
            <div className="px-6 pb-8 space-y-6 animate-in fade-in duration-300">
              <StepHeading number={1} title="What are you creating?" />

              {/* Use Case */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  I want to create…
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {USE_CASES.map((uc) => (
                    <button
                      key={uc}
                      onClick={() => updateInput("useCase", uc)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all text-left ${
                        inputs.useCase === uc
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {uc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  How many pieces per month?{" "}
                  <span className="font-normal text-gray-500">
                    ({inputs.monthlyVolume} pieces)
                  </span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={inputs.monthlyVolume}
                  onChange={(e) => updateInput("monthlyVolume", Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5</span>
                  <span>20</span>
                  <span>50</span>
                  <span>100+</span>
                </div>
              </div>

              {/* Team Size */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Team size
                </label>
                <div className="flex gap-2">
                  {TEAM_SIZES.map((ts) => (
                    <button
                      key={ts}
                      onClick={() => updateInput("teamSize", ts)}
                      className={`flex-1 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all text-center ${
                        inputs.teamSize === ts
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {ts === "1" ? "Just me" : ts}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  Next: Budget & Features →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Budget + features */}
          {step === 2 && (
            <div className="px-6 pb-8 space-y-6 animate-in fade-in duration-300">
              <StepHeading number={2} title="Budget & must-have features" />

              {/* Budget */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Monthly budget
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BUDGETS.map((b) => (
                    <button
                      key={b}
                      onClick={() => updateInput("budgetRange", b)}
                      className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all text-left ${
                        inputs.budgetRange === b
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200"
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Free Only Toggle */}
              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Free tier only</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Only show tools with a genuine free tier (no credit card)
                  </p>
                </div>
                <button
                  onClick={() => updateInput("freeOnly", !inputs.freeOnly)}
                  role="switch"
                  aria-checked={inputs.freeOnly}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                    inputs.freeOnly ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                      inputs.freeOnly ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Must-have features
                </label>
                <div className="space-y-2">
                  {ALL_FEATURES.map((feature) => (
                    <label
                      key={feature}
                      className={`flex items-start gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all ${
                        inputs.features.includes(feature)
                          ? "border-indigo-400 bg-indigo-50 ring-1 ring-indigo-200"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={inputs.features.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-indigo-600 accent-indigo-600"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">{feature}</span>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {FEATURE_DESCRIPTIONS[feature] ?? ""}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border border-gray-200 px-6 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  onClick={handleCalculate}
                  className="flex-[2] rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
                >
                  Calculate Best Tools →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {step === 3 && showResults && (
            <div ref={resultsRef} className="px-6 pb-8 space-y-6 animate-in fade-in duration-300">
              <StepHeading number={3} title="Your recommendations" />

              {/* Summary Cards */}
              <SummaryCards result={result} />

              {/* Ranked Results */}
              {result.tools.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    All tools ranked
                  </h3>
                  {result.tools.map((tool, idx) => (
                    <ToolCard key={tool.slug} tool={tool} rank={idx + 1} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No tools match your criteria.</p>
                  <p className="text-sm mt-1">Try adjusting your budget or feature requirements.</p>
                </div>
              )}

              {/* Share */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-5">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  📋 Share these results
                </p>
                <div className="flex gap-2">
                  <input
                    readOnly
                    value={shareUrl}
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 font-mono truncate focus:outline-none"
                    onFocus={(e) => e.target.select()}
                  />
                  <button
                    onClick={handleCopyLink}
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors whitespace-nowrap"
                  >
                    {copied ? "Copied ✓" : "Copy link"}
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Link includes your selections so you can share or bookmark these exact results.
                </p>
              </div>

              {/* Reset */}
              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  ← Start over with new criteria
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-3xl px-6 pb-20 text-center">
        <p className="text-sm text-gray-400">
          Data updated July 2026. Prices may change — always check the tool's website for current pricing.{" "}
          <span className="italic">Some links are affiliate links.</span>
        </p>
      </section>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────

function StepHeading({ number, title }: { number: number; title: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
        Step {number}
      </p>
      <h2 className="text-xl font-bold text-gray-900 mt-0.5">{title}</h2>
    </div>
  );
}

function SummaryCards({ result }: { result: CalculatorResult }) {
  const cards = [
    { label: "💰 Cheapest Option", tool: result.summary.cheapest, emoji: "💰" },
    { label: "⭐ Best Value", tool: result.summary.bestValue, emoji: "⭐" },
    { label: "🆓 Best Free Option", tool: result.summary.bestFree, emoji: "🆓" },
  ].filter((c) => c.tool !== null);

  if (cards.length === 0) return null;

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map((card) => {
        const t = card.tool!;
        return (
          <div
            key={card.label}
            className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-4 shadow-sm"
          >
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {card.label}
            </p>
            <p className="mt-1 text-base font-bold text-gray-900">{t.name}</p>
            <p className="text-sm text-gray-600 mt-0.5">
              {t.monthlyCost === 0 ? "Free" : `$${t.monthlyCost}/mo`}
            </p>
            <p className="text-xs text-indigo-600 font-medium mt-1">
              Score: {t.score}/100
            </p>
          </div>
        );
      })}
    </div>
  );
}

function ToolCard({ tool, rank }: { tool: CalculatorTool; rank: number }) {
  const matchPct = tool.score;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        {/* Left: tool info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
              {rank}
            </span>
            <h3 className="text-base font-bold text-gray-900">{tool.name}</h3>
            {tool.freeTierSufficient && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                Free tier sufficient ✓
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{tool.description}</p>

          {/* Feature matches / misses */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tool.featureDetail.map((fd) => (
              <span
                key={fd.feature}
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                  fd.matched
                    ? "bg-green-50 text-green-700"
                    : "bg-red-50 text-red-500 line-through"
                }`}
              >
                {fd.matched ? "✓ " : "✗ "}
                {fd.feature}
              </span>
            ))}
          </div>
        </div>

        {/* Right: score + price + CTA */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          {/* Score circle */}
          <div className="flex items-center gap-2">
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 64 64">
                <circle
                  cx="32" cy="32" r="27"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="4"
                />
                <circle
                  cx="32" cy="32" r="27"
                  fill="none"
                  stroke={matchPct >= 70 ? "#16a34a" : matchPct >= 40 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${(matchPct / 100) * 169.6} 169.6`}
                />
              </svg>
              <span className="absolute text-sm font-bold text-gray-900">{matchPct}%</span>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {tool.monthlyCost === 0 ? "Free" : `$${tool.monthlyCost}/mo`}
          </p>
          <p className="text-xs text-gray-400">{tool.priceBand}</p>
          {tool.affiliateUrl ? (
            <a
              href={tool.affiliateUrl}
              {...affiliateLinkAttrs}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Try {tool.name} →
            </a>
          ) : (
            <span className="text-xs text-gray-400">No affiliate link</span>
          )}
        </div>
      </div>

      {/* Score breakdown */}
      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-4 gap-2 text-center">
        {[
          { label: "Budget", value: tool.scoreBreakdown.budget, max: 40 },
          { label: "Features", value: tool.scoreBreakdown.features, max: 30 },
          { label: "Volume", value: tool.scoreBreakdown.volume, max: 20 },
          { label: "Free Tier", value: tool.scoreBreakdown.freeTier, max: 10 },
        ].map((sb) => (
          <div key={sb.label}>
            <div className="text-xs text-gray-400">{sb.label}</div>
            <div className="text-sm font-semibold text-gray-900">
              {sb.value}/{sb.max}
            </div>
            <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${(sb.value / sb.max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────

function defaultInputs(): CalculatorInputs {
  return {
    useCase: "All",
    monthlyVolume: 10,
    teamSize: "1",
    budgetRange: "No limit",
    features: [],
    freeOnly: false,
  };
}
