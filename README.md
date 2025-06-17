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
│   ├── plan.md          # Project planning and architecture
│   └── creating-new-blog-posts.md  # Content creation guide
└── astro.config.mjs     # Astro configuration
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```sh
# Clone the repository
git clone https://github.com/hashmil/hashblog.git
cd hashblog

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Commands

| Command                   | Action                                     |
| ------------------------- | ------------------------------------------ |
| `npm run dev`             | Start local dev server at `localhost:4321` |
| `npm run build`           | Build production site to `./dist/`         |
| `npm run preview`         | Preview build locally                      |
| `npm run setup-social-images` | Organize hero images for social sharing |
| `npm run astro -- --help` | Get help with Astro CLI                    |
| `npm test`                | Run unit tests                             |

### Running Tests

```sh
npm test
```

## 📝 Creating Blog Posts

### 1. Create a New Post Directory

```sh
# Create folder with date prefix
mkdir "src/content/blog/YYYY-MM-DD-your-post-title"
cd "src/content/blog/YYYY-MM-DD-your-post-title"
```

### 2. Add Content

Create an `index.mdx` file inside the new directory. Using the `.mdx` extension is required to embed components like videos directly into your content.

```markdown
---
title: "Your Post Title"
description: "Compelling description for SEO and previews."
pubDate: YYYY-MM-DD
heroImage: "./images/hero-image.jpg"
tags: ["AI", "Web Development", "Creative Coding"]
slug: "your-post-slug"
draft: false # Set to true to hide from production
---

# Your Post Title

Your content here...
```

### 3. Adding Videos

#### Local Videos

For videos stored locally, we use an organized public folder approach that ensures reliable loading across all deployment platforms:

1. **Store videos** in the organized `public/videos/` directory structure:

   ```text
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

#### External Video Embedding

For videos from providers like YouTube and Vimeo, import the required component from the `@astro-community/astro-embed` package directly in your `.mdx` file.

#### YouTube

1. **Import the component**:

   ```js
   import { YouTube } from "@astro-community/astro-embed-youtube";
   ```

2. **Use the component**:
   Pass the YouTube video ID to the `id` prop. You can find the ID in the YouTube video URL (`https://www.youtube.com/watch?v=VIDEO_ID`).

   ```astro
   <YouTube id="your-video-id-here" />
   ```

#### Vimeo

1. **Import the component**:

   ```js
   import { Vimeo } from "@astro-community/astro-embed-vimeo";
   ```

2. **Use the component**:
   Pass the full Vimeo video URL to the `id` prop.

   ```astro
   <Vimeo id="https://vimeo.com/your-video-id" />
   ```

#### TikTok

TikTok videos are currently embedded using a `LinkPreview` component.

### 4. Organization

- **Folder naming**: `YYYY-MM-DD-descriptive-title/`
- **Images**: Store in an `images/` sub-directory within the post folder. Reference them like `heroImage: "./images/hero.jpg"`
- **Videos**: Store in `public/videos/YYYY-MM-DD-post-slug/` and reference directly as `/videos/YYYY-MM-DD-post-slug/video.mp4`
- **Slugs**: The `slug` frontmatter property is required and determines the post's URL
- **URL Structure**: Posts are accessible at `/YYYY/MM/slug` (e.g., `/2024/05/what-lies-under-ai-short-film`)

See `docs/creating-new-blog-posts.md` and `docs/plan.md` for detailed guidelines.

### 5. Social Sharing Setup

The blog includes an automated social sharing system that optimizes hero images for social media platforms:

#### Social Images Script

```sh
npm run setup-social-images
```

This script:

- **Extracts hero images** from blog post frontmatter
- **Organizes them** in `/public/social-images/year/slug/hero.ext`
- **Optimizes for social sharing** meta tags (1200x630px recommended)
- **Runs automatically** during the build process

#### How it works

1. The script reads all blog posts and their `heroImage` frontmatter
2. Copies hero images to the organized social images directory structure
3. Social sharing meta tags reference these organized images
4. Ensures consistent URLs for Open Graph and Twitter Card previews

#### Requirements

- Hero images should be **1200x630px** for optimal social sharing
- Images must be referenced in frontmatter as `heroImage: "./images/filename.jpg"`
- The script must run before deployment for social sharing to work properly

## 🚀 Deployment

The site automatically deploys to Cloudflare Pages when
pushing to the `main` branch via GitHub Actions.

### Required Secrets

Add these to your GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with
  Pages:Edit permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

## 🎨 Features

- **Fast Loading** - Astro's static generation with minimal JavaScript
- **SEO Optimized** - Meta tags, structured data, and sitemap generation
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Interactive Elements** - Vue components for enhanced UX
- **Full-Screen Navigation** - Integrated search within navigation menu
- **Content Management** - MDX-based with automatic blog post discovery
- **Local Video Support** - Import and embed videos from post directories
- **External Video Embeds** - YouTube, Vimeo, and TikTok integration
- **Date-Based URLs** - Clean `/YYYY/MM/slug` URL structure for better SEO
- **Social Sharing** - Built-in share functionality
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
