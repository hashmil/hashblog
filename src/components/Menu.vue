<template>
  <div
    v-if="isOpen"
    id="site-menu"
    ref="dialogRef"
    role="dialog"
    aria-modal="true"
    aria-labelledby="site-menu-title"
    tabindex="-1"
    class="fixed inset-0 z-50 bg-dark/95 backdrop-blur-menu transition-opacity duration-500"
    :class="{ 'opacity-100': isMenuVisible, 'opacity-0': !isMenuVisible }">
    <h2 id="site-menu-title" class="sr-only">Site menu</h2>

    <div class="flex flex-col h-full">
      <div
        class="flex justify-between items-center p-6 border-b border-gray-800 animate-slide-down">
        <div class="flex items-center space-x-2">
          <div class="flex items-center">
            <img
              src="/images/logo.png"
              alt="Notes by Hash Milhan"
              class="h-8 object-contain" />
          </div>
        </div>

        <button
          ref="closeButtonRef"
          type="button"
          class="w-10 h-10 flex items-center justify-center text-white hover:text-primary transition-colors duration-200"
          aria-label="Close menu"
          @click="closeMenu">
          <svg
            aria-hidden="true"
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 flex flex-col lg:flex-row min-h-0">
        <div
          class="flex-1 flex flex-col justify-center items-center p-8 lg:p-16">
          <nav aria-label="Main navigation" class="text-center space-y-8">
            <a
              href="/"
              class="block text-4xl lg:text-6xl font-primary text-white hover:text-accent transition-all duration-300 animate-slide-up-1"
              @click="closeMenu">
              Blog Home
            </a>

            <a
              href="/about"
              class="block text-4xl lg:text-6xl font-primary text-white hover:text-accent transition-all duration-300 animate-slide-up-2"
              @click="closeMenu">
              About Hash
            </a>

            <a
              href="https://hashir.net"
              target="_blank"
              rel="noopener noreferrer"
              class="text-4xl lg:text-6xl font-primary text-white hover:text-accent transition-all duration-300 flex items-center justify-center gap-4 animate-slide-up-3"
              @click="closeMenu">
              Portfolio
              <svg
                aria-hidden="true"
                class="w-8 h-8 lg:w-12 lg:h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </nav>
        </div>

        <div
          class="lg:w-96 p-8 lg:p-16 border-t lg:border-t-0 lg:border-l border-gray-800 animate-slide-left flex flex-col min-h-0">
          <div class="space-y-6 flex flex-col flex-1 min-h-0">
            <div class="relative flex-shrink-0">
              <label for="site-search" class="sr-only">Search posts</label>
              <input
                id="site-search"
                v-model="searchQuery"
                type="search"
                autocomplete="off"
                placeholder="Search posts…"
                class="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-3 pr-10 text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors duration-200 font-text"
                aria-controls="search-results"
                :aria-busy="isLoadingPosts"
                @input="performSearch" />
              <svg
                aria-hidden="true"
                class="absolute right-3 top-3 w-5 h-5 text-text-muted pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div id="search-results" class="flex-1 min-h-0" aria-live="polite">
              <div
                v-if="searchQuery.trim() && isLoadingPosts"
                role="status"
                class="text-text-muted text-center py-8">
                Loading posts…
              </div>

              <div
                v-else-if="searchQuery.trim() && searchError"
                role="alert"
                class="text-text-muted text-center py-8">
                <p>{{ searchError }}</p>
                <button
                  type="button"
                  class="mt-4 font-accent text-white border-b border-accent hover:text-accent transition-colors"
                  @click="loadPosts">
                  Try again
                </button>
              </div>

              <div
                v-else-if="searchQuery.trim() && searchResults.length > 0"
                class="space-y-4 h-full overflow-y-auto rounded-lg bg-dark-lighter search-results-container"
                style="max-height: calc(100vh - 300px); padding: 16px 20px 16px 16px">
                <h3 class="text-lg font-semibold text-white">Search results</h3>
                <transition-group name="search-results" tag="div" class="space-y-3">
                  <a
                    v-for="(result, index) in searchResults"
                    :key="result.url"
                    :href="result.url"
                    class="block p-4 bg-dark rounded-lg hover:bg-gray-800 transition-all duration-200 animate-fade-in"
                    :style="{ animationDelay: `${index * 100}ms` }"
                    @click="closeMenu">
                    <h4 class="font-medium text-white mb-1">
                      {{ result.title }}
                    </h4>
                    <p class="text-sm text-text-muted line-clamp-2">
                      {{ result.description }}
                    </p>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-xs text-text-muted">
                        {{ formatDate(result.pubDate) }}
                      </span>
                      <div class="flex gap-1">
                        <span
                          v-for="tag in result.tags.slice(0, 2)"
                          :key="tag"
                          class="px-2 py-0.5 bg-dark text-xs rounded text-text-muted">
                          {{ tag }}
                        </span>
                      </div>
                    </div>
                  </a>
                </transition-group>
              </div>

              <div
                v-else-if="searchQuery.trim() && hasLoadedPosts"
                class="text-text-muted text-center py-8">
                No posts found matching “{{ searchQuery.trim() }}”
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref } from "vue";
import { matchesSearch } from "../utils/search";

