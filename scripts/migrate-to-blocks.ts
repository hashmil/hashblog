/**
 * Migration Script: Convert MDX body content to TinaCMS blocks
 *
 * This script reads all blog posts and converts the markdown body content
 * into structured TinaCMS blocks for visual editing.
 *
 * Usage: npx tsx scripts/migrate-to-blocks.ts
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

interface Block {
  _template: string;
  [key: string]: any;
}

/**
 * Parse markdown content into TinaCMS blocks
 */
function parseContentToBlocks(content: string): Block[] {
  const blocks: Block[] = [];
  const lines = content.split('\n');

  let currentParagraph: string[] = [];
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockContent: string[] = [];
  let inHtmlBlock = false;
  let htmlBlockContent: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join('\n').trim();
      if (text) {
        blocks.push({
          _template: 'content',
          body: text,
        });
      }
      currentParagraph = [];
    }
  };

  const flushCodeBlock = () => {
    if (codeBlockContent.length > 0) {
      blocks.push({
        _template: 'code',
        language: codeBlockLang || 'plaintext',
        code: codeBlockContent.join('\n'),
      });
      codeBlockContent = [];
      codeBlockLang = '';
    }
  };

  const flushHtmlBlock = () => {
    if (htmlBlockContent.length > 0) {
      const html = htmlBlockContent.join('\n').trim();

      // Check if it's a video element
      const videoMatch = html.match(/<video[^>]*>[\s\S]*?<source[^>]*src="([^"]+)"[^>]*>[\s\S]*?<\/video>/i);
      if (videoMatch) {
        const src = videoMatch[1];
        const hasAutoplay = html.includes('autoplay');
        const hasLoop = html.includes('loop');

        blocks.push({
          _template: 'video',
          type: 'local',
          url: src,
          autoplay: hasAutoplay,
          loop: hasLoop,
        });
      }
      // Check if it's a figure with image
      else if (html.includes('<figure')) {
        const imgMatch = html.match(/!\[([^\]]*)\]\(([^)]+)\)/);
        const captionMatch = html.match(/<figcaption>([^<]+)<\/figcaption>/);

        if (imgMatch) {
          blocks.push({
            _template: 'image',
            src: imgMatch[2],
            alt: imgMatch[1] || '',
            caption: captionMatch ? captionMatch[1].trim() : undefined,
          });
        }
      }
      // Otherwise treat as content block with raw HTML
      else {
        blocks.push({
          _template: 'content',
          body: html,
        });
      }

      htmlBlockContent = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        flushCodeBlock();
        inCodeBlock = false;
      } else {
        flushParagraph();
        inCodeBlock = true;
        codeBlockLang = line.slice(3).trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    // Handle HTML blocks (video, figure, etc.)
    if (line.trim().startsWith('<video') || line.trim().startsWith('<figure')) {
      flushParagraph();
      inHtmlBlock = true;
      htmlBlockContent.push(line);

      // Check if it ends on the same line
      if (line.includes('</video>') || line.includes('</figure>')) {
        flushHtmlBlock();
        inHtmlBlock = false;
      }
      continue;
    }

    if (inHtmlBlock) {
      htmlBlockContent.push(line);
      if (line.includes('</video>') || line.includes('</figure>')) {
        flushHtmlBlock();
        inHtmlBlock = false;
      }
      continue;
    }

    // Handle imports (skip them)
    if (line.startsWith('import ')) {
      continue;
    }

    // Handle horizontal rules / dividers
    if (line.trim() === '---' || line.trim() === '***' || line.trim() === '___') {
      flushParagraph();
      blocks.push({
        _template: 'divider',
        style: 'line',
      });
      continue;
    }

    // Handle images
    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushParagraph();
      blocks.push({
        _template: 'image',
        src: imageMatch[2],
        alt: imageMatch[1] || '',
      });
      continue;
    }

    // Handle blockquotes
    if (line.startsWith('> ')) {
      flushParagraph();
      const quoteLines: string[] = [line.slice(2)];

      // Collect multi-line quotes
      while (i + 1 < lines.length && lines[i + 1].startsWith('> ')) {
        i++;
        quoteLines.push(lines[i].slice(2));
      }

      blocks.push({
        _template: 'quote',
        quote: quoteLines.join('\n'),
      });
      continue;
    }

    // Handle YouTube/Vimeo URLs on their own line
    const youtubeMatch = line.trim().match(/^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11}).*$/);
    if (youtubeMatch) {
      flushParagraph();
      blocks.push({
        _template: 'video',
        type: 'youtube',
        url: line.trim(),
      });
      continue;
    }

    const vimeoMatch = line.trim().match(/^(https?:\/\/)?(www\.)?vimeo\.com\/(\d+).*$/);
    if (vimeoMatch) {
      flushParagraph();
      blocks.push({
        _template: 'video',
        type: 'vimeo',
        url: line.trim(),
      });
      continue;
    }

    // Handle LinkPreview components
    const linkPreviewMatch = line.match(/<LinkPreview\s+id="([^"]+)"\s*\/>/);
    if (linkPreviewMatch) {
      flushParagraph();
      const url = linkPreviewMatch[1];

      // Determine embed type
      let embedType = 'generic';
      if (url.includes('tiktok.com')) embedType = 'tiktok';
      else if (url.includes('twitter.com') || url.includes('x.com')) embedType = 'twitter';
      else if (url.includes('instagram.com')) embedType = 'instagram';

      blocks.push({
        _template: 'embed',
        type: embedType,
        url: url,
      });
      continue;
    }

    // Handle empty lines
    if (line.trim() === '') {
      flushParagraph();
      continue;
    }

    // Accumulate paragraph content
    currentParagraph.push(line);
  }

  // Flush any remaining content
  flushParagraph();
  flushCodeBlock();
  flushHtmlBlock();

  return blocks;
}

