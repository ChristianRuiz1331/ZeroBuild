/**
 * Calculator logic for the AI Tools Pricing Calculator.
 * Scoring function + tool feature data.
 */

// ── Types ──────────────────────────────────────────────────────────

export interface CalculatorInputs {
  useCase: string;           // "Blog posts" | "Social media" | "Email marketing" | "SEO content" | "Ad copy" | "All"
  monthlyVolume: number;     // 5 | 10 | 20 | 50 | 100
  teamSize: string;          // "1" | "2-5" | "6-10" | "10+"
  budgetRange: string;       // "$0 free only" | "Under $20/mo" | "$20-50/mo" | "$50-100/mo" | "$100+/mo" | "No limit"
  features: string[];        // "Long-form content" | "SEO optimization" | "Brand voice" | "Multi-language" | "API access" | "Plagiarism checker"
  freeOnly: boolean;
}

export interface CalculatorTool {
  name: string;
  slug: string;
  category: string;
  description: string;
  url: string;
  /** Monthly cost at the user's volume band */
  monthlyCost: number;
  /** Price band the tool falls into */
  priceBand: string;
  /** Features the tool supports */
  features: string[];
  /** Whether the free tier covers the user's volume at all */
  freeTierSufficient: boolean;
  /** Monthly word/image allowance on free tier */
  freeTierLimit: number;
  /** Score (0-100) */
  score: number;
  /** Component scores for display */
  scoreBreakdown: {
    budget: number;
    features: number;
    volume: number;
    freeTier: number;
  };
  /** Feature match details */
  featureDetail: { feature: string; matched: boolean }[];
  affiliateUrl?: string;
  trulyFree: boolean;
  requiresCreditCard: boolean;
}

export interface CalculatorResult {
  tools: CalculatorTool[];
  summary: {
    cheapest: CalculatorTool | null;
    bestValue: CalculatorTool | null;
    bestFree: CalculatorTool | null;
  };
}

// ── Tool definitions (AI Writing only, extended with feature flags) ──

interface ToolDef {
  name: string;
  slug: string;
  description: string;
  url: string;
  features: string[];
  /** Pricing tiers: [words_per_month, monthly_price_usd] */
  pricing: [number | null, number][];
  freeTierWords: number;
  trulyFree: boolean;
  requiresCreditCard: boolean;
  affiliateUrl?: string;
}

const AI_WRITING_TOOLS: ToolDef[] = [
  {
    name: "Writesonic",
    slug: "writesonic",
    description: "All-in-one AI content platform with article writer, paraphrasing, SEO tools, and chatbot builder. Best free tier in the category by word count.",
    url: "https://writesonic.com",
    features: ["Long-form content", "SEO optimization", "Multi-language", "API access"],
    pricing: [
      [10000, 0],    // 10K words: free
      [50000, 20],   // 50K words: $20/mo
      [null, 49],    // unlimited: $49/mo
    ],
    freeTierWords: 10000,
    trulyFree: true,
    requiresCreditCard: false,
    affiliateUrl: "https://writesonic.com/affiliate-program",
  },
  {
    name: "Jasper AI",
    slug: "jasper-ai",
    description: "Enterprise-grade AI writing platform with brand voice controls, campaign workflows, and marketing-specific templates.",
    url: "https://www.jasper.ai",
    features: ["Long-form content", "SEO optimization", "Brand voice", "Multi-language", "API access", "Plagiarism checker"],
    pricing: [
      [null, 49],   // unlimited: $49/mo
    ],
    freeTierWords: 0,
    trulyFree: false,
    requiresCreditCard: true,
    affiliateUrl: "https://www.jasper.ai/partners",
  },
  {
    name: "Copy.ai",
    slug: "copy-ai",
    description: "AI-powered content creation with strong focus on marketing workflows, sales copy, and GTM automation.",
    url: "https://www.copy.ai",
    features: ["Long-form content", "Brand voice", "Multi-language"],
    pricing: [
      [2000, 0],    // 2K words: free
      [null, 49],   // unlimited: $49/mo
    ],
    freeTierWords: 2000,
    trulyFree: true,
    requiresCreditCard: false,
    affiliateUrl: "https://www.copy.ai/affiliates",
  },
  {
    name: "Rytr",
    slug: "rytr",
    description: "Budget-friendly AI writing assistant with an intuitive interface. Lowest paid plan in the category.",
    url: "https://rytr.me",
    features: ["Long-form content", "Multi-language", "Plagiarism checker"],
    pricing: [
      [2500, 0],     // ~2.5K words: free
      [25000, 9],    // ~25K words: $9/mo
      [null, 29],    // unlimited: $29/mo
    ],
    freeTierWords: 2500,
    trulyFree: true,
    requiresCreditCard: false,
    affiliateUrl: "https://rytr.me/affiliates",
  },
  {
    name: "ChatGPT",
    slug: "chatgpt",
    description: "OpenAI's conversational AI — the most popular AI tool in the world. Versatile for writing, brainstorming, and coding.",
    url: "https://chat.openai.com",
    features: ["Long-form content", "Multi-language", "API access"],
    pricing: [
      [null, 0],    // free tier (unlimited words but rate-limited)
      [null, 20],   // Plus: $20/mo
      [null, 200],  // Pro: $200/mo
    ],
    freeTierWords: 999999, // effectively unlimited
    trulyFree: true,
    requiresCreditCard: false,
    affiliateUrl: undefined,
  },
  {
    name: "Anyword",
    slug: "anyword",
    description: "AI writing with predictive performance scoring. Best for data-driven marketers.",
    url: "https://anyword.com",
    features: ["Long-form content", "SEO optimization", "Brand voice", "API access"],
    pricing: [
      [null, 49],    // Starter: $49/mo
      [null, 99],    // Data-Driven: $99/mo
    ],
    freeTierWords: 0,
    trulyFree: false,
    requiresCreditCard: true,
    affiliateUrl: "https://anyword.com/affiliates",
  },
];

