'use client'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useTina, tinaField } from 'tinacms/dist/react'
import type { PageQuery } from '../../tina/__generated__/types'
import client from '../../tina/__generated__/client'
import { BlockRenderer } from '../components/blocks'

// Loader to fetch about page data from TinaCMS
export const Route = createFileRoute('/about')({
  loader: async () => {
    const pageResponse = await client.queries.page({
      relativePath: 'about.mdx',
    })

    return {
      query: pageResponse.query,
      variables: pageResponse.variables,
      data: pageResponse.data,
    }
  },
  component: AboutPage,
})

function AboutPage() {
  const { query, variables, data: initialData } = Route.useLoaderData()

  // useTina enables real-time editing in the TinaCMS sidebar
  const { data } = useTina<PageQuery>({
    query,
    variables,
    data: initialData,
  })

  const page = data?.page

  if (!page) {
    return (
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-primary text-white">Page not found</h1>
          <Link to="/" className="text-[#FF5682] hover:underline mt-4 inline-block font-accent">
            ← Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="container py-12">
      <article className="max-w-3xl mx-auto">
        {/* Page Header */}
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

          {/* Title - click to edit */}
          <h1
            className="text-3xl md:text-5xl font-primary text-white mb-8 leading-tight"
            data-tina-field={tinaField(page, 'title')}
          >
            {page.title}
          </h1>
        </header>

        {/* Page Content - Block-based */}
        <div className="prose-minimal" data-tina-field={tinaField(page, 'blocks')}>
          <BlockRenderer blocks={page.blocks} />
        </div>
      </article>
    </main>
  )
}
