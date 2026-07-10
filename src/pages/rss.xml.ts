import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { getAbsoluteUrl, getPostUrl } from "../utils/url";

export async function GET(context: APIContext) {
  const site = context.site ?? new URL("https://hashir.blog");
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
    site,
    items: sortedPosts.map((post) => {
      const postUrl = getAbsoluteUrl(getPostUrl(post.id, post.data.pubDate), site);

      return {
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        // MDX cannot be safely published as raw HTML. The feed links to the
        // canonical article and uses its plain-text description instead.
        link: postUrl,
        author: "blog@hashir.net (Hash Milhan)",
        categories: post.data.tags || [],
        guid: postUrl,
        customData: `<source url="${new URL("rss.xml", site)}">Notes by Hash Milhan</source>`,
      };
    }),
    customData: `
      <language>en-gb</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <managingEditor>blog@hashir.net (Hash Milhan)</managingEditor>
      <webMaster>blog@hashir.net (Hash Milhan)</webMaster>
      <generator>Astro RSS Feed</generator>
      <image>
        <url>${new URL("/images/logo.png", site)}</url>
        <title>Notes by Hash Milhan</title>
        <link>${site}</link>
        <description>Creative Technology Director sharing insights on AI, web development, and creative projects.</description>
        <width>144</width>
        <height>144</height>
      </image>
      <copyright>Copyright ${new Date().getFullYear()} Hash Milhan</copyright>
      <docs>https://www.rssboard.org/rss-specification</docs>
      <ttl>60</ttl>
      <atom:link href="${new URL(
        "rss.xml",
        site
      )}" rel="self" type="application/rss+xml" xmlns:atom="http://www.w3.org/2005/Atom"/>
    `,
    stylesheet: "/rss/styles.xsl",
  });
}
