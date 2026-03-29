'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, BookOpen } from 'lucide-react'

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="bg-brand-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:text-brand-200 transition-colors">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <span>Daily with Doc Team</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-brand-200 transition-colors">Blog</Link>
            <Link href="/feed.xml" className="hover:text-brand-200 transition-colors" target="_blank">RSS</Link>
            <Link
              href="/admin"
              className="bg-amber-500 hover:bg-amber-400 text-white px-4 py-1.5 rounded-full text-sm font-semibold transition-colors"
            >
              Admin
            </Link>
          </nav>

          <button
            className="md:hidden p-2 rounded-md hover:bg-brand-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-brand-800 bg-brand-900 px-4 py-3 space-y-2">
          <Link href="/" className="block py-2 hover:text-brand-200 transition-colors" onClick={() => setMobileOpen(false)}>Blog</Link>
          <Link href="/feed.xml" className="block py-2 hover:text-brand-200 transition-colors" target="_blank">RSS</Link>
          <Link href="/admin" className="block py-2 text-amber-400 font-semibold" onClick={() => setMobileOpen(false)}>Admin</Link>
        </div>
      )}
    </header>
  )
}
