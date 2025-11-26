import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true }
    },
    {
      path: '/receitas',
      name: 'recipes',
      component: () => import('@/views/HomeView.vue')
    },
    {
      path: '/receitas/:id',
      name: 'recipe-detail',
      component: () => import('@/views/RecipeDetailView.vue')
    },
    {
      path: '/categorias',
      name: 'categories',
      component: () => import('@/views/CategoriesView.vue')
    },
    {
      path: '/minhas-receitas',
      name: 'my-recipes',
      component: () => import('@/views/MyRecipesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/minhas-receitas/nova',
      name: 'create-recipe',
      component: () => import('@/views/RecipeFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/minhas-receitas/:id/editar',
      name: 'edit-recipe',
      component: () => import('@/views/RecipeFormView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/perfil',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true }
    }
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
