import { NextRequest, NextResponse } from 'next/server'
import { getPostById, updatePost, deletePost } from '@/lib/posts'
import { isAdminAuthenticated, isRequestAuthenticated, getSessionEmailFromCookie } from '@/lib/auth'
import { sendNewsletterForPost } from '@/lib/getresponse'
import { prisma } from '@/lib/db'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS })
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const post = await getPostById(params.id)
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(post, { headers: CORS })
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isRequestAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const existing = await getPostById(params.id)
    const wasUnpublished = existing && !existing.published
    const post = await updatePost(params.id, body)
    if (wasUnpublished && post.published) {
      sendNewsletterForPost(post).catch(console.error)
    }
    return NextResponse.json(post)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update post.' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const email = getSessionEmailFromCookie()
  if (email && email !== 'api@admin') {
    const user = await prisma.adminUser.findUnique({ where: { email }, select: { role: true } })
    if (user && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: only admins can delete posts.' }, { status: 403 })
    }
  }
  try {
    await deletePost(params.id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete post.' }, { status: 500 })
  }
}
