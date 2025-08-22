import { ref, watch, onMounted } from 'vue';

export function useDarkMode() {
  const isDark = ref(false);

  // Apply dark mode immediately
  function applyDarkMode() {
    const root = document.documentElement;
    if (isDark.value) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }

  // Initialize from localStorage or system preference
  function initializeDarkMode() {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      isDark.value = saved === 'true';
    } else {
      // Check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    applyDarkMode();
  }

  // Initialize immediately if we're in the browser
  if (typeof window !== 'undefined') {
    initializeDarkMode();
  }

  // Also initialize on mount for SSR compatibility
  onMounted(() => {
    if (typeof window !== 'undefined') {
      initializeDarkMode();
    }
  });

  // Watch for changes and persist to localStorage
  watch(isDark, (newValue) => {
    localStorage.setItem('darkMode', newValue.toString());
    applyDarkMode();
  });

  function toggle() {
    isDark.value = !isDark.value;
  }

  return {
    isDark,
    toggle
  };
}
