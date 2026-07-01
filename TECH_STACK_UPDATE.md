# Tech Stack Update - July 1, 2026

## Summary

The project runs on Astro 7 and deploys through Cloudflare Workers Static Assets. The production domain `hashir.blog` is served by the `hashblog` Worker route.

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
| **astro** | `^7.0.4` | Static site generation |
| **typescript** | `^6.0.3` | Type checking |

### Astro Integrations

| Package | Current Version | Notes |
| --- | --- | --- |
| **@astrojs/mdx** | `^7.0.0` | MDX blog posts |
| **@astrojs/rss** | `^4.0.18` | RSS feed generation |
| **@astrojs/vue** | `^7.0.0` | Vue islands |
| **@astrojs/markdown-remark** | `^7.2.0` | Unified Markdown/MDX processor support |

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
| **@astro-community/astro-embed-youtube** | `^0.5.10` | YouTube embeds |
| **@astro-community/astro-embed-vimeo** | `^0.3.12` | Vimeo embeds |
| **@astro-community/astro-embed-link-preview** | `^0.3.1` | Link preview embeds |
| **fuse.js** | `^7.3.0` | Client-side search |

### Tooling

| Package | Current Version | Notes |
| --- | --- | --- |
| **wrangler** | `^4.106.0` | Cloudflare Workers deploys |
| **@astrojs/check** | `^0.9.9` | Astro diagnostics |
| **tsx** | `^4.22.2` | Node test runner TypeScript support |
| **rehype-external-links** | `^3.0.0` | External link attributes |
| **@types/node** | `^25.0.3` | Node test and script types |

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

The workflow uses Node 22. Local clean-room validation should use `npm ci` before the same check/test/audit/build sequence.

Required repository secrets:

- `CLOUDFLARE_API_TOKEN` with Workers edit/deploy permissions
- `CLOUDFLARE_ACCOUNT_ID`

## Verification Completed

- `npm run check`: 0 errors, 0 warnings, 0 hints
- `npm test`: 2/2 tests passing
- `npm audit --audit-level=moderate`: 0 vulnerabilities
- `npm run build`: 42 pages built
- `npx wrangler deploy --dry-run`: passed
- GitHub Actions deploy to Workers: passing
- `https://hashir.blog/`: HTTP 200
- `https://hashir.blog/api/search.json`: HTTP 200
- Latest deployed Worker version checked during the July 1, 2026 deploy: `51a410cc-e96a-45ca-a1ca-ecca612fa0c2`

## Notes

- Normal page and asset requests are served as Workers static assets.
- The production site does not need TinaCMS on `main`; TinaCMS work remains isolated to the `feature/tinacms-exploration` branch.
- The old Cloudflare Pages project may still exist in Cloudflare, but `hashir.blog` is served by the Worker route.
- Keep `astro.config.mjs` as `output: "static"` unless server-rendered routes are intentionally introduced.
