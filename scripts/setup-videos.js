#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the project root directory
const projectRoot = path.resolve(__dirname, "..");
const blogDir = path.join(projectRoot, "src/content/blog");
const publicDir = path.join(projectRoot, "public");
const videosDir = path.join(publicDir, "videos");

// Create videos directory if it doesn't exist
if (!fs.existsSync(videosDir)) {
  fs.mkdirSync(videosDir, { recursive: true });
}

// Function to get post slug from directory name
function getPostSlug(dirName) {
  // Extract slug from directory name (remove date prefix)
  const match = dirName.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
  return match ? match[1] : dirName;
}

// Function to copy videos from post directories
function setupVideos() {
  console.log("🎬 Setting up video files...\n");

  const blogPosts = fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  let processedCount = 0;
  let skippedCount = 0;
  let totalVideosProcessed = 0;

  for (const postDir of blogPosts) {
    const postPath = path.join(blogDir, postDir);
    const videosPath = path.join(postPath, "videos");

    // Check if post has a videos directory
    if (!fs.existsSync(videosPath)) {
      skippedCount++;
      continue;
    }

    // Get all video files
    const videoFiles = fs
      .readdirSync(videosPath, { withFileTypes: true })
      .filter((dirent) => dirent.isFile())
      .filter((dirent) => {
        const ext = path.extname(dirent.name).toLowerCase();
        return ['.mp4', '.webm', '.mov', '.avi'].includes(ext);
      })
      .map((dirent) => dirent.name);

    if (videoFiles.length === 0) {
      console.log(`⚠️  Skipping ${postDir} - no video files found`);
      skippedCount++;
      continue;
    }

    // Create organized directory structure: /videos/YYYY-MM-DD-post-slug/
    const publicVideoDir = path.join(videosDir, postDir);

    if (!fs.existsSync(publicVideoDir)) {
      fs.mkdirSync(publicVideoDir, { recursive: true });
    }

    // Copy all video files
    let postVideoCount = 0;
    for (const videoFile of videoFiles) {
      const sourceVideoPath = path.join(videosPath, videoFile);
      const destVideoPath = path.join(publicVideoDir, videoFile);

      try {
        fs.copyFileSync(sourceVideoPath, destVideoPath);
        console.log(`✅ Copied: ${postDir}/${videoFile} → /videos/${postDir}/${videoFile}`);
        postVideoCount++;
        totalVideosProcessed++;
      } catch (error) {
        console.log(`❌ Error copying ${videoFile} from ${postDir}: ${error.message}`);
      }
    }

    if (postVideoCount > 0) {
      processedCount++;
    }
  }

  console.log(`\n🎉 Video setup complete!`);
  console.log(`✅ Processed: ${processedCount} posts`);
  console.log(`🎬 Total videos copied: ${totalVideosProcessed}`);
  console.log(`⚠️  Skipped: ${skippedCount} posts`);
  console.log(`\n📁 Videos are now organized in: /public/videos/`);
}

// Run the script
setupVideos();