// ── Volume estimation ──────────────────────────────────────────────

/** Estimate words needed per month based on use case + volume */
function estimateMonthlyWords(useCase: string, volume: number): number {
  const avgPerPiece: Record<string, number> = {
    "Blog posts": 1500,
    "Social media": 150,
    "Email marketing": 500,
    "SEO content": 1200,
    "Ad copy": 200,
    "All": 700,
  };
  const multiplier = avgPerPiece[useCase] ?? 700;
  return volume * multiplier;
}

// ── Scoring ────────────────────────────────────────────────────────

const ALL_FEATURES = [
  "Long-form content",
  "SEO optimization",
  "Brand voice",
  "Multi-language",
  "API access",
  "Plagiarism checker",
] as const;

const BUDGET_MAXES: Record<string, number> = {
  "$0 free only": 0,
  "Under $20/mo": 20,
  "$20-50/mo": 50,
  "$50-100/mo": 100,
  "$100+/mo": 200,
  "No limit": Infinity,
};

function resolvePriceForVolume(tool: ToolDef, monthlyWords: number): number {
  for (const [cap, price] of tool.pricing) {
    if (cap === null || monthlyWords <= cap) return price;
  }
  // fallback to highest tier
  return tool.pricing[tool.pricing.length - 1][1];
}

function budgetMatchScore(price: number, budgetRange: string): number {
  if (budgetRange === "$0 free only") return price === 0 ? 40 : 0;
  if (budgetRange === "No limit") return 40;
  const max = BUDGET_MAXES[budgetRange] ?? Infinity;
  if (price <= max * 0.5) return 40;
  if (price <= max) return 30;
  if (price <= max * 1.5) return 15;
  return 0;
}

function featureMatchScore(tool: ToolDef, wanted: string[]): number {
  if (wanted.length === 0) return 30; // no features selected = full score
  const total = wanted.length;
  const matched = wanted.filter((f) => tool.features.includes(f)).length;
  return Math.round((matched / total) * 30);
}

function volumeCapacityScore(tool: ToolDef, monthlyWords: number, freeOnly: boolean): number {
  if (freeOnly) {
    return tool.freeTierWords >= monthlyWords ? 20 : tool.freeTierWords > 0 ? 10 : 0;
  }
  // paid — check if free tier already covers it
  if (tool.freeTierWords >= monthlyWords) return 20;
  // otherwise, the tool can handle volume via paid tiers
  return 18;
}

function freeTierValueScore(tool: ToolDef, monthlyWords: number): number {
  let score = 0;
  if (tool.freeTierWords >= monthlyWords) score += 5;
  if (tool.trulyFree) score += 3;
  if (!tool.requiresCreditCard) score += 2;
  return Math.min(score, 10);
}

