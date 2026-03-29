import { NextRequest, NextResponse } from 'next/server'
import { getAllPosts, createPost } from '@/lib/posts'
import { isAdminAuthenticated } from '@/lib/auth'
import { sendNewsletterForPost } from '@/lib/getresponse'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get('all') === 'true'
  const limit = req.nextUrl.searchParams.get('limit')

  if (all && !isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let posts = await getAllPosts(!all)

  if (limit) {
    posts = posts.slice(0, parseInt(limit))
  }

  return NextResponse.json(posts, { headers: CORS })
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    if (!body.title || !body.content) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 })
    }
    const post = await createPost(body)
    if (post.published) {
      sendNewsletterForPost(post).catch(console.error)
    }
    return NextResponse.json(post, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create post.' }, { status: 500 })
  }
}
