import { Link } from '@tanstack/react-router'

interface BlogCardProps {
  slug: string
  title: string
  description: string
  pubDate: string
  heroImage?: string
  tags?: string[]
  featured?: boolean
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

function getPostUrl(slug: string, pubDate: string) {
  const date = new Date(pubDate)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  return { to: '/$year/$month/$slug' as const, params: { year: String(year), month, slug } }
}

export function BlogCard({
  slug,
  title,
  description,
  pubDate,
  heroImage,
  tags = [],
  featured = false,
}: BlogCardProps) {
  const linkProps = getPostUrl(slug, pubDate)

  return (
    <article className={`group ${featured ? 'featured-card' : 'blog-card'}`}>
      <Link {...linkProps} className="block">
        {heroImage && (
          <div className="relative overflow-hidden rounded-lg mb-4">
            <img
              src={heroImage}
              alt={title}
              className={`w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                featured ? 'h-64 md:h-80' : 'h-48'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-[#a0a0a0]">
            <time>{formatDate(pubDate)}</time>
            {tags.length > 0 && (
              <div className="flex gap-2">
                {tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-[#2a2a2a] text-xs rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <h3
            className={`font-bold text-white group-hover:text-[#FF5682] transition-colors duration-200 leading-tight ${
              featured ? 'text-2xl md:text-3xl' : 'text-xl'
            }`}
          >
            {title}
          </h3>

          <p className={`text-[#d1d5db] leading-relaxed ${featured ? 'text-lg' : 'text-base'}`}>
            {description}
          </p>

          <div className="flex items-center text-[#FF5682] group-hover:text-white transition-colors duration-200 font-medium">
            Read More
            <svg
              className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  )
}
