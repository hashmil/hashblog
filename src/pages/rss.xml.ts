import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getPostUrl } from "../utils/url";

export async function GET(context: any) {
  const posts = await getCollection("blog", ({ data }) => {
    return !data.draft;
  });

  return rss({
    title: "Notes by Hash Milhan",
    description:
      "Creative Technology Director sharing insights on AI, web development, and creative projects.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: getPostUrl(post.slug, post.data.pubDate),
    })),
    customData: `
      <language>en-us</language>
      <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
      <managingEditor>blog@hashir.net (Hash Milhan)</managingEditor>
      <webMaster>blog@hashir.net (Hash Milhan)</webMaster>
      <generator>Astro</generator>
      <ttl>60</ttl>
      <atom:link href="${new URL(
        "rss.xml",
        context.site
      )}" rel="self" type="application/rss+xml"/>
    `,
    stylesheet: "/rss/styles.xsl",
  });
}
