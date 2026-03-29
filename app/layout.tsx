import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Daily with Doc Team Blog',
    template: '%s | Daily with Doc Team',
  },
  description: 'Insights, updates, and expertise from the Doc Team.',
  openGraph: {
    type: 'website',
    siteName: 'Daily with Doc Team Blog',
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
