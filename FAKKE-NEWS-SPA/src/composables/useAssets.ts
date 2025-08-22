// Resolve asset URLs (images) against API origin when paths are relative
// Uses same env as useApi
// @ts-ignore - Vite provides env via import.meta at runtime
const RAW_BASE = ((import.meta as any).env?.VITE_API_BASE as string) || '';
// Optional override for where static uploads are served (e.g., MVC host)
// @ts-ignore
const ASSET_ORIGIN = ((import.meta as any).env?.VITE_ASSET_ORIGIN as string) || '';

function getApiOrigin(): string | null {
  try {
    if (!RAW_BASE) return null;
    const u = new URL(RAW_BASE);
    return u.origin;
  } catch {
    return null;
  }
}

export function resolveImageUrl(path?: string): string | undefined {
  if (!path) return undefined;
  // Already absolute
  if (/^https?:\/\//i.test(path)) return path;
  const origin = ASSET_ORIGIN || getApiOrigin() || window.location.origin;
  const normalized = path.startsWith('/') ? path : '/' + path;
  return origin + normalized;
}


