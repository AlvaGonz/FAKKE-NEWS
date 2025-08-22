<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useNews, type NewsItem } from '@/composables/useNews';
import NewsCard from '@/components/news/NewsCard.vue';
import NewsSkeleton from '@/components/news/NewsSkeleton.vue';
import EmptyState from '@/components/news/EmptyState.vue';
import { useIntersection } from '@/composables/useIntersection';

const n = useNews();
const items = computed<NewsItem[]>(() => (n.list as any as import('vue').Ref<NewsItem[]>).value ?? []);

onMounted(n.fetchList);

// Infinite scroll with better loading state
const { el } = useIntersection(async () => {
  if (n.page.value < n.totalPages.value && !n.isLoading.value) {
    n.page.value++; 
    await n.fetchList();
  }
});
</script>

<template>
  <main class="container">
    <div class="content">
      <!-- Total Count Header -->
      <header class="results-header" v-if="n.total.value > 0">
        <div class="results-info">
          <h2 class="results-title">Noticias</h2> 
          <p class="results-count">
            {{ n.total.value }} {{ n.total.value === 1 ? 'artículo' : 'artículos' }}
            <span v-if="n.page.value > 1" class="page-info">
              (página {{ n.page.value }} de {{ n.totalPages.value }})
            </span>
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
        <p>Cargando más artículos...</p>
      </div>

      <!-- End of Results -->
      <div v-if="n.page.value >= n.totalPages.value && items.length > 0" class="end-results">
        <p>Has llegado al final de los resultados</p>
      </div>

      <!-- Infinite Scroll Sentinel -->
      <div ref="el" class="sentinel" aria-hidden="true"></div>
    </div>
  </main>
</template>

<style scoped>
.content {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
  gap: 2rem;
}

.results-info {
  flex: 1;
}

.results-title {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  font-weight: 900;
  color: #111;
  margin: 0 0 0.5rem 0;
}

.results-count {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.page-info {
  color: #999;
  font-size: 0.9rem;
}

.results-filters {
  flex-shrink: 0;
}

.loading-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  color: #666;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.end-results {
  text-align: center;
  padding: 2rem;
  color: #999;
  font-style: italic;
  border-top: 1px solid #eee;
  margin-top: 2rem;
}

.sentinel {
  height: 1px;
  margin-top: 2rem;
}

/* Responsive */
@media (max-width: 768px) {
  .results-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .results-filters {
    width: 100%;
  }
}
</style>


