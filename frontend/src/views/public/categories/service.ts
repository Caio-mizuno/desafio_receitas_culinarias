import { useRecipeStore } from '@/stores/recipe.store'

export function getRecipeCountByCategory(categoryId: number) {
  const recipeStore = useRecipeStore()
  return recipeStore.recipes.filter((recipe) => recipe.categoriaId === categoryId).length
}

export function navigateToFilteredCategory(categoryId: number, push: (path: string) => void) {
  const recipeStore = useRecipeStore()
  recipeStore.setFilters({ categoriaId: categoryId })
  push('/')
}
