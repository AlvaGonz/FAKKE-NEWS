import { ref, computed } from 'vue';
import { useApi } from './useApi';

// Interfaces para tipado fuerte
interface NewsItem {
  id: number;
  title: string;
  content: string;
  imagePath?: string;
  categoryId: number;
  countryId: number;
  publishedAt: string;
  author?: string;
}

interface Category {
  id: number;
  name: string;
}

interface Country {
  id: number;
  name: string;
}

export function useNews() {
  const api = useApi();
  
  // Estado reactivo para noticias y metadatos
  const list = ref<NewsItem[]>([]);
  const categories = ref<Category[]>([]);
  const countries = ref<Country[]>([]);
  
  // Filtros activos
  const currentPage = ref(1);
  const pageSize = ref(12);
  const categoryFilter = ref<number | null>(null);
  const countryFilter = ref<number | null>(null);
  const searchFilter = ref<string>('');

  // Computed para obtener items con tipado correcto
  const items = computed(() => list.value as NewsItem[]);

  /**
   * Obtiene la lista de noticias con filtros aplicados
   */
  async function fetchList() {
    const params: any = {
      page: currentPage.value,
      pageSize: pageSize.value
    };

    if (categoryFilter.value) params.categoryId = categoryFilter.value;
    if (countryFilter.value) params.countryId = countryFilter.value;
    if (searchFilter.value) params.search = searchFilter.value;

    try {
      const data = await api.get<NewsItem[]>('news', params);
      list.value = data;
    } catch (error) {
      console.error('Error fetching news:', error);
      list.value = [];
    }
  }

  /**
   * Resetea filtros y vuelve a la primera página
   */
  function resetFilters() {
    currentPage.value = 1;
    categoryFilter.value = null;
    countryFilter.value = null;
    searchFilter.value = '';
    fetchList();
  }

  /**
   * Aplica filtro por categoría
   */
  function setCategoryFilter(categoryId: number) {
    categoryFilter.value = categoryId;
    resetFilters();
  }

  /**
   * Aplica filtro por país
   */
  function setCountryFilter(countryId: number) {
    countryFilter.value = countryId;
    resetFilters();
  }

  /**
   * Aplica filtro de búsqueda
   */
  function setSearchFilter(search: string) {
    searchFilter.value = search;
    resetFilters();
  }

  /**
   * Limpia todos los filtros
   */
  function clearFilters() {
    resetFilters();
  }

  /**
   * Carga la siguiente página de noticias
   */
  async function loadMore() {
    currentPage.value++;
    const params: any = {
      page: currentPage.value,
      pageSize: pageSize.value
    };

    if (categoryFilter.value) params.categoryId = categoryFilter.value;
    if (countryFilter.value) params.countryId = countryFilter.value;
    if (searchFilter.value) params.search = searchFilter.value;

    try {
      const data = await api.get<NewsItem[]>('news', params);
      list.value = [...list.value, ...data];
    } catch (error) {
      console.error('Error loading more news:', error);
      currentPage.value--; // Revertir en caso de error
    }
  }

  /**
   * Obtiene las categorías disponibles
   */
  async function fetchCategories() {
    try {
      const data = await api.get<Category[]>('categories');
      categories.value = data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      categories.value = [];
    }
  }

  /**
   * Obtiene los países disponibles
   */
  async function fetchCountries() {
    try {
      const data = await api.get<Country[]>('countries');
      countries.value = data;
    } catch (error) {
      console.error('Error fetching countries:', error);
      countries.value = [];
    }
  }

  return {
    list: items,
    categories,
    countries,
    isLoading: api.isLoading,
    error: api.error,
    fetchList,
    fetchCategories,
    fetchCountries,
    resetFilters,
    setCategoryFilter,
    setCountryFilter,
    setSearchFilter,
    clearFilters,
    loadMore
  };
}


