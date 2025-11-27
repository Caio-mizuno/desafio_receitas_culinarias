import { useRecipeStore } from '@/stores/recipe.store'

export async function removeRecipe(id: number) {
  const recipeStore = useRecipeStore()
  return recipeStore.deleteRecipe(id)
}

