export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: any
  return ((...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(null, args), wait)
  }) as T
}

import apiClient from '@/plugins/axios'
import { MockService } from '@/services/mock.service'
import type { DefaultPaginationResponse } from '@/types/auth.types'
import type { Recipe, RecipeFilters, PaginationInfo } from '@/types/recipe.types'

export function buildRecipeFilters(nome?: string, categoriaId?: number | null): RecipeFilters {
  return {
    nome: nome || undefined,
    categoriaId: categoriaId || undefined,
  }
}

export async function fetchPaginatedRecipes(
  page: number,
  limit: number,
  filters: RecipeFilters = {},
): Promise<DefaultPaginationResponse<Recipe[]>> {
  try {
    const response = await apiClient.get<DefaultPaginationResponse<Recipe[]>>('/recipes', {
      params: {
        page,
        limit,
        categoriaId: filters.categoriaId,
        nome: filters.nome,
      },
    })
    return response.data
  } catch (err: any) {
    if (err.code === 'ERR_NETWORK' || err.message?.includes('Network Error') || !err.response) {
      const mocked = await MockService.getRecipesPaginated(page, limit, filters)
      return mocked
    }
    throw err
  }
}

export function updatePaginationInfo(pagination: PaginationInfo, total: number) {
  pagination.total = total
  pagination.totalPages = Math.max(1, Math.ceil(total / pagination.limit))
}

export function canLoadMore(pagination: PaginationInfo) {
  return pagination.page < pagination.totalPages
}
