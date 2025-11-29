import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Recipe, RecipeFilters, PaginationInfo } from '@/types/recipe.types'
import type { DefaultResponse, DefaultPaginationResponse } from '@/types/auth.types'
import apiClient from '@/plugins/axios'
import { MockService } from '@/services/mock.service'

export const useRecipeStore = defineStore('recipe', () => {
  const recipes = ref<Recipe[]>([])
  const currentRecipe = ref<Recipe | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<RecipeFilters>({})
  const pagination = ref<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  })

  const filteredRecipes = computed(() => {
    let filtered = recipes.value

    if (filters.value.categoriaId) {
      filtered = filtered.filter(recipe => recipe.categoriaId === filters.value.categoriaId)
    }

    if (filters.value.nome) {
      const searchTerm = filters.value.nome.toLowerCase()
      filtered = filtered.filter(recipe =>
        recipe.nome.toLowerCase().includes(searchTerm)
      )
    }

    return filtered
  })

  const fetchRecipes = async (params?: RecipeFilters) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiClient.get<DefaultResponse<Recipe[]>>('/recipes', {
        params: params || filters.value
      })
      recipes.value = response.data.response
      return { success: true }
    } catch (err: any) {
      // Fallback to mock data when backend is not available
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || !err.response) {
        const response = await MockService.getRecipes(params || filters.value)
        recipes.value = response.response
        return { success: true }
      }
      error.value = err.response?.data?.message || 'Erro ao buscar receitas'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchRecipesPaginated = async (
    page: number = pagination.value.page,
    limit: number = pagination.value.limit,
    params?: RecipeFilters,
  ) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiClient.get<DefaultPaginationResponse<Recipe[]>>('/recipes', {
        params: { page, limit, ...(params || filters.value) }
      })
      recipes.value = response.data.response
      const total = response.data.total || 0
      const totalPages = Math.max(1, Math.ceil(total / limit))
      const currentPage = Math.min(Math.max(page, 1), totalPages)
      if (currentPage !== page) {
        const refetch = await apiClient.get<DefaultPaginationResponse<Recipe[]>>('/recipes', {
          params: { page: currentPage, limit, ...(params || filters.value) }
        })
        recipes.value = refetch.data.response
      }
      pagination.value = {
        page: currentPage,
        limit,
        total,
        totalPages,
      }
      return { success: true }
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || !err.response) {
        const response = await MockService.getRecipesPaginated(page, limit, params || filters.value)
        const total = response.total || 0
        const totalPages = Math.max(1, Math.ceil(total / limit))
        const currentPage = Math.min(Math.max(page, 1), totalPages)
        if (currentPage !== page) {
          const refetch = await MockService.getRecipesPaginated(currentPage, limit, params || filters.value)
          recipes.value = refetch.response
        } else {
          recipes.value = response.response
        }
        pagination.value = {
          page: currentPage,
          limit,
          total,
          totalPages,
        }
        return { success: true }
      }
      error.value = err.response?.data?.message || 'Erro ao buscar receitas paginadas'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchMyRecipesPaginated = async (
    page: number = pagination.value.page,
    limit: number = pagination.value.limit,
    params?: RecipeFilters,
  ) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiClient.get<DefaultPaginationResponse<Recipe[]>>('/recipes/my', {
        params: { page, limit, ...(params || filters.value) }
      })
      recipes.value = response.data.response
      const total = response.data.total || 0
      const totalPages = Math.max(1, Math.ceil(total / limit))
      const currentPage = Math.min(Math.max(page, 1), totalPages)
      if (currentPage !== page) {
        const refetch = await apiClient.get<DefaultPaginationResponse<Recipe[]>>('/recipes/my', {
          params: { page: currentPage, limit, ...(params || filters.value) }
        })
        recipes.value = refetch.data.response
      }
      pagination.value = {
        page: currentPage,
        limit,
        total,
        totalPages,
      }
      return { success: true }
    } catch (err: any) {
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || !err.response) {
        const response = await MockService.getRecipesPaginated(page, limit, params || filters.value)
        const total = response.total || 0
        const totalPages = Math.max(1, Math.ceil(total / limit))
        const currentPage = Math.min(Math.max(page, 1), totalPages)
        if (currentPage !== page) {
          const refetch = await MockService.getRecipesPaginated(currentPage, limit, params || filters.value)
          recipes.value = refetch.response
        } else {
          recipes.value = response.response
        }
        pagination.value = {
          page: currentPage,
          limit,
          total,
          totalPages,
        }
        return { success: true }
      }
      error.value = err.response?.data?.message || 'Erro ao buscar receitas paginadas'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const fetchRecipeById = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiClient.get<DefaultResponse<Recipe>>(`/recipes/${id}`)
      currentRecipe.value = response.data.response
      return { success: true }
    } catch (err: any) {
      // Fallback to mock data when backend is not available
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || !err.response) {
        const response = await MockService.getRecipeById(id)
        currentRecipe.value = response.response
        return { success: true }
      }
      error.value = err.response?.data?.message || 'Erro ao buscar receita'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const createRecipe = async (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiClient.post<DefaultResponse<Recipe>>('/recipes', recipe)
      recipes.value.unshift(response.data.response)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao criar receita'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateRecipe = async (id: number, recipe: Partial<Recipe>) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiClient.put<DefaultResponse<Recipe>>(`/recipes/${id}`, recipe)
      const index = recipes.value.findIndex(r => r.id === id)
      if (index !== -1) {
        recipes.value[index] = response.data.response
      }
      if (currentRecipe.value?.id === id) {
        currentRecipe.value = response.data.response
      }
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao atualizar receita'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteRecipe = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      await apiClient.delete(`/recipes/${id}`)
      recipes.value = recipes.value.filter(r => r.id !== id)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao excluir receita'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters: RecipeFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {}
  }

  const clearError = () => {
    error.value = null
  }

  return {
    recipes,
    currentRecipe,
    loading,
    error,
    filters,
    pagination,
    filteredRecipes,
    fetchRecipes,
    fetchRecipesPaginated,
    fetchMyRecipesPaginated,
    fetchRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    setFilters,
    clearFilters,
    clearError,
  }
})
