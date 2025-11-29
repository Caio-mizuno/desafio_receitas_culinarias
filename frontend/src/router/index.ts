import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/public/home/index.vue'),
      alias: '/home',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/public/login/index.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/receitas',
      name: 'recipes',
      component: () => import('@/views/public/recipes/index.vue'),
    },
    {
      path: '/receitas/:id',
      name: 'recipe-detail',
      component: () => import('@/views/public/recipe-detail/index.vue'),
    },
    {
      path: '/categorias',
      name: 'categories',
      component: () => import('@/views/public/categories/index.vue'),
    },
    {
      path: '/minhas-receitas',
      name: 'my-recipes',
      component: () => import('@/views/private/my-recipes/index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/minhas-receitas/nova',
      name: 'create-recipe',
      component: () => import('@/views/private/recipe-form/index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/minhas-receitas/:id/editar',
      name: 'edit-recipe',
      component: () => import('@/views/private/recipe-form/index.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/perfil',
      name: 'profile',
      component: () => import('@/views/private/profile/index.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
