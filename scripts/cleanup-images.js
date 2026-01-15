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

console.log('🧹 Cleaning up post-specific image directories...\n');

// Get all post directories
const blogPosts = fs
  .readdirSync(blogDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name)
  .sort();

let imagesDeleted = 0;
let directoriesDeleted = 0;
let errors = [];

blogPosts.forEach(postDir => {
  const postPath = path.join(blogDir, postDir);
  const imagesDir = path.join(postPath, 'images');
  
  if (fs.existsSync(imagesDir)) {
    // Get all files in images directory
    const files = fs.readdirSync(imagesDir);
    const filesToDelete = files.filter(f => 
      f !== '.gitkeep' && f !== '.gitignore'
    );
    
    if (filesToDelete.length > 0) {
      // Delete image files
      filesToDelete.forEach(file => {
        const filePath = path.join(imagesDir, file);
        try {
          fs.unlinkSync(filePath);
          imagesDeleted++;
          console.log(`  🗑️  Deleted: ${postDir}/images/${file}`);
        } catch (error) {
          errors.push({
            type: 'delete_file',
            path: filePath,
            error: error.message
          });
        }
      });
      
      // Check if directory is now empty (except .gitkeep/.gitignore)
      const remainingFiles = fs.readdirSync(imagesDir).filter(f => 
        f !== '.gitkeep' && f !== '.gitignore'
      );
      
      if (remainingFiles.length === 0) {
        // Delete the empty images directory
        try {
          fs.rmdirSync(imagesDir);
          directoriesDeleted++;
          console.log(`  📁 Deleted directory: ${postDir}/images/`);
        } catch (error) {
          errors.push({
            type: 'delete_dir',
            path: imagesDir,
            error: error.message
          });
        }
      }
    } else {
      console.log(`  ℹ️  No images to delete in ${postDir}/images/`);
    }
  }
});

// Summary
console.log('\n' + '='.repeat(60));
console.log('📊 CLEANUP SUMMARY');
console.log('='.repeat(60));
console.log(`✅ Image files deleted: ${imagesDeleted}`);
console.log(`✅ Directories deleted: ${directoriesDeleted}`);

if (errors.length > 0) {
  console.log(`\n⚠️  Errors encountered: ${errors.length}`);
  errors.forEach(error => {
    console.log(`  - ${error.type}: ${error.path}`);
    console.log(`    ${error.error}`);
  });
}

console.log('\n' + '='.repeat(60));
console.log('✅ Cleanup complete!');
console.log('\n💡 All images are now in /public/media/');
console.log('='.repeat(60));