// ── Main scoring function ──────────────────────────────────────────

export function scoreTools(inputs: CalculatorInputs): CalculatorResult {
  const monthlyWords = estimateMonthlyWords(inputs.useCase, inputs.monthlyVolume);
  const wantedFeatures = inputs.features;

  let eligibleTools = AI_WRITING_TOOLS.filter((t) => {
    // Free-only mode: exclude tools without a true free tier
    if (inputs.freeOnly) return t.trulyFree && t.freeTierWords > 0;
    // Budget filter
    if (inputs.budgetRange === "$0 free only") return t.freeTierWords > 0 && t.trulyFree;
    return true;
  });

  const scored: CalculatorTool[] = eligibleTools.map((tool) => {
    const price = resolvePriceForVolume(tool, monthlyWords);
    const budgetScore = budgetMatchScore(price, inputs.budgetRange);
    const featScore = featureMatchScore(tool, wantedFeatures);
    const volScore = volumeCapacityScore(tool, monthlyWords, inputs.freeOnly);
    const freeScore = freeTierValueScore(tool, monthlyWords);
    const total = budgetScore + featScore + volScore + freeScore;

    const featureDetail = wantedFeatures.map((f) => ({
      feature: f,
      matched: tool.features.includes(f),
    }));

    let priceBand = "Free";
    if (price > 0 && price <= 20) priceBand = "Under $20/mo";
    else if (price <= 50) priceBand = "$20-50/mo";
    else if (price <= 100) priceBand = "$50-100/mo";
    else if (price > 0) priceBand = "$100+/mo";

    return {
      name: tool.name,
      slug: tool.slug,
      category: "AI Writing",
      description: tool.description,
      url: tool.url,
      monthlyCost: price,
      priceBand,
      features: tool.features,
      freeTierSufficient: tool.freeTierWords >= monthlyWords,
      freeTierLimit: tool.freeTierWords,
      score: total,
      scoreBreakdown: {
        budget: budgetScore,
        features: featScore,
        volume: volScore,
        freeTier: freeScore,
      },
      featureDetail,
      affiliateUrl: tool.affiliateUrl,
      trulyFree: tool.trulyFree,
      requiresCreditCard: tool.requiresCreditCard,
    };
  });

  // Sort by score desc
  scored.sort((a, b) => b.score - a.score);

  // Summary
  const freeTools = scored.filter((t) => t.monthlyCost === 0);
  const paidTools = scored.filter((t) => t.monthlyCost > 0);

  const cheapest = paidTools.length > 0
    ? paidTools.reduce((best, t) => t.monthlyCost < best.monthlyCost ? t : best)
    : freeTools[0] ?? null;

  const bestValue = [...scored].sort((a, b) => b.score - a.score)[0] ?? null;

  const bestFree = freeTools.length > 0
    ? freeTools.reduce((best, t) => t.freeTierLimit > best.freeTierLimit ? t : best, freeTools[0])
    : null;

  return {
    tools: scored,
    summary: { cheapest, bestValue, bestFree },
  };
}

/** Serialize calculator inputs to a URL-safe query string */
export function inputsToQueryParams(inputs: CalculatorInputs): string {
  const params = new URLSearchParams();
  params.set("useCase", inputs.useCase);
  params.set("volume", String(inputs.monthlyVolume));
  params.set("teamSize", inputs.teamSize);
  params.set("budget", inputs.budgetRange);
  if (inputs.features.length > 0) params.set("features", inputs.features.join(","));
  if (inputs.freeOnly) params.set("freeOnly", "1");
  return params.toString();
}

/** Deserialize query params back to CalculatorInputs (with defaults) */
export function queryParamsToInputs(params: URLSearchParams): CalculatorInputs {
  return {
    useCase: params.get("useCase") ?? "All",
    monthlyVolume: Number(params.get("volume")) || 10,
    teamSize: params.get("teamSize") ?? "1",
    budgetRange: params.get("budget") ?? "No limit",
    features: params.get("features") ? params.get("features")!.split(",").filter(Boolean) : [],
    freeOnly: params.get("freeOnly") === "1",
  };
}

export { ALL_FEATURES };
