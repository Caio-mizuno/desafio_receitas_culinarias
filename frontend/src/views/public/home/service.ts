import type { Router } from 'vue-router'
import { useRecipeStore } from '@/stores/recipe.store'
import type { Category } from '@/types/recipe.types'

export const getCategoryNameFromList = (categories: Category[], categoriaId: number) => {
  const cat = categories.find(c => c.id === categoriaId)
  return cat?.nome || 'Categoria'
}

export const navigateToRecipes = (router: Router) => {
  router.push('/receitas')
}

export const navigateToCreate = (router: Router) => {
  router.push('/minhas-receitas/nova')
}

export const navigateToRecipe = (router: Router, id: number) => {
  router.push(`/receitas/${id}`)
}

export const getRecipesByCategory = async (categoriaId: number, limit = 5) => {
  const recipeStore = useRecipeStore()
  await recipeStore.fetchRecipes({ categoriaId })
  return recipeStore.filteredRecipes.slice(0, limit)
}

