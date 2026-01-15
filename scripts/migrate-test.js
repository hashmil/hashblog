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

// Test posts to migrate
const TEST_POSTS = [
  '2025-09-02-karak-calculator-the-only-metric-that-truly-matters',
  '2021-02-16-can-an-app-make-you-be-kinder'
];

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
  console.log(`\n🔄 Processing: ${postDir}`);
  
  const postPath = path.join(blogDir, postDir);
  const indexPath = path.join(postPath, 'index.mdx');
  const imagesDir = path.join(postPath, 'images');
  
  if (!fs.existsSync(indexPath)) {
    console.log(`⚠️  Skipping ${postDir} - no index.mdx found`);
    return false;
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
      console.log(`  ✅ Copied hero image: ${originalName} → ${newName}`);
      
      // Update frontmatter
      const heroImageRegex = /heroImage:\s*["'](.+?)["']/;
      content = content.replace(
        heroImageRegex,
        `heroImage: "/media/${newName}"`
      );
      
      heroImageChanges.push({
        old: heroImagePath,
        new: `/media/${newName}`
      });
    } else {
      console.log(`  ⚠️  Hero image not found: ${actualImagePath}`);
    }
  }
  
  // Process content images
  let contentImageChanges = [];
  
  if (fs.existsSync(imagesDir)) {
    const imageFiles = fs.readdirSync(imagesDir).filter(f => 
      f !== '.gitkeep' && f !== '.gitignore'
    );
    
    imageFiles.forEach(filename => {
      const imagePath = path.join(imagesDir, filename);
      
      if (fs.existsSync(imagePath)) {
        // Generate new filename with slug prefix
        const newName = truncateFilename(slug, filename);
        const newPath = path.join(mediaDir, newName);
        
        // Copy image to media folder
        if (!fs.existsSync(newPath)) {
          fs.copyFileSync(imagePath, newPath);
        }
        
        console.log(`  ✅ Copied content image: ${filename} → ${newName}`);
        
        contentImageChanges.push({
          old: filename,
          new: `/media/${newName}`
        });
        
        // Update image reference in content
        content = content.replace(
          `](./images/${filename})`,
          `](/media/${newName})`
        );
        content = content.replace(
          `](images/${filename})`,
          `](/media/${newName})`
        );
      }
    });
  }
  
  // Write updated content back
  if (content !== originalContent) {
    fs.writeFileSync(indexPath, content, 'utf8');
    console.log(`  ✅ Updated ${postDir}/index.mdx`);
    
    return {
      postDir,
      slug,
      heroImageChanges,
      contentImageChanges,
      success: true
    };
  } else {
    console.log(`  ℹ️  No changes needed for ${postDir}`);
    return { postDir, success: false, changes: [] };
  }
}

// Main execution
console.log('🧪 Running TEST migration...\n');
console.log('📋 Test posts:', TEST_POSTS.join(', '));

const results = TEST_POSTS.map(migratePost);

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 MIGRATION SUMMARY');
console.log('='.repeat(50));

const successfulMigrations = results.filter(r => r.success);
const failedMigrations = results.filter(r => !r.success);

console.log(`✅ Successfully migrated: ${successfulMigrations.length} posts`);
console.log(`⚠️  No changes: ${failedMigrations.length} posts`);

successfulMigrations.forEach(result => {
  console.log(`\n  📝 ${result.postDir}`);
  console.log(`     Slug: ${result.slug}`);
  if (result.heroImageChanges.length > 0) {
    console.log(`     Hero images: ${result.heroImageChanges.length}`);
    result.heroImageChanges.forEach(change => {
      console.log(`       ${change.old} → ${change.new}`);
    });
  }
  if (result.contentImageChanges.length > 0) {
    console.log(`     Content images: ${result.contentImageChanges.length}`);
    result.contentImageChanges.forEach(change => {
      console.log(`       ${change.old} → ${change.new}`);
    });
  }
});

console.log('\n' + '='.repeat(50));
console.log('✅ Test migration complete!');
console.log('\n💡 Next steps:');
console.log('1. Review changes with: git diff');
console.log('2. Verify images in: public/media/');
console.log('3. Test build: bun run build');
console.log('4. If satisfied, run full migration: bun scripts/migrate-all.js');
console.log('\n💡 To rollback: git checkout -- .');
console.log('='.repeat(50));
