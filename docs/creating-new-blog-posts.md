# Creating New Blog Posts

This guide covers everything you need to know about creating and publishing new blog posts for your Astro blog.

## Quick Start

1. Create a new `.md` file in `src/content/blog/`
2. Add frontmatter at the top
3. Write your content in Markdown
4. Build and deploy

## File Structure

```
src/content/blog/
├── your-post-slug.md
├── another-post.md
└── draft-post.md

public/images/blog/
├── your-post-hero.jpg
├── inline-image.png
└── another-image.webp
```

## Creating a New Post

### 1. Create the File

Create a new file in `src/content/blog/` with a descriptive slug:

```bash
# Good examples:
2024-03-15-future-of-web-development/
2024-06-20-creative-coding-with-ai/
2024-01-15-my-thoughts-on-design/

# Avoid:
post1/
blog-post/
untitled/
```

### 2. Add Frontmatter

Every blog post must start with frontmatter (YAML between `---`):

```yaml
---
title: "Your Post Title"
description: "A compelling description that appears in previews and SEO"
pubDate: 2024-01-15
heroImage: "/images/blog/your-hero-image.jpg"
tags: ["Web Development", "AI", "Creative Coding"]
draft: false
---
```

#### Frontmatter Fields

| Field         | Required | Description                                      |
| ------------- | -------- | ------------------------------------------------ |
| `title`       | ✅       | Post title (shows in browser tab, social shares) |
| `description` | ✅       | Brief summary (160 chars max for SEO)            |
| `pubDate`     | ✅       | Publication date (YYYY-MM-DD format)             |
| `heroImage`   | ❌       | Header image path (relative to `public/`)        |
| `tags`        | ❌       | Array of tags for categorization                 |
| `draft`       | ❌       | Set to `true` to hide from production            |
| `updatedDate` | ❌       | Last modified date (YYYY-MM-DD)                  |

### 3. Write Your Content

After the frontmatter, write your post in Markdown:

```markdown
---
title: "My Amazing Post"
description: "This post will blow your mind"
pubDate: 2024-01-15
---

# My Amazing Post

This is the introduction paragraph that hooks readers.

## Section Heading

Here's some content with **bold text** and _italic text_.

### Subsection

- Bullet point one
- Bullet point two
- Bullet point three

1. Numbered list
2. Another item
3. Final item
```

## Working with Images

### Image Storage

Store all blog images in `public/images/blog/`:

```
public/
└── images/
    └── blog/
        ├── post-slug/
        │   ├── hero.jpg
        │   ├── screenshot1.png
        │   └── diagram.svg
        └── shared/
            ├── author-avatar.jpg
            └── default-hero.jpg
```

### Hero Images

Set the main post image in frontmatter:

```yaml
---
heroImage: "/images/blog/my-post/hero.jpg"
---
```

**Recommended specs:**

- **Size**: 1200x630px (optimal for social sharing)
- **Format**: JPG, PNG, or WebP
- **File size**: Under 500KB
- **Aspect ratio**: 1.91:1 (matches social media)

### Inline Images

Reference images in your content:

```markdown
![Alt text description](../../public/images/blog/my-post/screenshot.png)

<!-- Or with a caption -->

![My amazing screenshot](../../public/images/blog/my-post/screenshot.png)
_Caption: This is what the interface looks like_
```

### Image Optimization Tips

1. **Compress images** before uploading (use TinyPNG, ImageOptim)
2. **Use descriptive filenames**: `dashboard-redesign.jpg` not `img001.jpg`
3. **Add alt text** for accessibility
4. **Consider WebP format** for better compression

## Embedding Videos

### YouTube Videos

```markdown
## Check out this demo

<div class="video-container">
  <iframe 
    width="560" 
    height="315" 
    src="https://www.youtube.com/embed/VIDEO_ID" 
    title="YouTube video player" 
    frameborder="0" 
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>
```

### Vimeo Videos

```markdown
<div class="video-container">
  <iframe 
    src="https://player.vimeo.com/video/VIDEO_ID" 
    width="560" 
    height="315" 
    frameborder="0" 
    allow="autoplay; fullscreen; picture-in-picture" 
    allowfullscreen>
  </iframe>
</div>
```

