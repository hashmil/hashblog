import { createFileRoute, Link } from '@tanstack/react-router'
import client from '../../tina/__generated__/client'

export const Route = createFileRoute('/')(
  {
    loader: async () => {
      const postsResponse = await client.queries.blogConnection({
        sort: 'pubDate',
        last: 100,
      })
      return {
        posts: postsResponse.data?.blogConnection?.edges || [],
      }
    },
    component: Home,
  }
)

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

function getPostUrl(relativePath: string) {
  const dirName = relativePath.replace('/index.mdx', '').replace('/index', '')
  const match = dirName.match(/^(\d{4})-(\d{2})-\d{2}-(.+)$/)
  if (!match) return null
  const [, year, month, slug] = match
  return { year, month, slug }
}

function Home() {
  const { posts } = Route.useLoaderData()

  const sortedPosts = posts
    .filter((edge) => edge?.node && !edge.node.draft)
    .map((edge) => edge!.node!)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  const featuredPost = sortedPosts[0]
  const previousPosts = sortedPosts.slice(1)

  return (
    <main className="container py-12">
      <div className="max-w-3xl mx-auto">
        {/* Featured/Latest Post */}
        {featuredPost && (() => {
          const urlParts = getPostUrl(featuredPost._sys?.relativePath || '')
          if (!urlParts) return null

          return (
            <article className="mb-16">
              <div className="text-[#a0a0a0] text-sm mb-4 font-text">
                {formatDate(featuredPost.pubDate)}
              </div>

              <h1 className="text-3xl md:text-5xl font-primary text-white mb-6 leading-tight">
                <Link
                  to="/$year/$month/$slug"
                  params={urlParts}
                  className="hover:text-[#FF5682] transition-colors duration-200"
                >
                  {featuredPost.title}
                </Link>
              </h1>

              <p className="text-base font-text leading-relaxed mb-6 text-[#d1d5db]" style={{ lineHeight: 1.8 }}>
                {featuredPost.description}
              </p>

              <Link
                to="/$year/$month/$slug"
                params={urlParts}
                className="font-accent text-white hover:text-[#FF5682] transition-colors duration-200"
                style={{ borderBottom: 'dotted 1px #FF5682', textDecoration: 'none' }}
              >
                Read More →
              </Link>
            </article>
          )
        })()}

        {/* Previous Posts List */}
        {previousPosts.length > 0 && (
          <section>
            <h2 className="text-xl font-primary text-[#FF5682] mb-4">Previous Posts</h2>

            <div className="space-y-0">
              {previousPosts.map((post) => {
                const urlParts = getPostUrl(post._sys?.relativePath || '')
                if (!urlParts) return null

                return (
                  <article
                    key={post.id}
                    className="border-b border-gray-600 py-4 last:border-b-0"
                  >
                    <h3 className="text-xl md:text-2xl font-primary text-white hover:text-[#FF5682] transition-colors duration-200 leading-tight mb-2">
                      <Link to="/$year/$month/$slug" params={urlParts}>
                        {post.title}
                      </Link>
                    </h3>
                    <div className="font-text text-sm text-gray-500">
                      {formatDate(post.pubDate)}
                    </div>
                  </article>
                )
              })}
            </div>
          </section>
        )}

        {/* No posts message */}
        {sortedPosts.length === 0 && (
          <p className="text-[#a0a0a0]">No posts yet. Start TinaCMS to create your first post!</p>
        )}
      </div>
    </main>
  )
}
