# HashBlog - Personal Blog by Hash Milhan

## Project Overview

A modern, fast-loading blog website showcasing insights on AI, web development, creative coding, and innovative design. Built with Astro and Vue components, featuring a dark theme, full-screen navigation menu with integrated search, and responsive design optimized for performance.

**Live Site**: [hashblog.pages.dev](https://hashblog.pages.dev)

## Tech Stack

- **Framework**: [Astro](https://astro.build) - Static site generator with component islands
- **UI Components**: [Vue 3](https://vuejs.org) - Interactive components (menu, search)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- **TypeScript** - Type safety and better developer experience
- **Content**: Markdown/MDX with frontmatter for blog posts
- **Embeds**: `@astro-community/astro-embed` - YouTube, Vimeo, TikTok video embeds
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com) - Edge deployment with global CDN
- **CI/CD**: GitHub Actions - Automated deployment pipeline

## Site Architecture

### Current Project Structure

```
/
├── public/                 # Static assets (images, fonts, etc.)
│   └── videos/            # Local videos organized by post
│       └── YYYY-MM-DD-post-slug/
│           └── video.mp4
├── src/
│   ├── components/        # Vue and Astro components
│   │   ├── Layout.astro   # Base layout with header/footer
│   │   ├── Menu.vue       # Full-screen navigation with integrated search
│   │   ├── Header.astro   # Site header with menu toggle
│   │   ├── Navigation.astro  # Post navigation (prev/next)
│   │   ├── BlogCard.astro    # Blog post card component
│   │   └── Share.astro       # Social sharing component
│   ├── content/
│   │   ├── blog/         # Blog posts (organized by date)
│   │   │   ├── YYYY-MM-DD-post-title/
│   │   │   │   ├── index.mdx      # Post content (MDX for embeds)
│   │   │   │   └── images/        # Post-specific images
│   │   │   └── ...
│   │   └── config.ts     # Content collection configuration
│   ├── pages/            # Route pages
│   │   ├── index.astro   # Homepage with latest + previous posts
│   │   ├── about.astro   # About page
│   │   ├── [year]/       # Year-based routing
│   │   │   └── [month]/  # Month-based routing
│   │   │       └── [slug].astro  # Dynamic blog post pages (/YYYY/MM/slug)
│   │   ├── api/
│   │   │   └── search.json.ts  # Search API endpoint
│   │   ├── rss.xml.ts    # RSS feed generation
│   │   └── sitemap.xml.ts  # Sitemap generation
│   ├── utils/            # Utility functions
│   │   └── url.ts        # URL generation helpers
│   ├── styles/           # Global styles
│   │   └── global.css    # Tailwind imports and custom styles
│   └── images/           # Site-wide images
├── .github/workflows/    # GitHub Actions for deployment
├── docs/                 # Documentation
│   ├── plan.md          # This file - project planning
│   └── creating-new-blog-posts.md  # Content creation guide
└── astro.config.mjs     # Astro configuration
```

## Implemented Features

### ✅ 1. Home Page

- **Hero Section**: Latest blog post with full content preview
- **Blog List**: Previous posts showing title, date, and excerpt
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Clean Typography**: Custom font stack with Work Sans and Libre Baskerville

### ✅ 2. Full-Screen Navigation Menu

- **Vue Component**: Interactive menu with smooth slide animations
- **Background Blur**: CSS backdrop-filter for elegant overlay effect
- **Navigation Links**: Blog Home, About Hash, Portfolio (external link with icon)
- **Integrated Search**: Built-in search functionality within the menu
- **Mobile Responsive**: Touch-friendly navigation with proper spacing
- **Keyboard Support**: ESC key to close menu

### ✅ 3. Search Functionality

- **Built-in Search**: Custom search implementation without external dependencies
- **Real-time Results**: Search as you type with instant filtering
- **Content Indexing**: Searches across title, description, tags, and full content
- **Responsive Results**: Scrollable results area with rounded corners and custom scrollbar
- **Visual Polish**: Proper contrast with lighter container and darker result items

### ✅ 4. Blog Post Pages

- **Dynamic Routing**: `/[year]/[month]/[slug].astro` for SEO-friendly date-based URLs
- **URL Structure**: Clean URLs in format `/YYYY/MM/post-slug` (e.g., `/2024/05/what-lies-under-ai-short-film`)
- **Rich Content**: MDX support for embedding YouTube, Vimeo, TikTok videos
- **Typography**: Beautiful reading experience with custom prose styling
- **Metadata**: Date, tags, descriptions with proper frontmatter
- **Hero Images**: Support for post-specific hero images
- **Responsive Images**: Optimized images with proper alt text
- **Post Navigation**: Previous/Next post links with proper URL generation

### ✅ 5. About Page

- **Personal Bio**: Professional background as Creative Technology Director
- **Contact Info**: Email and social media links
- **Responsive Design**: Mobile-friendly layout consistent with site theme

### ✅ 6. Content Management

- **MDX Files**: Easy content creation with component embedding support
- **Frontmatter**: Complete metadata (title, description, pubDate, tags, heroImage, slug, draft)
- **Organized Structure**: Date-prefixed folders with post-specific image and video directories
- **Content Collections**: Type-safe content with Astro's built-in system
- **Draft Support**: Hide posts from production with `draft: true`

### ✅ 7. Video Embedding

- **YouTube Integration**: Direct embedding with `@astro-community/astro-embed-youtube`
- **Vimeo Support**: Full Vimeo video embedding capabilities
- **TikTok Videos**: LinkPreview component for TikTok content
- **Local Video Support**: Import local videos as assets from post directories
- **Responsive Embeds**: All video embeds are mobile-responsive
- **Flexible Video Controls**: Custom attributes (autoplay, loop, muted, controls) for different use cases

### ✅ 8. Deployment & Performance

- **Cloudflare Pages**: Edge deployment with global CDN
- **GitHub Actions**: Automated CI/CD pipeline
- **Static Generation**: Fast loading with minimal JavaScript
- **Performance Optimized**: Lighthouse scores 90+ across all metrics
- **SEO-Friendly URLs**: Date-based URL structure for better organization and SEO

### ✅ 9. URL Structure & Navigation

- **Date-Based URLs**: Clean `/YYYY/MM/slug` format for all blog posts
- **URL Utility**: Centralized URL generation via `src/utils/url.ts`
- **Search Integration**: Menu search results use the new URL format
- **Sitemap & RSS**: Auto-generated with correct URL structure
- **Legacy Redirect**: Old `/blog/slug` format replaced with new structure

## Design System

### Color Palette

- **Background**: Dark theme (#1a1a1a, #2a2a2a)
- **Text**: Light colors (#ffffff, #e5e5e5)
- **Accent**: Pink/purple gradient (#ff6b9d, #c471ed)
- **Secondary**: Muted grays for dates and metadata

### Typography

- **Headings**: Bold, modern font (Inter or similar)
- **Body**: Readable font with good line height
- **Code**: Monospace font for code blocks
- **Responsive**: Fluid typography scaling

Some typography and colours from my older wordpress site that we can use

```
  --e-global-color-primary: #FFFFFF;
  --e-global-color-secondary: #FFFFFF;
  --e-global-color-text: #FFFFFF;
  --e-global-color-accent: #FF5682;
  --e-global-typography-primary-font-family: "Work Sans";
  --e-global-typography-primary-font-weight: 800;
  --e-global-typography-secondary-font-family: "Libre Baskerville";
  --e-global-typography-secondary-font-weight: 400;
  --e-global-typography-text-font-family: "Libre Baskerville";
  --e-global-typography-text-font-weight: 400;
  --e-global-typography-accent-font-family: "Work Sans";
  --e-global-typography-accent-font-weight: 500;
```

### Layout

- **Container**: Max-width with centered content
- **Grid**: CSS Grid for blog post layouts
- **Spacing**: Consistent spacing scale
- **Mobile-First**: Responsive breakpoints

## Development Status

### ✅ Completed Phases

**Phase 1: Project Setup & Basic Structure**

- ✅ Astro project initialized with TypeScript
- ✅ Tailwind CSS configured with custom design system
- ✅ Content collections set up for blog posts
- ✅ Basic layout and routing implemented
- ✅ Dark theme implemented with custom color palette

**Phase 2: Core Pages**

- ✅ Home page with latest post hero and previous posts list
- ✅ Individual blog post pages with MDX support
- ✅ About page with personal bio and contact info
- ✅ Header with menu toggle functionality

**Phase 3: Interactive Features**

- ✅ Full-screen navigation menu (Vue component)
- ✅ Integrated search functionality (custom implementation)
- ✅ Menu animations with backdrop blur effects
- ✅ Fully responsive design for all screen sizes

**Phase 4: Enhanced Features**

- ✅ Video embedding support (YouTube, Vimeo, TikTok)
- ✅ Image optimization and responsive images
- ✅ SEO optimization with proper meta tags
- ✅ Performance optimization (Lighthouse 90+)

**Phase 5: Content & Polish**

- ✅ Comprehensive blog post collection (27+ posts)
- ✅ About page content complete
- ✅ Fine-tuned styling and animations
- ✅ Cross-browser testing completed
- ✅ Performance audit completed

**Phase 6: URL Structure Optimization (December 2024)**

- ✅ Implemented date-based URL structure (`/YYYY/MM/slug`)
- ✅ Created centralized URL utility functions
- ✅ Updated all components to use new URL format
- ✅ Updated sitemap and RSS feed generation
- ✅ Implemented post navigation with correct URLs
- ✅ Updated search functionality for new URL structure

### 🚀 Future Enhancements

- **Social Sharing**: Twitter, Facebook, LinkedIn share buttons
- **Reading Time**: Estimated reading time calculation (partially implemented)
- **Categories/Tags**: Enhanced taxonomy system
- **Comments**: Potential integration with comment system
- **Custom 404 Page**: Better error handling for missing posts

## Technical Considerations

### SEO & Performance

- **Static Generation**: Fast loading with Astro's static output
- **Meta Tags**: Dynamic SEO metadata for each page
- **Sitemap**: Auto-generated sitemap with date-based URLs
- **RSS Feed**: Auto-generated RSS feed with proper URL structure
- **URL Structure**: SEO-friendly date-based URLs (`/YYYY/MM/slug`)
- **Image Optimization**: Responsive images with proper formats
- **Lighthouse Score**: Target 90+ on all metrics

### Accessibility

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliance
- **Focus Management**: Visible focus indicators

### Content Strategy

- **Blog Posts**: Technical articles, tutorials, personal projects
- **URL Structure**: Date-based organization for better content discovery
- **Categories/Tags**: Optional taxonomy system
- **RSS Feed**: Auto-generated RSS for subscribers
- **Reading Time**: Estimated reading time calculation

## Current Deployment

- **Platform**: Cloudflare Pages for edge deployment
- **Domain**: hashblog.pages.dev (with potential for custom domain)
- **CDN**: Global content delivery via Cloudflare's network
- **Build Process**: Automated deployments via GitHub Actions
- **Environment**: Node.js 18+ with npm package management

## Content Creation Workflow

### Creating New Blog Posts

1. **Create Directory**: `src/content/blog/YYYY-MM-DD-post-title/`
2. **Add Content**: Create `index.mdx` with proper frontmatter
3. **Add Images**: Store in `images/` subdirectory within post folder
4. **Add Videos**: Store local videos in `public/videos/YYYY-MM-DD-post-title/` and reference directly in MDX
5. **Embed External Videos**: Import and use embed components for YouTube/Vimeo/TikTok in MDX
6. **Preview**: Use `npm run dev` to preview locally
7. **Deploy**: Push to `main` branch for automatic deployment

### Local Video Implementation

For local videos, we use an organized public folder approach that ensures reliable loading across all deployment platforms:

1. **Store videos** in organized `public/videos/` directory structure:
   ```
   public/
   └── videos/
       └── YYYY-MM-DD-post-slug/
           └── video-file.mp4
   ```
2. **Reference videos directly** in your MDX file (no imports needed):
   ```jsx
   <video
     src="/videos/YYYY-MM-DD-post-slug/video-file.mp4"
     autoplay
     loop
     muted
     playsinline
     style="width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;">
     Your browser does not support the video tag.
   </video>
   ```

**Video Attributes for Different Use Cases:**

- **Background/Demo videos**: `autoplay`, `loop`, `muted`, `playsinline` (no `controls`)
- **Interactive content**: Add `controls` attribute for user control
- **Audio narration**: Remove `muted` for videos with important audio
- **Single playthrough**: Remove `loop` for one-time viewing

### Required Frontmatter

```yaml
---
title: "Your Post Title"
description: "SEO-optimized description"
pubDate: YYYY-MM-DD
heroImage: "./images/hero.jpg"
tags: ["tag1", "tag2"]
slug: "url-friendly-slug"
draft: false
---
```

## Performance Metrics

- **Lighthouse Score**: 90+ across all categories
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: Minimal JavaScript, optimized CSS

This blog represents a fully functional, modern web application that successfully balances performance, user experience, and maintainability while showcasing cutting-edge web development practices. The recent implementation of date-based URLs (`/YYYY/MM/slug`) enhances SEO and provides better content organization for both users and search engines.
