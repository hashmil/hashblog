# Decap CMS Guide

## Overview

HashBlog uses [Decap CMS](https://decapcms.org/) for content management. The CMS runs locally with a Git backend, so all content changes are committed to your local Git repository.

## Quick Start

### Start CMS Server

```bash
bun run cms
```

This starts the Decap CMS proxy server at `http://localhost:8082`.

### Access Admin Panel

Open your browser and navigate to:
```
http://localhost:8082/admin
```

### Start CMS + Dev Server Together

```bash
bun run dev:cms
```

This runs both the Astro development server (`localhost:4321`) and the CMS proxy server (`localhost:8082`) simultaneously.

## Creating New Posts

1. Click "New Blog Post" in the CMS
2. Fill in the required fields:
   - **Title** (required): Post title
   - **Description** (required): Post description (≤160 characters for SEO)
   - **Publish Date** (required): Publication date
   - **Hero Image** (optional): Main image for social sharing
   - **Preview Image** (optional): Additional preview image
   - **Tags** (optional): Array of tags
   - **Draft** (boolean): Set to `false` to publish
   - **Body** (required): Main content in Markdown

3. Upload images using the media library (images go to `/public/media/`)
4. Click "Save" - Changes are committed to your local Git repo

## Managing Images

### Image Uploads

All images uploaded via Decap CMS are stored in:
```
/public/media/
```

### Image References in Content

When writing Markdown content, reference images using the `/media/` path:
```markdown
![Alt text](/media/filename.jpg)
```

### Hero Images

Hero images for social sharing should be uploaded via the CMS. They will be stored in `/public/media/` and automatically copied to `/public/social-images/` during the build process.

## Cross-Machine Workflow

### Machine A (Creating/Editing)

1. Clone the repository:
   ```bash
   git clone <your-repo>
   cd hashblog
   bun install
   ```

2. Start the CMS:
   ```bash
   bun run cms
   ```

3. Access admin panel and create/edit posts:
   ```
   http://localhost:8082/admin
   ```

4. Changes are automatically committed to Git

5. Push to GitHub when satisfied:
   ```bash
   git push origin <branch>
   ```

### Machine B (Continuing Editing)

1. Pull latest changes:
   ```bash
   git pull origin <branch>
   ```

2. Start the CMS:
   ```bash
   bun run cms
   ```

3. Access admin panel - you'll see all posts from Machine A

4. Continue editing and push when done

## Content Structure

### Post Directory Pattern

Decap CMS creates posts with date-prefixed directories:
```
src/content/blog/YYYY-MM-DD-post-slug/index.mdx
```

Example:
```
src/content/blog/2026-01-15-my-new-post/index.mdx
```

### Frontmatter Format

Decap CMS generates standard YAML frontmatter:

```yaml
---
title: "Post Title"
description: "Post description"
pubDate: 2026-01-15T10:00:00.000Z
updatedDate: 2026-01-16T14:30:00.000Z
heroImage: "/media/hero-image.jpg"
preview: "/media/preview-image.jpg"
tags: ["tag1", "tag2"]
draft: false
---
```

### URL Generation

The site automatically generates URLs as:
```
/YYYY/MM/slug
```

For a post dated `2026-01-15` with slug `my-new-post`:
```
/2026/01/my-new-post
```

## Preview Functionality

The CMS includes a live preview that matches the site's design:
- Dark theme with pink accents
- Work Sans headings, Libre Baskerville body
- Responsive layout
- Same typography as the live site

## Troubleshooting

### CMS won't start

**Error**: Port 8082 already in use
**Solution**: Stop the existing process or change the port:
```bash
# Kill existing process
pkill -f "decap-server"

# Or change port in terminal
CMS_PORT=3001 bun run cms
```

### Images not loading

**Error**: 404 errors for images
**Solution**: Check that:
1. Images exist in `/public/media/`
2. Image paths in content start with `/media/`
3. Filenames are case-sensitive (common issue on macOS)

### Build fails

**Error**: Image not found during build
**Solution**:
1. Run the social images setup script:
   ```bash
   bun run setup-social-images
   ```
2. Check that hero images are copied to `/public/social-images/`
3. Verify image paths in frontmatter

### Changes not showing up

**Error**: CMS saves but changes don't appear
**Solution**:
1. Check Git status: `git status`
2. Verify changes were committed
3. If needed, commit manually: `git add . && git commit -m "message"`

### Authentication errors

**Error**: Git gateway authentication fails
**Solution**: This shouldn't happen with `local_backend: true`. If it does, check:
1. Ensure you're on `localhost:8082`
2. Check `.env` file (should not be needed for local mode)

## Migration Notes

This project was migrated from per-post `images/` directories to a global `/public/media/` folder in January 2026:

- **Original structure**: `src/content/blog/YYYY-MM-DD-slug/images/filename.jpg`
- **New structure**: `public/media/slug-filename.jpg`
- **All images prefixed with post slug** for uniqueness
- **Filename limit**: Total path ≤50 characters

### Legacy Image Support

The `setup-social-images.js` script still supports legacy `./images/` and `images/` paths for older posts that haven't been migrated yet. If you need to edit an old post, the build script will handle both formats.

## Deployment Workflow

1. Make content changes via CMS
2. Verify with dev server: `bun run dev`
3. Commit changes via Git
4. Push to GitHub: `git push origin feature/decap-cms-integration`
5. Cloudflare Pages automatically deploys

## Additional Resources

- [Decap CMS Documentation](https://decapcms.org/docs/)
- [Markdown Guide](https://www.markdownguide.org/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)

## Support

If you encounter issues not covered here:
1. Check Git status for merge conflicts
2. Verify branch is up to date: `git pull`
3. Check Decap CMS browser console for errors
