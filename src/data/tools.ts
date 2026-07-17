export interface ToolPricingTier {
  name: string;
  price_monthly: number; // USD, 0 = free
  price_annual?: number;
  words_per_month?: number;
  notes?: string;
}

export interface Tool {
  name: string;
  slug: string;
  category: string;
  description: string;
  url: string;
  pricing_tiers: ToolPricingTier[];
  affiliate_link?: string;
  affiliate_network?: string;
  commission_rate?: string;
  logo_url: string;
  free_tier_limits: {
    words_per_month?: number;
    images_per_month?: number;
    minutes_per_month?: number;
    description: string;
  };
  requires_credit_card: boolean;
  truly_free: boolean;
  /** 1-10 score calculated from free tier generosity, no-CC bonus, and long-term usability */
  free_tier_value_score: number;
}

function calculateValueScore(tool: Omit<Tool, "free_tier_value_score">): number {
  let score = 0;

  // No credit card required is a big deal
  if (!tool.requires_credit_card) score += 3;

  // Truly free (not just a trial that expires)
  if (tool.truly_free) score += 2;

  // Word count generosity (relative scale)
  const words = tool.free_tier_limits.words_per_month ?? 0;
  if (words >= 100_000) score += 3;
  else if (words >= 25_000) score += 2;
  else if (words >= 5_000) score += 1;
  else if (words > 0) score += 0; // trial-only, negligible long-term value

  // Has images or other media free
  if ((tool.free_tier_limits.images_per_month ?? 0) > 0) score += 1;
  if ((tool.free_tier_limits.minutes_per_month ?? 0) > 0) score += 1;

  return Math.min(score, 10);
}

