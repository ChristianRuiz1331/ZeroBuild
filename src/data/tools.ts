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

  // Image generation generosity (relative scale)
  const images = tool.free_tier_limits.images_per_month ?? 0;
  if (images >= 100) score += 3;
  else if (images >= 25) score += 2;
  else if (images >= 5) score += 1;

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
  // --- AI Image Generators ---
  {
    name: "Leonardo.ai",
    slug: "leonardo-ai",
    category: "AI Image Generators",
    description:
      "Professional-grade AI image generator with a generous free tier. Great for game assets, marketing visuals, and product mockups. No credit card required to start.",
    url: "https://leonardo.ai",
    pricing_tiers: [
      { name: "Free", price_monthly: 0, notes: "150 images/month, no credit card" },
      { name: "Apprentice", price_monthly: 12, notes: "8,500 images/month, faster generation" },
      { name: "Artisan", price_monthly: 30, notes: "25,000 images/month, video generation" },
      { name: "Maestro", price_monthly: 60, notes: "60,000 images/month, priority support" },
    ],
    affiliate_link: undefined,
    affiliate_network: undefined,
    commission_rate: undefined,
    logo_url: "",
    free_tier_limits: {
      images_per_month: 150,
      description: "150 images per month. No credit card required. Includes basic generation, upscaling, and community models. Generous for testing and light use.",
    },
    requires_credit_card: false,
    truly_free: true,
  },
  {
    name: "Canva AI",
    slug: "canva-ai",
    category: "AI Image Generators",
    description:
      "All-in-one design platform with AI image generation built in. Massive template library plus Magic Media for AI-generated images — perfect for small business owners.",
    url: "https://www.canva.com",
    pricing_tiers: [
      { name: "Free", price_monthly: 0, notes: "50 AI image credits lifetime, no credit card" },
      { name: "Pro", price_monthly: 15, notes: "500 AI image credits/month, premium templates" },
      { name: "Teams", price_monthly: 30, notes: "1,000 AI image credits/month, brand kit" },
    ],
    affiliate_link: "https://www.canva.com/affiliates",
    affiliate_network: "Impact",
    commission_rate: "$3-5 per signup",
    logo_url: "",
    free_tier_limits: {
      images_per_month: 50,
      description: "50 AI image generation credits total (lifetime, not monthly). No credit card required. Includes full design editor, 250K+ templates, and 5GB cloud storage.",
    },
    requires_credit_card: false,
    truly_free: true,
  },
  {
    name: "Adobe Firefly",
    slug: "adobe-firefly",
    category: "AI Image Generators",
    description:
      "Adobe's generative AI for images, vectors, and text effects. Built into Photoshop and Express. Best for designers already in the Adobe ecosystem.",
    url: "https://firefly.adobe.com",
    pricing_tiers: [
      { name: "Free", price_monthly: 0, notes: "25 credits/month, no credit card" },
      { name: "Creative Cloud", price_monthly: 60, notes: "100 credits/month, full CC suite" },
      { name: "Enterprise", price_monthly: 0, notes: "Custom pricing, unlimited credits" },
    ],
    affiliate_link: undefined,
    affiliate_network: undefined,
    commission_rate: undefined,
    logo_url: "",
    free_tier_limits: {
      images_per_month: 25,
      description: "25 generative credits per month. No credit card required for free tier. Includes text-to-image, generative fill, and text effects with Adobe watermark.",
    },
    requires_credit_card: false,
    truly_free: true,
  },
  {
    name: "RunwayML",
    slug: "runwayml",
    category: "AI Image Generators",
    description:
      "AI-powered creative suite for video and image generation. Best for content creators who need both image and video AI tools in one platform.",
    url: "https://runwayml.com",
    pricing_tiers: [
      { name: "Free", price_monthly: 0, notes: "125 credits/month, no credit card" },
      { name: "Standard", price_monthly: 15, notes: "625 credits/month, higher resolution" },
      { name: "Pro", price_monthly: 35, notes: "2,250 credits/month, priority generation" },
      { name: "Unlimited", price_monthly: 95, notes: "Unlimited video generations" },
    ],
    affiliate_link: undefined,
    affiliate_network: undefined,
    commission_rate: undefined,
    logo_url: "",
    free_tier_limits: {
      images_per_month: 125,
      description: "125 credits per month (1 image ≈ 5-10 credits depending on settings). No credit card required. Includes Gen-3 video, image-to-image, and basic export.",
    },
    requires_credit_card: false,
    truly_free: true,
  },
  {
    name: "Midjourney",
    slug: "midjourney",
    category: "AI Image Generators",
    description:
      "Industry-leading AI image generator known for stunning artistic quality and photorealistic output. No free tier — paid only, but results are unmatched for premium visuals.",
    url: "https://www.midjourney.com",
    pricing_tiers: [
      { name: "Basic", price_monthly: 10, notes: "~200 images/month, 3 concurrent jobs" },
      { name: "Standard", price_monthly: 30, notes: "Unlimited relaxed mode, 15hr fast GPU" },
      { name: "Pro", price_monthly: 60, notes: "30hr fast GPU, stealth mode" },
      { name: "Mega", price_monthly: 120, notes: "60hr fast GPU, max concurrency" },
    ],
    affiliate_link: undefined,
    affiliate_network: undefined,
    commission_rate: undefined,
    logo_url: "",
    free_tier_limits: {
      description: "No free tier available. Midjourney is paid-only starting at $10/month. They occasionally run free trial promotions, but there is no permanent free tier.",
    },
    requires_credit_card: true,
    truly_free: false,
  },
  {
    name: "DALL·E",
    slug: "dall-e",
    category: "AI Image Generators",
    description:
      "OpenAI's image generator, accessible through ChatGPT Plus and the API. Excellent at understanding complex prompts and producing consistent, high-quality images for business use.",
    url: "https://openai.com/dall-e",
    pricing_tiers: [
      { name: "ChatGPT Free", price_monthly: 0, notes: "2 images/day via ChatGPT, no credit card" },
      { name: "ChatGPT Plus", price_monthly: 20, notes: "50+ images/day via ChatGPT, priority" },
      { name: "API Pay-as-you-go", price_monthly: 0, notes: "~$0.04-0.08/image, no subscription" },
    ],
    affiliate_link: undefined,
    affiliate_network: undefined,
    commission_rate: undefined,
    logo_url: "",
    free_tier_limits: {
      images_per_month: 60,
      description: "~2 images per day via ChatGPT free tier (~60/month). No credit card required for ChatGPT. Images have OpenAI watermark. API requires pre-paid credits.",
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
  {
    slug: "ai-image-generators",
    title: "AI Image Generators",
    description: "Side-by-side comparison of the best AI image generators for small business — real free tier limits, output quality, and which tools don't require a credit card.",
    toolCount: tools.filter((t) => t.category === "AI Image Generators").length,
  },
];
