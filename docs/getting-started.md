# Getting Started with HashBlog

This guide will help you set up HashBlog for local development and create your first blog post.

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js 20+** installed ([Download](https://nodejs.org/)) - Required for Astro 5.8.1
- **npm** or **yarn** package manager
- **Git** for version control
- **Code editor** (VS Code recommended with Astro extension)

## 🚀 Quick Setup

### 1. Clone and Install

```bash
# Clone the repository (replace with your actual repo URL)
git clone https://github.com/yourusername/hashblog.git
cd hashblog

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:4321`

### 2. Project Structure Overview

```
hashblog/
├── src/
│   ├── components/         # Reusable Astro and Vue components
│   ├── content/           # Blog posts and content collections
│   ├── layouts/           # Page layout templates
│   ├── pages/             # Route pages and API endpoints
│   ├── styles/            # Global CSS and Tailwind config
│   └── utils/             # Utility functions
├── public/                # Static assets
├── docs/                  # This documentation
├── scripts/               # Build and automation scripts
└── tests/                 # Unit tests
```

### 3. Environment Setup

Create environment files if needed:

```bash
# .env (optional - for custom configuration)
# Add any environment variables here
```

## 📝 Creating Your First Blog Post

### 1. Create Post Directory

```bash
# Create a new blog post directory with date prefix
mkdir "src/content/blog/$(date +%Y-%m-%d)-my-first-post"
cd "src/content/blog/$(date +%Y-%m-%d)-my-first-post"

# Create images directory for post assets
mkdir images
```

### 2. Create Post Content

Create `index.mdx` with the following structure:

```mdx
---
title: "My First Blog Post"
description: "A brief description of your first post for SEO and social sharing."
pubDate: 2025-06-30
heroImage: "./images/hero.jpg"
tags: ["Getting Started", "Blogging"]
draft: false
---

# Welcome to My Blog!

This is your first blog post content. You can use **Markdown** and *MDX* features here.

## Adding Images

You can reference images relatively:

![Hero Image](./images/hero.jpg)

## Adding Code

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}
```

## Adding Components

You can also embed components:

```jsx
<div class="bg-accent text-white p-4 rounded">
  This is a custom styled div!
</div>
```
```

### 3. Add Hero Image

Add a hero image to your post's `images/` directory:
- **Recommended size**: 1200x630px for optimal social sharing
- **Formats**: JPG, PNG, or WebP
- **File name**: `hero.jpg` (or reference the correct filename in frontmatter)

### 4. Preview Your Post

```bash
# Return to project root
cd ../../../..

# Start development server if not already running
npm run dev

# Navigate to your post at:
# http://localhost:4321/YYYY/MM/my-first-post
```

## 🔧 Development Commands

### Essential Commands

```bash
# Development
npm run dev              # Start dev server (localhost:4321)
npm run build           # Production build with asset setup
npm run preview         # Preview production build locally

# Testing
npm test                # Run unit tests

# Asset Management
npm run setup-social-images  # Organize hero images for social sharing
npm run setup-videos        # Organize video files

# Direct Astro CLI
npm run astro           # Access Astro CLI commands
npm run astro add       # Add integrations
npm run astro check     # Type check
```

### Development Workflow

1. **Start Development**: `npm run dev`
2. **Create Content**: Add new blog posts in `src/content/blog/`
3. **Test Changes**: Preview at `localhost:4321`
4. **Run Tests**: `npm test` to ensure nothing breaks
5. **Build**: `npm run build` to verify production build
6. **Commit**: Git commit your changes

## 🎨 Customization Basics

### 1. Site Configuration

Edit `astro.config.mjs` for basic site settings:

```javascript
export default defineConfig({
  site: 'https://yourdomain.com',  // Your domain
  // ... other settings
});
```

### 2. Content Schema

Modify `src/content/config.ts` to customize blog post fields:

```typescript
const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    // Add custom fields here
    customField: z.string().optional(),
  }),
});
```

### 3. Styling Customization

Edit `tailwind.config.js` to customize the design system:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#YOUR_COLOR",   // Change primary color
        accent: "#YOUR_ACCENT",   // Change accent color
      },
      // Add custom styles
    },
  },
}
```

### 4. Global Styles

Modify `src/styles/global.css` for custom CSS:

```css
@layer base {
  /* Your custom base styles */
}

@layer components {
  /* Your custom component styles */
}
```

## 🔍 Understanding the File Structure

### Content Organization

```
src/content/blog/YYYY-MM-DD-post-title/
├── index.mdx              # Main post content
├── images/               # Post-specific images
│   ├── hero.jpg         # Social sharing hero image
│   ├── screenshot1.png  # Additional post images
│   └── diagram.svg      # Diagrams and illustrations
└── videos/              # Optional local videos
    └── demo.mp4         # Video content
```

### Component Architecture

```
src/components/
├── Layout.astro          # Base page layout
├── Header.astro          # Site header with navigation
├── Menu.vue             # Interactive full-screen menu
├── BlogCard.astro       # Reusable blog post cards
├── Navigation.astro     # Previous/next post navigation
└── Share.astro          # Social sharing buttons
```

### Page Routing

```
src/pages/
├── index.astro          # Homepage
├── about.astro          # About page
├── [year]/[month]/[slug].astro  # Dynamic blog post routes
├── api/search.json.ts   # Search API endpoint
├── rss.xml.ts          # RSS feed generation
└── sitemap.xml.ts      # XML sitemap generation
```

## 🛠 Development Tips

### VS Code Setup

Install recommended extensions:
- **Astro** - Official Astro language support
- **Vue Language Features (Volar)** - Vue 3 support
- **Tailwind CSS IntelliSense** - Tailwind utilities autocomplete
- **TypeScript Importer** - Auto-import management

### Hot Reloading

The development server supports hot reloading for:
- ✅ Astro components (`.astro` files)
- ✅ Vue components (`.vue` files)
- ✅ Markdown and MDX content
- ✅ CSS and styling changes
- ✅ TypeScript and JavaScript

### Common Issues

**Port Already in Use**:
```bash
# Kill process on port 4321
npx kill-port 4321

# Or use different port
npm run dev -- --port 3000
```

**Module Not Found**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build Errors**:
```bash
# Check TypeScript errors
npm run astro check

# Verify content schema
npm run build
```

## 🎯 Next Steps

1. **Read the [Content Management Guide](content/README.md)** for advanced content features
2. **Explore [Technical Architecture](architecture/README.md)** to understand the system
3. **Review [Deployment Guide](deployment/README.md)** when ready to go live
4. **Check [Development Workflows](development/README.md)** for best practices

## 💡 Getting Help

- **Documentation**: Browse the `/docs` folder for detailed guides
- **Issues**: Check existing issues or create new ones
- **Community**: Join discussions about Astro and Vue development
- **Code Examples**: Review existing blog posts in `src/content/blog/`

---

You're now ready to start blogging with HashBlog! 🚀