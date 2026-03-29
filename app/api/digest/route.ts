import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendDigestEmail } from '@/lib/getresponse'

export async function POST(req: NextRequest) {
  const secret = process.env.DIGEST_SECRET
  const authHeader = req.headers.get('authorization')

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)

    const endOfYesterday = new Date(yesterday)
    endOfYesterday.setHours(23, 59, 59, 999)

    const posts = await prisma.post.findMany({
      where: {
        published: true,
        createdAt: {
          gte: yesterday,
          lte: endOfYesterday,
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    if (posts.length === 0) {
      return NextResponse.json({ message: 'No posts published yesterday — digest skipped.' })
    }

    const dateLabel = yesterday.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    await sendDigestEmail(posts, `Morning Digest — ${dateLabel}`)

    return NextResponse.json({
      message: `Digest sent for ${dateLabel}`,
      postCount: posts.length,
      posts: posts.map((p: { title: string; slug: string }) => ({ title: p.title, slug: p.slug })),
    })
  } catch (err) {
    console.error('[Digest] Error:', err)
    return NextResponse.json({ error: 'Digest failed.' }, { status: 500 })
  }
}
