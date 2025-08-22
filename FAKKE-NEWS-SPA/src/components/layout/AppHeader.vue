<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNews } from '@/composables/useNews';
import { useOffline } from '@/composables/useOffline';
import DropdownSelect from '@/components/news/DropdownSelect.vue';
import NyLogo from './NyLogo.vue';

const router = useRouter();
const n = useNews();
const { isOffline } = useOffline();
const open = ref(false);

// Fetch categories and countries on mount
onMounted(async () => {
  await n.fetchCategories();
  await n.fetchCountries();
});

// Current route-based selections
const currentCategory = computed(() => {
  const route = router.currentRoute.value;
  if (route.name === 'category' && route.params.id) {
    return Number(route.params.id);
  }
  return undefined;
});

const currentCountry = computed(() => {
  const route = router.currentRoute.value;
  if (route.name === 'country' && route.params.id) {
    return Number(route.params.id);
  }
  return undefined;
});

// Selected values for dropdowns
const selectedCategoryId = computed({
  get: () => currentCategory.value,
  set: (value: number | undefined) => {
    if (value) {
      router.push(`/category/${value}`);
    } else {
      router.push('/');
    }
  }
});

const selectedCountryId = computed({
  get: () => currentCountry.value,
  set: (value: number | undefined) => {
    if (value) {
      router.push(`/country/${value}`);
    } else {
      router.push('/');
    }
  }
});

// Navigation handlers
function onCategorySelect(value: string | number | undefined) {
  if (typeof value === 'number') {
    router.push(`/category/${value}`);
  } else {
    router.push('/');
  }
}

function onCountrySelect(value: string | number | undefined) {
  if (typeof value === 'number') {
    router.push(`/country/${value}`);
  } else {
    router.push('/');
  }
}

function go(path: string) {
  router.push(path);
  open.value = false;
}

// Search functionality
const searchQuery = ref('');

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push(`/search/${encodeURIComponent(searchQuery.value.trim())}`);
  }
}

function handleKeyPress(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    handleSearch();
  }
}
</script>

<template>
  <header class="ny-header">
    <!-- Offline indicator -->
    <div v-if="isOffline" class="offline-indicator">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="1" y1="1" x2="23" y2="23"></line>
        <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
        <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
        <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
        <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
        <line x1="12" y1="20" x2="12.01" y2="20"></line>
      </svg>
      <span>Sin conexión</span>
    </div>

    <div class="bar">
      <div class="header-content">
        <!-- Logo and Hamburger -->
        <div class="header-left">
          <router-link to="/" class="logo">
            <NyLogo />
          </router-link>
          <button class="hamburger" @click="open = true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- Search Section -->
        <div class="search-section">
          <div class="nav">
            <!-- Category Dropdown -->
            <DropdownSelect
              v-model="selectedCategoryId"
              :options="n.categories.value.map(c => ({ value: c.id, label: c.name }))"
              placeholder="Todas las categorías"
              @update="onCategorySelect"
            />
            
            <!-- Country Dropdown -->
            <DropdownSelect
              v-model="selectedCountryId"
              :options="n.countries.value.map(c => ({ value: c.id, label: c.name }))"
              placeholder="Todos los países"
              @update="onCountrySelect"
            />
          </div>

          <!-- Search Bar -->
          <div class="search">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar noticias..."
              @keypress="handleKeyPress"
            />
            <button @click="handleSearch">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar -->
    <div v-if="open" class="offcanvas" @click="open = false">
      <div class="panel" @click.stop>
        <div class="panel-header">
          <h3>Navegación</h3>
          <button class="close-btn" @click="open = false">&times;</button>
        </div>
        <div class="panel-section">
            <div class="nav-links">
              <router-link to="/" @click="open=false" class="nav-link">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9,22 9,12 15,12 15,22"></polyline>
                </svg>
                Inicio
              </router-link>
            </div>
          </div>
        <div class="panel-content">
          <div class="panel-section">
            <h4 class="section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3h18v18H3z"></path>
                <path d="M9 9h6v6H9z"></path>
              </svg>
              Categorías
            </h4>
            <div class="nav-links">
              <router-link
                v-for="c in n.categories.value"
                :key="'m-cat-'+c.id"
                :to="`/category/${c.id}`"
                @click="open=false"
                class="nav-link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3h18v18H3z"></path>
                  <path d="M9 9h6v6H9z"></path>
                </svg>
                {{ c.name }}
              </router-link>
            </div>
          </div>

          <div class="panel-section">
            <h4 class="section-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
                <path d="M12 6v6l4 2"></path>
              </svg>
              Países
            </h4>
            <div class="nav-links">
              <router-link
                v-for="c in n.countries.value"
                :key="'m-cnt-'+c.id"
                :to="`/country/${c.id}`"
                @click="open=false"
                class="nav-link"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
                  <path d="M12 6v6l4 2"></path>
                </svg>
                {{ c.name }}
              </router-link>
            </div>
          </div>
        </div>
    </div>
        </div>
  </header>
