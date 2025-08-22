<script setup lang="ts">
import { ref, watch } from 'vue';

const emit = defineEmits<{ (e:'update', v:{ countryId?: number; categoryId?: number; q?: string }):void }>();

const q = ref('');

watch([q], () => emit('update', { q: q.value }), { immediate: true });
</script>

<template>
  <form class="filters" @submit.prevent>
    <div class="control">
      <input class="search" v-model.trim="q" type="search" placeholder="Buscar noticias…" aria-label="Buscar noticias" />
    </div>
  </form>
</template>

<style scoped>
.filters{display:flex;gap:.75rem;align-items:center}
.control{display:flex;flex:1}
.search{padding:.65rem .85rem;border:1px solid #ddd;border-radius:999px;background:#fff;box-shadow:0 6px 18px rgba(0,0,0,.05) inset;width:100%}

</style>


