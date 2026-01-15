#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, '..');
const blogDir = path.join(projectRoot, 'src/content/blog');
const publicDir = path.join(projectRoot, 'public');
const mediaDir = path.join(publicDir, 'media');

// Create media directory if it doesn't exist
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
  console.log('📁 Created media directory');
}

// Function to extract post slug from directory name
function getPostSlug(dirName) {
  const match = dirName.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
  return match ? match[1] : dirName;
}

// Function to truncate filename to keep total path under 50 chars
function truncateFilename(slug, originalName) {
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);
  const prefix = `${slug}-`;
  
  // Calculate max filename length (50 total chars - /media/ prefix)
  const maxFilenameLength = 50 - prefix.length - ext.length;
  
  if (prefix.length + nameWithoutExt.length + ext.length > 50) {
    const truncatedName = nameWithoutExt.substring(0, maxFilenameLength);
    return `${prefix}${truncatedName}${ext}`;
  }
  
  return `${prefix}${nameWithoutExt}${ext}`;
}

// Function to extract hero image from frontmatter
function extractHeroImage(content) {
  const heroImageMatch = content.match(/heroImage:\s*["'](.+?)["']/);
  return heroImageMatch ? heroImageMatch[1] : null;
}

// Function to migrate a single post
function migratePost(postDir) {
  const postPath = path.join(blogDir, postDir);
  const indexPath = path.join(postPath, 'index.mdx');
  const imagesDir = path.join(postPath, 'images');
  
  if (!fs.existsSync(indexPath)) {
    console.log(`⚠️  Skipping ${postDir} - no index.mdx found`);
    return { postDir, success: false, reason: 'No index.mdx' };
  }
  
  // Read MDX content
  let content = fs.readFileSync(indexPath, 'utf8');
  const originalContent = content;
  
  // Get post slug
  const slug = getPostSlug(postDir);
  
  // Find and process hero image
  const heroImagePath = extractHeroImage(content);
  let heroImageChanges = [];
  
  if (heroImagePath) {
    // Determine actual image path
    let actualImagePath;
    if (heroImagePath.startsWith('./')) {
      actualImagePath = path.join(postPath, heroImagePath.replace('./', ''));
    } else if (heroImagePath.startsWith('images/')) {
      actualImagePath = path.join(postPath, heroImagePath);
    } else {
      actualImagePath = path.join(postPath, heroImagePath);
    }
    
    if (fs.existsSync(actualImagePath)) {
      // Generate new filename with slug prefix
      const originalName = path.basename(actualImagePath);
      const newName = truncateFilename(slug, originalName);
      const newPath = path.join(mediaDir, newName);
      
      // Copy image to media folder
      fs.copyFileSync(actualImagePath, newPath);
      
      // Update frontmatter
      content = content.replace(
        /heroImage:\s*["'](.+?)["']/,
        `heroImage: "/media/${newName}"`
      );
      
      heroImageChanges.push({
        old: heroImagePath,
        new: `/media/${newName}`
      });
    }
  }
  
  // Process content images - find all image references to ./images/ or images/
  const imageRegex = /!\[([^\]]*)\]\((\.\/)?images\/([^)]+)\)/g;
  let contentImageChanges = [];
  let match;

  // First pass: collect all images to migrate
  const imagesToMigrate = [];
  while ((match = imageRegex.exec(originalContent)) !== null) {
    const altText = match[1];
    const imageName = match[3]; // The filename after images/
    const imagePath = path.join(imagesDir, imageName);

    if (fs.existsSync(imagePath)) {
      const newName = truncateFilename(slug, imageName);
      const newMediaPath = path.join(mediaDir, newName);

      // Copy image to media folder
      if (!fs.existsSync(newMediaPath)) {
        fs.copyFileSync(imagePath, newMediaPath);
      }

      imagesToMigrate.push({
        oldPattern: match[0],
        newMarkdown: `![${altText}](/media/${newName})`,
        oldName: imageName,
        newName: newName
      });

      contentImageChanges.push({
        old: imageName,
        new: `/media/${newName}`
      });
    }
  }

  // Second pass: replace all image references
  for (const img of imagesToMigrate) {
    content = content.replace(img.oldPattern, img.newMarkdown);
  }
  
  // Write updated content back
  if (content !== originalContent) {
    fs.writeFileSync(indexPath, content, 'utf8');
    
    return {
      postDir,
      slug,
      heroImageChanges,
      contentImageChanges,
      success: true
    };
  } else {
    return { postDir, success: false, reason: 'No changes needed' };
  }
}

// Main execution
console.log('🧪 Running FULL migration...\n');

// Get all post directories
const blogPosts = fs
  .readdirSync(blogDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .sort();

console.log(`📋 Found ${blogPosts.length} blog posts\n`);

// Migrate all posts
const results = blogPosts.map(migratePost);

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 MIGRATION SUMMARY');
console.log('='.repeat(60));

const successfulMigrations = results.filter(r => r.success);
const failedMigrations = results.filter(r => !r.success);

console.log(`✅ Successfully migrated: ${successfulMigrations.length} posts`);
console.log(`⚠️  Skipped/No changes: ${failedMigrations.length} posts`);

if (successfulMigrations.length > 0) {
  let totalHeroImages = 0;
  let totalContentImages = 0;
  
  successfulMigrations.forEach(result => {
    totalHeroImages += result.heroImageChanges.length;
    totalContentImages += result.contentImageChanges.length;
  });
  
  console.log(`\n  Hero images copied: ${totalHeroImages}`);
  console.log(`  Content images copied: ${totalContentImages}`);
}

if (failedMigrations.length > 0) {
  console.log('\n⚠️  Failed migrations:');
  failedMigrations.forEach(result => {
    console.log(`  - ${result.postDir}: ${result.reason}`);
  });
}

console.log('\n' + '='.repeat(60));
console.log('✅ Full migration complete!');
console.log('\n💡 Next steps:');
console.log('1. Review changes with: git status');
console.log('2. Review specific changes: git diff');
console.log('3. Run cleanup: bun scripts/cleanup-images.js');
console.log('4. Test build: bun run build');
console.log('5. If satisfied, commit changes');
console.log('\n💡 To rollback: git checkout -- .');
console.log('='.repeat(60));