interface SearchPost {
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  url: string;
  searchText: string;
}

interface BackgroundElementState {
  element: HTMLElement;
  wasInert: boolean;
}

const isOpen = ref(false);
const isMenuVisible = ref(false);
const dialogRef = ref<HTMLElement | null>(null);
const closeButtonRef = ref<HTMLButtonElement | null>(null);
const searchQuery = ref("");
const searchResults = ref<SearchPost[]>([]);
const allPosts = ref<SearchPost[]>([]);
const isLoadingPosts = ref(false);
const hasLoadedPosts = ref(false);
const searchError = ref("");

let previouslyFocusedElement: HTMLElement | null = null;
let previousBodyOverflow = "";
let backgroundElements: BackgroundElementState[] = [];
let closeTimer: number | undefined;
let showFrame: number | undefined;

const updateMenuButton = (expanded: boolean) => {
  const menuButton = document.getElementById("menu-button");
  if (!menuButton) return;

  menuButton.setAttribute("aria-expanded", expanded.toString());
};

const makeBackgroundInert = () => {
  const dialog = dialogRef.value;
  if (!dialog) return;

  backgroundElements = Array.from(document.body.children)
    .filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement && !element.contains(dialog)
    )
    .map((element) => ({ element, wasInert: element.inert }));

  backgroundElements.forEach(({ element }) => {
    element.inert = true;
  });
};

const restoreBackground = () => {
  backgroundElements.forEach(({ element, wasInert }) => {
    element.inert = wasInert;
  });
  backgroundElements = [];
};

const openMenu = async () => {
  if (isOpen.value) return;

  if (closeTimer !== undefined) {
    window.clearTimeout(closeTimer);
    closeTimer = undefined;
  }

  previouslyFocusedElement =
    document.activeElement instanceof HTMLElement ? document.activeElement : null;
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  isOpen.value = true;

  await nextTick();
  makeBackgroundInert();
  updateMenuButton(true);
  closeButtonRef.value?.focus();

  showFrame = window.requestAnimationFrame(() => {
    if (isOpen.value) isMenuVisible.value = true;
  });

  void loadPosts();
};

const closeMenu = () => {
  if (!isOpen.value || closeTimer !== undefined) return;

  if (showFrame !== undefined) {
    window.cancelAnimationFrame(showFrame);
    showFrame = undefined;
  }

  isMenuVisible.value = false;
  searchQuery.value = "";
  searchResults.value = [];

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  closeTimer = window.setTimeout(() => {
    isOpen.value = false;
    restoreBackground();
    document.body.style.overflow = previousBodyOverflow;
    updateMenuButton(false);
    previouslyFocusedElement?.focus();
    previouslyFocusedElement = null;
    closeTimer = undefined;
  }, reduceMotion ? 0 : 500);
};

