# Troubleshooting Guide

This guide helps you diagnose and resolve common issues when working with HashBlog.

## 🚨 Common Issues

### Build and Development Issues

#### Development Server Won't Start

**Symptom**: `npm run dev` fails or port is in use

**Solutions**:
```bash
# Check if port 4321 is in use
lsof -i :4321

# Kill process using the port
npx kill-port 4321

# Use a different port
npm run dev -- --port 3000

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors

**Symptom**: Build fails with TypeScript compilation errors

**Solutions**:
```bash
# Check TypeScript errors (requires @astrojs/check dependency)
# Install first if not available:
npm install --save-dev @astrojs/check typescript
npm run astro check

# Verify tsconfig.json extends Astro's strict config
# Check that all imports have proper file extensions
# Ensure content schema matches frontmatter fields

# Example fix for missing types
npm install --save-dev @types/node
```

#### Build Failures

**Symptom**: `npm run build` fails

**Common Causes and Fixes**:

1. **Content Schema Validation Errors**:
```bash
# Check blog post frontmatter
# Verify required fields: title, description, pubDate
# Ensure date format is correct (YYYY-MM-DD or Date object)
```

2. **Missing Hero Images**:
```bash
# Verify image paths in frontmatter
# Check that ./images/hero.jpg exists in post directory
# Run social images setup manually
npm run setup-social-images
```

3. **Asset Reference Errors**:
```bash
# Check relative image paths in MDX files
# Ensure videos directory exists if referenced
# Verify public asset organization
npm run setup-videos
```

### Content Issues

#### Blog Post Not Showing

**Symptom**: New blog post doesn't appear on site

**Checklist**:
- [ ] Post directory follows `YYYY-MM-DD-post-title` format
- [ ] `index.mdx` file exists in post directory
- [ ] Frontmatter has required fields: `title`, `description`, `pubDate`
- [ ] `draft: false` (or remove draft field entirely - defaults to false)
- [ ] Date format is valid (YYYY-MM-DD or Date object)
- [ ] Development server restarted after adding post

**Debug Steps**:
```bash
# Check content collections API (requires @astrojs/check)
npm install --save-dev @astrojs/check typescript
npm run astro check

# Verify post structure
ls -la "src/content/blog/YYYY-MM-DD-post-title/"

# Check frontmatter syntax
head -20 "src/content/blog/YYYY-MM-DD-post-title/index.mdx"
```

#### Post URLs Not Working

**Symptom**: Blog post URLs return 404 or don't generate correctly

**Common Causes**:

1. **Slug Generation Issues**:
```bash
# URLs are generated from directory names as /YYYY/MM/slug
# Slug is extracted by removing YYYY-MM-DD- prefix
# Example: 2025-06-17-my-post → /2025/06/my-post

# Check directory naming convention
ls src/content/blog/ | grep -E '^\d{4}-\d{2}-\d{2}-'
```

2. **Dynamic Route Configuration**:
```astro
# Verify src/pages/[year]/[month]/[slug].astro exists
# Check that getStaticPaths generates correct URLs
```

#### Content Schema Validation Errors

**Symptom**: Build fails with Zod validation errors

**Common Issues**:

1. **Required Fields Missing**:
```yaml
# Frontmatter must include (per src/content/config.ts):
title: "Your Post Title"           # Required: string
description: "Post description"    # Required: string  
pubDate: 2025-06-17               # Required: date
# Optional fields:
updatedDate: 2025-06-18           # Optional: date
heroImage: ./images/hero.jpg      # Optional: image
tags: ["tag1", "tag2"]            # Optional: array of strings (defaults to [])
draft: false                      # Optional: boolean (defaults to false)
preview: ./images/preview.jpg     # Optional: image
```

2. **Date Format Issues**:
```yaml
# Correct date formats:
pubDate: 2025-06-17              # YYYY-MM-DD
pubDate: "2025-06-17"            # String format
pubDate: 2025-06-17T10:00:00Z    # ISO format

