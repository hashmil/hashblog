import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPostUrl } from "../utils/url";

export async function GET(context: any) {
  const posts = await getCollection("blog", ({ data }) => {
    return !data.draft;
  });

  // Sort posts by publication date (newest first)
  const sortedPosts = posts.sort((a, b) => 
    new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );

  return rss({
    title: "Notes by Hash Milhan",
    description:
      "Creative Technology Director sharing insights on AI, web development, and creative projects.",
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      content: post.body, // Use the raw markdown content
      link: getPostUrl(post.id, post.data.pubDate),
      // Enhanced metadata
      author: "blog@hashir.net (Hash Milhan)",
      categories: post.data.tags || [],
      // Add GUID for proper RSS identification
      guid: getPostUrl(post.id, post.data.pubDate),
      // Add custom data for each item
      customData: `<source url="${new URL("rss.xml", context.site)}">Notes by Hash Milhan</source>`,
    })),
    customData: `
      <language>en-us</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <managingEditor>blog@hashir.net (Hash Milhan)</managingEditor>
      <webMaster>blog@hashir.net (Hash Milhan)</webMaster>
      <generator>Astro RSS Feed</generator>
      <image>
        <url>${new URL("/images/logo.png", context.site)}</url>
        <title>Notes by Hash Milhan</title>
        <link>${context.site}</link>
        <description>Creative Technology Director sharing insights on AI, web development, and creative projects.</description>
        <width>144</width>
        <height>144</height>
      </image>
      <copyright>Copyright ${new Date().getFullYear()} Hash Milhan</copyright>
      <docs>https://www.rssboard.org/rss-specification</docs>
      <ttl>60</ttl>
      <atom:link href="${new URL(
        "rss.xml",
        context.site
      )}" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom"/>
    `,
    stylesheet: "/rss/styles.xsl",
  });
}
