import { ref, onMounted, onUnmounted } from 'vue';

export function useOffline() {
  const isOnline = ref(navigator.onLine);
  const isOffline = ref(!navigator.onLine);

  function updateOnlineStatus() {
    isOnline.value = navigator.onLine;
    isOffline.value = !navigator.onLine;
    
    // Show notification when connection status changes
    if (isOffline.value) {
      console.log('App is now offline');
    } else {
      console.log('App is now online');
    }
  }

  // Request notification permission
  async function requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Show notification
  function showNotification(title: string, options?: NotificationOptions) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        ...options
      });
    }
  }

  // Background sync registration
  async function registerBackgroundSync(tag: string) {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration) {
        await (registration as any).sync.register(tag);
      }
    }
  }

  onMounted(() => {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  });

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
  });

  return {
    isOnline,
    isOffline,
    requestNotificationPermission,
    showNotification,
    registerBackgroundSync
  };
}