# Incorrect:
pubDate: "June 17, 2025"         # Text dates not supported
```

#### Images Not Loading

**Symptom**: Images show broken links or 404 errors

**Common Fixes**:

1. **Relative Path Issues**:
```mdx
<!-- Correct -->
![Description](./images/screenshot.png)

<!-- Incorrect -->
![Description](images/screenshot.png)
![Description](/images/screenshot.png)
```

2. **Missing Images Directory**:
```bash
# Create images directory in post folder
mkdir "src/content/blog/YYYY-MM-DD-post-title/images"
```

3. **Social Images Not Generated**:
```bash
# Run social images setup
npm run setup-social-images

# Check output in public/social-images/
ls -la public/social-images/
```

#### Video Playback Issues

**Symptom**: Videos don't load or play incorrectly

**Solutions**:

1. **Local Video Setup**:
```bash
# Ensure videos are in public directory (copies from post/videos/ to public/videos/)
npm run setup-videos

# Check video file exists
ls -la public/videos/YYYY-MM-DD-post-title/
```

2. **Video Format Compatibility**:
```html
<!-- Use multiple formats for compatibility -->
<video controls>
  <source src="/videos/post-title/video.mp4" type="video/mp4">
  <source src="/videos/post-title/video.webm" type="video/webm">
  Your browser does not support the video tag.
</video>
```

3. **External Embed Issues**:
```mdx
<!-- Ensure proper import (using astro-embed integration) -->
import { YouTube } from "@astro-community/astro-embed-youtube";
import { Vimeo } from "@astro-community/astro-embed-vimeo";

<!-- Use correct video ID -->
<YouTube id="dQw4w9WgXcQ" />
```

### Search and Menu Issues

#### Search Not Working

**Symptom**: Search menu doesn't show results

**Debug Steps**:

1. **Check Search API**:
```bash
# Test search endpoint directly
curl http://localhost:4321/api/search.json

# Verify response format
npm run dev
# Navigate to http://localhost:4321/api/search.json
```

2. **Vue Component Issues**:
```bash
# Check browser console for JavaScript errors
# Verify Vue component is hydrating with client:load directive
# Check network tab for API requests to /api/search.json
# Ensure Menu component has proper event listeners
```

3. **Content Indexing**:
```javascript
// Verify search data includes all published posts (draft: false)
// Check that post body content is included for full-text search
// Search uses simple string matching, not Fuse.js fuzzy search
// Search fields: title, description, tags, body content
```

#### Menu Not Opening

**Symptom**: Clicking menu button doesn't open full-screen menu

**Solutions**:

1. **JavaScript Hydration**:
```astro
<!-- Ensure Menu component has client directive -->
<Menu client:load />
```

2. **Event Handling**:
```javascript
// Check that custom events are firing (triggered by header menu button)
document.dispatchEvent(new CustomEvent('toggle-menu'));
```

3. **CSS Conflicts**:
```css
/* Check for conflicting z-index or position styles */
/* Verify backdrop-blur support */
/* Menu uses z-50 and fixed positioning - ensure no conflicts */
```

### Performance Issues

#### Slow Build Times

**Symptom**: `npm run build` takes too long

**Optimization Steps**:

1. **Asset Optimization**:
```bash
# Compress images before adding to posts
# Use appropriate image formats (WebP, AVIF)
# Optimize video file sizes
```

2. **Dependency Analysis**:
```bash
# Check for unnecessary dependencies
npm audit
npm outdated

# Remove unused packages
npm uninstall package-name
```

3. **Content Volume**:
```bash
# For large numbers of posts, consider:
# - Pagination implementation
# - Selective search indexing
# - Image optimization automation
```

#### Slow Page Load Times

**Symptom**: Pages load slowly in production

**Debug Steps**:

1. **Performance Analysis**:
```bash
# Run Lighthouse audit
# Check Core Web Vitals
# Analyze bundle size
```

2. **Cloudflare Issues**:
```bash
# Check Cloudflare cache settings
# Verify edge caching is working
# Test from different geographic locations
```

3. **Asset Optimization**:
```bash
# Verify images are optimized
# Check CSS/JS minification
# Ensure proper caching headers
```

### Deployment Issues

#### GitHub Actions Failing

**Symptom**: Deployment workflow fails

**Note**: This project currently uses direct Cloudflare Pages deployment rather than GitHub Actions. If setting up GitHub Actions:

**Common Fixes**:

1. **Secrets Configuration**:
```bash
# Verify GitHub secrets are set:
# - CLOUDFLARE_API_TOKEN
# - CLOUDFLARE_ACCOUNT_ID
```

2. **Node.js Version**:
```yaml
# Ensure GitHub Actions uses Node.js 18+
- uses: actions/setup-node@v4
  with:
    node-version: 18
