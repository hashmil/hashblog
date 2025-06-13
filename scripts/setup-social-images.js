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
const socialImagesDir = path.join(publicDir, "social-images");

// Create social-images directory if it doesn't exist
if (!fs.existsSync(socialImagesDir)) {
  fs.mkdirSync(socialImagesDir, { recursive: true });
}

// Function to extract hero image from frontmatter
function extractHeroImage(content) {
  const heroImageMatch = content.match(/heroImage:\s*["'](.+?)["']/);
  return heroImageMatch ? heroImageMatch[1] : null;
}

// Function to get post slug from directory name
function getPostSlug(dirName) {
  // Extract slug from directory name (remove date prefix)
  const match = dirName.match(/^\d{4}-\d{2}-\d{2}-(.+)$/);
  return match ? match[1] : dirName;
}

// Function to copy and organize images
function setupSocialImages() {
  console.log("🚀 Setting up social sharing images...\n");

  const blogPosts = fs
    .readdirSync(blogDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  let processedCount = 0;
  let skippedCount = 0;

  for (const postDir of blogPosts) {
    const postPath = path.join(blogDir, postDir);
    const indexPath = path.join(postPath, "index.mdx");

    if (!fs.existsSync(indexPath)) {
      console.log(`⚠️  Skipping ${postDir} - no index.mdx found`);
      skippedCount++;
      continue;
    }

    // Read the frontmatter
    const content = fs.readFileSync(indexPath, "utf-8");
    const heroImagePath = extractHeroImage(content);

    if (!heroImagePath) {
      console.log(`⚠️  Skipping ${postDir} - no hero image found`);
      skippedCount++;
      continue;
    }

    // Get the actual image file path
    const imagePath = path.join(postPath, heroImagePath.replace("./", ""));

    if (!fs.existsSync(imagePath)) {
      console.log(`❌ Error: Image not found for ${postDir}: ${imagePath}`);
      skippedCount++;
      continue;
    }

    // Create organized directory structure: /social-images/year/slug/
    const slug = getPostSlug(postDir);
    const year = postDir.substring(0, 4);
    const socialPostDir = path.join(socialImagesDir, year, slug);

    if (!fs.existsSync(socialPostDir)) {
      fs.mkdirSync(socialPostDir, { recursive: true });
    }

    // Get file extension
    const ext = path.extname(imagePath);
    const socialImagePath = path.join(socialPostDir, `hero${ext}`);

    // Copy the image
    try {
      fs.copyFileSync(imagePath, socialImagePath);
      console.log(
        `✅ Copied: ${postDir} → /social-images/${year}/${slug}/hero${ext}`
      );
      processedCount++;
    } catch (error) {
      console.log(`❌ Error copying ${postDir}: ${error.message}`);
      skippedCount++;
    }
  }

  console.log(`\n🎉 Setup complete!`);
  console.log(`✅ Processed: ${processedCount} images`);
  console.log(`⚠️  Skipped: ${skippedCount} posts`);
  console.log(
    `\n📁 Social images are now organized in: /public/social-images/`
  );
}

// Run the script
setupSocialImages();
