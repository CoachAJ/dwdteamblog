import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, isAdminAuthenticated } from '@/lib/auth'

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const users = await prisma.adminUser.findMany({
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { email, password, name } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }
    const existing = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (existing) {
      return NextResponse.json({ error: 'A user with that email already exists.' }, { status: 409 })
    }
    const passwordHash = await hashPassword(password)
    const user = await prisma.adminUser.create({
      data: { email: email.toLowerCase().trim(), passwordHash, name: name || 'Admin' },
      select: { id: true, email: true, name: true, createdAt: true },
    })
    return NextResponse.json(user, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create user.' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id } = await req.json()
    const count = await prisma.adminUser.count()
    if (count <= 1) {
      return NextResponse.json({ error: 'Cannot delete the last admin user.' }, { status: 400 })
    }
    await prisma.adminUser.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 })
  }
}
