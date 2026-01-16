'use client'
import { createFileRoute } from '@tanstack/react-router'
import { useTina } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import type { BlogQuery } from '../../../../tina/__generated__/types'
import client from '../../../../tina/__generated__/client'

// Loader to fetch blog post data from TinaCMS
export const Route = createFileRoute('/$year/$month/$slug')({
  loader: async ({ params }) => {
    const { year, month, slug } = params

    // Find the matching blog post by iterating through all posts
    // TinaCMS stores files as: YYYY-MM-DD-slug/index.mdx
    const postsResponse = await client.queries.blogConnection()
    const posts = postsResponse.data?.blogConnection?.edges || []

    // Find post matching the URL pattern
    const matchingPost = posts.find((edge) => {
      if (!edge?.node?._sys?.relativePath) return false
      const relativePath = edge.node._sys.relativePath
      // Extract date from directory name: YYYY-MM-DD-slug/index.mdx
      const dirName = relativePath.replace('/index.mdx', '').replace('/index', '')
      const match = dirName.match(/^(\d{4})-(\d{2})-\d{2}-(.+)$/)
      if (!match) return false
      const [, postYear, postMonth, postSlug] = match
      return postYear === year && postMonth === month && postSlug === slug
    })

    if (!matchingPost?.node?._sys?.relativePath) {
      throw new Error('Post not found')
    }

    // Fetch full post data with query for useTina
    const postResponse = await client.queries.blog({
      relativePath: matchingPost.node._sys.relativePath,
    })

    return {
      query: postResponse.query,
      variables: postResponse.variables,
      data: postResponse.data,
    }
  },
  component: BlogPost,
})

function BlogPost() {
  const { query, variables, data: initialData } = Route.useLoaderData()

  // useTina enables real-time editing in the TinaCMS sidebar
  const { data } = useTina<BlogQuery>({
    query,
    variables,
    data: initialData,
  })

  const post = data?.blog

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">Post not found</h1>
      </div>
    )
  }

  const formattedDate = new Date(post.pubDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {post.heroImage && (
        <img
          src={post.heroImage}
          alt={post.title}
          className="w-full h-64 object-cover rounded-lg mb-8"
        />
      )}

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          {post.title}
        </h1>
        <p className="text-gray-400">{formattedDate}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-800 rounded-full text-sm text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="prose prose-invert prose-lg max-w-none">
        <TinaMarkdown content={post.body} />
      </div>
    </article>
  )
}
