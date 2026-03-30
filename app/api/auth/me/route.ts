import { NextResponse } from 'next/server'
import { getSessionEmailFromCookie } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const email = getSessionEmailFromCookie()
  if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (email === 'api@admin') {
    return NextResponse.json({ email, name: 'API', role: 'admin' })
  }

  try {
    const user = await prisma.adminUser.findUnique({
      where: { email },
      select: { email: true, name: true, role: true },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    return NextResponse.json(user)
  } catch (err) {
    console.error('[/api/auth/me]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
