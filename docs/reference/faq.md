# Frequently Asked Questions

Common questions and answers about HashBlog architecture, usage, and customization.

## 🚀 General Questions

### What is HashBlog?

HashBlog is a modern, performance-focused personal blog platform built with Astro 5.8.1, Vue 3, and TypeScript. It combines static site generation with selective interactivity to achieve excellent performance while maintaining a rich user experience.

**Key Features**:
- 90+ Lighthouse performance scores
- Real-time search without external dependencies
- Automated social image organization
- Edge deployment on Cloudflare Pages
- Type-safe content management

### Why choose HashBlog over other blogging platforms?

**Performance**: HashBlog is optimized for Core Web Vitals with minimal JavaScript and aggressive caching.

**Developer Experience**: Full TypeScript support, hot reloading, and modern tooling make development enjoyable.

**SEO**: Built-in optimization for search engines and social media sharing.

**Customization**: Complete control over design and functionality without vendor lock-in.

**Scalability**: Edge deployment ensures fast loading times globally.

### What are the system requirements?

**Development**:
- Node.js 18 or later
- npm or yarn package manager
- Git for version control
- Modern code editor (VS Code recommended)

**Production**:
- GitHub account (for CI/CD)
- Cloudflare account (for deployment)
- Custom domain (optional)

## 🏗 Technical Questions

### How does the islands architecture work?

HashBlog uses Astro's islands architecture where most content is statically generated at build time, with only specific components (like the search menu) hydrated on the client side.

**Benefits**:
- Minimal JavaScript bundle size
- Faster page loads
- Better SEO and accessibility
- Selective interactivity where needed

**Example**:
```astro
<!-- Static component (no JavaScript) -->
<Header />

<!-- Interactive component (JavaScript loaded) -->
<Menu client:load />

<!-- Static content -->
<main>Blog content here...</main>
```

### How does the search system work?

Search is implemented as a client-side system that fetches all published posts via an API endpoint and filters them in real-time.

**Architecture**:
1. Build-time: All posts indexed in `/api/search.json`
2. Runtime: Vue component fetches search data when menu opens
3. Filtering: Simple string matching across title, description, tags, and content
4. Performance: Results limited to 10 items, cached for 1 hour

**Why not server-side search?**
- Simpler architecture for personal blogs
- No external dependencies or costs
- Instant results without API latency
- Works offline after initial load

### How are images optimized?

HashBlog uses a multi-layered image optimization strategy:

**Build-time Optimization**:
- Astro's built-in image processing
- Automatic format conversion (WebP, AVIF)
- Responsive image generation
- Social image organization (1200x630px)

**Runtime Optimization**:
- Lazy loading for below-the-fold images
- Proper `alt` attributes for accessibility
- Optimized caching headers via Cloudflare

**Best Practices**:
- Compress images before adding to posts
- Use appropriate dimensions for context
- Include descriptive alt text

### How does content validation work?

Content is validated using Zod schemas at build time:

```typescript
const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    heroImage: image().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});
```

**Benefits**:
- Catch errors early in development
- TypeScript autocompletion for content
- Consistent frontmatter structure
- Build fails if validation errors occur

## 📝 Content Management

### How do I create a new blog post?

1. **Create directory**:
```bash
mkdir "src/content/blog/$(date +%Y-%m-%d)-post-title"
```

2. **Add content file** (`index.mdx`):
```mdx
---
title: "Your Post Title"
description: "SEO description under 160 characters"
pubDate: 2025-06-30
heroImage: "./images/hero.jpg"
tags: ["Tag1", "Tag2"]
draft: false
---

# Your content here...
```

3. **Add assets**:
- Images in `images/` directory
- Videos in `videos/` directory (optional)

4. **Preview and publish**:
```bash
npm run dev  # Preview at localhost:4321
npm run build  # Validate before publishing
```

### What content formats are supported?

**Primary Format**: MDX (Markdown with JSX components)
- Standard Markdown syntax
- Component embedding
- Code syntax highlighting
- Table support
- Custom HTML elements

**Supported Media**:
- Images: JPG, PNG, WebP, SVG
- Videos: MP4, WebM, MOV, AVI
- External embeds: YouTube, Vimeo, etc.

### How do I add videos to posts?

**Local Videos**:
1. Add video files to post's `videos/` directory
2. Reference in content:
```html
<video controls>
  <source src="/videos/YYYY-MM-DD-post-title/demo.mp4" type="video/mp4">
</video>
```

**External Embeds**:
```mdx
import { YouTube } from "@astro-community/astro-embed-youtube";

<YouTube id="VIDEO_ID" />
```

### How do I organize content with tags?

Tags are defined in frontmatter and used for categorization:

```yaml
---
tags: ["JavaScript", "Tutorial", "Performance"]
---
```

**Best Practices**:
- Use consistent tag names (case-sensitive)
- Limit to 3-5 tags per post
- Create a tag taxonomy for consistency
- Consider tag hierarchy (JavaScript > React > Hooks)

### Can I schedule posts for future publication?

Yes, by setting `pubDate` to a future date. However, note that:
- Posts are statically generated at build time
- Future posts won't appear until the next build after their publication date
- Consider using `draft: true` for work-in-progress content

