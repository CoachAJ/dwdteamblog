const GR_API = 'https://api.getresponse.com/v3'

type Post = {
  title: string
  slug: string
  excerpt?: string | null
  content: string
  author: string
  tags?: string | null
  createdAt: Date
}

function buildEmailHtml(post: Post, blogUrl: string): string {
  const postUrl = `${blogUrl}/${post.slug}`
  const tags = post.tags
    ? post.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${post.title}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <tr>
          <td style="background:#1e3a8a;padding:24px 32px;">
            <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#f59e0b;margin-right:8px;vertical-align:middle;"></span>
              Daily with Doc Team Blog
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 8px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">New Post</p>
            <h1 style="margin:0 0 16px;color:#0f172a;font-size:26px;font-weight:800;line-height:1.3;">${post.title}</h1>
            ${tags.length ? `<p style="margin:0 0 16px;">${tags.map((t) => `<span style="display:inline-block;background:#eff6ff;color:#1d4ed8;font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;margin-right:6px;">${t}</span>`).join('')}</p>` : ''}
            ${post.excerpt ? `<p style="margin:0 0 24px;color:#475569;font-size:16px;line-height:1.6;">${post.excerpt}</p>` : ''}
            <p style="margin:0 0 24px;color:#64748b;font-size:13px;">By <strong style="color:#334155;">${post.author}</strong></p>
            <a href="${postUrl}" style="display:inline-block;background:#1e3a8a;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-weight:700;font-size:15px;">Read the Full Post →</a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
              You're receiving this because you subscribed to the Daily with Doc Team Blog.<br/>
              <a href="${blogUrl}" style="color:#64748b;">Visit our blog</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildEmailPlain(post: Post, blogUrl: string): string {
  const postUrl = `${blogUrl}/${post.slug}`
  return `New post from Daily with Doc Team Blog\n\n${post.title}\nBy ${post.author}\n\n${post.excerpt ?? ''}\n\nRead the full post: ${postUrl}\n\n---\nVisit the blog: ${blogUrl}`
}

function buildDigestHtml(posts: Post[], blogUrl: string, label: string): string {
  const items = posts.map((post) => {
    const postUrl = `${blogUrl}/${post.slug}`
    const tags = post.tags ? post.tags.split(',').map((t) => t.trim()).filter(Boolean) : []
    return `
    <tr>
      <td style="padding:20px 0;border-bottom:1px solid #f1f5f9;">
        <p style="margin:0 0 6px;">
          ${tags.map((t) => `<span style="display:inline-block;background:#eff6ff;color:#1d4ed8;font-size:11px;font-weight:600;padding:2px 8px;border-radius:999px;margin-right:4px;">${t}</span>`).join('')}
        </p>
        <a href="${postUrl}" style="color:#0f172a;font-size:17px;font-weight:700;text-decoration:none;line-height:1.4;">${post.title}</a>
        ${post.excerpt ? `<p style="margin:6px 0 8px;color:#475569;font-size:14px;line-height:1.5;">${post.excerpt}</p>` : ''}
        <p style="margin:0;color:#94a3b8;font-size:12px;">By <strong style="color:#64748b;">${post.author}</strong></p>
        <a href="${postUrl}" style="display:inline-block;margin-top:10px;color:#1d4ed8;font-size:13px;font-weight:600;text-decoration:none;">Read more →</a>
      </td>
    </tr>`
  }).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${label}</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
        <tr>
          <td style="background:#1e3a8a;padding:24px 32px;">
            <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#f59e0b;margin-right:8px;vertical-align:middle;"></span>
              Daily with Doc Team Blog
            </p>
            <p style="margin:6px 0 0;color:#93c5fd;font-size:13px;">${label}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px 8px;">
            <p style="margin:0 0 4px;color:#64748b;font-size:13px;text-transform:uppercase;letter-spacing:0.05em;font-weight:600;">
              ${posts.length} post${posts.length !== 1 ? 's' : ''} published
            </p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${items}
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px 28px;">
            <a href="${blogUrl}" style="display:inline-block;background:#1e3a8a;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:700;font-size:14px;">Visit the Blog →</a>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
            <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
              You're receiving this daily digest because you subscribed to the Daily with Doc Team Blog.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildDigestPlain(posts: Post[], blogUrl: string, label: string): string {
  const lines = posts.map((p) => `• ${p.title}\n  ${p.excerpt ?? ''}\n  ${blogUrl}/${p.slug}`).join('\n\n')
  return `${label}\nDaily with Doc Team Blog\n\n${lines}\n\n---\nVisit the blog: ${blogUrl}`
}

export async function sendDigestEmail(posts: Post[], label: string): Promise<void> {
  const apiKey = process.env.GETRESPONSE_API_KEY
  const campaignId = process.env.GETRESPONSE_CAMPAIGN_ID
  const blogUrl = process.env.NEXT_PUBLIC_BLOG_URL ?? ''

  if (!apiKey || !campaignId) {
    console.warn('[GetResponse] GETRESPONSE_API_KEY or GETRESPONSE_CAMPAIGN_ID not set — skipping digest.')
    return
  }

  if (posts.length === 0) {
    console.log('[GetResponse] No posts for digest — skipping.')
    return
  }

  const payload = {
    subject: `${label} — Daily with Doc Team Blog`,
    campaign: { campaignId },
    content: {
      html: buildDigestHtml(posts, blogUrl, label),
      plain: buildDigestPlain(posts, blogUrl, label),
    },
    sendSettings: {
      selectedCampaigns: [campaignId],
      selectedSegments: [],
      selectedSuppressions: [],
      excludedCampaigns: [],
    },
  }

  const res = await fetch(`${GR_API}/newsletters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': `api-key ${apiKey}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`[GetResponse] Failed to send digest: ${res.status} ${err}`)
  } else {
    console.log(`[GetResponse] Digest sent: "${label}" (${posts.length} posts)`)
  }
}

export async function sendNewsletterForPost(post: Post): Promise<void> {
  const apiKey = process.env.GETRESPONSE_API_KEY
  const campaignId = process.env.GETRESPONSE_CAMPAIGN_ID
  const blogUrl = process.env.NEXT_PUBLIC_BLOG_URL ?? ''

  if (!apiKey || !campaignId) {
    console.warn('[GetResponse] GETRESPONSE_API_KEY or GETRESPONSE_CAMPAIGN_ID not set — skipping email.')
    return
  }

  const payload = {
    subject: `New Post: ${post.title}`,
    campaign: { campaignId },
    content: {
      html: buildEmailHtml(post, blogUrl),
      plain: buildEmailPlain(post, blogUrl),
    },
    sendSettings: {
      selectedCampaigns: [campaignId],
      selectedSegments: [],
      selectedSuppressions: [],
      excludedCampaigns: [],
    },
  }

  const res = await fetch(`${GR_API}/newsletters`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': `api-key ${apiKey}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error(`[GetResponse] Failed to send newsletter: ${res.status} ${err}`)
  } else {
    console.log(`[GetResponse] Newsletter queued for post: "${post.title}"`)
  }
}
