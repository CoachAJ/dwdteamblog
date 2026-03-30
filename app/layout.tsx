import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

const BASE_URL = process.env.NEXT_PUBLIC_BLOG_URL || 'https://blog.dailywithdocteam.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Daily with Doc Team Blog',
    template: '%s | Daily with Doc Team',
  },
  description: 'Daily health insights, wellness tips, and expert guidance from the Daily with Doc Team.',
  keywords: ['health', 'wellness', 'doc team', 'daily tips', 'holistic health'],
  authors: [{ name: 'Doc Team', url: BASE_URL }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'Daily with Doc Team Blog',
    url: BASE_URL,
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@dailywithdocteam',
  },
  alternates: {
    canonical: BASE_URL,
    types: {
      'application/rss+xml': `${BASE_URL}/feed.xml`,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
