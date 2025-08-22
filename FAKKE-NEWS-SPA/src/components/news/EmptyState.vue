<template>
  <div class="empty">
    <div class="icon" aria-hidden="true">📰</div>
    <h3 class="title">No hay resultados</h3>
    <p class="msg">Prueba ajustando los filtros o realizando otra búsqueda.</p>
    <div class="actions">
      <button class="btn" @click="$emit('clear')">Limpiar filtros</button>
      <button class="btn btn-primary" @click="$emit('retry')">Reintentar</button>
    </div>
  </div>
  </template>

<style scoped>
.empty{background:#fff;border-radius:12px;padding:2rem;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.06)}
.icon{font-size:40px;margin-bottom:.5rem}
.title{margin:.25rem 0;font-weight:800}
.msg{color:#555;margin:.25rem 0 1rem}
.actions{display:flex;gap:.75rem;justify-content:center}
</style>


