import { notFound } from 'next/navigation'
import { getPostBySlug, renderMarkdown, parseTags } from '@/lib/posts'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = { params: { slug: string } }

const BASE_URL = process.env.NEXT_PUBLIC_BLOG_URL || 'https://blog.dailywithdocteam.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let post = null
  try { post = await getPostBySlug(params.slug) } catch { /* db error */ }
  if (!post) return { title: 'Post Not Found' }
  const url = `${BASE_URL}/${post.slug}`
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt ?? undefined,
      url,
      images: post.coverImage ? [{ url: post.coverImage, width: 1200, height: 630 }] : [],
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author],
      tags: post.tags ? post.tags.split(',').map((t) => t.trim()) : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.coverImage ? [post.coverImage] : [],
    },
  }
}

export default async function PostPage({ params }: Props) {
  let post = null
  try { post = await getPostBySlug(params.slug) } catch { /* db error */ }

  if (!post || !post.published) notFound()

  const html = await renderMarkdown(post.content)
  const tags = parseTags(post.tags)
  const url = `${BASE_URL}/${post.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? undefined,
    image: post.coverImage ?? undefined,
    url,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Daily with Doc Team',
      url: BASE_URL,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.tags ?? undefined,
  }

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      {post.coverImage && (
        <div className="w-full h-72 md:h-96 overflow-hidden">
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-800 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all posts
        </Link>

        <article>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-brand-100 text-brand-700"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mb-10 pb-8 border-b border-slate-200">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {format(new Date(post.createdAt), 'MMMM d, yyyy')}
            </span>
          </div>

          <div
            className="prose prose-slate prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </article>
      </main>

      <Footer />
    </div>
  )
}
