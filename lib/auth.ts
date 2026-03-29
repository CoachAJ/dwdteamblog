import crypto from 'crypto'
import { cookies } from 'next/headers'

const AUTH_SECRET = process.env.AUTH_SECRET || 'dev-secret-change-in-production'
export const COOKIE_NAME = 'blog_admin_session'

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = await new Promise<string>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => {
      if (err) reject(err)
      else resolve(key.toString('hex'))
    })
  })
  return `${salt}:${hash}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, hash] = stored.split(':')
  const candidate = await new Promise<string>((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, key) => {
      if (err) reject(err)
      else resolve(key.toString('hex'))
    })
  })
  return crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(hash))
}

export function generateSessionToken(email: string): string {
  const sig = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(email)
    .digest('hex')
  return `${Buffer.from(email).toString('base64url')}:${sig}`
}

export function validateSessionToken(token: string): boolean {
  try {
    const [encodedEmail, sig] = token.split(':')
    if (!encodedEmail || !sig) return false
    const email = Buffer.from(encodedEmail, 'base64url').toString()
    const expectedSig = crypto
      .createHmac('sha256', AUTH_SECRET)
      .update(email)
      .digest('hex')
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))
  } catch {
    return false
  }
}

export function getSessionEmail(token: string): string | null {
  try {
    const [encodedEmail] = token.split(':')
    return Buffer.from(encodedEmail, 'base64url').toString()
  } catch {
    return null
  }
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

export { AUTH_SECRET }