/**
 * Convert blocks to MDX frontmatter format
 */
function blocksToYaml(blocks: Block[]): string {
  const yamlBlocks = blocks.map(block => {
    const entries = Object.entries(block)
      .filter(([key, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => {
        if (typeof value === 'string' && (value.includes('\n') || value.includes('"') || value.includes(':'))) {
          // Use literal block scalar for multiline or complex strings
          const indented = value.split('\n').map(line => `        ${line}`).join('\n');
          return `      ${key}: |\n${indented}`;
        } else if (typeof value === 'boolean') {
          return `      ${key}: ${value}`;
        } else {
          return `      ${key}: "${String(value).replace(/"/g, '\\"')}"`;
        }
      });

    return `    - ${entries.join('\n      ').replace('    - ', '')}`;
  });

  return yamlBlocks.join('\n');
}

/**
 * Migrate a single blog post
 */
function migratePost(postDir: string): { success: boolean; error?: string } {
  const indexPath = path.join(postDir, 'index.mdx');

  if (!fs.existsSync(indexPath)) {
    return { success: false, error: 'index.mdx not found' };
  }

  try {
    const fileContent = fs.readFileSync(indexPath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    // Skip if already has blocks
    if (frontmatter.blocks && frontmatter.blocks.length > 0) {
      console.log(`  Skipping (already has blocks): ${path.basename(postDir)}`);
      return { success: true };
    }

    // Parse content to blocks
    const blocks = parseContentToBlocks(content);

    if (blocks.length === 0) {
      console.log(`  Warning: No blocks generated for ${path.basename(postDir)}`);
      return { success: true };
    }

    // Build new frontmatter with blocks
    const newFrontmatter: any = { ...frontmatter };
    newFrontmatter.blocks = blocks;

    // Generate new file content
    let newContent = '---\n';

    // Write frontmatter fields
    for (const [key, value] of Object.entries(newFrontmatter)) {
      if (key === 'blocks') continue; // Handle blocks separately

      if (key === 'tags' && Array.isArray(value)) {
        if (value.length > 0) {
          newContent += `${key}:\n${value.map(t => `  - "${t}"`).join('\n')}\n`;
        }
      } else if (value instanceof Date) {
        newContent += `${key}: ${value.toISOString().split('T')[0]}\n`;
      } else if (typeof value === 'boolean') {
        newContent += `${key}: ${value}\n`;
      } else if (typeof value === 'string') {
        if (value.includes('\n') || value.includes('"')) {
          newContent += `${key}: |\n  ${value.split('\n').join('\n  ')}\n`;
        } else {
          newContent += `${key}: "${value}"\n`;
        }
      }
    }

    // Write blocks
    newContent += `blocks:\n`;
    for (const block of blocks) {
      newContent += `  - _template: ${block._template}\n`;
      for (const [key, value] of Object.entries(block)) {
        if (key === '_template') continue;
        if (value === undefined || value === null || value === '') continue;

        if (typeof value === 'string' && value.includes('\n')) {
          newContent += `    ${key}: |\n`;
          value.split('\n').forEach(line => {
            newContent += `      ${line}\n`;
          });
        } else if (typeof value === 'boolean') {
          newContent += `    ${key}: ${value}\n`;
        } else {
          // Escape special characters
          const escaped = String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
          newContent += `    ${key}: "${escaped}"\n`;
        }
      }
    }

    newContent += '---\n';

    // Write the migrated file
    fs.writeFileSync(indexPath, newContent, 'utf-8');

    console.log(`  Migrated: ${path.basename(postDir)} (${blocks.length} blocks)`);
    return { success: true };

  } catch (error) {
    return { success: false, error: String(error) };
  }
}

/**
 * Main migration function
 */
async function main() {
  console.log('='.repeat(60));
  console.log('TinaCMS Blocks Migration');
  console.log('='.repeat(60));
  console.log('');

  // Get all blog post directories
  const dirs = fs.readdirSync(BLOG_DIR)
    .filter(name => {
      const fullPath = path.join(BLOG_DIR, name);
      return fs.statSync(fullPath).isDirectory() &&
             fs.existsSync(path.join(fullPath, 'index.mdx'));
    })
    .sort();

  console.log(`Found ${dirs.length} blog posts to migrate\n`);

  let successful = 0;
  let failed = 0;
  let skipped = 0;

  for (const dir of dirs) {
    const postDir = path.join(BLOG_DIR, dir);
    const result = migratePost(postDir);

    if (result.success) {
      successful++;
    } else {
      failed++;
      console.error(`  Failed: ${dir} - ${result.error}`);
    }
  }

  console.log('');
  console.log('='.repeat(60));
  console.log(`Migration complete!`);
  console.log(`  Successful: ${successful}`);
  console.log(`  Failed: ${failed}`);
  console.log('='.repeat(60));
}

main().catch(console.error);
