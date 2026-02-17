# Notion → Hashblog workflow

This repo can pull rough blog ideas/drafts from Hash’s Notion **Blog Posts** database and convert them into local MDX drafts.

## What it does (and does *not* do)

- ✅ List Notion items (filtered by Status)
- ✅ Preview generated MDX in the terminal
- ✅ Write generated MDX + downloaded images into `drafts/` (ignored by git)
- ❌ Does *not* commit or push anything

## Setup

1) Create/share the Notion integration with the **Blog** page (Notion UI → `…` → **Connect to**).

2) (Optional) If auto-discovery fails, set the Blog Posts data source id:

```bash
export HASHBLOG_NOTION_BLOG_POSTS_DATA_SOURCE_ID="..."
```

2) Store the API key:

```bash
mkdir -p ~/.config/notion
echo "ntn_..." > ~/.config/notion/api_key
chmod 600 ~/.config/notion/api_key
```

## Usage

From repo root:

### List ideas

```bash
node scripts/notion-blog.mjs list
node scripts/notion-blog.mjs list --status Draft
```

### Preview a post (prints MDX to stdout)

```bash
node scripts/notion-blog.mjs preview <pageId>
```

### Write a local draft (no git commit)

```bash
node scripts/notion-blog.mjs write <pageId>
# or custom location
node scripts/notion-blog.mjs write <pageId> --out drafts/notion
```

Output structure:

```
drafts/notion/YYYY-MM-DD-your-slug/
  index.mdx
  images/
```

## Suggested editorial workflow

- In Notion, keep rough ideas in **Inbox**.
- When ready to convert, move a row to **Draft**.
- Use `preview` to generate a first draft quickly.
- Iterate in chat (rewrite / tighten / add sections).
- Only once approved, copy/move into `src/content/blog/YYYY-MM-DD-slug/` and commit + push.

(We keep that last step manual on purpose.)
