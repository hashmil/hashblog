import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { getSearchPosts, type SearchPost } from '../lib/search'

type Post = SearchPost

interface MenuProps {
  isOpen: boolean
  onClose: () => void
}

export function Menu({ isOpen, onClose }: MenuProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Post[]>([])
  const [allPosts, setAllPosts] = useState<Post[]>([])
  const navigate = useNavigate()

  // Load posts for search
  useEffect(() => {
    if (isOpen && allPosts.length === 0) {
      getSearchPosts()
        .then((posts) => {
          setAllPosts(posts)
        })
        .catch(console.error)
    }
  }, [isOpen, allPosts.length])

  // Handle menu open animation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setTimeout(() => setIsVisible(true), 50)
    } else {
      setIsVisible(false)
      document.body.style.overflow = ''
      setSearchQuery('')
      setSearchResults([])
    }
  }, [isOpen])

  // Handle escape key
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [isOpen, onClose])

  // Search functionality
  const performSearch = useCallback(
    (query: string) => {
      if (!query.trim()) {
        setSearchResults([])
        return
      }

      const q = query.toLowerCase()
      const filtered = allPosts.filter((post) => {
        const title = post.title?.toLowerCase() || ''
        const description = post.description?.toLowerCase() || ''
        const tags = post.tags

        return (
          title.includes(q) ||
          description.includes(q) ||
          tags.some((tag) => tag.toLowerCase().includes(q))
        )
      })

      setSearchResults(filtered.slice(0, 10))
    },
    [allPosts]
  )

  useEffect(() => {
    performSearch(searchQuery)
  }, [searchQuery, performSearch])

  // Format date helper
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(dateStr))
  }

  // Generate post URL
  const getPostUrl = (slug: string, pubDate: string) => {
    const date = new Date(pubDate)
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    return `/${year}/${month}/${slug}`
  }

  const handleLinkClick = () => {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#121212]/95 backdrop-blur-menu transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Menu Content */}
      <div className="flex flex-col h-full" onClick={(e) => e.stopPropagation()}>
        {/* Header with Close Button */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800 animate-slide-down">
          <div className="flex items-center space-x-2">
            <img
              src="/images/logo.png"
              alt="Notes by Hash Milhan"
              className="h-8 object-contain"
            />
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-white hover:text-[#FF5682] transition-colors duration-200"
            aria-label="Close menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu Content Area */}
        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Navigation Links */}
          <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16">
            <nav className="text-center space-y-8">
              <Link
                to="/"
                onClick={handleLinkClick}
                className="block text-4xl lg:text-6xl font-primary text-white hover:text-[#FF5682] transition-all duration-300 animate-slide-up-1 hover:-translate-y-0.5"
              >
                Blog Home
              </Link>

              <a
                href="/about"
                onClick={handleLinkClick}
                className="block text-4xl lg:text-6xl font-primary text-white hover:text-[#FF5682] transition-all duration-300 animate-slide-up-2 hover:-translate-y-0.5"
              >
                About Hash
              </a>

              <a
                href="https://hashir.net"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className="text-4xl lg:text-6xl font-primary text-white hover:text-[#FF5682] transition-all duration-300 flex items-center justify-center gap-4 animate-slide-up-3 hover:-translate-y-0.5"
              >
                Portfolio
                <svg
                  className="w-8 h-8 lg:w-12 lg:h-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </nav>
          </div>

          {/* Search Section */}
          <div className="lg:w-96 p-8 lg:p-16 border-t lg:border-t-0 lg:border-l border-gray-800 animate-slide-left flex flex-col">
            <div className="space-y-6 flex flex-col flex-1">
              <div className="relative flex-shrink-0">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#2a2a2a] border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-[#a0a0a0] focus:outline-none focus:border-[#FF5682] transition-colors duration-200 font-text"
                />
                <svg
                  className="absolute right-3 top-3 w-5 h-5 text-[#a0a0a0]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Search Results */}
              {searchQuery && searchResults.length > 0 && (
                <div
                  className="space-y-4 flex-1 overflow-y-auto rounded-lg bg-[#2a2a2a] p-4"
                  style={{ maxHeight: 'calc(100vh - 300px)' }}
                >
                  <h3 className="text-lg font-semibold text-white">Search Results</h3>
                  <div className="space-y-3">
                    {searchResults.map((result, index) => (
                      <Link
                        key={result.slug}
                        to={getPostUrl(result.slug, result.pubDate)}
                        onClick={handleLinkClick}
                        className="block p-4 bg-[#121212] rounded-lg hover:bg-gray-800 transition-all duration-200 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <h4 className="font-medium text-white mb-1">{result.title}</h4>
                        <p className="text-sm text-[#a0a0a0] line-clamp-2">{result.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-[#a0a0a0]">
                            {formatDate(result.pubDate)}
                          </span>
                          <div className="flex gap-1">
                            {result.tags.slice(0, 2).map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-0.5 bg-[#121212] text-xs rounded text-[#a0a0a0]"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {searchQuery && searchResults.length === 0 && (
                <div className="text-[#a0a0a0] text-center py-8 flex-shrink-0">
                  No posts found matching "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
