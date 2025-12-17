<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useNews, type NewsItem } from '@/composables/useNews';
import { resolveImageUrl } from '@/composables/useAssets';

const route = useRoute();
const n = useNews();
const item = ref<NewsItem | null>(null);
const showImageModal = ref(false);

// Extract lead paragraph (first paragraph) and remaining content
const leadParagraph = computed(() => {
  if (!item.value?.content) return '';
  const paragraphs = item.value.content.split('\n\n').filter(p => p.trim());
  return paragraphs[0] || '';
});

const remainingContent = computed(() => {
  if (!item.value?.content) return '';
  const paragraphs = item.value.content.split('\n\n').filter(p => p.trim());
  return paragraphs.slice(1).join('\n\n');
});

// Sharing functions
function shareOnTwitter() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(item.value?.title || '');
  window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareOnFacebook() {
  const url = encodeURIComponent(window.location.href);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareOnWhatsApp() {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(item.value?.title || '');
  window.open(`https://wa.me/?text=${text}%20${url}`, '_blank');
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href);
    console.log('Enlace copiado al portapapeles');
  } catch (err) {
    console.error('Error al copiar enlace:', err);
  }
}

function openImageModal() {
  showImageModal.value = true;
}

function closeImageModal() {
  showImageModal.value = false;
}

onMounted(async () => {
  const id = Number(route.params.id);
  item.value = await n.getById(id);
});
</script>

<template>
  <main class="article" v-if="item">
    <!-- Hero Section -->
    <section class="hero-section" v-if="item.imagePath" @click="openImageModal">
      <img 
        :src="resolveImageUrl(item.imagePath)" 
        :alt="item.title" 
        class="hero-image"
        loading="eager"
      />
      <div class="hero-overlay">
        <div class="hero-content">
          <div class="title-backdrop">
            <h1 class="hero-title">{{ item.title }}</h1>
          </div>
          <div class="hero-meta">
            <span class="category">{{ item.categoryName }}</span>
            <span class="dot">•</span>
            <span class="country">{{ item.countryName }}</span>
            <span class="dot">•</span>
            <time :datetime="item.publicationDate" class="date">
              {{ new Date(item.publicationDate).toLocaleDateString('es-ES', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) }}
            </time>
          </div>
        </div>
      </div>
    </section>

    <!-- Article Content -->
    <article class="article-content">
      <!-- Title for non-hero articles -->
      <header class="article-header" v-if="!item.imagePath">
        <h1 class="article-title">{{ item.title }}</h1>
        <div class="article-meta">
          <span class="category">{{ item.categoryName }}</span>
      <span class="dot">•</span>
          <span class="country">{{ item.countryName }}</span>
      <span class="dot">•</span>
          <time :datetime="item.publicationDate" class="date">
            {{ new Date(item.publicationDate).toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) }}
          </time>
        </div>
      </header>

      <!-- Main Content with Drop Cap -->
      <div class="content-body" v-if="remainingContent">
        <p class="drop-cap">{{ remainingContent }}</p>
      </div>

      <!-- Full content if no paragraphs to separate -->
      <div class="content-body" v-else-if="item.content">
        <p class="drop-cap">{{ item.content }}</p>
      </div>
    </article>

    <!-- Article Footer -->
    <footer class="article-footer">
      <div class="footer-content">
        <div class="article-tags">
          <router-link :to="`/category/${item.categoryId}`" class="tag category-tag">
            {{ item.categoryName }}
          </router-link>
          <router-link :to="`/country/${item.countryId}`" class="tag country-tag">
            {{ item.countryName }}
          </router-link>
        </div>
        
        <div class="article-info">
          <div class="article-author">
            <span class="author-label">Por:</span>
            <span class="author-name">{{ item.authorName }}</span>
          </div>
          
          <div class="share-buttons">
            <span class="share-label">Compartir:</span>
            <button 
              class="share-btn twitter" 
              @click="shareOnTwitter"
              aria-label="Compartir en Twitter"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            <button 
              class="share-btn facebook" 
              @click="shareOnFacebook"
              aria-label="Compartir en Facebook"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button 
              class="share-btn whatsapp" 
              @click="shareOnWhatsApp"
              aria-label="Compartir en WhatsApp"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </button>
            <button 
              class="share-btn copy" 
              @click="copyLink"
              aria-label="Copiar enlace"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>

    <!-- New Yorker Style Image Modal -->
    <div v-if="showImageModal" class="image-modal ny-modal" @click="closeImageModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeImageModal" aria-label="Close">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <figure class="modal-figure">
          <img 
            :src="resolveImageUrl(item.imagePath)" 
            :alt="item.title" 
            class="modal-image"
          />
          <figcaption class="modal-caption">
            {{ item.title }}
            <span class="modal-credit" v-if="item.authorName">Photograph by {{ item.authorName }}</span>
          </figcaption>
        </figure>
      </div>
    </div>
  </main>
