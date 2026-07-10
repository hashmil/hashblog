/**
 * Reduce MDX to compact, searchable plain text for the client-side index.
 */
export function normaliseSearchText(source: string): string {
  return source
    .replace(/^---[\s\S]*?---/u, " ")
    .replace(/^(?:import|export)\s.+$/gmu, " ")
    .replace(/```[\s\S]*?```/gu, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/gu, " $1 ")
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, " $1 ")
    .replace(/<[^>]+>/gu, " ")
    .replace(/https?:\/\/\S+/gu, " ")
    .replace(/[#>*_~`{|}\[\]\\-]/gu, " ")
    .replace(/\s+/gu, " ")
    .trim()
    .toLocaleLowerCase("en-GB");
}

interface SearchablePost {
  title: string;
  description: string;
  tags: string[];
  searchText: string;
}

export function matchesSearch(post: SearchablePost, query: string): boolean {
  const normalisedQuery = query.trim().toLocaleLowerCase("en-GB");
  if (!normalisedQuery) return false;

  return [post.title, post.description, ...post.tags, post.searchText]
    .join(" ")
    .toLocaleLowerCase("en-GB")
    .includes(normalisedQuery);
}
