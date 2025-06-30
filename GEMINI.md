### Project Overview

This is a personal blog built with [Astro](https://astro.build/), a modern static site generator. The content is written in MDX (Markdown with JSX) and the project is styled with Tailwind CSS. It also uses some Vue.js components. The site is automatically deployed to Cloudflare Pages when changes are pushed to the `main` or `cloudflare` branches.

### Key Technologies

*   **Framework**: Astro.js
*   **UI Frameworks**: Vue.js
*   **Styling**: Tailwind CSS
*   **Content**: MDX (Markdown with JSX)
*   **Deployment**: Cloudflare Pages via GitHub Actions

### Project Structure

*   `src/content/blog`: Contains all the blog posts. Each post is a directory containing an `index.mdx` file and its assets (images, videos).
*   `public/`: Contains static assets like images, fonts, and videos.
*   `astro.config.mjs`: The main Astro configuration file.
*   `package.json`: Defines project scripts and dependencies.
*   `scripts/`: Contains build-related scripts.

### Getting Started

1.  Install dependencies: `npm install`
2.  Start the development server: `npm run dev`
3.  Build the project: `npm run build`

### Build Process

The `npm run build` command executes the following steps:

1.  `npm run setup-social-images`: This script (`scripts/setup-social-images.js`) scans each blog post's frontmatter for a `heroImage` and copies it to `/public/social-images`, organized by year and post slug. This is used for social media sharing cards.
2.  `npm run setup-videos`: This script (`scripts/setup-videos.js`) finds video files within each post's directory and copies them to `/public/videos`.
3.  `astro build`: This is the standard Astro build command that generates the static site in the `dist/` directory.

### Testing

The project uses `tsx` for running tests. To run the tests, use the following command:

```bash
npm run test
```

This will execute all test files located in the `tests/` directory with the pattern `*.test.ts`.
