<script setup lang="ts">
import AppHeader from '@/components/layout/AppHeader.vue'
</script>

<template>
  <div class="app">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <footer class="footer">© {{ new Date().getFullYear() }} FAKKE NEWS</footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background: #f7f7f7;
}

.footer {
  background: #fff;
  padding: 2rem 1rem;
  text-align: center;
  color: #666;
  border-top: 1px solid #eee;
}
</style>
