# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev                    # Start development server at localhost:4321
npm run build                  # Production build with social images setup
npm run preview                # Preview production build locally
npm test                       # Run unit tests using Node.js built-in test runner
npm run setup-social-images    # Organize hero images for social sharing
```

## Architecture Overview

HashBlog is an Astro 5.8.1 static site generator with Vue 3 islands for interactivity. It uses server-side rendering with Cloudflare Pages adapter for global edge deployment.

### Core Stack
- **Astro**: Static site generation with component islands
- **Vue 3**: Interactive components (menu, search)
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling with custom design system
- **MDX**: Rich content with component embedding
- **Fuse.js**: Real-time search functionality

### Content Architecture
Blog posts are organized in `src/content/blog/YYYY-MM-DD-post-title/` directories with:
- `index.mdx` - Post content with frontmatter schema validation
- `images/` - Post-specific images referenced as `./images/filename.jpg`
- Frontmatter schema defined in `src/content/config.ts` with required fields: title, description, pubDate, optional heroImage, tags, draft

### URL Structure
Posts use SEO-friendly `/YYYY/MM/slug` URLs generated via:
- Dynamic routes: `src/pages/[year]/[month]/[slug].astro`
- URL utilities: `src/utils/url.ts` for consistent URL generation
- Slug extraction from directory names (removes date prefix)

### Video Handling
- **Local videos**: Store in `public/videos/YYYY-MM-DD-post-slug/` and reference as `/videos/path/video.mp4`
- **External embeds**: Import from `@astro-community/astro-embed` in MDX files
  - YouTube: `import { YouTube } from "@astro-community/astro-embed-youtube"`
  - Vimeo: `import { Vimeo } from "@astro-community/astro-embed-vimeo"`

### Social Sharing System
The `npm run setup-social-images` script:
- Extracts hero images from blog post frontmatter
- Organizes them in `/public/social-images/year/slug/hero.ext`
- Required for social sharing meta tags to work properly
- Automatically runs during build process

### Search Implementation
Real-time search using Fuse.js:
- Search API endpoint: `src/pages/api/search.json.ts`
- Integrated into full-screen menu component (`src/components/Menu.vue`)
- Searches across title, description, tags, and content
- No external search service dependencies

### Key Components
- `Layout.astro` - Base layout with SEO meta tags, structured data
- `Menu.vue` - Full-screen navigation with integrated search
- `Header.astro` - Site header with menu toggle
- `Navigation.astro` - Previous/next post navigation
- `BlogCard.astro` - Reusable blog post card component
- `Share.astro` - Social sharing functionality

### Content Collections
Type-safe content management via Astro's content collections:
- Schema validation in `src/content/config.ts`
- Required fields: title, description, pubDate
- Optional fields: heroImage, tags, draft status, updatedDate
- Images processed through Astro's image optimization

### Build Process
1. `npm run setup-social-images` - Organizes hero images for social sharing
2. `astro build` - Generates static site with optimized assets
3. CSS/JS minification and asset fingerprinting
4. Automatic sitemap and RSS feed generation

### Deployment
- **Platform**: Cloudflare Pages with GitHub Actions
- **Config**: `astro.config.mjs` with server-side rendering
- **Domain**: hashir.blog (custom domain)
- **Assets**: Global CDN with edge caching

## Development Workflows

### Creating New Blog Posts
1. Create directory: `src/content/blog/YYYY-MM-DD-post-title/`
2. Add `index.mdx` with proper frontmatter (required: title, description, pubDate, slug)
3. Store images in `images/` subdirectory, reference as `./images/filename.jpg`
4. For videos: Store in `public/videos/YYYY-MM-DD-post-title/` and reference as `/videos/path/video.mp4`
5. Set `draft: true` to hide from production during development

**Important SEO/Content Guidelines**:
- Description must be ≤160 characters for SEO optimization
- Hero images should be 1200x630px for optimal social sharing
- Directory names must use hyphens, no spaces or special characters
- Required frontmatter: title, description, pubDate, slug (all other fields optional)

### Testing
- Unit tests in `tests/` directory
- Run with `npm test` (Node.js built-in test runner with tsx)
- No specific test framework configured - uses Node.js native testing

### Content Validation
All blog posts are validated against the schema in `src/content/config.ts`. TypeScript will catch missing required fields or incorrect types during development.

### Performance Considerations
- Static generation with minimal JavaScript
- Image optimization built-in
- CSS inlined for critical styles
- Prefetching enabled for viewport links
- Edge deployment for global performance