# Creating New Blog Posts

This guide covers everything you need to know about creating and publishing new blog posts for your Astro blog.

## Quick Start

1. Create a new date-prefixed directory in `src/content/blog/`
2. Create an `index.mdx` file inside the directory
3. Add frontmatter at the top
4. Write your content in MDX (Markdown with components)
5. Build and deploy

## File Structure

```
src/content/blog/
├── YYYY-MM-DD-post-title/
│   ├── index.mdx           # Post content (MDX for embeds)
│   ├── images/             # Post-specific images
│   │   ├── hero.jpg
│   │   ├── screenshot.png
│   │   └── diagram.svg
│   └── videos/             # Post-specific videos
│       ├── demo.mp4
│       └── prototype.webm
├── 2024-05-13-another-post/
│   ├── index.mdx
│   └── images/
│       └── cover.jpg
└── 2021-02-16-draft-post/
    ├── index.mdx
    └── videos/
        └── example.mp4
```

## Creating a New Post

### 1. Create the Directory Structure

Create a new date-prefixed directory in `src/content/blog/` with a descriptive title:

```bash
# Create the directory
mkdir "src/content/blog/YYYY-MM-DD-descriptive-title"
cd "src/content/blog/YYYY-MM-DD-descriptive-title"

# Create subdirectories for assets
mkdir images videos

# Create the main content file
touch index.mdx
```

**Good directory examples:**

```bash
2024-03-15-future-of-web-development/
2024-06-20-creative-coding-with-ai/
2024-01-15-my-thoughts-on-design/
2021-02-16-can-an-app-make-you-be-kinder/
```

**Avoid:**

```bash
post1/
blog-post/
untitled/
my post with spaces/
```

### 2. Add Frontmatter

Every blog post must start with frontmatter (YAML between `---`) in your `index.mdx` file:

```yaml
---
title: "Your Post Title"
description: "A compelling description that appears in previews and SEO"
pubDate: 2024-01-15
heroImage: "./images/hero.jpg"
tags: ["Web Development", "AI", "Creative Coding"]
slug: "your-post-slug"
draft: false
---
```

#### Frontmatter Fields

| Field         | Required | Description                                      |
| ------------- | -------- | ------------------------------------------------ |
| `title`       | ✅       | Post title (shows in browser tab, social shares) |
| `description` | ✅       | Brief summary (160 chars max for SEO)            |
| `pubDate`     | ✅       | Publication date (YYYY-MM-DD format)             |
| `slug`        | ✅       | URL slug (determines post URL)                   |
| `heroImage`   | ❌       | Header image path (relative to post directory)   |
| `tags`        | ❌       | Array of tags for categorization                 |
| `draft`       | ❌       | Set to `true` to hide from production            |
| `updatedDate` | ❌       | Last modified date (YYYY-MM-DD)                  |

### 3. Write Your Content

After the frontmatter, write your post in MDX (Markdown with component support):

```markdown
---
title: "My Amazing Post"
description: "This post will blow your mind"
pubDate: 2024-01-15
slug: "my-amazing-post"
---

import myVideo from "./videos/demo.mp4";

# My Amazing Post

This is the introduction paragraph that hooks readers.

## Section Heading

Here's some content with **bold text** and _italic text_.

<video
src={myVideo}
controls
style="width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;"

> Your browser does not support the video tag.
> </video>

### Subsection

- Bullet point one
- Bullet point two
- Bullet point three

1. Numbered list
2. Another item
3. Final item
```

**Key differences with MDX:**

- You can import assets (images, videos) at the top
- You can use HTML elements with React-style attributes
- You can embed components directly in your content

## Working with Images

### Image Storage

Store all blog images in the `images/` directory within each post folder:

```
src/content/blog/
└── YYYY-MM-DD-post-title/
    ├── index.mdx
    └── images/
        ├── hero.jpg            # Hero/cover image
        ├── screenshot1.png     # Inline images
        ├── diagram.svg         # Diagrams/illustrations
        └── gallery/            # Optional subdirectory
            ├── photo1.jpg
            └── photo2.jpg
```

**Benefits of this approach:**

- ✅ **Organized**: All post assets stay with the post
- ✅ **Portable**: Easy to move or archive entire posts
- ✅ **No conflicts**: Each post has its own namespace
- ✅ **Automatic optimization**: Astro processes these images

### Hero Images

Set the main post image in frontmatter using a relative path:

```yaml
---
heroImage: "./images/hero.jpg"
---
```

**Recommended specs:**

- **Size**: 1200x630px (optimal for social sharing)
- **Format**: JPG, PNG, or WebP
- **File size**: Under 500KB
- **Aspect ratio**: 1.91:1 (matches social media)

### Inline Images

Reference images in your content using relative paths:

```markdown
![Alt text description](./images/screenshot.png)

<!-- Or with a caption -->

![My amazing screenshot](./images/screenshot.png)
_Caption: This is what the interface looks like_

<!-- For more complex layouts, you can use HTML -->
<figure>
  <img src="./images/diagram.svg" alt="System architecture diagram" />
  <figcaption>
    Figure 1: How the system components interact
  </figcaption>
</figure>
```

### Image Optimization Tips

1. **Compress images** before uploading (use TinyPNG, ImageOptim)
2. **Use descriptive filenames**: `dashboard-redesign.jpg` not `img001.jpg`
3. **Add alt text** for accessibility
4. **Consider WebP format** for better compression

