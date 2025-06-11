/**
 * Generate a blog post URL in the format /yyyy/mm/slug
 */
export function getPostUrl(slug: string, pubDate: Date): string {
  const year = pubDate.getFullYear();
  const month = (pubDate.getMonth() + 1).toString().padStart(2, "0");
  return `/${year}/${month}/${slug}`;
}