</template>

<style scoped>
.article {
  min-height: 100vh;
  background: #fff;
}

/* Hero Section - Reduced to 80% height */
.hero-section {
  position: relative;
  width: 100%;
  height: 56vh; /* Reduced from 70vh to 56vh (80%) */
  min-height: 400px;
  overflow: hidden;
  margin-bottom: 3rem;
  cursor: pointer;
  z-index: 1;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.3s ease;
  pointer-events: none; /* Allow click to pass through to section */
}

.hero-section:hover .hero-image {
  transform: scale(1.02);
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.7) 100%
  );
  display: flex;
  align-items: flex-end;
}

.hero-content {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  padding: 3rem 2rem 2rem;
  color: #fff;
}

/* Title backdrop for better readability */
.title-backdrop {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(8px);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.hero-title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  line-height: 1.1;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.hero-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.95rem;
  opacity: 0.9;
}

/* Article Content */
.article-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem 3rem;
}

.article-header {
  margin-bottom: 2rem;
  padding-top: 2rem;
}

.article-title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  line-height: 1.2;
  margin-bottom: 1rem;
  color: #111;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #666;
  font-size: 0.95rem;
}

.category {
  color: var(--accent);
  font-weight: 600;
}

.dot {
  opacity: 0.6;
}

/* Content Body with Drop Cap */
.content-body {
  font-size: 1.1rem;
  line-height: 1.7;
  color: #222;
}

.drop-cap {
  text-align: justify;
  margin-bottom: 1.5rem;
}

.drop-cap::first-letter {
  color: var(--accent);
  float: left;
  font-family: var(--font-serif);
  font-size: 4rem;
  font-weight: 900;
  line-height: 0.8;
  margin: 0.1rem 0.5rem 0 0;
  text-shadow: 2px 2px 0px rgba(226, 59, 46, 0.1);
}

/* Full-width Article Footer */
.article-footer {
  width: 100%;
  background: #fafafa;
  border-top: 1px solid #eee;
  padding: 2rem 0;
}

.footer-content {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 2rem;
}

.article-tags {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.tag {
  padding: 0.5rem 1rem;
  border-radius: 999px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.category-tag {
  background: var(--accent);
  color: #fff;
}

.category-tag:hover {
  background: #c5281c;
  transform: translateY(-1px);
}

.country-tag {
  background: #f0f0f0;
  color: #333;
}

.country-tag:hover {
  background: #e0e0e0;
  transform: translateY(-1px);
}

.article-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.article-author {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.95rem;
}

.author-label {
  font-weight: 600;
}

.author-name {
  color: #333;
  font-weight: 500;
}

.share-buttons {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.share-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 600;
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #fff;
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.share-btn.twitter {
  background: #1da1f2;
}

.share-btn.twitter:hover {
  background: #1a91da;
}

.share-btn.facebook {
  background: #1877f2;
}

.share-btn.facebook:hover {
  background: #166fe5;
}

.share-btn.whatsapp {
  background: #25d366;
}

.share-btn.whatsapp:hover {
  background: #22c55e;
}

.share-btn.copy {
  background: #6b7280;
  color: #fff;
}

.share-btn.copy:hover {
  background: #4b5563;
}

/* New Yorker Lightbox Modal */
.image-modal.ny-modal {
  background: rgba(255, 255, 255, 0.98); /* White overlay */
  backdrop-filter: blur(5px);
  color: #111;
}

.ny-modal .modal-content {
  max-width: 1200px;
  width: 90vw;
  box-shadow: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.ny-modal .modal-close {
  position: absolute;
  top: -60px;
  right: 0;
  color: #333;
  background: transparent;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.ny-modal .modal-close:hover {
  background: transparent;
  color: var(--accent);
  transform: scale(1.1);
}

.modal-figure {
  margin: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-image {
  max-height: 80vh;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1); /* Elegant shadow */
  border-radius: 2px;
}

.modal-caption {
  margin-top: 1.5rem;
  font-family: var(--font-display);
  font-size: 1.25rem;
  text-align: center;
  max-width: 800px;
  line-height: 1.4;
  color: #111;
}

.modal-credit {
  display: block;
  font-family: var(--font-ui);
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Responsive */
@media (max-width: 768px) {
  .hero-section {
    height: 40vh; /* Reduced for mobile */
    min-height: 300px;
  }
  
  .hero-content {
    padding: 2rem 1rem 1.5rem;
  }
  
  .title-backdrop {
    padding: 1rem;
  }
  
  .article-content {
    padding: 0 1rem 2rem;
  }
  
  .footer-content {
    padding: 0 1rem;
  }
  
  .drop-cap::first-letter {
    font-size: 3rem;
  }
  
  .modal-content {
    max-width: 95vw;
  }
}
</style>