## Working with Videos

### Local Videos

For videos stored locally, we use an organized public folder approach that ensures reliable loading across all deployment platforms:

#### 1. Store Videos in Public Folder

Create an organized directory structure in the public folder that mirrors your blog post structure:

```
public/
└── videos/
    ├── YYYY-MM-DD-post-title-1/
    │   ├── demo.mp4
    │   ├── prototype.webm
    │   └── tutorial.mov
    ├── YYYY-MM-DD-post-title-2/
    │   └── feature-demo.mp4
    └── ...
```

**Example for a specific post:**

```
public/
└── videos/
    └── 2025-06-12-apple-liquid-glass-ui-thoughts/
        └── liquidglass.mp4
```

#### 2. Reference Videos Directly

Use direct path references in your video elements (no imports needed):

```markdown
---
title: "My Video Post"
description: "A post with local videos"
pubDate: 2024-01-15
slug: "my-video-post"
---

# My Video Post

Here's a demo of the feature in action:

<video
  src="/videos/2024-01-15-my-video-post/demo.mp4"
  controls
  style="width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;">
Your browser does not support the video tag.
</video>

And here's an autoplay background video:

<video
  src="/videos/2024-01-15-my-video-post/prototype.webm"
  autoplay
  loop
  muted
  playsinline
  style="width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;">
Your browser does not support the video tag.
</video>
```

#### 3. Video Attributes for Different Use Cases

**Interactive Content (User Controls)**

```jsx
<video src="/videos/YYYY-MM-DD-post-slug/video.mp4" controls>
  Your browser does not support the video tag.
</video>
```

**Background/Demo Videos (Auto-playing)**

```jsx
<video
  src="/videos/YYYY-MM-DD-post-slug/video.mp4"
  autoplay
  loop
  muted
  playsinline>
  Your browser does not support the video tag.
</video>
```

**Audio Narration (With Sound)**

```jsx
<video
  src="/videos/YYYY-MM-DD-post-slug/video.mp4"
  controls
  style="width: 100%; height: auto;">
  Your browser does not support the video tag.
</video>
```

**Single Playthrough**

```jsx
<video src="/videos/YYYY-MM-DD-post-slug/video.mp4" controls preload="metadata">
  Your browser does not support the video tag.
</video>
```

### External Video Embedding

For videos hosted on external platforms, use the embed components:

#### YouTube Videos

```markdown
import { YouTube } from "@astro-community/astro-embed-youtube";

## Check out this demo

<YouTube id="VIDEO_ID" />

<!-- Or with custom poster -->
<YouTube id="VIDEO_ID" poster="https://example.com/poster.jpg" />
```

#### Vimeo Videos

```markdown
import { Vimeo } from "@astro-community/astro-embed-vimeo";

<Vimeo id="https://vimeo.com/VIDEO_ID" />
```

#### TikTok Videos

```markdown
import { LinkPreview } from "@astro-community/astro-embed-link-preview";

<LinkPreview id="https://www.tiktok.com/@username/video/VIDEO_ID" />
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

## Directory Naming Conventions

### Good Examples

```
2024-03-15-advanced-css-techniques/
2024-06-20-my-journey-with-nextjs/
2024-01-10-web-design-trends/
2021-02-16-can-an-app-make-you-be-kinder/
2023-07-08-animating-superheroes-with-ai-deforum/
```

### Avoid

```
post1/
new-blog-post/
untitled/
my post with spaces/
2024-3-5-bad-date-format/  # Use zero-padding: 2024-03-05
```

**Directory naming rules:**

- Always start with `YYYY-MM-DD-` format
- Use lowercase letters and hyphens
- Be descriptive but concise
- No spaces or special characters

## Troubleshooting

### Common Issues

**Post not showing up?**

- Check `draft: false` in frontmatter
- Verify directory is in `src/content/blog/` with proper date format
- Ensure `index.mdx` exists in the post directory
- Verify frontmatter is valid YAML
- Check that `slug` field is present and unique

**Images not loading?**

- Check path is relative: `./images/filename.jpg` (not `/images/...`)
- Verify file exists in post's `images/` directory
- Check file permissions and filename spelling
- Ensure image file extensions are lowercase

**Videos not loading?**

- Check video is imported at top of MDX file
- Verify file exists in post's `videos/` directory
- Ensure video is used with `{variableName}` syntax in JSX
- Check video file format is supported (mp4, webm, mov)

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

Copy this template for new posts (`index.mdx`):

```yaml
---
title: "Your Post Title Here"
description: "A compelling description for SEO and social sharing"
pubDate: 2024-01-15
heroImage: "./images/hero.jpg"
tags: ["Tag1", "Tag2", "Tag3"]
slug: "your-post-slug"
draft: false
---

# Your Post Title Here

Introduction paragraph that hooks the reader and explains what they'll learn.

## Main Section

Your content goes here with proper MDX formatting.

![Screenshot](./images/screenshot.png)
_Caption: This shows the interface in action_

<video
  src="/videos/2024-01-15-your-post-slug/demo.mp4"
  controls
  style="width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;">
  Your browser does not support the video tag.
</video>

### Subsection

More detailed content with examples.

## Conclusion

Wrap up your thoughts and include a call to action.

**URL**: This post will be available at `/YYYY/MM/your-post-slug`

*What are your thoughts on this topic? Let me know on [Twitter](https://twitter.com/hashir)!*
```

Happy blogging! 🚀
