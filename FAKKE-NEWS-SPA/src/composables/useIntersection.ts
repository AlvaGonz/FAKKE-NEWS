import { ref, onMounted, onBeforeUnmount } from 'vue';

export function useIntersection(callback: () => void) {
  const el = ref<HTMLElement | null>(null);
  let obs: IntersectionObserver | null = null;
  onMounted(() => {
    obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) callback(); });
    }, { rootMargin: '200px' });
    if (el.value) obs.observe(el.value);
  });
  onBeforeUnmount(() => { if (obs && el.value) obs.unobserve(el.value); });
  return { el };
}


