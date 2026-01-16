# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**IMPORTANT: Always use `bun` instead of `npm` for all commands in this project.**

```bash
bun run dev                    # Start development server at localhost:4321
bun run build                  # Production build with social images setup
bun run preview                # Preview production build locally
bun test                       # Run unit tests using Node.js built-in test runner
bun run setup-social-images    # Organize hero images for social sharing
bun run cms                    # Start Decap CMS proxy server (localhost:8082)
bun run dev:cms                # Run dev server + CMS together
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
- **Decap CMS**: Git-based content management system

### Content Architecture
Blog posts are organized in `src/content/blog/YYYY-MM-DD-post-title/` directories with:
- `index.mdx` - Post content with frontmatter schema validation
- All media (images, videos) stored centrally in `/public/media/`
- Frontmatter schema defined in `src/content/config.ts`

### Media Storage (Decap CMS)
All media files are stored in `/public/media/` with slug-prefixed names:
```
public/media/
├── post-slug-hero.jpg          # Hero images
├── post-slug-screenshot.png    # Content images
└── post-slug-video.mp4         # Local videos
```

Reference in posts:
```markdown
heroImage: "/media/post-slug-hero.jpg"
![Alt text](/media/post-slug-screenshot.png)
```

### URL Structure
Posts use SEO-friendly `/YYYY/MM/slug` URLs generated via:
- Dynamic routes: `src/pages/[year]/[month]/[slug].astro`
- URL utilities: `src/utils/url.ts` for consistent URL generation
- Slug extraction from directory names (removes date prefix)

### Video Handling
- **Local videos**: Store in `/public/media/` and reference as `/media/slug-video.mp4`
  ```html
  <video controls loop playsinline autoplay muted>
    <source src="/media/post-slug-video.mp4" type="video/mp4" />
    Your browser does not support the video tag.
  </video>
  ```
- **YouTube/Vimeo**: Just paste URL on its own line (auto-embeds via astro-embed)
  ```markdown
  https://www.youtube.com/watch?v=VIDEO_ID
  https://vimeo.com/VIDEO_ID
  ```
- **TikTok**: Use LinkPreview component
  ```jsx
  import { LinkPreview } from "@astro-community/astro-embed-link-preview";
  <LinkPreview id="https://www.tiktok.com/@user/video/123" />
  ```

### Social Sharing System
The `bun run setup-social-images` script:
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
- Optional fields: heroImage (string path), tags, draft status, updatedDate
- heroImage uses string paths for Decap CMS compatibility

### Build Process
1. `bun run setup-social-images` - Organizes hero images for social sharing
2. `astro build` - Generates static site with optimized assets
3. CSS/JS minification and asset fingerprinting
4. Automatic sitemap and RSS feed generation

### Deployment
- **Platform**: Cloudflare Pages with GitHub Actions
- **Config**: `astro.config.mjs` with server-side rendering
- **Domain**: hashir.blog (custom domain)
- **Assets**: Global CDN with edge caching

## Development Workflows

### Creating New Blog Posts (via Decap CMS)
1. Access CMS at `/admin/index.html`
2. Click "New Blog Post"
3. Fill in title, description, publish date
4. Upload hero image (goes to `/media/`)
5. Write content using the editor
6. Use toolbar buttons for YouTube, Vimeo, Video, Code Block embeds
7. Save to commit to Git

### Creating New Blog Posts (Manual)
1. Create directory: `src/content/blog/YYYY-MM-DD-post-title/`
2. Add `index.mdx` with proper frontmatter (required: title, description, pubDate, slug)
3. Store images in `/public/media/` with slug prefix
4. Reference as `heroImage: "/media/slug-hero.jpg"`
5. Set `draft: true` to hide from production during development

**Important SEO/Content Guidelines**:
- Description must be ≤160 characters for SEO optimization
- Hero images should be 1200x630px for optimal social sharing
- Directory names must use hyphens, no spaces or special characters
- Required frontmatter: title, description, pubDate, slug (all other fields optional)

### Testing
- Unit tests in `tests/` directory
- Run with `bun test` (Node.js built-in test runner with tsx)
- No specific test framework configured - uses Node.js native testing

### Content Validation
All blog posts are validated against the schema in `src/content/config.ts`. TypeScript will catch missing required fields or incorrect types during development.

### Performance Considerations
- Static generation with minimal JavaScript
- Image optimization built-in
- CSS inlined for critical styles
- Prefetching enabled for viewport links
- Edge deployment for global performance
