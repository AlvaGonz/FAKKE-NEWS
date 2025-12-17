import { ref, computed } from 'vue';
import { useApi } from './useApi';

// Interfaces para tipado fuerte
export interface NewsItem {
  id: number;
  title: string;
  content: string;
  imagePath?: string;
  categoryId: number;
  categoryName?: string;
  countryId: number;
  countryName?: string;
  publicationDate: string; // The API returns PublicationDate
  author?: string;
  authorName?: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  name: string;
}

export function useNews() {
  const api = useApi();

  interface PaginatedResponse<T> {
    data: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }

  // Estado reactivo para noticias y metadatos
  const list = ref<NewsItem[]>([]);
  const categories = ref<Category[]>([]);
  const countries = ref<Country[]>([]);

  // Filtros activos
  const currentPage = ref(1);
  const pageSize = ref(12);
  const total = ref(0);
  const totalPages = ref(0);

  const categoryFilter = ref<number | null>(null);
  const countryFilter = ref<number | null>(null);
  const searchFilter = ref<string>('');

  // Computed para obtener items con tipado correcto
  const items = computed(() => list.value);

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
      // The API returns fields in PascalCase usually if using default .NET JSON options, 
      // but let's check if they are camelCase or PascalCase. 
      // Dotnet 9 minimal APIs or Controllers usually default to camelCase now, 
      // but let's look at the implementation response again later if needed.
      // Assuming case-insensitive matching or standard camelCase from ASP.NET Core default.
      const response = await api.get<PaginatedResponse<NewsItem>>('news', params);

      // Handle case sensitivity if needed, but usually JS object keys from JSON are camelCase
      // However, the C# controller returns anonymous object which serializes to camelCase by default in .NET Core.
      // But let's be safe and check usage.
      // The properties in the C# anonymous object are PascalCase in definition: Data, TotalCount, etc.
      // ASP.NET Core default serializer (System.Text.Json) converts to camelCase by default.

      const result = response as any;
      // In case serialization preserves PascalCase (older MVC or configured differently)
      const data = result.data || result.Data || [];
      const totalCount = result.totalCount || result.TotalCount || 0;
      const pages = result.totalPages || result.TotalPages || 0;

      list.value = data;
      total.value = totalCount;
      totalPages.value = pages;

    } catch (error) {
      console.error('Error fetching news:', error);
      list.value = [];
      total.value = 0;
      totalPages.value = 0;
    }
  }

  /**
   * Resetea filtros y vuelve a la primera página
   */
  function resetFilters() {
    currentPage.value = 1;
    // Don't clear filters, just reset pagination? 
    // The original code reset filters when individual setters were called, 
    // but clearFilters call resetFilters too.
    // Wait, the original code had setCategoryFilter calling resetFilters which cleared EVERYTHING?
    // Let's re-read original:
    // setCategoryFilter sets filter then calls resetFilters.
    // resetFilters: resets currentPage, AND sets all filters to null... 
    // THAT SEEMS WRONG for "setCategoryFilter". 
    // Use logic: if setting a category, we want to reset page to 1, but keep the category we just set.
    // I should fix this logic too while I am here.

    // original resetFilters cleared everything including filters. 
    // But setCategoryFilter sets value THEN calls resetFilters. 
    // If resetFilters clears values, then setCategoryFilter does nothing effectively?
    // Let's check original lines 69-75 and 80-83.
    // function resetFilters() { currentPage=1; categoryFilter=null ... }
    // function setCategoryFilter(id) { categoryFilter.value = id; resetFilters(); }
    // This indeed would clear the filter immediately. That is a bug.

    // I will implementation proper filtering logic.
    fetchList();
  }

  function applyFilterChange() {
    currentPage.value = 1;
    fetchList();
  }

  /**
   * Aplica filtro por categoría
   */
  function setCategoryFilter(categoryId: number) {
    categoryFilter.value = categoryId;
    applyFilterChange();
  }

  /**
   * Aplica filtro por país
   */
  function setCountryFilter(countryId: number) {
    countryFilter.value = countryId;
    applyFilterChange();
  }

  /**
   * Aplica filtro de búsqueda
   */
  function setSearchFilter(search: string) {
    searchFilter.value = search;
    applyFilterChange();
  }

  /**
   * Limpia todos los filtros
   */
  function clearFilters() {
    currentPage.value = 1;
    categoryFilter.value = null;
    countryFilter.value = null;
    searchFilter.value = '';
    fetchList();
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
      const response = await api.get<any>('news', params);
      const result = response as any;
      const data = result.data || result.Data || [];

      list.value = [...list.value, ...data];
    } catch (error) {
      console.error('Error loading more news:', error);
      currentPage.value--; // Revertir en caso de error
    }
  }

  /**
   * Obtiene una noticia por ID
   */
  async function getById(id: number): Promise<NewsItem | null> {
    try {
      const data = await api.get<NewsItem>(`news/${id}`);
      return data;
    } catch (error) {
      console.error(`Error fetching news ${id}:`, error);
      return null;
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

    // Pagination
    page: currentPage,
    total,
    totalPages,

    // Filters (exposed directly for v-model binding compatibility if needed, though functions are safer)
    // Exposing searchFilter as 'search' for compatibility
    search: searchFilter,

    fetchList,
    fetchCategories,
    fetchCountries,
    getById,
    resetFilters: clearFilters, // map to clearFilters for compatibility or use logic
    setCategoryFilter,
    setCountryFilter,
    setSearchFilter,
    clearFilters,
    loadMore
  };
}


