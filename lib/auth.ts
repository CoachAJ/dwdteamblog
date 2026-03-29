import crypto from 'crypto'
import { cookies } from 'next/headers'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme'
const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-in-production'
const COOKIE_NAME = 'blog_admin_session'

export function generateSessionToken(): string {
  return crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(ADMIN_PASSWORD)
    .digest('hex')
}

export function validatePassword(input: string): boolean {
  return input === ADMIN_PASSWORD
}

export function validateSessionToken(token: string): boolean {
  const expected = generateSessionToken()
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected))
}

export function isAdminAuthenticated(): boolean {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return false
    return validateSessionToken(token)
  } catch {
    return false
  }
}

export { COOKIE_NAME }
