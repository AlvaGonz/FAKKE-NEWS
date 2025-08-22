import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from 'rollup-plugin-visualizer';

// Configuración de Vite para el proyecto FAKKE NEWS SPA
export default defineConfig({
  plugins: [
    vue(),
    // Plugin para analizar el tamaño del bundle
    visualizer({ 
      filename: 'dist/stats.html', 
      open: true, 
      gzipSize: true, 
      brotliSize: true 
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // Proxy para manejar las llamadas a la API durante desarrollo
    proxy: {
      '/api': {
        target: 'https://localhost:7258', // API ASP.NET Core
        changeOrigin: true,
        secure: false, // Permite certificados autofirmados
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    target: 'es2015', // Compatibilidad con navegadores más antiguos
    minify: 'terser', // Minificación del código
    rollupOptions: {
      output: {
        // División del bundle para optimizar la carga
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router'],
          'ui-components': ['@vue/test-utils']
        },
        // Nomenclatura de archivos para cache busting
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000, // Límite de advertencia de tamaño
  },
  optimizeDeps: {
    include: ['vue', 'vue-router'] // Dependencias a pre-bundlear
  },
})