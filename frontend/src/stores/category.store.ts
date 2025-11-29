import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Category, CategoryWithCountDto } from '@/types/recipe.types'
import type { DefaultResponse } from '@/types/auth.types'
import apiClient from '@/plugins/axios'
import { MockService } from '@/services/mock.service'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref<Category[]>([])
  const categoriesCountRecipes = ref<CategoryWithCountDto[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const categoryOptions = computed(() =>
    categories.value.map(cat => ({
      text: cat.nome,
      value: cat.id,
    }))
  )

  const fetchCategories = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await apiClient.get<DefaultResponse<Category[]>>('/categories')
      categories.value = response.data.response
      return { success: true }
    } catch (err: any) {
      // Fallback to mock data when backend is not available
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || !err.response) {
        const response = await MockService.getCategories()
        categories.value = response.response
        return { success: true }
      }
      error.value = err.response?.data?.message || 'Erro ao buscar categorias'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

   const fetchCategoriesCount = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await apiClient.get<DefaultResponse<CategoryWithCountDto[]>>('/categories/count/recipes')
      categoriesCountRecipes.value = response.data.response
      return { success: true }
    } catch (err: any) {
      // Fallback to mock data when backend is not available
      if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || !err.response) {
        const response = await MockService.getCategories()
        categories.value = response.response
        return { success: true }
      }
      error.value = err.response?.data?.message || 'Erro ao buscar categorias'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const createCategory = async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiClient.post<DefaultResponse<Category>>('/categories', category)
      categories.value.push(response.data.response)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao criar categoria'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const updateCategory = async (id: number, category: Partial<Category>) => {
    loading.value = true
    error.value = null

    try {
      const response = await apiClient.put<DefaultResponse<Category>>(`/categories/${id}`, category)
      const index = categories.value.findIndex(c => c.id === id)
      if (index !== -1) {
        categories.value[index] = response.data.response
      }
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao atualizar categoria'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const deleteCategory = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      await apiClient.delete(`/categories/${id}`)
      categories.value = categories.value.filter(c => c.id !== id)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao excluir categoria'
      return { success: false, error: error.value }
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    categories,
    categoriesCountRecipes,
    loading,
    error,
    categoryOptions,
    fetchCategories,
    fetchCategoriesCount,
    createCategory,
    updateCategory,
    deleteCategory,
    clearError,
  }
})
