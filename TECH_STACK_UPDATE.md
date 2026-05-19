# Tech Stack Update - May 19, 2026

## Summary

The project has been updated to the current Astro 6 stack and moved from Cloudflare Pages deployment to Cloudflare Workers Static Assets. The production domain `hashir.blog` is now served by the `hashblog` Worker route.

## Current Runtime Model

- **Site output**: Static Astro build
- **Production host**: Cloudflare Workers Static Assets
- **Worker name**: `hashblog`
- **Production route**: `hashir.blog/*`
- **Worker preview URL**: `https://hashblog.hashirm.workers.dev`
- **Build output**: `dist`
- **Deployment command**: `wrangler deploy`

The site does not currently use TinaCMS, Cloudflare Pages Functions, server-rendered Astro routes, or the Astro Cloudflare adapter.

## Current Package Versions

### Core Framework

| Package | Current Version | Notes |
| --- | --- | --- |
| **astro** | `^6.3.5` | Static site generation |
| **typescript** | `^6.0.3` | Type checking |

### Astro Integrations

| Package | Current Version | Notes |
| --- | --- | --- |
| **@astrojs/mdx** | `^5.0.6` | MDX blog posts |
| **@astrojs/rss** | `^4.0.18` | RSS feed generation |
| **@astrojs/vue** | `^6.0.1` | Vue islands |
| **@astrojs/markdown-remark** | `^7.1.2` | Markdown pipeline support |

### Styling

| Package | Current Version | Notes |
| --- | --- | --- |
| **tailwindcss** | `^4.3.0` | Tailwind CSS v4 |
| **@tailwindcss/vite** | `^4.3.0` | Tailwind Vite integration |
| **@tailwindcss/typography** | `^0.5.19` | Prose styling |

### Content and UI

| Package | Current Version | Notes |
| --- | --- | --- |
| **vue** | `^3.5.34` | Interactive menu/search islands |
| **astro-embed** | `^0.13.0` | External media embeds |
| **fuse.js** | `^7.3.0` | Client-side search |

### Tooling

| Package | Current Version | Notes |
| --- | --- | --- |
| **wrangler** | `^4.92.0` | Cloudflare Workers deploys |
| **@astrojs/check** | `^0.9.9` | Astro diagnostics |
| **tsx** | `^4.22.2` | Node test runner TypeScript support |
| **rehype-external-links** | `^3.0.0` | External link attributes |

## Deployment Changes

### Before

- Astro server output
- `@astrojs/cloudflare` adapter
- Cloudflare Pages deployment
- `pages_build_output_dir = "dist"`

### Now

- Astro static output
- No Cloudflare adapter
- Cloudflare Workers Static Assets
- `wrangler.toml` uses:

```toml
name = "hashblog"
compatibility_date = "2026-05-19"
workers_dev = true

[assets]
directory = "./dist"
html_handling = "auto-trailing-slash"
not_found_handling = "none"

[[routes]]
pattern = "hashir.blog/*"
zone_name = "hashir.blog"
```

## CI/CD

GitHub Actions runs on pushes and pull requests:

1. `npm ci`
2. `npm run check`
3. `npm test`
4. `npm audit --audit-level=moderate`
5. `npm run build`
6. `cloudflare/wrangler-action@v4` deploys on push events

Required repository secrets:

- `CLOUDFLARE_API_TOKEN` with Workers edit/deploy permissions
- `CLOUDFLARE_ACCOUNT_ID`

## Verification Completed

- `npm run check`: 0 errors, 0 warnings, 0 hints
- `npm test`: 1/1 tests passing
- `npm audit --audit-level=moderate`: 0 vulnerabilities
- `npm run build`: 41 pages built
- GitHub Actions deploy to Workers: passing
- `https://hashir.blog/`: HTTP 200
- `https://hashir.blog/api/search.json`: HTTP 200, 39 posts

## Notes

- Normal page and asset requests are served as Workers static assets.
- The production site does not need TinaCMS on `main`; TinaCMS work remains isolated to the `feature/tinacms-exploration` branch.
- The old Cloudflare Pages project may still exist in Cloudflare, but `hashir.blog` is served by the Worker route.
- Keep `astro.config.mjs` as `output: "static"` unless server-rendered routes are intentionally introduced.

