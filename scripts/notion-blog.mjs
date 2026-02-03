#!/usr/bin/env node
/**
 * Notion → MDX helper for Hashblog.
 *
 * Workflow intent:
 * - Hash keeps rough ideas/drafts in Notion (Blog Posts database)
 * - We can list candidates, preview generated MDX, and (optionally) write files into drafts/
 * - Nothing is committed by this script.
 *
 * Usage:
 *   node scripts/notion-blog.mjs list [--status Inbox|Draft|Complete|Published]
 *   node scripts/notion-blog.mjs preview <pageId>
 *   node scripts/notion-blog.mjs write <pageId> [--out drafts/notion]
 */

import fs from "node:fs";
import path from "node:path";

const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2025-09-03";

// The data source id is intentionally *not* hardcoded (this repo is public).
// Set HASHBLOG_NOTION_BLOG_POSTS_DATA_SOURCE_ID to skip auto-discovery.
let _cachedBlogPostsDataSourceId = null;

async function getBlogPostsDataSourceId() {
  if (_cachedBlogPostsDataSourceId) return _cachedBlogPostsDataSourceId;
  if (process.env.HASHBLOG_NOTION_BLOG_POSTS_DATA_SOURCE_ID) {
    _cachedBlogPostsDataSourceId = process.env.HASHBLOG_NOTION_BLOG_POSTS_DATA_SOURCE_ID;
    return _cachedBlogPostsDataSourceId;
  }

  // Auto-discover via search.
  const data = await notionFetch(`/search`, {
    method: "POST",
    body: JSON.stringify({ query: "Blog Posts", page_size: 10 }),
  });

  const hit = (data.results || []).find((r) => {
    if (r.object !== "data_source") return false;
    const title = (r.title || []).map((t) => t.plain_text || "").join("").trim();
    return title.toLowerCase() === "blog posts";
  });

  if (!hit) {
    throw new Error(
      "Could not find Notion data source named 'Blog Posts'. Set HASHBLOG_NOTION_BLOG_POSTS_DATA_SOURCE_ID or rename your database."
    );
  }

  _cachedBlogPostsDataSourceId = hit.id;
  return _cachedBlogPostsDataSourceId;
}

function readNotionKey() {
  const p = path.join(process.env.HOME || "/home/clawdbot", ".config/notion/api_key");
  if (process.env.NOTION_API_KEY) return process.env.NOTION_API_KEY;
  if (fs.existsSync(p)) return fs.readFileSync(p, "utf8").trim();
  throw new Error(
    `No Notion API key found. Set NOTION_API_KEY or create ${p} with the integration token.`
  );
}

async function notionFetch(route, opts = {}) {
  const key = readNotionKey();
  const res = await fetch(`${NOTION_API_BASE}${route}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${key}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Notion API ${res.status} ${res.statusText}: ${body.slice(0, 500)}`);
  }
  return res.json();
}

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function pickTitle(page) {
  const props = page.properties || {};
  for (const k of Object.keys(props)) {
    const v = props[k];
    if (v?.type === "title") {
      return (v.title || []).map((t) => t.plain_text || "").join("").trim();
    }
  }
  return "Untitled";
}

function pickTags(page) {
  const props = page.properties || {};
  const tagsProp = props["Tags"];
  if (!tagsProp || tagsProp.type !== "multi_select") return [];
  return (tagsProp.multi_select || []).map((t) => t.name).filter(Boolean);
}

function pickStatus(page) {
  const props = page.properties || {};
  const s = props["Status"];
  if (!s || s.type !== "status") return null;
  return s.status?.name || null;
}

function mdEscape(text) {
  return text.replace(/\|/g, "\\|");
}

function richTextToMarkdown(rich = []) {
  return rich
    .map((rt) => {
      const text = rt.plain_text ?? "";
      const href = rt.href;
      const a = rt.annotations || {};

      let out = text;

      // Inline code first (avoid wrapping backticks inside other wrappers)
      if (a.code) out = `\`${out.replace(/`/g, "\\`")}\``;

      if (a.bold) out = `**${out}**`;
      if (a.italic) out = `*${out}*`;
      if (a.strikethrough) out = `~~${out}~~`;
      if (a.underline) out = `<u>${out}</u>`;

      if (href) out = `[${out}](${href})`;
      return out;
    })
    .join("")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();
}

async function getAllBlockChildren(blockId) {
  const out = [];
  let cursor = undefined;
  while (true) {
    const qs = new URLSearchParams({ page_size: "100" });
    if (cursor) qs.set("start_cursor", cursor);

    const data = await notionFetch(`/blocks/${blockId}/children?${qs.toString()}`, {
      method: "GET",
    });

    out.push(...(data.results || []));
    if (!data.has_more) break;
    cursor = data.next_cursor;
  }
  return out;
}

