/**
 * Generate a blog post URL in the format /yyyy/mm/slug
 */
export function getPostUrl(slug: string, pubDate: Date): string {
  // Content dates are calendar dates parsed at UTC midnight. Using local date
  // methods would move a post into the previous month for readers west of UTC.
  const year = pubDate.getUTCFullYear();
  const month = (pubDate.getUTCMonth() + 1).toString().padStart(2, "0");
  return `/${year}/${month}/${slug}`;
}

/**
 * Resolve a site-relative path without introducing duplicate slashes.
 */
export function getAbsoluteUrl(path: string, site: URL | string): string {
  return new URL(path, site).toString();
}
