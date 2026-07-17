import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  Link,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        name: "description",
        content:
          "ZeroBuild — honest AI tool comparisons, tested side-by-side. Real free tier limits, real pricing, real output samples. No fluff.",
      },
      { title: "ZeroBuild — Honest AI Tool Comparisons, Zero Cost" },
      { property: "og:title", content: "ZeroBuild" },
      {
        property: "og:description",
        content:
          "We find, build, and document zero-cost passive income streams from scratch — sharing the exact blueprints, tools, and real results transparently.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-6xl font-bold text-gray-300">404</h1>
      <p className="text-lg text-gray-500">Page not found</p>
      <Link
        to="/"
        className="mt-2 text-indigo-600 underline hover:text-indigo-800"
      >
        Back to home
      </Link>
    </div>
  ),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-dvh flex-col bg-white text-gray-900 antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Scripts />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="text-xl font-bold tracking-tight text-gray-900 hover:text-indigo-600 transition-colors"
        >
          ZeroBuild
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className="text-gray-600 hover:text-indigo-600 transition-colors [&.active]:text-indigo-600"
          >
            Home
          </Link>
          <Link
            to="/compare"
            className="text-gray-600 hover:text-indigo-600 transition-colors [&.active]:text-indigo-600"
          >
            Compare
          </Link>
          <Link
            to="/about"
            className="text-gray-600 hover:text-indigo-600 transition-colors [&.active]:text-indigo-600"
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:justify-between">
          {/* Brand column */}
          <div className="max-w-xs">
            <p className="text-lg font-bold text-gray-900">ZeroBuild</p>
            <p className="mt-1 text-sm text-gray-500">
              Honest AI tool comparisons, tested side-by-side. Real free tier
              limits, real pricing, real output samples — no fluff, no courses,
              no hype.
            </p>
          </div>

          {/* Links column */}
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-gray-900">Navigate</p>
            <Link
              to="/"
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/compare"
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              Compare Tools
            </Link>
            <Link
              to="/compare/ai-writing-tools"
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              AI Writing Tools
            </Link>
            <Link
              to="/about"
              className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
            >
              About
            </Link>
          </div>

          {/* Subscribe column — UI only */}
          <div className="w-full sm:max-w-xs">
            <p className="text-sm font-semibold text-gray-900">
              Get new comparisons in your inbox
            </p>
            <form
              className="mt-2 flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-400">
              No spam, no paid courses. Just real comparisons.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} ZeroBuild. Honest tool comparisons,
          transparent affiliate links.{" "}
          <Link to="/about" className="underline hover:text-gray-600">
            How we make money
          </Link>
          .
        </div>
      </div>
    </footer>
  );
}
