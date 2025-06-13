# Social Images Setup

This document explains how the social sharing images are organized and managed for the blog.

## Overview

The blog uses a hybrid approach for social sharing images:

- **Static images** in `public/social-images/` for reliable social media sharing
- **Astro-optimized images** for the actual blog content display

## Directory Structure

```
public/social-images/
├── 2021/
│   ├── how-to-set-up-an-easy-minimalist-blog/
│   │   └── hero.jpg
│   ├── 2x-speed-listening-has-changed-my-life/
│   │   └── hero.jpg
│   └── ...
├── 2023/
│   ├── animating-superheroes-with-ai-deforum/
│   │   └── hero.jpg
│   └── ...
├── 2024/
└── 2025/
    ├── moving-to-dubai-what-ive-learnt-so-far/
    │   └── hero.png
    └── ...
```

## How It Works

1. **Blog posts** define hero images in frontmatter: `heroImage: "./images/hero.png"`
2. **Astro optimizes** these images for display in the blog content
3. **Static copies** are created in `public/social-images/{year}/{slug}/hero.{ext}` for social sharing
4. **Meta tags** use the static image URLs to ensure reliability

## Setup Script

### Automatic Setup

The social images are automatically set up every time you build:

```bash
npm run build
```

This will automatically run the setup script before building, ensuring your social images are always up-to-date.

You can also run the setup script manually:

```bash
npm run setup-social-images
```

This script will:

- ✅ Find all blog posts with hero images
- ✅ Copy images to organized directory structure
- ✅ Preserve original file extensions
- ✅ Create year-based organization
- ✅ Use clean slug-based naming

### Manual Setup

If you need to add a single post's social image:

1. Copy the hero image to: `public/social-images/{year}/{slug}/hero.{ext}`
2. Ensure the filename matches the original extension
3. The blog template will automatically use it for social sharing

## Template Logic

The blog post template (`src/pages/[year]/[month]/[slug].astro`) automatically:

1. **Extracts** year and slug from the URL parameters
2. **Determines** the file extension from the original hero image
3. **Generates** the social image URL: `/social-images/{year}/{slug}/hero.{ext}`
4. **Creates** Open Graph and Twitter meta tags with the static URL

## Benefits

- ✅ **Reliable social sharing** - Static images never return 404s
- ✅ **Organized structure** - Easy to find and manage images
- ✅ **Automatic generation** - No manual work for existing posts
- ✅ **Future-proof** - New posts automatically work with the system
- ✅ **Performance** - Astro still optimizes images for blog content

## Troubleshooting

### Social image not showing on LinkedIn/Facebook

1. **Check the image URL** - Visit the social image URL directly in browser
2. **Verify file exists** - Ensure the file is in the correct directory
3. **Test with social debuggers**:
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### Re-running the setup

If you add new blog posts or modify hero images:

```bash
npm run setup-social-images
```

The script is safe to run multiple times and will overwrite existing files.

## File Naming Convention

- **Directory**: `{year}/{slug}/`
- **Filename**: `hero.{original-extension}`
- **Year**: Extracted from blog post directory name (e.g., `2025-06-13-...` → `2025`)
- **Slug**: Extracted from blog post directory name (e.g., `2025-06-13-moving-to-dubai...` → `moving-to-dubai-what-ive-learnt-so-far`)