const isSearchPost = (value: unknown): value is SearchPost => {
  if (!value || typeof value !== "object") return false;
  const post = value as Partial<SearchPost>;

  return (
    typeof post.title === "string" &&
    typeof post.description === "string" &&
    typeof post.pubDate === "string" &&
    Array.isArray(post.tags) &&
    post.tags.every((tag) => typeof tag === "string") &&
    typeof post.url === "string" &&
    typeof post.searchText === "string"
  );
};

const loadPosts = async () => {
  if (isLoadingPosts.value || hasLoadedPosts.value) return;

  isLoadingPosts.value = true;
  searchError.value = "";

  try {
    const response = await fetch("/api/search.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data: unknown = await response.json();
    const posts =
      data && typeof data === "object" && "posts" in data
        ? (data as { posts?: unknown }).posts
        : undefined;

    if (!Array.isArray(posts)) throw new Error("Invalid search response");

    allPosts.value = posts.filter(isSearchPost);
    hasLoadedPosts.value = true;
    performSearch();
  } catch (error) {
    console.error("Failed to load posts for search:", error);
    searchResults.value = [];
    searchError.value = "Search is unavailable. Check your connection and try again.";
  } finally {
    isLoadingPosts.value = false;
  }
};

const performSearch = () => {
  const query = searchQuery.value.trim().toLocaleLowerCase("en-GB");
  if (!query || !hasLoadedPosts.value) {
    searchResults.value = [];
    return;
  }

  searchResults.value = allPosts.value
    .filter((post) => matchesSearch(post, query))
    .slice(0, 10);
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));

const getFocusableElements = (): HTMLElement[] => {
  const dialog = dialogRef.value;
  if (!dialog) return [];

  return Array.from(
    dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  ).filter((element) => !element.hasAttribute("hidden"));
};

const handleKeydown = (event: KeyboardEvent) => {
  if (!isOpen.value) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeMenu();
    return;
  }

  if (event.key !== "Tab") return;

  const focusableElements = getFocusableElements();
  if (focusableElements.length === 0) {
    event.preventDefault();
    dialogRef.value?.focus();
    return;
  }

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  const activeElement = document.activeElement;

  if (event.shiftKey && (activeElement === first || !dialogRef.value?.contains(activeElement))) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (activeElement === last || !dialogRef.value?.contains(activeElement))) {
    event.preventDefault();
    first.focus();
  }
};

onMounted(() => {
  document.addEventListener("toggle-menu", openMenu);
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("toggle-menu", openMenu);
  document.removeEventListener("keydown", handleKeydown);

  if (closeTimer !== undefined) window.clearTimeout(closeTimer);
  if (showFrame !== undefined) window.cancelAnimationFrame(showFrame);

  restoreBackground();
  document.body.style.overflow = previousBodyOverflow;
  updateMenuButton(false);
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up-1 {
  animation: slideUpFade 0.6s ease-out 0.2s both;
}

.animate-slide-up-2 {
  animation: slideUpFade 0.6s ease-out 0.4s both;
}

.animate-slide-up-3 {
  animation: slideUpFade 0.6s ease-out 0.6s both;
}

.animate-slide-down {
  animation: slideDown 0.5s ease-out 0.1s both;
}

.animate-slide-left {
  animation: slideLeft 0.6s ease-out 0.3s both;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out both;
}

.search-results-enter-active {
  transition: all 0.3s ease-out;
}

.search-results-leave-active {
  transition: all 0.2s ease-in;
}

.search-results-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.search-results-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

nav a:hover {
  transform: translateY(-2px);
}

.search-results-container::-webkit-scrollbar {
  width: 6px;
}

.search-results-container::-webkit-scrollbar-track {
  background: transparent;
  margin: 8px 4px;
}

.search-results-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
  border: 1px solid transparent;
  background-clip: content-box;
}

.search-results-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
  background-clip: content-box;
}

@media (prefers-reduced-motion: reduce) {
  .animate-slide-up-1,
  .animate-slide-up-2,
  .animate-slide-up-3,
  .animate-slide-down,
  .animate-slide-left,
  .animate-fade-in {
    animation: none;
  }

  .search-results-enter-active,
  .search-results-leave-active {
    transition: none;
  }

  nav a:hover {
    transform: none;
  }
}
</style>
