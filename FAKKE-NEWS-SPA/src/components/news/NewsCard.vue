<script setup lang="ts">
import { ref } from 'vue';
import { resolveImageUrl } from '@/composables/useAssets';
import type { NewsItem } from '@/composables/useNews';

const props = defineProps<{
  item: NewsItem;
}>();

const imageLoaded = ref(false);
const imageError = ref(false);

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'hoy';
  if (diffDays === 2) return 'ayer';
  if (diffDays <= 7) return `${diffDays - 1} días`;
  
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short' 
  });
}

function handleSave() {
  console.log('Guardando artículo:', props.item.title);
  // Aquí se implementaría la lógica de guardar
}

function handleShare() {
  if (navigator.share) {
    navigator.share({
      title: props.item.title,
      text: props.item.content.substring(0, 100) + '...',
      url: window.location.origin + `/article/${props.item.id}`
    });
  } else {
    // Fallback para navegadores que no soportan Web Share API
    const url = window.location.origin + `/article/${props.item.id}`;
    navigator.clipboard.writeText(url);
    alert('URL copiada al portapapeles');
  }
}
</script>

<template>
  <article class="news-card">
    <div class="card-image">
      <img 
        v-if="item.imagePath" 
        :src="resolveImageUrl(item.imagePath)" 
        :alt="item.title" 
        loading="lazy"
        @load="imageLoaded = true"
        @error="imageError = true"
        :class="{ 'loaded': imageLoaded, 'error': imageError }"
      />
      <div v-else-if="imageError" class="placeholder-image error">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
        <span>Error al cargar imagen</span>
      </div>
      <div v-else class="placeholder-image">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
        <span>Sin imagen</span>
      </div>
    </div>
    
    <div class="card-content">
      <div class="card-meta">
        <span class="category">{{ item.categoryName }}</span>
        <span class="dot">•</span>
        <span>{{ item.countryName }}</span>
        <span class="dot">•</span>
        <span>{{ formatDate(item.publicationDate) }}</span>
      </div>
      
      <h3 class="card-title">
        <router-link :to="`/article/${item.id}`">{{ item.title }}</router-link>
      </h3>
      
      <p class="card-excerpt">{{ item.content.substring(0, 120) }}...</p>
      
      <div class="card-footer">
        <span class="author">{{ item.authorName }}</span>
        <div class="card-actions">
          <button class="action-btn" title="Guardar" @click="handleSave">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
          <button class="action-btn" title="Compartir" @click="handleShare">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped>
.news-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-primary);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  cursor: pointer;
}

/* Uiverse Shine Effect */
.news-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: -150%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right, 
    transparent 0%, 
    rgba(255, 255, 255, 0.4) 50%, 
    transparent 100%
  );
  transform: skewX(-25deg);
  pointer-events: none;
  transition: none;
}

.news-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 30px rgba(0,0,0,0.1);
  border-color: var(--accent);
}

.news-card:hover::after {
  left: 150%;
  transition: left 0.8s ease-in-out;
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: var(--bg-tertiary);
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: scale(1.1);
}

.card-image img.loaded {
  opacity: 1;
  transform: scale(1);
}

.card-image img.error {
  display: none;
}

.news-card:hover .card-image img {
  transform: scale(1.1);
}

.placeholder-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  background: var(--bg-secondary);
  gap: 0.5rem;
}

.placeholder-image.error {
  color: var(--accent);
}

.placeholder-image svg {
  opacity: 0.6;
}

.placeholder-image span {
  font-size: 0.875rem;
  font-weight: 500;
}

.card-content {
  padding: 1.5rem;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  color: var(--text-tertiary);
}

.category {
  color: var(--accent);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.dot {
  opacity: 0.5;
}

.card-title {
  margin: 0 0 1rem 0;
  font-family: var(--font-serif);
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--text-primary);
}

.card-title a {
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;
}

.card-title a:hover {
  color: var(--accent);
}

.card-excerpt {
  color: var(--text-secondary);
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 3;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--border-primary);
}

.author {
  font-size: 0.9rem;
  color: var(--text-tertiary);
  font-weight: 500;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-secondary);
  border-radius: 50%;
  background: var(--bg-primary);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(10px);
}

.news-card:hover .action-btn {
  opacity: 1;
  transform: translateY(0);
}

.action-btn:nth-child(1) {
  transition-delay: 0.1s;
}

.action-btn:nth-child(2) {
  transition-delay: 0.2s;
}

.action-btn:hover {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
  transform: translateY(-2px) scale(1.1);
  box-shadow: 0 4px 12px rgba(226, 59, 46, 0.3);
}

@media (max-width: 768px) {
  .news-card:hover {
    transform: translateY(-4px) scale(1.01);
  }
  
  .card-content {
    padding: 1rem;
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .action-btn {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>


