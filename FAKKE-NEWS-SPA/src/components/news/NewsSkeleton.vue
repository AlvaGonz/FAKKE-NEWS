<template>
  <div class="s-card" aria-hidden="true">
    <div class="s-media" />
    <div class="s-line" />
    <div class="s-line short" />
  </div>
</template>

<style scoped>
.s-card{background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,.06);padding:.75rem}
.s-media{aspect-ratio:16/9;background:linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%);animation:shimmer 1.5s infinite;border-radius:8px}
.s-line{height:12px;margin-top:.6rem;background:linear-gradient(90deg,#eee 25%,#f5f5f5 50%,#eee 75%);animation:shimmer 1.5s infinite;border-radius:6px}
.s-line.short{width:60%}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
</style>


