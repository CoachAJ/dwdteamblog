import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'blog_admin_session'

async function validateTokenEdge(token: string): Promise<boolean> {
  try {
    const secret = process.env.AUTH_SECRET || 'dev-secret-change-in-production'
    const [encodedEmail, sig] = token.split(':')
    if (!encodedEmail || !sig) return false
    const email = atob(encodedEmail.replace(/-/g, '+').replace(/_/g, '/'))
    const enc = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
    )
    const mac = await crypto.subtle.sign('HMAC', key, enc.encode(email))
    const expectedSig = Array.from(new Uint8Array(mac))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
    return sig === expectedSig
  } catch {
    return false
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin'

  if (isAdminRoute && !isLoginPage) {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token || !(await validateTokenEdge(token))) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
