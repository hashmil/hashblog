# Content Management

HashBlog uses **Decap CMS** for content management with Git-based storage. All content is type-safe using Astro's Content Collections with Zod validation.

## 🚀 Quick Start

The easiest way to manage content is via Decap CMS:

```bash
# Start CMS and dev server together
bun run dev:cms

# Access admin panel at:
# http://localhost:4321/admin/index.html
```

See **[Decap CMS Guide](../decap-cms-guide.md)** for complete CMS documentation.

## 📚 Table of Contents

- **[Decap CMS Guide](../decap-cms-guide.md)** - Visual content management
- **[Creating Blog Posts](creating-posts.md)** - Step-by-step guide to writing new posts
- **[Image Handling](images.md)** - Image optimization and social sharing setup
- **[Video Integration](videos.md)** - Local videos and external platform embeds
- **[Content Schema](schema.md)** - Understanding frontmatter validation and types

## 🎯 Content Management Overview

### Core Principles

1. **Visual Editing**: Decap CMS provides a user-friendly editor with live preview
2. **Type Safety**: All content is validated using Zod schemas
3. **Centralized Media**: All images and videos stored in `/public/media/`
4. **SEO First**: Built-in optimization for search engines and social sharing
5. **Git-Based**: All changes committed to Git automatically

### Content Architecture

```
src/content/blog/YYYY-MM-DD-post-title/
└── index.mdx              # Main post content

public/media/              # Centralized media storage
├── post-slug-hero.jpg     # Hero images (1200x630px)
├── post-slug-image.png    # Content images
└── post-slug-video.mp4    # Local videos
```

### URL Structure

Posts are accessible via SEO-friendly URLs:
- **Pattern**: `/YYYY/MM/slug`
- **Example**: `/2025/06/my-awesome-blog-post`
- **Automatic**: Generated from `pubDate` and directory name

## 📝 Content Types

### Blog Posts (Primary Content)

**Location**: `src/content/blog/`
**File**: `index.mdx` in each post directory
**Features**:
- MDX support for rich content and component embedding
- Zod schema validation for frontmatter
- Automatic URL generation
- Social image organization
- Draft system for preview

### Static Pages

**Location**: `src/pages/`
**Examples**: `about.astro`, `contact.astro`
**Features**:
- Astro component format
- Direct routing based on filename
- Full access to layout system

## 🔧 Content Workflow

### Option 1: Using Decap CMS (Recommended)

1. Start CMS: `bun run dev:cms`
2. Open `http://localhost:4321/admin/index.html`
3. Click "New Blog Post"
4. Fill in fields and write content
5. Use toolbar for embeds (YouTube, Vimeo, Video, Code)
6. Click Save - auto-commits to Git

### Option 2: Manual Creation

```bash
# Create new post directory
mkdir "src/content/blog/$(date +%Y-%m-%d)-your-post-title"
```

Create `index.mdx`:

```mdx
---
title: "Your Amazing Blog Post"
description: "A compelling description under 160 characters for SEO."
pubDate: 2025-06-30
heroImage: "/media/your-post-slug-hero.jpg"
tags: ["Development", "Tutorial"]
draft: true  # Set to false when ready to publish
---

# Your Content Here

Write your blog post using Markdown and MDX features...
```

### Asset Management

- **Images**: Upload via CMS or add to `/public/media/` with slug prefix
- **Videos**: Upload via CMS or add to `/public/media/`
- **External Media**: Paste YouTube/Vimeo URLs on their own line

### Preview and Testing

```bash
# Start development server
bun run dev

# Preview your post at:
# http://localhost:4321/YYYY/MM/your-post-title
```

### Publication

```bash
# Set draft: false in frontmatter
# Run build to verify everything works
bun run build

# Commit and push to trigger deployment
git add .
git commit -m "Add new blog post: Your Amazing Title"
git push
```

## 📋 Content Schema

### Required Fields

```typescript
title: string           // Post title (used in meta tags)
description: string     // SEO description (max 160 characters)
pubDate: Date          // Publication date (determines URL)
```

### Optional Fields

```typescript
updatedDate?: Date      // Last modification date
heroImage?: string      // Path to hero image (1200x630px recommended)
tags?: string[]        // Category tags (default: [])
draft?: boolean        // Draft status (default: false)
```

### Schema Validation

Content is automatically validated using Zod schemas:

```typescript
const blog = defineCollection({
  schema: () => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),  // String path for /media/ URLs
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});
```

