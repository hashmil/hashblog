# HashBlog 🚀

Personal blog by **Hash Milhan** - Creative Technology Director sharing insights on AI, web development, creative coding, and innovative design.

🌐 **Live Site**: [hashblog.pages.dev](https://hashblog.pages.dev)

## About

This blog explores the intersection of technology and creativity, featuring posts about:

- 🤖 **AI & Machine Learning** - Prompt engineering, creative applications, and emerging tools
- 💻 **Web Development** - Modern frameworks, edge computing, and future trends
- 🎨 **Creative Coding** - Generative art, interactive installations, and creative applications
- 🔮 **Innovation** - Emerging technologies, design thinking, and creative processes

## Tech Stack

- **Framework**: [Astro](https://astro.build) - Fast, content-focused static site generator
- **UI Components**: [Vue.js](https://vuejs.org) - Interactive components and menu system
- **Styling**: [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- **Content**: Markdown with frontmatter - Blog posts organized by date
- **Deployment**: [Cloudflare Pages](https://pages.cloudflare.com) - Edge deployment with global CDN
- **CI/CD**: GitHub Actions - Automated deployment pipeline

## 🏗️ Project Structure

```text
/
├── public/                 # Static assets (images, fonts, etc.)
├── src/
│   ├── components/        # Vue components and Astro components
│   │   └── pages/
│   │       └── index.astro
│   ├── content/
│   │   └── blog/         # Blog posts (organized by date)
│   │       ├── 2024-03-15-future-of-web-development/
│   │       ├── 2024-04-30-be-a-prompt-god/
│   │       └── ...
│   ├── pages/            # Route pages
│   │   ├── blog/[slug].astro  # Dynamic blog post pages
│   │   └── index.astro        # Homepage
│   └── styles/           # Global styles
├── .github/workflows/    # GitHub Actions for deployment
└── docs/                # Documentation for content creation
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
| `npm run astro -- --help` | Get help with Astro CLI                    |

## 📝 Creating Blog Posts

### 1. Create a New Post Directory

```sh
# Create folder with date prefix
mkdir "src/content/blog/2024-MM-DD-your-post-title"
cd "src/content/blog/2024-MM-DD-your-post-title"
```

### 2. Add Content

Create `index.md` with frontmatter:

```markdown
---
title: "Your Post Title"
description: "Compelling description for SEO and previews"
pubDate: 2024-MM-DD
heroImage: "./hero-image.jpg" # Optional
tags: ["AI", "Web Development", "Creative Coding"]
draft: false # Set to true to hide from production
---

# Your Post Title

Your content here...
```

### 3. Organization

- **Folder naming**: `YYYY-MM-DD-descriptive-title/`
- **Images**: Store in the same folder as your post
- **Custom slugs**: Add `slug: custom-url` to frontmatter if needed

See `docs/creating-new-blog-posts.md` for detailed guidelines.

## 🚀 Deployment

The site automatically deploys to Cloudflare Pages when pushing to the `main` branch via GitHub Actions.

### Required Secrets

Add these to your GitHub repository secrets:

- `CLOUDFLARE_API_TOKEN` - Cloudflare API token with Pages:Edit permissions
- `CLOUDFLARE_ACCOUNT_ID` - Your Cloudflare account ID

## 🎨 Features

- **Fast Loading** - Astro's static generation with minimal JavaScript
- **SEO Optimized** - Meta tags, structured data, and sitemap generation
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Interactive Elements** - Vue components for enhanced UX
- **Content Management** - Markdown-based with automatic blog post discovery
- **Social Sharing** - Built-in share functionality
- **RSS Feed** - Automatic feed generation for subscribers

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Hash Milhan** - Creative Technology Director

- 🌐 Website: [hashblog.pages.dev](https://hashblog.pages.dev)
- 🐦 Twitter: [@hashir](https://twitter.com/hashir)
- 📧 Email: blog@hashir.net

---

_Built with ❤️ using Astro, Vue, and modern web technologies_
