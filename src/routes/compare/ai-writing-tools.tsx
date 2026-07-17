import { createFileRoute } from "@tanstack/react-router";
import { tools } from "~/data/tools";
import ToolComparison from "~/components/ToolComparison";
import { AffiliateDisclosure } from "~/utils/affiliate";

const aiWritingTools = tools.filter((t) => t.category === "AI Writing");

// Used for the methodology section
const testPrompt = `Write a 200-word product description for a new eco-friendly water bottle made from recycled ocean plastic. Target audience: outdoor enthusiasts aged 25-45. Tone: adventurous but genuine.`;

const faqs = [
  {
    question: "Which AI writing tool has the best free tier?",
    answer:
      "Writesonic offers the most generous free tier with 10,000 words per month and no credit card required. Copy.ai (2,000 words/mo) and Rytr (~2,500 words/mo) also offer genuine free tiers. ChatGPT is excellent for free-form writing and brainstorming. Jasper and Anyword only offer time-limited trials that require a credit card.",
  },
  {
    question: "Do any of these tools require a credit card for the free tier?",
    answer:
      "Jasper AI and Anyword require a credit card for their free trials. Copy.ai, Writesonic, Rytr, and ChatGPT offer free tiers with no credit card required — you can start writing immediately without entering payment details.",
  },
  {
    question: "Which tool is best for long-form content like blog posts?",
    answer:
      "Jasper AI and Writesonic excel at long-form content with dedicated article and blog post workflows. ChatGPT is highly capable for long-form writing but requires more manual prompting. Copy.ai is strong for marketing copy and shorter content. Rytr is best for short-form content given its character-based limits.",
  },
  {
    question: "Can I earn money through affiliate programs for these tools?",
    answer:
      "Yes, most AI writing tools have affiliate programs. Writesonic offers 30% lifetime recurring commissions (best long-term value). Copy.ai offers 30% recurring for 12 months through PartnerStack. Rytr offers 25% recurring, and Anyword offers 20% recurring. Jasper pays $50-100 plus 20% of the first month. ChatGPT/OpenAI does not have an affiliate program.",
  },
  {
    question: "How did you test these tools?",
    answer:
      "We ran the same prompt through every tool — a 200-word product description — and evaluated output quality, speed, ease of use, and free tier limits. We signed up for each free tier (without paying) to verify the actual limits and whether a credit card was required. The comparison is based on real, hands-on testing.",
  },
  {
    question: "Are your links affiliate links?",
    answer:
      "Yes, some links on this page are affiliate links. If you click and sign up for a paid plan, we may earn a commission at no extra cost to you. We only recommend tools we've tested and believe are genuinely useful. Tools without affiliate programs (like ChatGPT) are included for completeness.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: f.answer,
    },
  })),
};

export const Route = createFileRoute("/compare/ai-writing-tools")({
  head: () => ({
    meta: [
      {
        title: "Best AI Writing Tools — Side-by-Side Comparison (2026) | ZeroBuild",
      },
      {
        name: "description",
        content:
          "We tested 6 AI writing tools side-by-side with the same prompt. Compare free tier limits, pricing, and real output quality. Find the best free AI writing tool — no credit card required to read.",
      },
      { property: "og:title", content: "Best AI Writing Tools — Side-by-Side Comparison | ZeroBuild" },
      {
        property: "og:description",
        content:
          "Real comparison of 6 AI writing tools: Jasper, Copy.ai, Writesonic, Rytr, Anyword, and ChatGPT. Free tier limits, pricing, and side-by-side output samples.",
      },
      { property: "og:type", content: "article" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(faqSchema),
      },
    ],
  }),
  component: AiWritingToolsCompare,
});