const rawTools: Omit<Tool, "free_tier_value_score">[] = [
  {
    name: "Jasper AI",
    slug: "jasper-ai",
    category: "AI Writing",
    description:
      "Enterprise-grade AI writing platform with brand voice controls, campaign workflows, and marketing-specific templates. Best for teams and professional marketers.",
    url: "https://www.jasper.ai",
    pricing_tiers: [
      { name: "Free Trial", price_monthly: 0, words_per_month: undefined, notes: "7-day trial, requires credit card" },
      { name: "Creator", price_monthly: 49, words_per_month: undefined, notes: "1 user, 1 brand voice" },
      { name: "Pro", price_monthly: 69, words_per_month: undefined, notes: "3 users, 3 brand voices, campaigns" },
    ],
    affiliate_link: "https://www.jasper.ai/partners",
    affiliate_network: "PartnerStack",
    commission_rate: "$50-100 + 20% first month",
    logo_url: "",
    free_tier_limits: {
      description: "7-day free trial, credit card required. No ongoing free tier — trial only.",
    },
    requires_credit_card: true,
    truly_free: false,
  },
  {
    name: "Copy.ai",
    slug: "copy-ai",
    category: "AI Writing",
    description:
      "AI-powered content creation with a strong focus on marketing workflows, sales copy, and GTM (go-to-market) automation. Generous free tier with no credit card.",
    url: "https://www.copy.ai",
    pricing_tiers: [
      { name: "Free", price_monthly: 0, words_per_month: 2000, notes: "1 user, 2,000 words/mo, no credit card" },
      { name: "Pro", price_monthly: 49, words_per_month: undefined, notes: "5 users, unlimited words" },
      { name: "Team", price_monthly: 249, words_per_month: undefined, notes: "20 users, collaboration features" },
    ],
    affiliate_link: "https://www.copy.ai/affiliates",
    affiliate_network: "PartnerStack",
    commission_rate: "30% recurring for 12 months",
    logo_url: "",
    free_tier_limits: {
      words_per_month: 2000,
      description: "2,000 words per month. No credit card required. Includes 1 seat, chat, and all templates.",
    },
    requires_credit_card: false,
    truly_free: true,
  },
  {
    name: "Writesonic",
    slug: "writesonic",
    category: "AI Writing",
    description:
      "All-in-one AI content platform with article writer, paraphrasing, SEO tools, and chatbot builder. Best free tier in the category by word count.",
    url: "https://writesonic.com",
    pricing_tiers: [
      { name: "Free", price_monthly: 0, words_per_month: 10000, notes: "10,000 words/mo, no credit card" },
      { name: "Individual", price_monthly: 20, words_per_month: undefined, notes: "50,000 words/mo" },
      { name: "Standard", price_monthly: 49, words_per_month: undefined, notes: "Unlimited words, GPT-4" },
    ],
    affiliate_link: "https://writesonic.com/affiliate-program",
    affiliate_network: "Direct",
    commission_rate: "30% lifetime recurring",
    logo_url: "",
    free_tier_limits: {
      words_per_month: 10000,
      description: "10,000 words per month. No credit card required. Includes AI Article Writer, Sonic Editor, and 100+ templates.",
    },
    requires_credit_card: false,
    truly_free: true,
  },
  {
    name: "Rytr",
    slug: "rytr",
    category: "AI Writing",
    description:
      "Budget-friendly AI writing assistant with an intuitive interface. Lowest paid plan in the category and a solid free character allowance.",
    url: "https://rytr.me",
    pricing_tiers: [
      { name: "Free", price_monthly: 0, words_per_month: undefined, notes: "10,000 chars/mo (~2,500 words), no credit card" },
      { name: "Saver", price_monthly: 9, words_per_month: undefined, notes: "100,000 chars/mo, tone matching" },
      { name: "Unlimited", price_monthly: 29, words_per_month: undefined, notes: "Unlimited chars, dedicated account manager" },
    ],
    affiliate_link: "https://rytr.me/affiliates",
    affiliate_network: "Direct",
    commission_rate: "25% recurring",
    logo_url: "",
    free_tier_limits: {
      words_per_month: 2500,
      description: "10,000 characters per month (~2,500 words). No credit card required. Includes 40+ use cases, 20+ tones, and plagiarism checker.",
    },
    requires_credit_card: false,
    truly_free: true,
  },
  {
    name: "Anyword",
    slug: "anyword",
    category: "AI Writing",
    description:
      "AI writing with predictive performance scoring. Best for data-driven marketers who want copy scoring and audience targeting built in.",
    url: "https://anyword.com",
    pricing_tiers: [
      { name: "Free Trial", price_monthly: 0, words_per_month: undefined, notes: "7-day trial, credit card required" },
      { name: "Starter", price_monthly: 49, words_per_month: undefined, notes: "1 user, 1 brand voice" },
      { name: "Data-Driven", price_monthly: 99, words_per_month: undefined, notes: "3 users, predictive scores" },
    ],
    affiliate_link: "https://anyword.com/affiliates",
    affiliate_network: "PartnerStack",
    commission_rate: "20% recurring",
    logo_url: "",
    free_tier_limits: {
      description: "7-day free trial, credit card required. No ongoing free tier — trial only.",
    },
    requires_credit_card: true,
    truly_free: false,
  },
  {
    name: "ChatGPT",
    slug: "chatgpt",
    category: "AI Writing",
    description:
      "OpenAI's conversational AI — the most popular AI tool in the world. Versatile for writing, brainstorming, coding, and more. Free tier with GPT-4o mini.",
    url: "https://chat.openai.com",
    pricing_tiers: [
      { name: "Free", price_monthly: 0, words_per_month: undefined, notes: "GPT-4o mini, limited messages, no credit card" },
      { name: "Plus", price_monthly: 20, words_per_month: undefined, notes: "GPT-4o, 80 messages/3hr, DALL·E" },
      { name: "Pro", price_monthly: 200, words_per_month: undefined, notes: "Unlimited, advanced features" },
    ],
    affiliate_link: undefined,
    affiliate_network: undefined,
    commission_rate: undefined,
    logo_url: "",
    free_tier_limits: {
      description: "GPT-4o mini with limited daily messages. No credit card required. Includes web browsing, file uploads, and basic image generation.",
    },
    requires_credit_card: false,
    truly_free: true,
  },
];

export const tools: Tool[] = rawTools.map((t) => ({
  ...t,
  free_tier_value_score: calculateValueScore(t),
}));

/** Get a tool by its slug */
export function getTool(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

/** Get all tools, optionally filtered by category */
export function getTools(category?: string): Tool[] {
  if (category) return tools.filter((t) => t.category === category);
  return [...tools];
}

/** Comparison categories available on the site */
export const comparisonCategories = [
  {
    slug: "ai-writing-tools",
    title: "AI Writing Tools",
    description: "Side-by-side comparison of the best free and paid AI writing assistants — real free tier limits, pricing, and which ones don't need a credit card.",
    toolCount: tools.filter((t) => t.category === "AI Writing").length,
  },
];
