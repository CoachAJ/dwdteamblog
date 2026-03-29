import Link from 'next/link'
import { Calendar, User, Tag } from 'lucide-react'
import { format } from 'date-fns'
import type { Post } from '@/lib/posts'

const TAG_COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-violet-100 text-violet-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
]

function tagColor(tag: string) {
  const idx = tag.charCodeAt(0) % TAG_COLORS.length
  return TAG_COLORS[idx]
}

export default function PostCard({ post }: { post: Post }) {
  const tags = post.tags ? post.tags.split(',').map((t) => t.trim()).filter(Boolean) : []

  return (
    <article className="group bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-brand-200 transition-all duration-200 overflow-hidden flex flex-col">
      {post.coverImage ? (
        <div className="h-48 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="h-3 bg-gradient-to-r from-brand-600 to-brand-400" />
      )}

      <div className="p-6 flex flex-col flex-1">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${tagColor(tag)}`}>
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link href={`/${post.slug}`}>
          <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-700 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">
            {post.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            {post.author}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {format(new Date(post.createdAt), 'MMM d, yyyy')}
          </span>
        </div>
      </div>
    </article>
  )
}
