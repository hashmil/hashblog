<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 bg-dark/95 backdrop-blur-menu transition-opacity duration-500"
    :class="{ 'opacity-100': isMenuVisible, 'opacity-0': !isMenuVisible }"
    @click="closeMenu">
    <!-- Menu Content -->
    <div class="flex flex-col h-full" @click.stop>
      <!-- Header with Close Button -->
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
          @click="closeMenu"
          class="w-10 h-10 flex items-center justify-center text-white hover:text-primary transition-colors duration-200"
          aria-label="Close menu">
          <svg
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

      <!-- Menu Content Area -->
      <div class="flex-1 flex flex-col lg:flex-row">
        <!-- Navigation Links -->
        <div
          class="flex-1 flex flex-col justify-center items-center p-8 lg:p-16">
          <nav class="text-center space-y-8">
            <a
              href="/"
              @click="closeMenu"
              class="block text-4xl lg:text-6xl font-primary text-white hover:text-accent transition-all duration-300 animate-slide-up-1">
              Blog Home
            </a>

            <a
              href="/about"
              @click="closeMenu"
              class="block text-4xl lg:text-6xl font-primary text-white hover:text-accent transition-all duration-300 animate-slide-up-2">
              About Hash
            </a>

            <a
              href="https://hashir.net"
              target="_blank"
              rel="noopener noreferrer"
              @click="closeMenu"
              class="block text-4xl lg:text-6xl font-primary text-white hover:text-accent transition-all duration-300 flex items-center justify-center gap-4 animate-slide-up-3">
              Portfolio
              <svg
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

        <!-- Search Section -->
        <div
          class="lg:w-96 p-8 lg:p-16 border-t lg:border-t-0 lg:border-l border-gray-800 animate-slide-left flex flex-col">
          <div class="space-y-6 flex flex-col flex-1">
            <div class="relative flex-shrink-0">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search..."
                class="w-full bg-dark-lighter border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-accent transition-colors duration-200 font-text"
                @input="performSearch" />
              <svg
                class="absolute right-3 top-3 w-5 h-5 text-text-muted"
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

            <!-- Search Results -->
            <transition-group
              name="search-results"
              tag="div"
              v-if="searchQuery && searchResults.length > 0"
              class="space-y-4 flex-1 overflow-y-auto rounded-lg bg-dark-lighter search-results-container"
              style="
                max-height: calc(100vh - 300px);
                padding: 16px 20px 16px 16px;
              ">
              <h3 key="title" class="text-lg font-semibold text-white">
                Search Results
              </h3>
              <div key="results" class="space-y-3">
                <a
                  v-for="(result, index) in searchResults"
                  :key="result.slug"
                  :href="`/blog/${result.slug}`"
                  @click="closeMenu"
                  class="block p-4 bg-dark rounded-lg hover:bg-gray-800 transition-all duration-200 animate-fade-in"
                  :style="{ animationDelay: `${index * 100}ms` }">
                  <h4 class="font-medium text-white mb-1">
                    {{ result.data?.title || result.title }}
                  </h4>
                  <p class="text-sm text-text-muted line-clamp-2">
                    {{ result.data?.description || result.description }}
                  </p>
                  <div class="flex items-center gap-2 mt-2">
                    <span class="text-xs text-text-muted">{{
                      formatDate(result.data?.pubDate || result.pubDate)
                    }}</span>
                    <div class="flex gap-1">
                      <span
                        v-for="tag in (
                          result.data?.tags ||
                          result.tags ||
                          []
                        ).slice(0, 2)"
                        :key="tag"
                        class="px-2 py-0.5 bg-dark text-xs rounded text-text-muted">
                        {{ tag }}
                      </span>
                    </div>
                  </div>
                </a>
              </div>
            </transition-group>

            <!-- No Results -->
            <transition name="no-results" mode="out-in">
              <div
                v-if="searchQuery && searchResults.length === 0"
                class="text-text-muted text-center py-8 flex-shrink-0">
                No posts found matching "{{ searchQuery }}"
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";

const isOpen = ref(false);
const isMenuVisible = ref(false);
const searchQuery = ref("");
const searchResults = ref<any[]>([]);
const allPosts = ref<any[]>([]);

// Menu controls
const openMenu = async () => {
  isOpen.value = true;
  document.body.style.overflow = "hidden";

  // Load posts when menu opens (in case they weren't loaded on mount)
  if (allPosts.value.length === 0) {
    await loadPosts();
  }

  // Delay to trigger enter animation
  await nextTick();
  setTimeout(() => {
    isMenuVisible.value = true;
  }, 50);
};

const closeMenu = async () => {
  isMenuVisible.value = false;
  document.body.style.overflow = "";
  searchQuery.value = "";
  searchResults.value = [];

  // Wait for exit animation before hiding
  setTimeout(() => {
    isOpen.value = false;
  }, 300);
};

// Load posts for search
const loadPosts = async () => {
  try {
    const response = await fetch("/api/search.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle both response formats: array or object with posts property
    let posts = [];
    if (Array.isArray(data)) {
      posts = data;
    } else if (data.posts && Array.isArray(data.posts)) {
      posts = data.posts;
    }

    allPosts.value = posts;
  } catch (error) {
    console.error("Failed to load posts for search:", error);
  }
};

// Search functionality
const performSearch = async () => {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    return;
  }

  const query = searchQuery.value.toLowerCase();
  const filteredResults = allPosts.value.filter((post) => {
    // More robust data access
    const title = post?.data?.title || post?.title || "";
    const description = post?.data?.description || post?.description || "";
    const tags = post?.data?.tags || post?.tags || [];
    const body = post?.body || "";

    const titleMatch = title.toLowerCase().includes(query);
    const descriptionMatch = description.toLowerCase().includes(query);
    const tagsMatch =
      Array.isArray(tags) &&
      tags.some((tag: string) => tag.toLowerCase().includes(query));
    const contentMatch = body && body.toLowerCase().includes(query);

    return titleMatch || descriptionMatch || tagsMatch || contentMatch;
  });

  searchResults.value = filteredResults.slice(0, 10);
};

// Format date helper
const formatDate = (date: string | Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

// Event listeners
onMounted(() => {
  document.addEventListener("toggle-menu", openMenu);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen.value) {
      closeMenu();
    }
  });
  loadPosts();
});

onUnmounted(() => {
  document.removeEventListener("toggle-menu", openMenu);
  document.body.style.overflow = "";
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Staggered slide-up animations for navigation links */
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

/* Transition groups for search results */
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

.no-results-enter-active,
.no-results-leave-active {
  transition: all 0.3s ease;
}

.no-results-enter-from,
.no-results-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Hover effects */
nav a:hover {
  transform: translateY(-2px);
}

/* Custom scrollbar for search results */
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
</style>
