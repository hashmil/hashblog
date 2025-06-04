# Astro Blog Website Development Plan

## Project Overview

Creating a modern blog website using Astro with Vue components, featuring a dark theme, full-screen navigation menu, search functionality, and responsive design.

## Tech Stack

- **Astro** - Static site generator with component islands
- **Vue 3** - For interactive components (menu, search)
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Fuse.js** - Search functionality
- **Content Collections** - Astro's built-in content management

## Site Architecture

### Pages Structure

```
src/
├── pages/
│   ├── index.astro          # Home page with blog post list
│   ├── about.astro          # About page
│   ├── blog/
│   │   ├── [slug].astro     # Dynamic blog post pages
│   │   └── [...page].astro  # Paginated blog list (if needed)
│   └── api/
│       └── search.json.ts   # Search API endpoint
├── content/
│   ├── blog/               # Markdown blog posts
│   └── config.ts          # Content collection config
├── components/
│   ├── Layout.astro       # Base layout
│   ├── Header.astro       # Site header
│   ├── Menu.vue           # Full-screen navigation menu
│   ├── BlogCard.astro     # Blog post preview card
│   ├── BlogPost.astro     # Individual blog post layout
│   ├── Navigation.astro   # Post navigation (prev/next)
│   ├── Share.astro        # Social sharing buttons
│   └── Search.vue         # Search component
└── styles/
    └── global.css         # Global styles and Tailwind imports
```

## Feature Implementation Plan

### 1. Home Page

- **Hero Section**: Latest blog post with full content preview
- **Blog List**: Older posts showing title, date, and excerpt
- **Responsive Grid**: Mobile-first design
- **Load More**: Pagination or infinite scroll for older posts

### 2. Full-Screen Navigation Menu

- **Vue Component**: Interactive menu with smooth animations
- **Background Blur**: CSS backdrop-filter for content behind menu
- **Navigation Links**: Blog Home, About, Portfolio (external link)
- **Search Integration**: Built-in search functionality
- **Mobile Responsive**: Touch-friendly navigation

### 3. Search Functionality

- **Fuse.js Integration**: Fuzzy search across blog posts
- **Real-time Results**: Search as you type
- **Content Indexing**: Title, excerpt, and content search
- **Keyboard Navigation**: Arrow keys and enter support

### 4. Blog Post Pages

- **Dynamic Routing**: [slug].astro for individual posts
- **Rich Content**: Support for images, videos, code blocks
- **Typography**: Beautiful reading experience
- **Metadata**: Author, date, reading time, tags
- **Navigation**: Previous/Next post links
- **Social Sharing**: Twitter, Facebook, LinkedIn, Email

### 5. About Page

- **Personal Bio**: Professional background and interests
- **Social Links**: Twitter, LinkedIn, Instagram, Mastodon
- **Contact Info**: Email and other contact methods
- **Responsive Design**: Mobile-friendly layout

### 6. Content Management

- **Markdown Files**: Easy content creation and editing
- **Frontmatter**: Metadata for posts (title, date, excerpt, image)
- **Image Optimization**: Astro's built-in image optimization
- **Content Collections**: Type-safe content with Astro

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

## Development Phases

### Phase 1: Project Setup & Basic Structure

1. Initialize Astro project with TypeScript
2. Configure Tailwind CSS
3. Set up content collections
4. Create basic layout and routing
5. Implement dark theme

### Phase 2: Core Pages

1. Home page with blog post list
2. Individual blog post pages
3. About page
4. Basic navigation and header

### Phase 3: Interactive Features

1. Full-screen navigation menu (Vue component)
2. Search functionality with Fuse.js
3. Menu animations and backdrop blur
4. Mobile responsiveness

### Phase 4: Enhanced Features

1. Post navigation (previous/next)
2. Social sharing buttons
3. Image and video support in posts
4. SEO optimization
5. Performance optimization

### Phase 5: Content & Polish

1. Create sample blog posts
2. Add about page content
3. Fine-tune styling and animations
4. Cross-browser testing
5. Performance audit

## Technical Considerations

### SEO & Performance

- **Static Generation**: Fast loading with Astro's static output
- **Meta Tags**: Dynamic SEO metadata for each page
- **Sitemap**: Auto-generated sitemap
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
- **Categories/Tags**: Optional taxonomy system
- **RSS Feed**: Auto-generated RSS for subscribers
- **Reading Time**: Estimated reading time calculation

## Deployment

- **Static Hosting**: Netlify, Vercel, or GitHub Pages
- **Domain**: Custom domain setup
- **CDN**: Global content delivery
- **Build Process**: Automated deployments from Git

This plan provides a solid foundation for building a modern, performant blog website that matches your design requirements while being maintainable and scalable.
