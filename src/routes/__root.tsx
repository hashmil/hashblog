/// <reference types="vite/client" />
import { useState, type ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'
import '../app.css'
import { Header } from '../components/Header'
import { Menu } from '../components/Menu'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Notes by Hash Milhan' },
      { name: 'description', content: 'Creative Technology Director sharing insights on AI, web development, and creative projects.' },
      { name: 'theme-color', content: '#FF5682' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Notes by Hash Milhan' },
      { property: 'twitter:site', content: '@hashir' },
      { property: 'twitter:creator', content: '@hashir' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'manifest', href: '/site.webmanifest' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' as const },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;800&display=swap' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <RootDocument>
      <Header onMenuToggle={() => setIsMenuOpen(true)} />
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <Outlet />
      <Footer />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="bg-[#121212] text-white min-h-screen">
        {children}
        <Scripts />
      </body>
    </html>
  )
}

function Footer() {
  // Using 2026 as static year to avoid hydration mismatch
  const currentYear = 2026

  return (
    <footer className="border-t border-gray-800 mt-16">
      <div className="container py-8">
        <div className="max-w-3xl mx-auto text-center text-[#a0a0a0] text-sm">
          <p className="mb-2">
            &copy; {currentYear} Hash Milhan. All rights reserved.
          </p>
          <p>
            Built with{' '}
            <a
              href="https://tanstack.com/start"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF5682] hover:underline"
            >
              TanStack Start
            </a>{' '}
            &{' '}
            <a
              href="https://tina.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF5682] hover:underline"
            >
              TinaCMS
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
