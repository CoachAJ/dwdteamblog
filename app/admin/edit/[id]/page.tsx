import { getPostById } from '@/lib/posts'
import PostEditor from '@/components/PostEditor'
import { notFound } from 'next/navigation'

type Props = { params: { id: string } }

export default async function EditPostPage({ params }: Props) {
  const post = await getPostById(params.id)
  if (!post) notFound()

  return (
    <PostEditor
      postId={post.id}
      initialData={{
        title: post.title,
        excerpt: post.excerpt ?? '',
        content: post.content,
        coverImage: post.coverImage ?? '',
        author: post.author,
        tags: post.tags ?? '',
        published: post.published,
      }}
    />
  )
}