</template>

<style scoped>
.ny-header {
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-primary);
  position: sticky;
  top: 0;
  z-index: 50;
}

.bar {
  padding: 1rem 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--text-primary);
  text-decoration: none;
}

.logo-text {
  background: linear-gradient(135deg, var(--accent), #ff6b6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  justify-content: flex-end;
}

.nav {
  display: flex;
  gap: 0.75rem;
}

.search {
  display: flex;
  align-items: center;
  background: var(--bg-secondary);
  border: 1px solid var(--border-secondary);
  border-radius: 999px;
  padding: 0.5rem;
  gap: 0.5rem;
  min-width: 300px;
}

.search input {
  flex: 1;
  border: none;
  background: none;
  outline: none;
  padding: 0.5rem;
  color: var(--text-primary);
  font-size: 0.95rem;
}

.search input::placeholder {
  color: var(--text-muted);
}

.search button {
  border: 1px solid var(--border-secondary);
  border-radius: 999px;
  background: var(--bg-primary);
  padding: 0.65rem 0.85rem;
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.search button:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-primary);
  transform: translateY(-1px);
}

/* Theme Toggle */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-secondary);
  border-radius: 50%;
  background: var(--bg-primary);
  color: var(--text-tertiary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-primary);
  transform: translateY(-2px) scale(1.05);
  box-shadow: 0 4px 12px var(--shadow-medium);
}

.theme-icon {
  transition: transform 0.3s ease;
}

.theme-toggle:hover .theme-icon {
  transform: rotate(15deg);
}

.hamburger {
  border: 1px solid var(--border-secondary);
  background: var(--bg-primary);
  border-radius: 8px;
  padding: 0.35rem 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--text-tertiary);
}

.hamburger:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-primary);
  transform: translateY(-1px);
}

/* Enhanced Sidebar */
.offcanvas {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
}

.panel {
  width: 85%;
  max-width: 380px;
  background: var(--bg-primary);
  height: 100%;
  box-shadow: 8px 0 32px var(--shadow-heavy);
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid var(--border-primary);
}

.panel-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.close-btn {
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  color: var(--text-tertiary);
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

.panel-content {
  flex-grow: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.panel-section {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-primary);
}

.panel-section:last-child {
  border-bottom: none;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-title svg {
  opacity: 0.7;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  text-decoration: none;
  color: var(--text-secondary);
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 0.95rem;
}

.nav-link:hover {
  background: var(--bg-tertiary);
  color: var(--accent);
  transform: translateX(4px);
}

.nav-link svg {
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.nav-link:hover svg {
  opacity: 1;
}

/* Sidebar theme toggle */
.sidebar-theme-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: none;
  background: none;
  color: var(--text-secondary);
  border-radius: 8px;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  cursor: pointer;
}

.sidebar-theme-toggle:hover {
  background: var(--bg-tertiary);
  color: var(--accent);
  transform: translateX(4px);
}

.sidebar-theme-toggle svg {
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.sidebar-theme-toggle:hover svg {
  opacity: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .search {
    min-width: 200px;
  }
  
  .nav {
    display: none;
  }
}
</style>


