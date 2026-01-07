import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  try {
    // Get all published blog posts
    const allPosts = await getCollection("blog", ({ data }) => {
      return !data.draft;
    });

    // Transform posts for search index
    const searchData = allPosts.map((post) => ({
      slug: post.id,
      data: {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.pubDate,
        tags: post.data.tags || [],
        heroImage: post.data.heroImage || null,
      },
      body: post.body || "", // Include post content for better search
    }));

    // Sort by publication date (newest first)
    searchData.sort(
      (a, b) =>
        new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime()
    );

    return new Response(JSON.stringify({ posts: searchData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error generating search data:", error);

    return new Response(
      JSON.stringify({ error: "Failed to load search data", posts: [] }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
