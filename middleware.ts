import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME, validateSessionToken } from '@/lib/auth'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin'

  if (isAdminRoute && !isLoginPage) {
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token || !validateSessionToken(token)) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
