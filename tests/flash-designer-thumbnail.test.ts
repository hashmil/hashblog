import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postDir = path.join(
  repoRoot,
  'src/content/blog/2026-07-01-figma-motion-and-the-return-of-the-flash-designer',
);
const postPath = path.join(postDir, 'index.mdx');
const expectedHeroImage = './images/figma-motion-flash-designer-thumbnail.png';

function readFrontmatter(source: string): Record<string, string> {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    assert.fail('post should have frontmatter');
  }

  const entries = match[1]
    .split('\n')
    .map((line) => line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*)$/))
    .filter((entry): entry is RegExpMatchArray => Boolean(entry))
    .map((entry) => [entry[1], entry[2].replace(/^"|"$/g, '')]);

  return Object.fromEntries(entries);
}

function readPngSize(filePath: string): { width: number; height: number } {
  const buffer = fs.readFileSync(filePath);
  assert.equal(buffer.toString('ascii', 1, 4), 'PNG', 'hero image should be a PNG');

  return {
    width: buffer.readUInt32BE(16),
    height: buffer.readUInt32BE(20),
  };
}

test('Flash Designer post uses the selected timeline thumbnail image', () => {
  const source = fs.readFileSync(postPath, 'utf8');
  const frontmatter = readFrontmatter(source);

  assert.equal(frontmatter.heroImage, expectedHeroImage);

  const imagePath = path.join(postDir, expectedHeroImage);
  assert.ok(fs.existsSync(imagePath), 'selected thumbnail file should exist');

  const { width, height } = readPngSize(imagePath);
  assert.ok(width >= 1200, 'thumbnail should be wide enough for social sharing');
  assert.ok(height >= 630, 'thumbnail should be tall enough for social sharing');
  assert.ok(width / height > 1.7 && width / height < 1.85, 'thumbnail should be close to 16:9');
});
