import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

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

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hash Milhan's Blog</title>
    <description>Creative Technology Director sharing insights on AI, web development, and creative projects.</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <managingEditor>blog@hashir.net (Hash Milhan)</managingEditor>
    <webMaster>blog@hashir.net (Hash Milhan)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Astro</generator>
    
    ${sortedPosts
      .map(
        (post) => `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <description><![CDATA[${post.data.description}]]></description>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
      <author>blog@hashir.net (Hash Milhan)</author>
      ${post.data.tags.map((tag) => `<category>${tag}</category>`).join("")}
    </item>`
      )
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
