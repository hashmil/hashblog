import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog", ({ data }) => {
    return !data.draft;
  });

  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
  );

  return new Response(JSON.stringify({ posts: sortedPosts }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
