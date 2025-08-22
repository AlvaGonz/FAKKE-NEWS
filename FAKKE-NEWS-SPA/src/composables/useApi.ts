import { ref } from 'vue';

// Cache para evitar llamadas repetidas a la API
const cache = new Map<string, any>();

// Configuración de la URL base de la API desde variables de entorno
// @ts-ignore - Vite provides env via import.meta in runtime; safe to ignore for generic linters
const RAW_BASE = ((import.meta as any).env?.VITE_API_BASE as string) || 'https://localhost:7258/api';

export function useApi() {
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Construye URLs para las llamadas a la API
   * Maneja tanto URLs absolutas como relativas
   */
  function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>): URL {
    const isAbsolute = /^https?:\/\//i.test(RAW_BASE);
    const origin = window.location.origin;
    const base = isAbsolute ? RAW_BASE : (RAW_BASE.startsWith('/') ? RAW_BASE : '/' + RAW_BASE);
    let url: URL;
    
    if (isAbsolute) {
      // Preserva la ruta base (ej: '/api') cuando se pasan rutas como '/resource'
      const b = new URL(RAW_BASE);
      const basePath = b.pathname.endsWith('/') ? b.pathname.slice(0, -1) : b.pathname;
      const p = path.startsWith('/') ? path : '/' + path;
      url = new URL(b.origin + basePath + p);
    } else {
      const p = path.startsWith('/') ? path : '/' + path;
      url = new URL(base + p, origin);
    }
    
    // Agrega parámetros de consulta
    Object.entries(params || {}).forEach(([k, v]) => v !== undefined && url.searchParams.append(k, String(v)));
    return url;
  }

  /**
   * Realiza llamadas GET a la API con cache automático
   */
  async function get<T>(path: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    const url = buildUrl(path, params);
    const key = url.toString();
    
    // Verificar cache antes de hacer la llamada
    if (cache.has(key)) return cache.get(key);
    
    isLoading.value = true; 
    error.value = null;
    
    try {
      const res = await fetch(key, { headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      
      const data = await res.json();
      cache.set(key, data); // Guardar en cache
      return data as T;
    } catch (e: any) {
      console.error('[API]', key, e);
      error.value = e?.message ?? String(e);
      throw e;
    } finally { 
      isLoading.value = false; 
    }
  }

  return { get, isLoading, error };
}


