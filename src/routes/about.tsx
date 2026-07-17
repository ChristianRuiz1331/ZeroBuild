import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
        About ZeroBuild
      </h1>

      <div className="mt-10 space-y-8 text-lg leading-relaxed text-gray-700">
        <p>
          Most "passive income" content online is a sales funnel. A YouTube
          video promising $10,000/month that funnels you into a $997 course —
          which teaches you to make YouTube videos funneling people into{" "}
          <em>your</em> $997 course.
        </p>

        <p>
          <strong>ZeroBuild is the antidote.</strong> We don't sell courses. We
          don't have a secret method. We just build real income streams with
          zero dollars spent, document every step publicly, and share the actual
          results — even when they're disappointing.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          What we believe
        </h2>

        <ul className="list-disc space-y-3 pl-6">
          <li>
            <strong>No upfront capital.</strong> If a method requires money to
            start, we skip it. Every build starts at $0.
          </li>
          <li>
            <strong>Full transparency.</strong> We share exact numbers — revenue,
            time invested, tools used, mistakes made. No cherry-picked
            highlights.
          </li>
          <li>
            <strong>Copyable blueprints.</strong> Every build log includes the
            exact steps so you can replicate it yourself. No hidden steps, no
            "secret sauce."
          </li>
          <li>
            <strong>No coding required.</strong> Most builds use free,
            no-code tools. If a build does involve code, we walk through it in
            plain language.
          </li>
          <li>
            <strong>Long-term focus.</strong> We're interested in income streams
            that compound — not quick flips or trends. Real passive income takes
            time.
          </li>
        </ul>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          How we make money
        </h2>

        <p>
          ZeroBuild itself is a zero-cost build. The site runs on free hosting,
          the content is written by us, and we don't charge for access. Our
          revenue comes from:
        </p>

        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Ad revenue</strong> from the blog and any YouTube content
          </li>
          <li>
            <strong>Affiliate commissions</strong> from free/freemium tools we
            genuinely use and recommend
          </li>
          <li>
            <strong>The builds themselves</strong> — the income streams we
            document are real revenue sources
          </li>
        </ul>

        <p>
          If we ever create a paid product (compiled blueprints, templates), it
          will be because people asked for it — and every method will still be
          available free on this site.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-gray-900">
          Who's behind this
        </h2>

        <p>
          ZeroBuild is an open experiment. We're people who got tired of the
          passive-income hype machine and decided to test what actually works —
          with real builds, real money, and no secrets. Every build is
          documented as it happens, and the results — good or bad — go live.
        </p>
      </div>

      <div className="mt-16 rounded-2xl border border-indigo-200 bg-indigo-50 p-8 text-center">
        <p className="text-lg font-semibold text-indigo-900">
          Want to follow along?
        </p>
        <p className="mt-2 text-indigo-700">
          Every new build is documented in full. Subscribe to get notified when
          a new blueprint goes live.
        </p>
        <form
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="you@email.com"
            className="flex-1 rounded-xl border border-indigo-200 bg-white px-4 py-3 text-base placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-700 transition-colors sm:flex-shrink-0"
          >
            Subscribe
          </button>
        </form>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-lg font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          See all builds →
        </Link>
      </div>
    </div>
  );
}
