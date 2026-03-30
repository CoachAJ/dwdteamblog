import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BookOpen } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let posts: Awaited<ReturnType<typeof getAllPosts>> = []
  try {
    posts = await getAllPosts(true)
  } catch (err) {
    console.error('[HomePage] DB error:', err)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4 text-amber-400" />
            Daily with Doc Team
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            Insights from the <span className="text-amber-400">Doc Team</span>
          </h1>
          <p className="text-brand-200 text-lg max-w-xl mx-auto">
            Tips, updates, tutorials and perspectives — shared daily by the team.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-700 mb-2">No posts yet</h2>
            <p className="text-slate-500">Check back soon — great content is on the way.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Latest Posts</h2>
              <span className="text-sm text-slate-500">{posts.length} article{posts.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
