import { createServerFn } from '@tanstack/react-start'
import client from '../../tina/__generated__/client'

export interface SearchPost {
  title: string
  description: string
  pubDate: string
  slug: string
  tags: string[]
}

export const getSearchPosts = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const postsResponse = await client.queries.blogConnection({
      sort: 'pubDate',
      last: 100,
    })

    const posts: SearchPost[] = (postsResponse.data?.blogConnection?.edges || [])
      .filter((edge) => edge?.node && !edge.node.draft)
      .map((edge) => {
        const post = edge!.node!
        const relativePath = post._sys?.relativePath || ''
        const dirName = relativePath.replace('/index.mdx', '').replace('/index', '')
        const match = dirName.match(/^(\d{4})-(\d{2})-\d{2}-(.+)$/)

        return {
          title: post.title,
          description: post.description,
          pubDate: post.pubDate,
          slug: match ? match[3] : dirName,
          tags: (post.tags || []) as string[],
        }
      })
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

    return posts
  } catch (error) {
    console.error('Search error:', error)
    return []
  }
})