### Video Styling

Add this CSS class (already included in your theme):

```markdown
<style>
.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
  margin: 2rem 0;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
</style>
```

## Advanced Markdown Features

### Code Blocks

Use triple backticks with language highlighting:

````markdown
```javascript
function greetUser(name) {
  return `Hello, ${name}!`;
}
```

```css
.my-class {
  color: #ff5682;
  font-family: "Work Sans", sans-serif;
}
```
````

### Blockquotes

```markdown
> This is a quote that will stand out from the rest of the content.
>
> It can span multiple lines and will be styled with your accent color.
```

### Links

```markdown
[Internal link](/blog/another-post)
[External link](https://example.com)
[Link with title](https://example.com "This appears on hover")
```

### Tables

```markdown
| Feature  | Status | Notes              |
| -------- | ------ | ------------------ |
| Search   | ✅     | Powered by Fuse.js |
| RSS      | ✅     | Auto-generated     |
| Comments | ❌     | Maybe later        |
```

## Drafts and Publishing

### Working with Drafts

Set `draft: true` in frontmatter to hide posts:

```yaml
---
title: "Work in Progress"
draft: true
---
```

**Draft posts:**

- Won't appear on the home page
- Won't be included in RSS feeds
- Won't be indexed by search engines
- Can still be accessed directly by URL in development

### Publishing Workflow

1. **Write your post** with `draft: true`
2. **Preview locally** with `npm run dev`
3. **Review and edit** your content
4. **Add final touches** (images, formatting)
5. **Set `draft: false`** or remove the draft field
6. **Build and deploy** with `npm run build`

## Content Guidelines

### Writing Tips

- **Hook readers early** with a compelling first paragraph
- **Use subheadings** to break up long content
- **Add personality** - this is your blog, let your voice shine
- **Include examples** and practical tips
- **End with a call-to-action** or question

### SEO Best Practices

- **Descriptive titles** (50-60 characters)
- **Meta descriptions** (150-160 characters)
- **Use headings** (H1, H2, H3) strategically
- **Internal linking** to other posts
- **Alt text** for all images

### Accessibility

- **Descriptive link text** (avoid "click here")
- **Image alt text** that describes the content
- **Good color contrast** (handled by your theme)
- **Logical heading hierarchy**

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Check for errors
npm run astro check
```

## File Naming Conventions

### Good Examples

```
advanced-css-techniques.md
my-journey-with-nextjs.md
2024-web-design-trends.md
building-accessible-components.md
```

### Avoid

```
post1.md
new-blog-post.md
untitled.md
my post with spaces.md
```

## Troubleshooting

### Common Issues

**Post not showing up?**

- Check `draft: false` in frontmatter
- Verify file is in `src/content/blog/`
- Ensure frontmatter is valid YAML

**Images not loading?**

- Check path starts with `/` (e.g., `/images/blog/...`)
- Verify file exists in `public/` directory
- Check file permissions

**Build errors?**

- Run `npm run astro check` for detailed errors
- Validate frontmatter YAML syntax
- Check for missing required fields

### Getting Help

1. Check the [Astro documentation](https://docs.astro.build)
2. Validate YAML with [YAMLlint](https://www.yamllint.com/)
3. Test markdown with [StackEdit](https://stackedit.io/)

---

## Quick Reference

### New Post Template

Copy this template for new posts:

```yaml
---
title: "Your Post Title Here"
description: "A compelling description for SEO and social sharing"
pubDate: 2024-01-15
heroImage: "/images/blog/post-slug/hero.jpg"
tags: ["Tag1", "Tag2", "Tag3"]
draft: false
---

# Your Post Title Here

Introduction paragraph that hooks the reader and explains what they'll learn.

## Main Section

Your content goes here with proper markdown formatting.

### Subsection

More detailed content with examples.

## Conclusion

Wrap up your thoughts and include a call to action.

*What are your thoughts on this topic? Let me know on [Twitter](https://twitter.com/hashir)!*
```

Happy blogging! 🚀