async function blockToMarkdown(block, assets) {
  const t = block.type;

  // Some blocks can have children.
  const hasChildren = !!block.has_children;
  const children = hasChildren ? await getAllBlockChildren(block.id) : [];

  const childMd = [];
  for (const c of children) childMd.push(await blockToMarkdown(c, assets));

  const childText = childMd.filter(Boolean).join("\n");

  const mk = (s) => (s ? s.trimEnd() : "");

  switch (t) {
    case "paragraph": {
      const txt = richTextToMarkdown(block.paragraph?.rich_text || []);
      // Keep blank lines for spacing.
      return mk([txt, childText].filter(Boolean).join("\n"));
    }
    case "heading_1": {
      const txt = richTextToMarkdown(block.heading_1?.rich_text || []);
      return mk([`# ${txt}`, childText].filter(Boolean).join("\n"));
    }
    case "heading_2": {
      const txt = richTextToMarkdown(block.heading_2?.rich_text || []);
      return mk([`## ${txt}`, childText].filter(Boolean).join("\n"));
    }
    case "heading_3": {
      const txt = richTextToMarkdown(block.heading_3?.rich_text || []);
      return mk([`### ${txt}`, childText].filter(Boolean).join("\n"));
    }
    case "bulleted_list_item": {
      const txt = richTextToMarkdown(block.bulleted_list_item?.rich_text || []);
      return mk([`- ${txt}`, childText].filter(Boolean).join("\n"));
    }
    case "numbered_list_item": {
      const txt = richTextToMarkdown(block.numbered_list_item?.rich_text || []);
      // Notion doesn't expose the index; "1." is fine in Markdown.
      return mk([`1. ${txt}`, childText].filter(Boolean).join("\n"));
    }
    case "to_do": {
      const txt = richTextToMarkdown(block.to_do?.rich_text || []);
      const checked = !!block.to_do?.checked;
      return mk([`- [${checked ? "x" : " "}] ${txt}`, childText].filter(Boolean).join("\n"));
    }
    case "quote": {
      const txt = richTextToMarkdown(block.quote?.rich_text || []);
      return mk([`> ${txt}`, childText].filter(Boolean).join("\n"));
    }
    case "code": {
      const txt = (block.code?.rich_text || []).map((r) => r.plain_text || "").join("");
      const lang = block.code?.language || "";
      return mk([`\n\n\`\`\`${lang}`.trimEnd(), txt, "```", childText].filter(Boolean).join("\n"));
    }
    case "divider": {
      return mk(["---", childText].filter(Boolean).join("\n"));
    }
    case "image": {
      const img = block.image;
      const url = img?.type === "file" ? img.file?.url : img?.external?.url;
      if (!url) return mk(childText);

      const ext = (url.split("?")[0].split(".").pop() || "png").slice(0, 5);
      const fileName = `notion-${block.id.replace(/-/g, "").slice(0, 12)}.${ext}`;
      assets.images.push({ url, fileName });
      return mk([`![](./images/${fileName})`, childText].filter(Boolean).join("\n"));
    }
    case "bookmark": {
      const url = block.bookmark?.url;
      return mk([url ? `<${url}>` : "", childText].filter(Boolean).join("\n"));
    }
    case "callout": {
      const txt = richTextToMarkdown(block.callout?.rich_text || []);
      return mk([`> ${txt}`, childText].filter(Boolean).join("\n"));
    }
    case "toggle": {
      const txt = richTextToMarkdown(block.toggle?.rich_text || []);
      // Use <details> in MDX-friendly way.
      return mk([
        `<details>`,
        `<summary>${mdEscape(txt)}</summary>`,
        childText,
        `</details>`,
      ].filter(Boolean).join("\n"));
    }

    // Skip Notion database/page containers.
    case "child_database":
    case "child_page":
      return "";

    default:
      // Fallback: try to render something minimal
      return mk(childText);
  }
}

