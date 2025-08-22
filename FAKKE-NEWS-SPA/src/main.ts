import './assets/main.css'
import './assets/styles.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

const app = createApp(App)

app.use(router)

app.mount('#app')
