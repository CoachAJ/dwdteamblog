import Link from 'next/link'
import { BookOpen, Rss } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-brand-950 text-slate-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span>Daily with Doc Team</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Blog</Link>
            <Link href="/feed.xml" className="hover:text-white transition-colors flex items-center gap-1" target="_blank">
              <Rss className="w-4 h-4" />
              RSS Feed
            </Link>
            <Link href="/embed-guide" className="hover:text-white transition-colors">Embed Guide</Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-brand-900 text-center text-xs">
          © {new Date().getFullYear()} Daily with Doc Team. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
