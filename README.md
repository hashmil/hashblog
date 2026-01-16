# HashBlog 🚀

Personal blog by **Hash Milhan** - Creative Technology Director sharing insights on AI, web development, creative coding, and innovative design.

🌐 **Live Site**: [hashir.blog](https://hashir.blog)

## About

This blog explores the intersection of technology and creativity, featuring posts about:

- 🤖 **AI & Machine Learning** - Prompt engineering, creative applications, and emerging tools
- 💻 **Web Development** - Modern frameworks, edge computing, and future trends
- 🎨 **Creative Coding** - Generative art, interactive installations, and creative applications
- 🔮 **Innovation** - Emerging technologies, design thinking, and creative processes

## Tech Stack

- **Framework**: [Astro](https://astro.build) - Static site generator with component islands
- **CMS**: [Decap CMS](https://decapcms.org) - Git-based content management with local backend
- **UI Components**: [Vue 3](https://vuejs.org) - Interactive components (menu, search)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- **TypeScript** - Type safety and better developer experience
- **Content**: Markdown/MDX with frontmatter for blog posts
- **Embeds**: `@astro-community/astro-embed` - YouTube, Vimeo, TikTok video embeds
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com) - Edge deployment with global CDN
- **CI/CD**: GitHub Actions - Automated deployment pipeline

## 🏗️ Project Structure

```text
/
├── public/                 # Static assets (favicon, manifest, etc.)
│   └── media/             # All images and videos (centralized)
│       ├── post-slug-image.jpg
│       └── post-slug-video.mp4
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
│   │   │   │   └── index.mdx      # Post content (MDX for embeds)
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
├── docs/                 # Comprehensive documentation
└── astro.config.mjs     # Astro configuration
```

## 📚 Documentation

HashBlog includes comprehensive documentation covering all aspects of the platform:

### 📖 Getting Started
- **[Overview](docs/overview.md)** - Project vision, features, and architecture overview
- **[Getting Started](docs/getting-started.md)** - Quick setup guide and creating your first blog post

### 🏗️ Technical Documentation
- **[Architecture](docs/architecture/README.md)** - Deep dive into technical implementation
  - Islands architecture with Astro + Vue
  - Content collections and schema validation
  - Search implementation and API design
  - Build process and asset optimization

### ✍️ Content Management
- **[Content Guide](docs/content/README.md)** - Complete content management system
  - Creating and organizing blog posts
  - Image handling and social sharing setup
  - Video integration (local and external embeds)
  - MDX features and component embedding
  - Type-safe frontmatter with Zod validation

### 🔧 Development & Deployment
- **[Development Workflows](docs/development/README.md)** - Development best practices
  - Component development (Astro + Vue)
  - Testing strategies and code quality
  - Performance optimization techniques
  - Security considerations

- **[Deployment Guide](docs/deployment/README.md)** - Production deployment
  - Cloudflare Pages setup and configuration
  - CI/CD with GitHub Actions
  - Performance monitoring and optimization
  - SEO and social media optimization

### 🆘 Reference & Support
- **[Troubleshooting](docs/reference/troubleshooting.md)** - Common issues and solutions
  - Build and development issues
  - Content and asset problems
  - Search and menu troubleshooting
  - Performance and deployment issues

- **[FAQ](docs/reference/faq.md)** - Frequently asked questions
  - Technical architecture questions
  - Content management workflows
  - Customization and deployment options
  - Performance and security considerations

### 🎯 Key Documentation Features

- **Comprehensive Coverage** - Every aspect of HashBlog documented
- **Code Examples** - Practical examples with real code snippets
- **Best Practices** - Proven patterns and optimization strategies
- **Troubleshooting** - Solutions for common development issues
- **Architecture Deep-Dives** - Understanding the technical implementation

## 🛠️ Development

### Prerequisites

- Node.js 18+ or Bun
- Git

### Setup

```sh
# Clone the repository
git clone https://github.com/hashmil/hashblog.git
cd hashblog

# Install dependencies
bun install

# Start development server
bun run dev
```

### Available Commands

| Command                   | Action                                           |
| ------------------------- | ------------------------------------------------ |
| `bun run dev`             | Start local dev server at `localhost:4321`       |
| `bun run build`           | Build production site to `./dist/`               |
| `bun run preview`         | Preview build locally                            |
| `bun run cms`             | Start Decap CMS proxy server                     |
| `bun run dev:cms`         | Run dev server + CMS together                    |
| `bun run setup-social-images` | Organize hero images for social sharing      |
| `bun test`                | Run unit tests                                   |

### Running Tests

```sh
bun test
```

## 📝 Creating Blog Posts

### Option 1: Using Decap CMS (Recommended)

The easiest way to create and manage blog posts:

```sh
# Start the CMS and dev server together
bun run dev:cms

# Access the admin panel at:
# http://localhost:4321/admin/index.html
```

The CMS provides:
- Visual editor with live preview
- Toolbar buttons for YouTube, Vimeo, Tweet, Video, and Code embeds
- Automatic Git commits
- Image upload to `/public/media/`

### Option 2: Manual Creation

```sh
# Create folder with date prefix
mkdir "src/content/blog/YYYY-MM-DD-your-post-title"
```

Create an `index.mdx` file inside the new directory:

```markdown
---
title: "Your Post Title"
description: "Compelling description for SEO and previews."
pubDate: YYYY-MM-DD
heroImage: "/media/your-post-slug-hero.jpg"
tags: ["AI", "Web Development", "Creative Coding"]
draft: false # Set to true to hide from production
---

# Your Post Title

Your content here...
```

### 3. Adding Media (Images & Videos)

All media files (images and videos) are stored in the centralized `/public/media/` directory.

#### Images

Store images in `/public/media/` with a slug prefix:
```
public/media/
├── post-slug-hero.jpg
├── post-slug-screenshot.png
└── post-slug-diagram.svg
```

Reference in frontmatter or content:
```markdown
heroImage: "/media/post-slug-hero.jpg"
![Description](/media/post-slug-screenshot.png)
```

#### Local Videos

Store videos in `/public/media/` and reference directly:

```html
<video controls loop playsinline autoplay muted>
  <source src="/media/post-slug-video.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

**Video Attributes:**
- **Background/Demo videos**: `autoplay`, `loop`, `muted`, `playsinline` (no `controls`)
- **Interactive content**: Add `controls` for user control
- **Audio narration**: Remove `muted` for videos with important audio

#### External Video Embedding

YouTube and Vimeo videos auto-embed when you paste a URL on its own line:

```markdown
https://www.youtube.com/watch?v=VIDEO_ID

https://vimeo.com/VIDEO_ID
```

The `astro-embed` integration automatically transforms these URLs into embedded players.

#### TikTok

TikTok videos use `LinkPreview` for card-style embedding:
```js
import { LinkPreview } from "@astro-community/astro-embed-link-preview";
<LinkPreview id="https://www.tiktok.com/@user/video/123" />
```

### 4. Organization

- **Folder naming**: `YYYY-MM-DD-descriptive-title/`
- **Media**: All images and videos stored in `/public/media/` with slug prefixes
- **Slugs**: The `slug` frontmatter property is required and determines the post's URL
- **URL Structure**: Posts are accessible at `/YYYY/MM/slug` (e.g., `/2024/05/what-lies-under-ai-short-film`)

See the comprehensive [Content Management Guide](docs/content/README.md) for detailed guidelines and best practices.

### 5. Social Sharing Setup

The blog includes an automated social sharing system that optimizes hero images for social media platforms:

#### Social Images Script

```sh
bun run setup-social-images
```

This script:

- **Extracts hero images** from blog post frontmatter
- **Organizes them** in `/public/social-images/year/slug/hero.ext`
- **Optimizes for social sharing** meta tags (1200x630px recommended)
- **Runs automatically** during the build process

#### Requirements

- Hero images should be **1200x630px** for optimal social sharing
- Images referenced in frontmatter as `heroImage: "/media/slug-hero.jpg"`

## 🚀 Deployment

The site automatically deploys to Cloudflare Pages when
pushing to the `main` branch via GitHub Actions.

### Required Secrets

Add these to your GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with
  Pages:Edit permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

## 🎨 Features

- **Decap CMS** - Git-based content management with visual editor
- **Fast Loading** - Astro's static generation with minimal JavaScript
- **SEO Optimized** - Meta tags, structured data, sitemap, and robots.txt
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Interactive Elements** - Vue components for enhanced UX
- **Full-Screen Navigation** - Integrated search within navigation menu
- **Rich Media Embeds** - YouTube, Vimeo, Twitter/X, and local videos via CMS toolbar
- **Date-Based URLs** - Clean `/YYYY/MM/slug` URL structure for better SEO
- **Social Sharing** - Built-in share functionality with optimized images
- **RSS Feed** - Automatic feed generation for subscribers
- **Search Functionality** - Real-time search across all content

## 📄 License

This project is open source and available under the [MIT
License](LICENSE).

## 👨‍💻 Author

**Hash Milhan** - Creative Technology Director

- 🌐 Website: [hashir.blog](https://hashir.blog)
- 🐦 Twitter: [@hashir](https://twitter.com/hashir)
- 📧 Email: <blog@hashir.net>

---

_Built with ❤️ using Astro, Vue, and modern web
technologies_
