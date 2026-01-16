'use client'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useTina, tinaField } from 'tinacms/dist/react'
import { TinaMarkdown } from 'tinacms/dist/rich-text'
import type { BlogQuery } from '../../../../tina/__generated__/types'
import client from '../../../../tina/__generated__/client'
import { BlockRenderer } from '../../../components/blocks'

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
        <Link to="/" className="text-pink-500 hover:underline mt-4 inline-block">
          ← Back to home
        </Link>
      </div>
    )
  }

  const formattedDate = new Date(post.pubDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Check if post uses blocks or legacy body content
  const hasBlocks = post.blocks && post.blocks.length > 0

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Image - click to edit */}
      {post.heroImage && (
        <img
          src={post.heroImage}
          alt={post.title}
          className="w-full h-64 md:h-80 object-cover rounded-lg mb-8 shadow-lg"
          data-tina-field={tinaField(post, 'heroImage')}
        />
      )}

      {/* Post Header - click to edit title */}
      <header className="mb-8">
        <h1
          className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
          style={{ fontFamily: 'Work Sans, sans-serif' }}
          data-tina-field={tinaField(post, 'title')}
        >
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-400">
          <time
            dateTime={post.pubDate}
            data-tina-field={tinaField(post, 'pubDate')}
          >
            {formattedDate}
          </time>
          {post.updatedDate && (
            <span className="text-sm">
              (Updated: {new Date(post.updatedDate).toLocaleDateString()})
            </span>
          )}
        </div>

        {/* Description - click to edit */}
        <p
          className="text-gray-400 mt-4 text-lg"
          style={{ fontFamily: 'Libre Baskerville, serif' }}
          data-tina-field={tinaField(post, 'description')}
        >
          {post.description}
        </p>

        {/* Tags - click to edit */}
        {post.tags && post.tags.length > 0 && (
          <div
            className="flex flex-wrap gap-2 mt-4"
            data-tina-field={tinaField(post, 'tags')}
          >
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-sm text-gray-300 transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content - either blocks or legacy body */}
      <div className="prose-minimal">
        {hasBlocks ? (
          // New block-based content
          <BlockRenderer blocks={post.blocks} />
        ) : (
          // Legacy body content (for backward compatibility)
          <div
            className="prose prose-invert prose-lg max-w-none"
            data-tina-field={tinaField(post, 'body')}
          >
            <TinaMarkdown content={post.body} />
          </div>
        )}
      </div>

      {/* Back to home link */}
      <footer className="mt-16 pt-8 border-t border-gray-800">
        <Link
          to="/"
          className="text-pink-500 hover:text-pink-400 transition-colors inline-flex items-center gap-2"
        >
          <span>←</span>
          <span>Back to all posts</span>
        </Link>
      </footer>
    </article>
  )
}
