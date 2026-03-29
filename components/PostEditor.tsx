'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Save, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react'

type PostData = {
  title: string
  excerpt: string
  content: string
  coverImage: string
  author: string
  tags: string
  published: boolean
}

type Props = {
  initialData?: Partial<PostData>
  postId?: string
}

const EMPTY: PostData = {
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  author: 'Doc Team',
  tags: '',
  published: false,
}

export default function PostEditor({ initialData, postId }: Props) {
  const [form, setForm] = useState<PostData>({ ...EMPTY, ...initialData })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const router = useRouter()

  function update(field: keyof PostData, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function save(publish?: boolean) {
    setSaving(true)
    setError('')
    const body = { ...form }
    if (publish !== undefined) body.published = publish

    const url = postId ? `/api/posts/${postId}` : '/api/posts'
    const method = postId ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      router.push('/admin/dashboard')
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Failed to save. Please try again.')
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-brand-900 text-white px-6 py-3 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-brand-300 hover:text-white transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button
            onClick={() => save(true)}
            disabled={saving}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <Eye className="w-4 h-4" />
            Publish
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}

          <input
            type="text"
            placeholder="Post title…"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            className="w-full text-3xl font-bold text-slate-900 placeholder:text-slate-300 border-0 bg-transparent focus:outline-none focus:ring-0 py-2"
          />

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setTab('write')}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                  tab === 'write' ? 'text-brand-700 border-b-2 border-brand-600 -mb-px' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Write (Markdown)
              </button>
              <button
                onClick={() => setTab('preview')}
                className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                  tab === 'preview' ? 'text-brand-700 border-b-2 border-brand-600 -mb-px' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Preview
              </button>
            </div>

            {tab === 'write' ? (
              <textarea
                value={form.content}
                onChange={(e) => update('content', e.target.value)}
                placeholder="Write your post in Markdown…"
                rows={24}
                className="w-full p-4 text-sm font-mono text-slate-800 focus:outline-none resize-none"
              />
            ) : (
              <div
                className="prose prose-slate max-w-none p-6 min-h-[300px]"
                dangerouslySetInnerHTML={{
                  __html: form.content
                    ? form.content.replace(/\n/g, '<br/>')
                    : '<p class="text-slate-400 italic">Nothing to preview yet.</p>',
                }}
              />
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
            <h3 className="font-semibold text-slate-800 text-sm">Post Settings</h3>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => update('published', false)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    !form.published
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <EyeOff className="w-3 h-3" /> Draft
                </button>
                <button
                  onClick={() => update('published', true)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    form.published
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <Eye className="w-3 h-3" /> Published
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Excerpt</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => update('excerpt', e.target.value)}
                placeholder="Short description…"
                rows={3}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Author</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => update('author', e.target.value)}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tags <span className="text-slate-400">(comma-separated)</span></label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => update('tags', e.target.value)}
                placeholder="design, tips, update"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Cover Image URL</label>
              <input
                type="url"
                value={form.coverImage}
                onChange={(e) => update('coverImage', e.target.value)}
                placeholder="https://…"
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {form.coverImage && (
                <img src={form.coverImage} alt="Cover preview" className="mt-2 w-full h-24 object-cover rounded-lg" />
              )}
            </div>
          </div>
        </aside>
      </main>
    </div>
  )
}
