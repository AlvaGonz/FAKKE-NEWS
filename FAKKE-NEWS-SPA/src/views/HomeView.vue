<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useNews, type NewsItem } from '@/composables/useNews';
import NewsCard from '@/components/news/NewsCard.vue';
import NewsSkeleton from '@/components/news/NewsSkeleton.vue';
import EmptyState from '@/components/news/EmptyState.vue';
import { useIntersection } from '@/composables/useIntersection';

const n = useNews();
const items = computed<NewsItem[]>(() => n.list.value ?? []);

onMounted(n.fetchList);

// Infinite scroll with better loading state
const { el } = useIntersection(async () => {
  if (n.page.value < n.totalPages.value && !n.isLoading.value) {
    await n.loadMore();
  }
});

const topStories = computed(() => items.value.slice(0, 5));
</script>

<template>
  <main class="container">
    <div class="wsj-layout">
      <!-- WSJ "What's News" Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h3>WHAT'S NEWS</h3>
          <span class="subtitle">Business & Finance</span>
        </div>
        <ul class="whats-news-list">
          <li v-for="item in topStories" :key="'sidebar-'+item.id" class="whats-news-item">
            <span class="bullet">■</span>
            <div class="text">
              <router-link :to="`/article/${item.id}`" class="sidebar-link">
                {{ item.title }}
              </router-link>
            </div>
          </li>
          <li v-if="n.isLoading.value" class="loading-text">Loading updates...</li>
        </ul>
      </aside>
      
      <!-- Main Content -->
      <div class="main-content">
        <!-- Total Count Header -->
        <header class="results-header" v-if="n.total.value > 0">
          <div class="results-info">
            <h2 class="results-title">Latest Headlines</h2> 
            <p class="results-count">
              {{ n.total.value }} articles found
            </p>
          </div>
        </header>

        <!-- News Grid -->
        <section class="grid">
          <template v-if="items.length">
            <NewsCard v-for="item in items" :key="item.id" :item="item" />
          </template>
          <template v-else-if="n.isLoading.value && n.page.value === 1">
            <NewsSkeleton v-for="i in 6" :key="'s-'+i" />
          </template>
          <template v-else>
            <EmptyState @retry="n.fetchList" @clear="() => { n.search.value=''; n.fetchList(); }" />
          </template>
        </section>

        <!-- Infinite Scroll Loading -->
        <div v-if="n.isLoading.value && n.page.value > 1" class="loading-more">
          <div class="loading-spinner"></div>
          <p>Loading more...</p>
        </div>

        <!-- End of Results -->
        <div v-if="n.page.value >= n.totalPages.value && items.length > 0" class="end-results">
          <p>End of results</p>
        </div>

        <!-- Infinite Scroll Sentinel -->
        <div ref="el" class="sentinel" aria-hidden="true"></div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: var(--max);
  margin: 0 auto;
  padding: 0 var(--gutter);
}

.wsj-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-top: 2rem;
}

@media (min-width: 1024px) {
  .wsj-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 0; /* Border separation */
    border-left: 1px solid var(--border-primary);
    border-right: 1px solid var(--border-primary);
  }
}

/* Sidebar Styles */
.sidebar {
  padding: 0 1.5rem 1.5rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-primary);
}

@media (min-width: 1024px) {
  .sidebar {
    border-bottom: none;
    border-right: 1px solid var(--border-primary);
    background: transparent;
    padding: 0;
  }
  
  .sidebar-header {
    background: var(--bg-secondary);
    padding: 1rem;
    border-bottom: 1px solid var(--border-primary);
    text-align: center;
  }
}

.sidebar h3 {
  font-family: var(--font-ui);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 1px;
  margin: 0;
  color: var(--text-primary);
}

.subtitle {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-style: italic;
  color: var(--text-tertiary);
}

.whats-news-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.whats-news-item {
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border-primary);
  font-size: 0.95rem;
  line-height: 1.4;
}

.bullet {
  color: var(--accent);
  font-size: 0.6rem;
  margin-top: 0.3rem;
  flex-shrink: 0;
}

.sidebar-link {
  color: var(--text-primary);
  text-decoration: none;
  font-family: var(--font-body);
  transition: color 0.2s ease;
}

.sidebar-link:hover {
  text-decoration: underline;
  color: var(--accent);
}

/* Main Content */
.main-content {
  background: #fff;
}

/* Reuse existing classes but minimal overrides */
.results-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-primary);
}

.results-title {
  font-family: var(--font-display);
  font-size: 2rem;
  margin: 0;
}

.grid {
  /* Grid is handled globally in styles.css now */
}

/* Loaders */
.loading-more {
  padding: 2rem;
  text-align: center;
  color: var(--text-tertiary);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-primary);
  border-top-color: var(--text-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.end-results {
  text-align: center;
  padding: 1rem;
  color: var(--text-muted);
  font-family: var(--font-ui);
  font-size: 0.8rem;
  text-transform: uppercase;
}

.sentinel { height: 1px; margin-top: 1rem; }
</style>