## 🎨 Customization

### How do I customize the design?

HashBlog uses Tailwind CSS with a custom design system:

**Colors** (`tailwind.config.js`):
```javascript
colors: {
  primary: "#FFFFFF",
  accent: "#FF5682",
  dark: "#121212",
  // Add your custom colors
}
```

**Typography**:
```javascript
fontFamily: {
  sans: ['Work Sans', 'system-ui', 'sans-serif'],
  serif: ['Libre Baskerville', 'Georgia', 'serif'],
  // Add custom fonts
}
```

**Global Styles** (`src/styles/global.css`):
```css
@layer base {
  /* Custom base styles */
}

@layer components {
  /* Custom component styles */
}
```

### How do I add new pages?

Create new `.astro` files in `src/pages/`:

```astro
---
// src/pages/contact.astro
import Layout from '../components/Layout.astro';
---

<Layout title="Contact" description="Get in touch">
  <main>
    <h1>Contact Me</h1>
    <!-- Your content -->
  </main>
</Layout>
```

Page will be available at `/contact`.

### How do I modify the header/navigation?

Edit `src/components/Header.astro`:

```astro
<header class="sticky top-0 z-40 backdrop-blur-md bg-dark/90">
  <div class="container mx-auto px-4 py-4">
    <!-- Customize navigation -->
  </div>
</header>
```

### Can I add a comments system?

HashBlog doesn't include comments by default, but you can add:

**Static Comments** (via GitHub Issues):
- Use utterances or giscus
- Comments stored as GitHub issues
- Markdown support

**Third-party Services**:
- Disqus (traditional)
- Webmentions (IndieWeb)
- Custom API integration

## 🚀 Deployment

### How does deployment work?

HashBlog uses automated deployment via GitHub Actions:

1. **Push to main branch** triggers GitHub Actions
2. **Build process** runs asset organization and Astro build
3. **Deploy to Cloudflare Pages** distributes globally
4. **Edge caching** ensures fast loading worldwide

### Can I deploy to other platforms?

Yes, HashBlog can be deployed to any static hosting platform:

**Vercel**:
```bash
npm install @astrojs/vercel
# Update astro.config.mjs adapter
```

**Netlify**:
```bash
npm install @astrojs/netlify
# Update astro.config.mjs adapter
```

**GitHub Pages**, **Firebase Hosting**, etc. are also supported.

### How do I set up a custom domain?

1. **Configure DNS** to point to Cloudflare Pages
2. **Update Astro config**:
```javascript
export default defineConfig({
  site: 'https://yourdomain.com',
  // ...
});
```
3. **Update social images** and rebuild

### What about SSL certificates?

Cloudflare Pages provides automatic SSL certificates via Let's Encrypt. No additional configuration required.

## 🔧 Performance

### How fast is HashBlog?

HashBlog consistently achieves excellent performance scores:
- **Lighthouse Performance**: 90+
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### How many posts can HashBlog handle?

**Technical Limits**:
- No hard limit on post count
- Search performance optimal up to ~1000 posts
- Build time scales linearly with content

**Performance Considerations**:
- Large images increase build time
- Client-side search loads all posts
- Consider pagination for 500+ posts

### How do I optimize for better performance?

**Image Optimization**:
- Compress images before adding
- Use appropriate formats (WebP, AVIF)
- Optimize hero images to 1200x630px

**Content Optimization**:
- Keep posts focused and concise
- Use code blocks instead of screenshots
- Optimize video file sizes

**Build Optimization**:
- Regular dependency updates
- Remove unused packages
- Monitor bundle size

## 🔒 Security

### Is HashBlog secure?

HashBlog follows security best practices:

**Build-time Security**:
- Content validation prevents injection
- TypeScript catches type-related errors
- Dependency scanning via GitHub

**Runtime Security**:
- Static generation minimizes attack surface
- Cloudflare provides DDoS protection
- HTTPS enforced automatically

**Content Security**:
- Input sanitization in templates
- External links get security attributes
- No user-generated content by default

### How do I keep HashBlog updated?

**Regular Updates**:
```bash
npm update  # Update dependencies
npm audit   # Check for vulnerabilities
```

**Major Version Updates**:
- Review changelog for breaking changes
- Test in development environment
- Update configuration if needed

## 🐛 Troubleshooting

### Build is failing, what should I check?

1. **Content validation**: Check frontmatter syntax
2. **Asset references**: Verify image and video paths
3. **TypeScript errors**: Run `npm run astro check`
4. **Dependencies**: Try `rm -rf node_modules && npm install`

### Search isn't working

1. **Check API endpoint**: Visit `/api/search.json` directly
2. **Verify Vue hydration**: Look for JavaScript errors in console
3. **Content indexing**: Ensure posts aren't all drafts

### Images not loading

1. **Path syntax**: Use `./images/filename.jpg` (relative paths)
2. **File existence**: Verify files exist in post directories
3. **Social images**: Run `npm run setup-social-images`

---

Can't find your question? Check the [troubleshooting guide](troubleshooting.md) or create an issue on GitHub.