async function exportPost(pageId) {
  const page = await notionFetch(`/pages/${pageId}`, { method: "GET" });
  const title = pickTitle(page);
  const tags = pickTags(page);
  const status = pickStatus(page);

  const created = page.created_time || new Date().toISOString();
  const pubDate = created.slice(0, 10);

  const blocks = await getAllBlockChildren(pageId);

  const assets = { images: [] };
  const parts = [];
  for (const b of blocks) parts.push(await blockToMarkdown(b, assets));

  const body = parts
    .filter((x) => x !== null && x !== undefined)
    .join("\n\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Simple description: first paragraph-ish sentence.
  const firstLine = body
    .split("\n")
    .map((l) => l.trim())
    .find((l) => l && !l.startsWith("#") && !l.startsWith("-") && !l.startsWith(">"));
  const description = (firstLine || title).replace(/\s+/g, " ").slice(0, 170);

  const slug = `${pubDate}-${slugify(title || "post")}`;

  // Optional hero image: use Notion cover if present.
  let heroImageFile = null;
  const cover = page.cover;
  const coverUrl = cover?.type === "file" ? cover.file?.url : cover?.external?.url;
  if (coverUrl) {
    const ext = (coverUrl.split("?")[0].split(".").pop() || "png").slice(0, 5);
    heroImageFile = `hero.${ext}`;
    assets.images.unshift({ url: coverUrl, fileName: heroImageFile });
  }

  const frontmatterLines = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description)}`,
    `pubDate: ${pubDate}`,
    heroImageFile ? `heroImage: "./images/${heroImageFile}"` : null,
    tags.length ? `tags: ${JSON.stringify(tags)}` : `tags: []`,
    // Always default exported pages to draft=true (you can flip later)
    `draft: true`,
    "---",
    "",
  ].filter(Boolean);

  const mdx = `${frontmatterLines.join("\n")}\n${body}\n`;

  return { page, title, tags, status, pubDate, slug, description, mdx, assets };
}

async function downloadAsset(url, outPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download asset ${res.status} ${res.statusText}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, buf);
}

async function cmdList(args) {
  const statusFilter = (args[0] === "--status" ? args[1] : null) || null;

  const body = {
    page_size: 100,
    sorts: [{ property: "Date", direction: "descending" }],
  };

  if (statusFilter) {
    body.filter = { property: "Status", status: { equals: statusFilter } };
  }

  const dsId = await getBlogPostsDataSourceId();
  const data = await notionFetch(`/data_sources/${dsId}/query`, {
    method: "POST",
    body: JSON.stringify(body),
  });

  const rows = (data.results || []).map((p) => {
    const title = pickTitle(p);
    const status = pickStatus(p) || "";
    const created = p.created_time?.slice(0, 10) || "";
    const tags = pickTags(p);
    return { id: p.id, created, status, title, tags };
  });

  // Output: compact, grep-friendly.
  for (const r of rows) {
    const tags = r.tags.length ? ` [${r.tags.join(", ")}]` : "";
    process.stdout.write(`${r.created} • ${r.status.padEnd(9)} • ${r.id} • ${r.title}${tags}\n`);
  }
}

async function cmdPreview(pageId) {
  const exp = await exportPost(pageId);
  process.stdout.write(exp.mdx);
}

async function cmdWrite(pageId, args) {
  const outIdx = args.indexOf("--out");
  const outBase = outIdx >= 0 ? args[outIdx + 1] : "drafts/notion";

  const exp = await exportPost(pageId);

  const outDir = path.resolve(process.cwd(), outBase, exp.slug);
  const outFile = path.join(outDir, "index.mdx");
  const imgDir = path.join(outDir, "images");

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, exp.mdx, "utf8");

  for (const img of exp.assets.images) {
    const p = path.join(imgDir, img.fileName);
    await downloadAsset(img.url, p);
  }

  process.stdout.write(`Wrote ${outFile}\n`);
  if (exp.assets.images.length) process.stdout.write(`Downloaded ${exp.assets.images.length} image(s) into ${imgDir}/\n`);
}

function usage() {
  return `Notion → MDX (Hashblog)\n\n` +
    `Commands:\n` +
    `  list [--status Inbox|Draft|Complete|Published]\n` +
    `  preview <pageId>\n` +
    `  write <pageId> [--out drafts/notion]\n`;
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  if (!cmd || cmd === "-h" || cmd === "--help") {
    process.stdout.write(usage());
    process.exit(0);
  }

  if (cmd === "list") return cmdList(rest);
  if (cmd === "preview") {
    const pageId = rest[0];
    if (!pageId) throw new Error("Missing pageId");
    return cmdPreview(pageId);
  }
  if (cmd === "write") {
    const pageId = rest[0];
    if (!pageId) throw new Error("Missing pageId");
    return cmdWrite(pageId, rest.slice(1));
  }

  throw new Error(`Unknown command: ${cmd}\n\n${usage()}`);
}

// Avoid noisy crashes when piping output (e.g., `... | head`).
process.stdout.on("error", (err) => {
  if (err && err.code === "EPIPE") process.exit(0);
});

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});
