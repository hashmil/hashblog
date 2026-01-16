'use client'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useTina, tinaField } from 'tinacms/dist/react'
import { TinaMarkdown, type Components } from 'tinacms/dist/rich-text'
import type { BlogQuery } from '../../../../tina/__generated__/types'
import client from '../../../../tina/__generated__/client'
import { BlockRenderer } from '../../../components/blocks'
import { Navigation } from '../../../components/Navigation'
import { Share } from '../../../components/Share'

// Custom TinaMarkdown components for rich content rendering
const markdownComponents: Components<Record<string, never>> = {
  // Handle raw HTML content (video, etc.)
  html: (props: any) => {
    // TinaMarkdown passes the html node - extract the value
    const html = props?.value || ''
    if (!html) {
      console.log('HTML component received:', props)
      return null
    }
    return <div dangerouslySetInnerHTML={{ __html: html }} className="my-6" />
  },
  // Handle HTML inline content
  html_inline: (props: any) => {
    const html = props.value || props.text || ''
    return <span dangerouslySetInnerHTML={{ __html: html }} />
  },
  // Handle raw content (another format for HTML)
  raw: (props: any) => {
    const html = props.value || props.text || ''
    return <div dangerouslySetInnerHTML={{ __html: html }} className="my-6" />
  },
  // Handle MDX component (inline JSX/HTML in MDX)
  mdxJsxFlowElement: (props: any) => {
    // Handle video elements
    if (props.name === 'video') {
      const attrs: Record<string, any> = {}
      props.attributes?.forEach((attr: any) => {
        if (attr.value === null) {
          attrs[attr.name] = true // Boolean attributes like controls, loop, etc.
        } else {
          attrs[attr.name] = attr.value
        }
      })

      // Find source element in children
      let src = ''
      props.children?.forEach((child: any) => {
        if (child.name === 'source') {
          child.attributes?.forEach((attr: any) => {
            if (attr.name === 'src') src = attr.value
          })
        }
      })

      return (
        <figure className="my-8">
          <video
            src={src}
            controls={attrs.controls}
            loop={attrs.loop}
            autoPlay={attrs.autoplay}
            muted={attrs.muted}
            playsInline={attrs.playsinline}
            className="w-full rounded-lg"
          />
        </figure>
      )
    }

    // Fallback for other MDX elements
    console.log('Unknown MDX element:', props.name, props)
    return null
  },
  // Images with proper styling
  img: (props) => (
    <figure className="my-8">
      <img
        src={props.url}
        alt={props.alt || ''}
        className="w-full rounded-lg shadow-lg"
      />
      {props.caption && (
        <figcaption className="text-center text-[#a0a0a0] text-sm mt-3 italic">
          {props.caption}
        </figcaption>
      )}
    </figure>
  ),
  // Code blocks with styling
  code_block: (props) => (
    <pre className="bg-[#2a2a2a] border border-gray-700 rounded-lg p-4 overflow-x-auto my-6">
      <code className={`text-[#d1d5db] text-sm font-mono ${props.lang ? `language-${props.lang}` : ''}`}>
        {props.value}
      </code>
    </pre>
  ),
  // Blockquotes with styling
  blockquote: (props) => (
    <blockquote className="border-l-4 border-[#FF5682] bg-[#2a2a2a] p-6 rounded-r-lg my-6 italic">
      {props.children}
    </blockquote>
  ),
  // Links with styling - auto-detect YouTube/Vimeo URLs and convert to embeds
  a: (props) => {
    const url = props.url || ''

    // Check if link URL is a YouTube video
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    if (youtubeMatch) {
      return (
        <figure className="my-8">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeMatch[1]}`}
            title="YouTube video"
            className="w-full aspect-video rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </figure>
      )
    }

    // Check if link URL is a Vimeo video
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return (
        <figure className="my-8">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoMatch[1]}`}
            title="Vimeo video"
            className="w-full aspect-video rounded-lg"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </figure>
      )
    }

    // Regular link
    return (
      <a
        href={url}
        target={url.startsWith('http') ? '_blank' : undefined}
        rel={url.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="text-white hover:text-[#FF5682] transition-colors duration-200"
        style={{ borderBottom: 'dotted 1px #FF5682' }}
      >
        {props.children}
      </a>
    )
  },
  // YouTube embeds (if detected in body templates)
  YouTube: (props: { url?: string }) => {
    const videoId = props.url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)?.[1]
    if (!videoId) return <p className="text-red-500">Invalid YouTube URL</p>
    return (
      <figure className="my-8">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video"
          className="w-full aspect-video rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </figure>
    )
  },
  // Vimeo embeds
  Vimeo: (props: { url?: string }) => {
    const videoId = props.url?.match(/vimeo\.com\/(\d+)/)?.[1]
    if (!videoId) return <p className="text-red-500">Invalid Vimeo URL</p>
    return (
      <figure className="my-8">
        <iframe
          src={`https://player.vimeo.com/video/${videoId}`}
          title="Vimeo video"
          className="w-full aspect-video rounded-lg"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      </figure>
    )
  },
}

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

  // Check if post uses blocks or legacy body content
  const hasBlocks = post.blocks && post.blocks.length > 0

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

        {/* Post Content */}
        <div className="prose-minimal">
          {hasBlocks ? (
            // New block-based content
            <BlockRenderer blocks={post.blocks} />
          ) : (
            // Legacy body content (for backward compatibility)
            <div data-tina-field={tinaField(post, 'body')}>
              <TinaMarkdown content={post.body} components={markdownComponents} />
            </div>
          )}
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
