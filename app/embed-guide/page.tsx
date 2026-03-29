import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Code2, Link2, Rss, Globe } from 'lucide-react'

export const metadata = {
  title: 'Embed Guide',
  description: 'How to integrate the Doc Team Blog into your other websites.',
}

export default function EmbedGuidePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Embed & Integration Guide</h1>
        <p className="text-slate-500 mb-10">
          Three ways to connect your 13 websites to this blog — pick the one that fits each site.
        </p>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-brand-100 rounded-lg flex items-center justify-center">
                <Link2 className="w-5 h-5 text-brand-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Option 1 — Direct Link</h2>
                <p className="text-sm text-slate-500">Simplest. Just link to this blog from your site.</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Add a &ldquo;Blog&rdquo; link in your navigation pointing to this blog&apos;s URL. Zero setup required.
            </p>
            <pre className="bg-slate-50 rounded-lg p-4 text-sm font-mono text-slate-700 overflow-x-auto">
              {`<a href="https://your-blog-url.com">Visit our Blog</a>`}
            </pre>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Option 2 — Embeddable Widget</h2>
                <p className="text-sm text-slate-500">Drop a script tag into any page to show recent posts.</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Works on <strong>any website</strong> — HTML, WordPress, Webflow, Wix, Squarespace, React, etc. Paste this snippet where you want the feed to appear:
            </p>
            <pre className="bg-slate-900 text-emerald-400 rounded-lg p-4 text-xs font-mono overflow-x-auto leading-relaxed">
              {`<!-- Doc Team Blog Widget -->
<div id="doc-team-blog"></div>
<script
  src="https://your-blog-url.com/embed.js"
  data-blog-url="https://your-blog-url.com"
  data-limit="5"
  data-theme="light"
  data-excerpt="true"
></script>`}
            </pre>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="bg-slate-50 rounded-lg p-3">
                <code className="font-semibold text-brand-700">data-limit</code>
                <p className="mt-1 text-slate-500">Number of posts to show (default: 5)</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <code className="font-semibold text-brand-700">data-theme</code>
                <p className="mt-1 text-slate-500"><code>light</code> or <code>dark</code></p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <code className="font-semibold text-brand-700">data-excerpt</code>
                <p className="mt-1 text-slate-500"><code>true</code> or <code>false</code> to show excerpts</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <code className="font-semibold text-brand-700">data-container</code>
                <p className="mt-1 text-slate-500">Custom container div ID (default: <code>doc-team-blog</code>)</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Option 3 — JSON API</h2>
                <p className="text-sm text-slate-500">Fetch posts and render them in your own style.</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              For sites with a custom front-end. Fetch from the API and display posts however you like.
            </p>
            <pre className="bg-slate-900 text-emerald-400 rounded-lg p-4 text-xs font-mono overflow-x-auto leading-relaxed">
              {`// GET https://your-blog-url.com/api/posts?limit=5
// Returns an array of published posts:
[
  {
    "id": "...",
    "title": "Post Title",
    "slug": "post-title",
    "excerpt": "Short description",
    "author": "Doc Team",
    "tags": "tips, design",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "coverImage": "https://..."
  }
]`}
            </pre>
            <p className="text-xs text-slate-500 mt-3">CORS is enabled — you can call this API from any domain.</p>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-rose-100 rounded-lg flex items-center justify-center">
                <Rss className="w-5 h-5 text-rose-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Option 4 — RSS Feed</h2>
                <p className="text-sm text-slate-500">For WordPress sites or RSS-aware platforms.</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              Use the RSS feed to auto-import posts into WordPress or any RSS reader/aggregator.
            </p>
            <pre className="bg-slate-50 rounded-lg p-4 text-sm font-mono text-slate-700 overflow-x-auto">
              {`https://your-blog-url.com/feed.xml`}
            </pre>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
