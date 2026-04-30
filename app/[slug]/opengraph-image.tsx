import { ImageResponse } from 'next/og'
import { getPostBySlug } from '@/lib/posts'

export const runtime = 'nodejs'
export const alt = 'Blog post preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image({ params }: { params: { slug: string } }) {
  let post = null
  try { post = await getPostBySlug(params.slug) } catch { /* db error */ }

  const title = post?.title ?? 'Daily with Doc Team Blog'
  const excerpt = post?.excerpt ?? 'Daily health insights and wellness tips from the Doc Team.'
  const fontSize = title.length > 70 ? 48 : title.length > 50 ? 54 : 62

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              background: '#f59e0b',
              color: 'white',
              padding: '10px 24px',
              borderRadius: '100px',
              fontSize: '22px',
              fontWeight: 'bold',
              letterSpacing: '-0.02em',
            }}
          >
            Daily with Doc Team
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              color: 'white',
              fontSize: `${fontSize}px`,
              fontWeight: 'bold',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
          <div
            style={{
              color: '#94a3b8',
              fontSize: '26px',
              lineHeight: 1.5,
            }}
          >
            {excerpt.length > 130 ? excerpt.slice(0, 130) + '…' : excerpt}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#475569',
            fontSize: '20px',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '3px',
              background: '#f59e0b',
              borderRadius: '2px',
            }}
          />
          blog.dailywithdocteam.com
        </div>
      </div>
    ),
    { ...size }
  )
}
