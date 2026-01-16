import { Link } from '@tanstack/react-router'

interface PostInfo {
  slug: string
  title: string
  year: string
  month: string
}

interface NavigationProps {
  prevPost?: PostInfo
  nextPost?: PostInfo
}

export function Navigation({ prevPost, nextPost }: NavigationProps) {
  if (!prevPost && !nextPost) return null

  return (
    <nav className="border-t border-gray-800 pt-8 mt-12">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {prevPost && (
          <div className="flex-1">
            <Link
              to="/$year/$month/$slug"
              params={{ year: prevPost.year, month: prevPost.month, slug: prevPost.slug }}
              className="group flex items-start gap-4 p-6 bg-[#2a2a2a] rounded-lg border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#FF5682] to-[#ff8fa3] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-[#a0a0a0] mb-1 font-accent">Previous Post</div>
                <h3 className="text-white font-primary leading-tight group-hover:text-[#FF5682] transition-colors duration-200">
                  {prevPost.title}
                </h3>
              </div>
            </Link>
          </div>
        )}

        {nextPost && (
          <div className="flex-1">
            <Link
              to="/$year/$month/$slug"
              params={{ year: nextPost.year, month: nextPost.month, slug: nextPost.slug }}
              className="group flex items-start gap-4 p-6 bg-[#2a2a2a] rounded-lg border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg text-right"
            >
              <div className="flex-1 min-w-0 order-2">
                <div className="text-sm text-[#a0a0a0] mb-1 font-accent">Next Post</div>
                <h3 className="text-white font-primary leading-tight group-hover:text-[#FF5682] transition-colors duration-200">
                  {nextPost.title}
                </h3>
              </div>
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-[#FF5682] to-[#ff8fa3] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-200 order-1">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
