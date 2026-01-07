import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getPostUrl } from "../utils/url";

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site || "https://localhost:4321";

  // Get all blog posts
  const posts = await getCollection("blog", ({ data }) => {
    return !data.draft;
  });

  // Sort posts by date
  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- About page -->
  <url>
    <loc>${siteUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <!-- Blog posts -->
  ${sortedPosts
    .map(
      (post) => `
  <url>
    <loc>${siteUrl}${getPostUrl(post.id, post.data.pubDate)}</loc>
    <lastmod>${
      post.data.updatedDate
        ? post.data.updatedDate.toISOString()
        : post.data.pubDate.toISOString()
    }</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
