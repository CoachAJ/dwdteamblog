import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, generateSessionToken, COOKIE_NAME } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
    }

    const token = generateSessionToken(user.email)
    const res = NextResponse.json({ success: true, name: user.name })
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
}