```

3. **Build Dependencies**:
```bash
# Check that all dependencies install correctly
npm ci

# Verify build succeeds locally
npm run build
```

#### Cloudflare Pages Issues

**Symptom**: Site doesn't deploy or shows errors

**Solutions**:

1. **Build Configuration**:
```toml
# Check wrangler.toml settings (actual configuration)
name = "hashblog"
compatibility_date = "2024-01-01"
pages_build_output_dir = "dist"
```

2. **Compatibility Issues**:
```javascript
// Verify Cloudflare adapter configuration in astro.config.mjs
adapter: cloudflare({
  imageService: 'compile',
  routes: {
    extend: {
      exclude: [{ pattern: "/assets/*" }],
    },
  },
})
```

3. **Domain Configuration**:
```bash
# Check DNS settings for hashir.blog
# Verify custom domain setup in Cloudflare Pages
# Ensure SSL certificates are active
# Check site configuration points to correct domain
```

## 🔧 Diagnostic Commands

### Health Check Script

```bash
#!/bin/bash
echo "HashBlog Health Check"
echo "====================="

# Check Node.js version
echo "Node.js: $(node --version)"

# Check npm version
echo "npm: $(npm --version)"

# Check dependencies
echo "Checking dependencies..."
npm audit --audit-level=moderate

# Verify content structure
echo "Checking content structure..."
find src/content/blog -name "index.mdx" | wc -l
echo "Blog posts found"

# Test build process
echo "Testing build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
fi

# Check TypeScript (requires @astrojs/check)
echo "Checking TypeScript..."
if npm list @astrojs/check > /dev/null 2>&1; then
    npm run astro check > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "✅ TypeScript check passed"
    else
        echo "❌ TypeScript errors found"
    fi
else
    echo "⚠️  @astrojs/check not installed - skipping TypeScript check"
fi
```

### Debug Information Collection

```bash
# System information
echo "OS: $(uname -a)"
echo "Node: $(node --version)"
echo "npm: $(npm --version)"

# Project information
echo "Package.json scripts:"
cat package.json | jq .scripts

# Content structure
echo "Blog posts:"
find src/content/blog -type d -name "*-*-*" | sort

# Asset organization
echo "Social images:"
find public/social-images -name "*.jpg" -o -name "*.png" | wc -l

echo "Videos:"
find public/videos -name "*.mp4" -o -name "*.webm" | wc -l
```

## 📞 Getting Help

### Before Asking for Help

1. **Search Existing Issues**: Check GitHub issues for similar problems
2. **Check Documentation**: Review relevant docs sections
3. **Reproduce Locally**: Ensure issue occurs in fresh environment
4. **Gather Information**: Collect error messages, logs, and system info

### Creating Bug Reports

**Include the Following**:
- Operating system and version
- Node.js and npm versions
- Exact error messages or screenshots
- Steps to reproduce the issue
- Expected vs actual behavior
- Relevant configuration files

**Template**:
```markdown
## Bug Description
Brief description of the issue

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: 
- Node.js: 
- npm: 
- Browser: 

## Additional Context
Any other relevant information
```

### Community Resources

- **Astro Discord**: Join the Astro community
- **Vue.js Forum**: For Vue-specific questions
- **Tailwind CSS Discord**: For styling issues
- **Cloudflare Community**: For deployment questions

---

Most issues can be resolved by carefully checking configuration files, verifying file paths, and ensuring all dependencies are properly installed. When in doubt, try the "clean slate" approach: delete `node_modules`, clear caches, and reinstall everything.