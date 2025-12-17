<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useNews } from '@/composables/useNews';
import { useOffline } from '@/composables/useOffline';
import DropdownSelect from '@/components/news/DropdownSelect.vue';

const router = useRouter();
const n = useNews();
const { isOffline } = useOffline();
const open = ref(false);

const currentDate = computed(() => {
  return new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }).toUpperCase();
});

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
  <header class="header">
    <!-- WSJ Top Bar: Date & Editions -->
    <div class="header-top">
      <div class="container top-bar-content">
        <span class="date">{{ currentDate }}</span>
        <div class="editions">
          <span>PRINT EDITION</span>
          <span class="divider">|</span>
          <span>VIDEO</span>
        </div>
      </div>
    </div>

    <!-- WSJ Main: Centered Logo -->
    <div class="header-main">
      <router-link to="/" class="logo">
        <span class="logo-text">THE FA<span class="spinning-k">K</span><span class="spinning-k">K</span>E NEWS</span>
      </router-link>
    </div>

    <!-- WSJ Nav: Sticky Navigation -->
    <div class="header-nav">
      <div class="container nav-content">
        <button class="sections-btn" @click="open = true">
          <span class="hamburger-icon">☰</span>
          SECTIONS
        </button>

        <div class="nav-filters">
           <DropdownSelect
              v-model="selectedCategoryId"
              :options="n.categories.value.map(c => ({ value: c.id, label: c.name }))"
              placeholder="SECTIONS"
              @update="onCategorySelect"
            />
            <DropdownSelect
              v-model="selectedCountryId"
              :options="n.countries.value.map(c => ({ value: c.id, label: c.name }))"
              placeholder="EDITIONS"
              @update="onCountrySelect"
            />
        </div>

        <div class="search-mini">
          <input 
            v-model="searchQuery" 
            placeholder="Search..." 
            @keypress="handleKeyPress"
          />
          <button @click="handleSearch">🔍</button>
        </div>
      </div>
    </div>

    <!-- Offline indicator -->
    <div v-if="isOffline" class="offline-bar">
      OFFLINE MODE
    </div>

    <!-- Sidebar (Keep existing functionality but restyle) -->
    <div v-if="open" class="offcanvas" @click="open = false">
      <div class="panel" @click.stop>
        <div class="panel-header">
          <h3>SECTIONS</h3>
          <button class="close-btn" @click="open = false">&times;</button>
        </div>
        
        <div class="panel-content">
          <div class="panel-section">
             <router-link to="/" class="nav-link" @click="open=false">Home</router-link>
          </div>
          <div class="panel-section">
            <h4 class="section-title">Categories</h4>
             <router-link
                v-for="c in n.categories.value"
                :key="'m-cat-'+c.id"
                :to="`/category/${c.id}`"
                @click="open=false"
                class="nav-link"
              >
                {{ c.name }}
              </router-link>
          </div>
          <div class="panel-section">
             <h4 class="section-title">Countries</h4>
             <router-link
                v-for="c in n.countries.value"
                :key="'m-cnt-'+c.id"
                :to="`/country/${c.id}`"
                @click="open=false"
                class="nav-link"
              >
                {{ c.name }}
              </router-link>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* Local Component Overrides matching WSJ Structure */

.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-ui);
  font-size: 0.75rem;
  letter-spacing: 1px;
  color: var(--text-tertiary);
  padding: 0.5rem 1rem;
}

.divider {
  margin: 0 0.5rem;
  color: var(--border-primary);
}

.header-nav {
  border-top: 1px solid var(--text-primary); /* Heavy border above nav */
  border-bottom: 1px solid var(--border-primary);
  background: var(--bg-primary);
  padding: 0.5rem 0;
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sections-btn {
  background: none;
  border: none;
  font-family: var(--font-ui);
  font-weight: 700;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: var(--text-primary);
}

.nav-filters {
  display: flex;
  gap: 1rem;
}

.search-mini {
  display: flex;
  align-items: center;
  border: 1px solid var(--border-primary);
  padding: 0.25rem 0.5rem;
  border-radius: 4px; /* Slightly rounded */
}

.search-mini input {
  border: none;
  outline: none;
  font-family: var(--font-ui);
  font-size: 0.85rem;
  width: 120px;
}

.search-mini button {
  background: none;
  border: none;
  cursor: pointer;
}

.offline-bar {
  background: var(--text-primary);
  color: white;
  text-align: center;
  font-family: var(--font-ui);
  font-size: 0.75rem;
  padding: 0.25rem;
  letter-spacing: 1px;
}

/* Sidebar overrides */
.panel {
  width: 300px;
  background: white;
  height: 100%;
  border-right: 1px solid var(--border-primary);
}

.nav-link {
  display: block;
  padding: 0.5rem 0;
  color: var(--text-primary);
  text-decoration: none;
  font-family: var(--font-body);
  font-weight: 700;
  border-bottom: 1px solid var(--border-secondary);
}

.nav-link:hover {
  text-decoration: underline;
}

.section-title {
  font-family: var(--font-ui);
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--text-muted);
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

/* Easter Egg: Spinning K */
.spinning-k {
  display: inline-block;
  transition: transform 0.2s;
}

.spinning-k:hover {
  animation: spin-k 0.2s linear infinite;
  color: var(--accent);
}

@keyframes spin-k { 
  100% { transform: rotate(360deg); } 
}
</style>


