import { prisma } from './db'
import { marked } from 'marked'
import slugify from 'slugify'

export type Post = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  author: string
  tags: string | null
  published: boolean
  createdAt: Date
  updatedAt: Date
}

export function generateSlug(title: string): string {
  return slugify(title, { lower: true, strict: true })
}

export function parseTags(tags: string | null): string[] {
  if (!tags) return []
  return tags.split(',').map((t) => t.trim()).filter(Boolean)
}

export async function renderMarkdown(content: string): Promise<string> {
  return await marked(content, { breaks: true })
}

export async function getAllPosts(publishedOnly = true): Promise<Post[]> {
  return prisma.post.findMany({
    where: publishedOnly ? { published: true } : undefined,
    orderBy: { createdAt: 'desc' },
  })
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return prisma.post.findUnique({ where: { slug } })
}

export async function getPostById(id: string): Promise<Post | null> {
  return prisma.post.findUnique({ where: { id } })
}

export async function createPost(data: {
  title: string
  content: string
  excerpt?: string
  coverImage?: string
  author?: string
  tags?: string
  published?: boolean
}): Promise<Post> {
  const slug = generateSlug(data.title)
  return prisma.post.create({
    data: {
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt || null,
      coverImage: data.coverImage || null,
      author: data.author || 'Doc Team',
      tags: data.tags || null,
      published: data.published ?? false,
    },
  })
}

export async function updatePost(
  id: string,
  data: Partial<{
    title: string
    content: string
    excerpt: string
    coverImage: string
    author: string
    tags: string
    published: boolean
  }>
): Promise<Post> {
  const updateData: Record<string, unknown> = { ...data }
  if (data.title) {
    updateData.slug = generateSlug(data.title)
  }
  return prisma.post.update({ where: { id }, data: updateData })
}

export async function deletePost(id: string): Promise<void> {
  await prisma.post.delete({ where: { id } })
}
