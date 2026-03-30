import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateSessionToken, COOKIE_NAME } from '@/lib/auth'
import { prisma } from '@/lib/db'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ''

function setSessionCookie(res: NextResponse, email: string) {
  res.cookies.set(COOKIE_NAME, generateSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!password) {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 })
    }

    // Legacy: password-only login for AI pipeline / automation
    if (!email) {
      if (ADMIN_PASSWORD && password === ADMIN_PASSWORD) {
        const res = NextResponse.json({ success: true, name: 'API' })
        setSessionCookie(res, 'api@admin')
        return res
      }
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 })
    }

    // Email + password login for team members
    const user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }
    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }
    const res = NextResponse.json({ success: true, name: user.name })
    setSessionCookie(res, user.email)
    return res
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
