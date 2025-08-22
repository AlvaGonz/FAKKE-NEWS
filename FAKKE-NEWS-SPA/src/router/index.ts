import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: () => import('@/views/HomeView.vue') },
    { path: '/category/:id', component: () => import('@/views/CategoryView.vue') },
    { path: '/country/:id', component: () => import('@/views/CountryView.vue') },
    { path: '/search/:q?', component: () => import('@/views/SearchView.vue') },
    { path: '/article/:id', component: () => import('@/views/ArticleView.vue') },
  ],
  scrollBehavior: () => ({ top: 0 }),
});

export default router;


