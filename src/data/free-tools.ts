export interface FreeTool {
  name: string;
  slug: string;
  category: "Writing" | "Image" | "Video" | "Voice" | "Code" | "Other";
  free_tier_summary: string;
  classification: "truly_free" | "freemium" | "trial_ware";
  requires_credit_card: boolean;
  affiliate_program: boolean;
  affiliate_url?: string;
  best_for: string;
  url: string;
  /** 1-10 score based on free tier generosity, no-CC bonus, and long-term usability */
  free_tier_value_score: number;
}

function calculateValueScore(tool: Pick<FreeTool, "classification" | "requires_credit_card" | "free_tier_summary">): number {
  let score = 0;

  // No credit card required is a big deal
  if (!tool.requires_credit_card) score += 3;

  // Truly free (indefinite, not just freemium or trial)
  if (tool.classification === "truly_free") score += 3;
  else if (tool.classification === "freemium") score += 1;
  // trial_ware gets 0

  // Summary hints at generosity
  const summary = tool.free_tier_summary.toLowerCase();
  if (summary.includes("unlimited")) score += 2;
  if (summary.includes("generous") || summary.includes("daily") || summary.includes("per day")) score += 1;

  return Math.min(score, 10);
}

const rawFreeTools: Omit<FreeTool, "free_tier_value_score">[] = [
  {
    name: "Claude",
    slug: "claude",
    category: "Writing",
    free_tier_summary:
      "Claude 3.5 Sonnet with 20-45 messages/day. 200K token context window for long document analysis and nuanced editing. No credit card required.",
    classification: "truly_free",
    requires_credit_card: false,
    affiliate_program: false,
    best_for: "Long-form writing, document analysis, nuanced editing",
    url: "https://claude.ai",
  },
  {
    name: "Google Gemini",
    slug: "google-gemini",
    category: "Writing",
    free_tier_summary:
      "Gemini Flash with generous message limits. Includes Imagen image generation. No credit card required — just a Google account.",
    classification: "truly_free",
    requires_credit_card: false,
    affiliate_program: false,
    best_for: "Quick research, fact-checking, Google Workspace users",
    url: "https://gemini.google.com",
  },
  {
    name: "Bing Image Creator",
    slug: "bing-image-creator",
    category: "Image",
    free_tier_summary:
      "15 boosts/day for fast generation, then slower queue. Powered by DALL·E 3. No credit card required — just a Microsoft account.",
    classification: "truly_free",
    requires_credit_card: false,
    affiliate_program: false,
    best_for: "Quick social media graphics, blog images",
    url: "https://www.bing.com/create",
  },
  {
    name: "CapCut",
    slug: "capcut",
    category: "Video",
    free_tier_summary:
      "AI video tools, auto-captions, basic effects, and templates. Exports include a watermark on the free tier. No credit card required.",
    classification: "freemium",
    requires_credit_card: false,
    affiliate_program: false,
    best_for: "TikTok/Reels/Shorts content",
    url: "https://www.capcut.com",
  },
  {
    name: "Pika Labs",
    slug: "pika-labs",
    category: "Video",
    free_tier_summary:
      "Daily free credits (~10-30 generations/day). AI video generation with watermarked exports. No credit card required.",
    classification: "freemium",
    requires_credit_card: false,
    affiliate_program: false,
    best_for: "Quick AI video clips, experimenting",
    url: "https://pika.art",
  },
  {
    name: "ElevenLabs",
    slug: "elevenlabs",
    category: "Voice",
    free_tier_summary:
      "10,000 characters/month of text-to-speech. 3 custom voice clones. Standard-quality voices. No credit card required.",
    classification: "freemium",
    requires_credit_card: false,
    affiliate_program: true,
    affiliate_url: "https://elevenlabs.io/?via=zerobuild",
    best_for: "Voiceovers, podcast intros, narration",
    url: "https://elevenlabs.io",
  },
  {
    name: "Suno",
    slug: "suno",
    category: "Voice",
    free_tier_summary:
      "50 credits/day (5 songs). AI music generation for non-commercial use only. No credit card required.",
    classification: "freemium",
    requires_credit_card: false,
    affiliate_program: false,
    best_for: "Music creation, jingles",
    url: "https://suno.ai",
  },
  {
    name: "Murf.ai",
    slug: "murf-ai",
    category: "Voice",
    free_tier_summary:
      "10 minutes of voice generation total (lifetime). 120+ AI voices in multiple languages. No credit card required.",
    classification: "freemium",
    requires_credit_card: false,
    affiliate_program: true,
    affiliate_url: "https://murf.ai/?via=zerobuild",
    best_for: "Professional voiceovers, e-learning",
    url: "https://murf.ai",
  },
  {
    name: "GitHub Copilot Free",
    slug: "github-copilot-free",
    category: "Code",
    free_tier_summary:
      "2,000 code completions/month and 50 chat messages/month. Works in VS Code and JetBrains. No credit card required.",
    classification: "freemium",
    requires_credit_card: false,
    affiliate_program: false,
    best_for: "Solo developers, students",
    url: "https://github.com/features/copilot",
  },
  {
    name: "HuggingChat",
    slug: "huggingchat",
    category: "Code",
    free_tier_summary:
      "Open-source LLM chat with Llama, Mistral, and more. No account required — completely anonymous and free.",
    classification: "truly_free",
    requires_credit_card: false,
    affiliate_program: false,
    best_for: "Open-source coding help, experimentation",
    url: "https://huggingface.co/chat",
  },
  {
    name: "Replit AI",
    slug: "replit-ai",
    category: "Code",
    free_tier_summary:
      "Basic AI coding assistant with free hosting for simple projects. No credit card required for the free tier.",
    classification: "freemium",
    requires_credit_card: false,
    affiliate_program: false,
    best_for: "Learning to code, prototyping",
    url: "https://replit.com",
  },
  {
    name: "Perplexity AI",
    slug: "perplexity-ai",
    category: "Other",
    free_tier_summary:
      "Unlimited Quick searches and 5 Pro searches/day. All answers include source citations. No credit card required.",
    classification: "truly_free",
    requires_credit_card: false,
    affiliate_program: false,
    best_for: "Research, fact-checking, cited answers",
    url: "https://www.perplexity.ai",
  },
  {
    name: "Grammarly",
    slug: "grammarly",
    category: "Other",
    free_tier_summary:
      "Basic grammar, spelling, and punctuation correction via browser extension and web app. No credit card required.",
    classification: "freemium",
    requires_credit_card: false,
    affiliate_program: true,
    affiliate_url: "https://www.grammarly.com/affiliates",
    best_for: "Quick proofreading",
    url: "https://www.grammarly.com",
  },
  {
    name: "Gamma",
    slug: "gamma",
    category: "Other",
    free_tier_summary:
      "400 AI credits at signup (one-time). Create AI-powered presentations, documents, and webpages. No credit card required.",
    classification: "freemium",
    requires_credit_card: false,
    affiliate_program: false,
    best_for: "Quick presentations, pitch decks",
    url: "https://gamma.app",
  },
];

export const freeTools: FreeTool[] = rawFreeTools.map((t) => ({
  ...t,
  free_tier_value_score: calculateValueScore(t),
}));

/** Get all free tools, optionally filtered */
export function getFreeTools(filters?: {
  category?: string;
  classification?: string;
  noCreditCard?: boolean;
}): FreeTool[] {
  let results = [...freeTools];

  if (filters?.category && filters.category !== "All") {
    results = results.filter((t) => t.category === filters.category);
  }
  if (filters?.classification) {
    results = results.filter((t) => t.classification === filters.classification);
  }
  if (filters?.noCreditCard) {
    results = results.filter((t) => !t.requires_credit_card);
  }

  return results;
}

/** Categories available in the directory */
export const directoryCategories = [
  "All",
  "Writing",
  "Image",
  "Video",
  "Voice",
  "Code",
  "Other",
] as const;
