import { createFileRoute, Link } from '@tanstack/react-router'
import client from '../../tina/__generated__/client'

export const Route = createFileRoute('/')(
  {
    loader: async () => {
      const postsResponse = await client.queries.blogConnection({
        sort: 'pubDate',
        last: 100, // Get recent posts
      })
      return {
        posts: postsResponse.data?.blogConnection?.edges || [],
      }
    },
    component: Home,
  }
)

function Home() {
  const { posts } = Route.useLoaderData()

  return (
    <div className="min-h-screen">
      <header className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold" style={{ fontFamily: 'Work Sans, sans-serif' }}>
          HashBlog
        </h1>
        <p className="text-gray-400 mt-2" style={{ fontFamily: 'Libre Baskerville, serif' }}>
          Personal blog by Hash Milhan
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {posts.length === 0 ? (
            <p className="text-gray-400">No posts yet. Start TinaCMS to create your first post!</p>
          ) : (
            posts
              .filter((edge) => edge?.node && !edge.node.draft)
              .reverse() // Show newest first
              .map((edge) => {
                const post = edge?.node
                if (!post) return null

                // Extract URL parts from relativePath
                const relativePath = post._sys?.relativePath || ''
                const dirName = relativePath.replace('/index.mdx', '').replace('/index', '')
                const match = dirName.match(/^(\d{4})-(\d{2})-\d{2}-(.+)$/)
                if (!match) return null
                const [, year, month, slug] = match

                const formattedDate = new Date(post.pubDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })

                return (
                  <article key={post.id} className="border-b border-gray-800 pb-8">
                    <Link
                      to="/$year/$month/$slug"
                      params={{ year, month, slug }}
                      className="group block"
                    >
                      {post.heroImage && (
                        <img
                          src={post.heroImage}
                          alt={post.title}
                          className="w-full h-48 object-cover rounded-lg mb-4 group-hover:opacity-80 transition-opacity"
                        />
                      )}
                      <h2
                        className="text-2xl font-bold mb-2 group-hover:text-pink-500 transition-colors"
                        style={{ fontFamily: 'Work Sans, sans-serif' }}
                      >
                        {post.title}
                      </h2>
                      <p className="text-gray-400 text-sm mb-3">{formattedDate}</p>
                      <p className="text-gray-300">{post.description}</p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-2 mt-4">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </Link>
                  </article>
                )
              })
          )}
        </div>
      </main>
    </div>
  )
}
