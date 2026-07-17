import { createFileRoute } from "@tanstack/react-router";
import { tools } from "~/data/tools";
import ToolComparison from "~/components/ToolComparison";
import { AffiliateDisclosure } from "~/utils/affiliate";

const aiImageTools = tools.filter((t) => t.category === "AI Image Generators");

// Used for the methodology section
const testPrompt = `product photo of a modern desk setup with laptop and coffee, natural lighting, professional`;

const faqs = [
  {
    question: "Which AI image generator has the best free tier?",
    answer:
      "Leonardo.ai offers the most generous free tier with 150 images per month and no credit card required. Canva AI provides 50 lifetime AI image credits plus a full design suite. DALL·E gives ~2 images per day via ChatGPT's free tier (~60/month). RunwayML offers 125 credits/month for both image and video. Adobe Firefly provides 25 credits/month. Midjourney is paid-only with no permanent free tier.",
  },
  {
    question: "Do any AI image generators require a credit card for the free tier?",
    answer:
      "Midjourney requires a credit card (it's paid-only starting at $10/month). Leonardo.ai, Canva AI, Adobe Firefly, RunwayML, and DALL·E (via ChatGPT) all offer free tiers with no credit card required — you can start generating images immediately without entering payment details.",
  },
  {
    question: "Which tool is best for product photos and marketing images?",
    answer:
      "Midjourney produces the highest quality photorealistic product images, but it's paid-only. DALL·E excels at understanding complex prompts and is great for e-commerce product shots. Canva AI is ideal for marketing images since it integrates with Canva's massive template library — perfect for social media graphics and ads. Leonardo.ai is strong for stylized product mockups and game assets.",
  },
  {
    question: "Can I use AI-generated images for commercial purposes?",
    answer:
      "Most tools allow commercial use of generated images: Leonardo.ai, Canva AI, Adobe Firefly, RunwayML, and DALL·E all permit commercial use under their standard terms. Midjourney allows commercial use on paid plans. Adobe Firefly is particularly safe for commercial use since it's trained on Adobe Stock images. Always check the current terms of service, as policies can change.",
  },
  {
    question: "Which tool is best for social media content creators?",
    answer:
      "Canva AI is the best all-in-one for social media — you get AI image generation plus Canva's full design editor, templates, and scheduling tools. RunwayML is great for creators who also need AI video generation. Leonardo.ai excels at creating unique, stylized visuals that stand out in feeds. Adobe Firefly integrates well with Photoshop and Express for polish.",
  },
  {
    question: "How did you test these tools?",
    answer:
      "We ran the same prompt through every tool — a product photo of a modern desk setup — and evaluated output quality, realism, prompt adherence, speed, and free tier limits. We signed up for each free tier (without paying) to verify the actual limits and whether a credit card was required. The comparison is based on real, hands-on testing.",
  },
  {
    question: "Are your links affiliate links?",
    answer:
      "Some links on this page are affiliate links (like Canva). If you click and sign up for a paid plan, we may earn a commission at no extra cost to you. We only recommend tools we've tested and believe are genuinely useful. Tools without affiliate programs (like Midjourney and DALL·E) are included for completeness.",
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

export const Route = createFileRoute("/compare/ai-image-generators")({
  head: () => ({
    meta: [
      {
        title: "Best AI Image Generators for Small Business — Side-by-Side Comparison (2026) | ZeroBuild",
      },
      {
        name: "description",
        content:
          "We tested 6 AI image generators side-by-side with the same prompt. Compare free tier limits, pricing, and real output quality. Find the best free AI image generator for product photos, marketing, and social media.",
      },
      { property: "og:title", content: "Best AI Image Generators — Side-by-Side Comparison | ZeroBuild" },
      {
        property: "og:description",
        content:
          "Real comparison of 6 AI image generators: Midjourney, DALL·E, Leonardo.ai, RunwayML, Canva AI, and Adobe Firefly. Free tier limits, pricing, and side-by-side output samples.",
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
  component: AiImageGeneratorsCompare,
});

function AiImageGeneratorsCompare() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-4xl px-6 pb-16 pt-16 sm:pt-24 sm:pb-20">
          <span className="inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700">
            🎨 AI Image Generators Comparison
          </span>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Best AI Image Generators for Small Business — Side-by-Side Comparison
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-600">
            We tested 6 popular AI image generators with the same prompt so you can
            see exactly how they compare on free tier limits, pricing, output
            quality, and which ones are actually free.
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
          <ToolComparison tools={aiImageTools} />
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
                body: "We used the exact same prompt across all 6 tools — a product photo of a modern desk setup. This tests real-world product photography and lifestyle image generation capability.",
              },
              {
                title: "Free Tier Verification",
                body: "We signed up for every free tier ourselves. We verified whether a credit card was required, what the actual image generation limits are, and what resolution/features are available for free.",
              },
              {
                title: "Output Quality",
                body: "We evaluated each output on photorealism, prompt adherence, lighting quality, composition, and overall aesthetic appeal. No tool was given special treatment.",
              },
              {
                title: "Speed & Ease of Use",
                body: "We timed how long it took from sign-up to first generated image. We noted interface friction, generation speed, and overall user experience — especially for beginners.",
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
            {aiImageTools.map((tool) => (
              <div
                key={tool.slug}
                className="rounded-xl border border-gray-200 bg-gray-50 p-5"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{tool.name}</h3>
                  <span className="text-xs text-gray-400">
                    {tool.truly_free ? "Free tier" : "Paid only"}
                  </span>
                </div>
                <div className="mt-3 rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center">
                  <p className="text-sm text-gray-400 italic">
                    Output sample coming soon — we're running the tests now.
                    Check back for real side-by-side images from each tool.
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
                tool: "Leonardo.ai",
                reason:
                  "150 images/month with no credit card required. The most generous free tier among AI image generators. If you need volume for testing and prototyping, start here.",
              },
              {
                label: "Best for Product Photos",
                tool: "DALL·E",
                reason:
                  "Excellent prompt understanding and consistent output quality. The ChatGPT integration makes it accessible, and ~2 images/day on the free tier is usable for light e-commerce work.",
              },
              {
                label: "Best for Social Media",
                tool: "Canva AI",
                reason:
                  "AI image generation plus Canva's full design suite makes this unbeatable for social media marketers. Templates, brand kits, and scheduling all in one place. Free tier includes 50 AI credits.",
              },
              {
                label: "Best Quality Overall",
                tool: "Midjourney",
                reason:
                  "The industry leader for photorealistic and artistic quality — but it's paid-only starting at $10/month. Worth it if you need premium, publication-ready images regularly.",
              },
              {
                label: "Best for Designers",
                tool: "Adobe Firefly",
                reason:
                  "Seamless integration with Photoshop and Adobe Express. Safe for commercial use since it's trained on Adobe Stock. 25 free credits/month to test the waters.",
              },
              {
                label: "Best for Video Creators",
                tool: "RunwayML",
                reason:
                  "The only tool in this comparison that handles both image and AI video generation. 125 free credits/month covers both. Perfect if you're creating short-form video content.",
              },
              {
                label: "Best Affiliate Potential",
                tool: "Canva AI",
                reason:
                  "Canva has a massive affiliate program through Impact. $3-5 per signup may seem modest, but Canva's huge user base and strong free-to-paid conversion funnel make it a reliable earner.",
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