## 🎨 Content Features

### MDX Support

Write rich content with component embedding:

```mdx
# Standard Markdown

**Bold text** and *italic text* work as expected.

## Code Blocks

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

## Component Embedding

<div class="bg-accent text-white p-4 rounded-lg">
  Custom styled content!
</div>

## External Embeds

Import and use embed components:

import { YouTube } from "@astro-community/astro-embed-youtube";

<YouTube id="dQw4w9WgXcQ" />
```

### Image Handling

**In Markdown content**:
```mdx
![Description](/media/post-slug-screenshot.png)
```

**Hero images** (in frontmatter):
```yaml
heroImage: "/media/post-slug-hero.jpg"
```

### Video Integration

**Local Videos** (stored in `/public/media/`):
```html
<video controls loop playsinline autoplay muted>
  <source src="/media/post-slug-video.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

**External Embeds** (just paste URL on its own line):
```mdx
https://www.youtube.com/watch?v=VIDEO_ID

https://vimeo.com/VIDEO_ID
```

The `astro-embed` integration auto-transforms these URLs into embedded players.

## 🔍 Content Discovery

### Search Integration

All published content is automatically indexed for search:

- **Title**: Primary search field
- **Description**: SEO description included in search
- **Tags**: Tag-based filtering
- **Content**: Full-text search across post body
- **Real-time**: Instant search results as you type

### Navigation

**Automatic Navigation**:
- Previous/next post links based on publication date
- Tag-based content grouping
- Date-based URL structure for chronological browsing

### RSS and Sitemaps

**Automatic Generation**:
- RSS feed at `/rss.xml`
- XML sitemap at `/sitemap.xml`
- Social media meta tags for sharing

## 📊 Content Analytics

### SEO Optimization

Every post automatically includes:

- **Meta Tags**: Title, description, canonical URL
- **Open Graph**: Facebook and social sharing optimization
- **Twitter Cards**: Twitter-specific meta tags
- **Structured Data**: Schema.org markup for rich search results
- **Image Optimization**: Social sharing images at 1200x630px

### Performance Monitoring

- **Build Validation**: Content schema errors prevent builds
- **Image Optimization**: Automatic format conversion and resizing
- **Asset Organization**: Automated social image and video setup
- **Bundle Analysis**: Minimal JavaScript for optimal loading

## 🛠 Advanced Features

### Draft System

Control content visibility:

```yaml
---
title: "Work in Progress"
draft: true  # Not visible in production
---
```

### Content Updates

Track content modifications:

```yaml
---
pubDate: 2025-06-30
updatedDate: 2025-07-01  # Shows "Updated" badge
---
```

### Tag Organization

Organize content by topics:

```yaml
---
tags: ["Tutorial", "JavaScript", "Performance"]
---
```

## 🚀 Best Practices

### Content Writing

1. **SEO-Friendly Titles**: Clear, descriptive titles under 60 characters
2. **Compelling Descriptions**: Under 160 characters, include primary keywords
3. **Consistent Tagging**: Use standardized tag names for better organization
4. **Quality Images**: High-resolution hero images for social sharing
5. **Mobile-First**: Write for mobile reading experience

### Asset Management

1. **Image Optimization**: Compress images before adding to posts
2. **Consistent Naming**: Use descriptive filenames for all assets
3. **Asset Organization**: Keep related files in post-specific directories
4. **Video Optimization**: Compress videos for web delivery
5. **Alternative Formats**: Provide fallbacks for unsupported formats

### Performance

1. **Content Length**: Balance comprehensive coverage with loading speed
2. **Image Sizes**: Use appropriate dimensions for context
3. **External Embeds**: Use sparingly to maintain performance
4. **Code Examples**: Prefer syntax highlighting over screenshots
5. **Asset Prefixing**: Use relative paths for portability

## 🔧 Troubleshooting

### Common Issues

**Build Failures**:
- Check frontmatter schema validation
- Verify all required fields are present
- Ensure image paths start with `/media/`

**Missing Images**:
- Verify images exist in `/public/media/`
- Check image paths start with `/media/`
- Run `bun run setup-social-images`

**Draft Posts Showing**:
- Ensure `draft: false` for published content
- Clear build cache and rebuild
- Check content collection filtering

**URL Issues**:
- Verify `pubDate` format is correct
- Check directory naming convention
- Ensure slug is auto-generated from directory name

---

This content management system provides a powerful foundation for creating engaging, SEO-optimized blog content with modern developer tooling and automated optimizations.