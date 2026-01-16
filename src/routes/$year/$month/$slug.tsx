'use client'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useTina, tinaField } from 'tinacms/dist/react'
import type { BlogQuery } from '../../../../tina/__generated__/types'
import client from '../../../../tina/__generated__/client'
import { BlockRenderer } from '../../../components/blocks'
import { Navigation } from '../../../components/Navigation'
import { Share } from '../../../components/Share'

// Helper to extract URL parts from relativePath
function getUrlParts(relativePath: string) {
  const dirName = relativePath.replace('/index.mdx', '').replace('/index', '')
  const match = dirName.match(/^(\d{4})-(\d{2})-\d{2}-(.+)$/)
  if (!match) return null
  const [, year, month, slug] = match
  return { year, month, slug }
}

// Loader to fetch blog post data from TinaCMS
export const Route = createFileRoute('/$year/$month/$slug')({
  loader: async ({ params }) => {
    const { year, month, slug } = params

    // Find the matching blog post by iterating through all posts
    // TinaCMS stores files as: YYYY-MM-DD-slug/index.mdx
    const postsResponse = await client.queries.blogConnection({
      sort: 'pubDate',
      last: 100,
    })
    const posts = postsResponse.data?.blogConnection?.edges || []

    // Find post matching the URL pattern
    let currentIndex = -1
    const matchingPost = posts.find((edge, index) => {
      if (!edge?.node?._sys?.relativePath) return false
      const urlParts = getUrlParts(edge.node._sys.relativePath)
      if (!urlParts) return false
      const isMatch = urlParts.year === year && urlParts.month === month && urlParts.slug === slug
      if (isMatch) currentIndex = index
      return isMatch
    })

    if (!matchingPost?.node?._sys?.relativePath) {
      throw new Error('Post not found')
    }

    // Sort posts by date (newest first) for navigation
    const sortedPosts = posts
      .filter((edge) => edge?.node && !edge.node.draft)
      .sort((a, b) => new Date(b!.node!.pubDate).getTime() - new Date(a!.node!.pubDate).getTime())

    // Find current post index in sorted array
    const sortedIndex = sortedPosts.findIndex(
      (edge) => edge?.node?._sys?.relativePath === matchingPost.node._sys.relativePath
    )

    // Get prev/next posts (older = prev, newer = next)
    const prevPostEdge = sortedIndex < sortedPosts.length - 1 ? sortedPosts[sortedIndex + 1] : null
    const nextPostEdge = sortedIndex > 0 ? sortedPosts[sortedIndex - 1] : null

    const prevPost = prevPostEdge?.node
      ? {
          title: prevPostEdge.node.title,
          ...getUrlParts(prevPostEdge.node._sys?.relativePath || ''),
        }
      : null

    const nextPost = nextPostEdge?.node
      ? {
          title: nextPostEdge.node.title,
          ...getUrlParts(nextPostEdge.node._sys?.relativePath || ''),
        }
      : null

    // Fetch full post data with query for useTina
    const postResponse = await client.queries.blog({
      relativePath: matchingPost.node._sys.relativePath,
    })

    // Calculate reading time
    const bodyText = postResponse.data?.blog?.body?.children
      ?.map((child: any) => JSON.stringify(child))
      .join(' ') || ''
    const wordCount = bodyText.split(/\s+/).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    return {
      query: postResponse.query,
      variables: postResponse.variables,
      data: postResponse.data,
      prevPost,
      nextPost,
      readingTime,
    }
  },
  component: BlogPost,
})

function BlogPost() {
  const { query, variables, data: initialData, prevPost, nextPost, readingTime } = Route.useLoaderData()

  // useTina enables real-time editing in the TinaCMS sidebar
  const { data } = useTina<BlogQuery>({
    query,
    variables,
    data: initialData,
  })

  const post = data?.blog

  if (!post) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-primary text-white">Post not found</h1>
          <Link to="/" className="text-[#FF5682] hover:underline mt-4 inline-block font-accent">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(post.pubDate))

  // All posts now use blocks

  // Get canonical URL for sharing - use URL params to build on server
  const { year, month, slug } = Route.useParams()
  const canonicalUrl = `https://hashir.blog/${year}/${month}/${slug}`

  return (
    <main className="container py-12">
      <article className="max-w-3xl mx-auto">
        {/* Post Header */}
        <header className="mb-12">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link
              to="/"
              className="text-[#a0a0a0] hover:text-[#FF5682] transition-colors duration-200 font-accent text-sm"
            >
              ← Back to Blog
            </Link>
          </nav>

          {/* Date and reading time */}
          <div className="text-[#a0a0a0] text-sm mb-6 font-text">
            <span data-tina-field={tinaField(post, 'pubDate')}>{formattedDate}</span>
            <span> • {readingTime} min read</span>
          </div>

          {/* Title - click to edit */}
          <h1
            className="text-3xl md:text-5xl font-primary text-white mb-8 leading-tight"
            data-tina-field={tinaField(post, 'title')}
          >
            {post.title}
          </h1>

          {/* Hero Image (commented out in main, but keeping for visual editing) */}
          {/* {post.heroImage && (
            <div className="mb-12 rounded-lg overflow-hidden">
              <img
                src={post.heroImage}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover"
                data-tina-field={tinaField(post, 'heroImage')}
              />
            </div>
          )} */}
        </header>

        {/* Post Content - Block-based */}
        <div className="prose-minimal" data-tina-field={tinaField(post, 'blocks')}>
          <BlockRenderer blocks={post.blocks} />
        </div>

        {/* Share Component */}
        <Share
          title={post.title}
          url={canonicalUrl}
          description={post.description}
        />

        {/* Navigation Component */}
        <Navigation
          prevPost={prevPost as { slug: string; title: string; year: string; month: string } | undefined}
          nextPost={nextPost as { slug: string; title: string; year: string; month: string } | undefined}
        />
      </article>
    </main>
  )
}