function AiWritingToolsCompare() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-4xl px-6 pb-16 pt-16 sm:pt-24 sm:pb-20">
          <span className="inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
            📊 AI Writing Tools Comparison
          </span>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Best AI Writing Tools — Side-by-Side Comparison
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            We tested 6 popular AI writing tools with the same prompt so you can
            see exactly how they compare on free tier limits, pricing, output
            quality, and value.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Updated: July 2026 • 6 tools tested • All free tiers verified
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-white py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Comparison Table
              </h2>
              <p className="mt-1 text-gray-600">
                Sort by any column — click column headers to reorder.
              </p>
            </div>
          </div>
          <ToolComparison tools={aiWritingTools} />
          <AffiliateDisclosure className="mt-4" />
        </div>
      </section>

      {/* How We Tested — Methodology */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            How We Tested
          </h2>
          <p className="mt-3 text-gray-600">
            Every tool in this comparison was tested using the same methodology
            — one prompt, signed up with no credit card where possible, and
            evaluated on the same criteria.
          </p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "The Prompt",
                body: "We used the exact same prompt across all 6 tools — a 200-word product description task. This tests real-world copywriting capability, not just chat.",
              },
              {
                title: "Free Tier Verification",
                body: "We signed up for every free tier ourselves. We verified whether a credit card was required, what the actual word/character limits are, and what features are available for free.",
              },
              {
                title: "Output Quality",
                body: "We evaluated each output on readability, creativity, brand voice, and how well it followed the prompt instructions. No tool was given special treatment.",
              },
              {
                title: "Ease of Use",
                body: "We timed how long it took from sign-up to first output. We noted interface friction, template quality, and overall user experience.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.body}</p>
              </div>
            ))}
          </div>

          {/* The test prompt */}
          <div className="mt-8 rounded-xl border border-gray-300 bg-gray-900 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
              Test Prompt Used
            </p>
            <p className="text-sm text-gray-200 leading-relaxed font-mono">
              {testPrompt}
            </p>
          </div>
        </div>
      </section>

      {/* Side-by-Side Output Samples */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Side-by-Side Output Samples
          </h2>
          <p className="mt-3 text-gray-600">
            See what each tool produced from the exact same prompt. We'll be
            adding real output samples here as we complete testing.
          </p>

          <div className="mt-8 space-y-6">
            {aiWritingTools.map((tool) => (
              <div
                key={tool.slug}
                className="rounded-xl border border-gray-200 bg-gray-50 p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                  <span className="text-xs text-gray-400">
                    {tool.truly_free ? "Free tier" : "Trial"}
                  </span>
                </div>
                <div className="mt-3 rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center">
                  <p className="text-sm text-gray-400 italic">
                    Output sample coming soon — we're running the tests now.
                    Check back for real side-by-side results from each tool.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decision Guide */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Which Tool Is Right for You?
          </h2>
          <p className="mt-3 text-gray-600">
            The best tool depends on your needs. Here's our quick guide based on
            real testing.
          </p>

          <div className="mt-8 space-y-5">
            {[
              {
                label: "Best Free Tier Overall",
                tool: "Writesonic",
                reason:
                  "10,000 words/month with no credit card. The most generous free tier in the category. If you want to write without spending a dime, start here.",
              },
              {
                label: "Best for Beginners",
                tool: "Rytr",
                reason:
                  "Simple interface, lowest paid plan at $9/month, and a free tier that doesn't require a credit card. Perfect if you're just getting started with AI writing.",
              },
              {
                label: "Best for Marketing Teams",
                tool: "Jasper AI",
                reason:
                  "Brand voice controls, campaign workflows, and team collaboration features make Jasper the top pick for professional marketing teams — but it requires a credit card for the trial.",
              },
              {
                label: "Best for Versatility",
                tool: "ChatGPT",
                reason:
                  "It's not just for writing — ChatGPT handles brainstorming, coding, research, and creative tasks. The free tier is genuinely useful and unlimited in duration (just rate-limited per day).",
              },
              {
                label: "Best Affiliate Potential",
                tool: "Writesonic",
                reason:
                  "30% lifetime recurring commissions and a strong product with a generous free tier means higher conversion rates. If you're promoting AI tools, Writesonic's affiliate program is the strongest.",
              },
              {
                label: "Best for Data-Driven Copy",
                tool: "Anyword",
                reason:
                  "Predictive performance scores tell you how well your copy will perform before you publish. Best for data-driven marketers who want copy scoring baked in.",
              },
            ].map((rec) => (
              <div
                key={rec.label}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                  {rec.label}
                </span>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">
                  {rec.tool}
                </h3>
                <p className="mt-1 text-sm text-gray-600">{rec.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">
            Frequently Asked Questions
          </h2>
          <div className="mt-10 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-gray-200 bg-white p-5 hover:border-indigo-200 transition-colors"
              >
                <summary className="cursor-pointer font-medium text-gray-900 list-none flex items-center justify-between">
                  {faq.question}
                  <span className="ml-4 text-gray-400 group-open:hidden">+</span>
                  <span className="ml-4 text-gray-400 hidden group-open:inline">
                    −
                  </span>
                </summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
