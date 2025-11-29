import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRecipeStore } from '@/stores/recipe.store'
import apiClient from '@/plugins/axios'
import { MockService } from '@/services/mock.service'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('recipe.store', () => {
  it('filtra receitas por categoria e nome', () => {
    const store = useRecipeStore()
    store.recipes = [
      { id: 1, nome: 'Bolo', categoriaId: 1, tempoPreparoMinutos: 10, porcoes: 1, ingredientes: 'a' } as any,
      { id: 2, nome: 'Carne', categoriaId: 2, tempoPreparoMinutos: 20, porcoes: 2, ingredientes: 'b' } as any,
    ]
    store.setFilters({ categoriaId: 1 })
    expect(store.filteredRecipes.length).toBe(1)
    store.setFilters({ nome: 'car' })
    expect(store.filteredRecipes.length).toBe(0)
    store.clearFilters()
    expect(store.filteredRecipes.length).toBe(2)
  })

  it('fetchRecipes sucesso e fallback', async () => {
    const store = useRecipeStore()
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: { response: [{ id: 1, nome: 'Bolo', categoriaId: 1 }] } } as any)
    let res = await store.fetchRecipes()
    expect(res.success).toBe(true)
    vi.spyOn(apiClient, 'get').mockRejectedValueOnce({ code: 'ERR_NETWORK', message: 'Network Error' })
    vi.spyOn(MockService, 'getRecipes').mockResolvedValueOnce({ response: [{ id: 2, nome: 'Carne', categoriaId: 2 }], message: '', status: true })
    res = await store.fetchRecipes()
    expect(res.success).toBe(true)
    expect(store.recipes[0].id).toBe(2)
  })

  it('fetchRecipesPaginated corrige página fora do limite', async () => {
    const store = useRecipeStore()
    const first = { data: { response: [{ id: 3, nome: 'X', categoriaId: 1 }], total: 1 } }
    const second = { data: { response: [{ id: 4, nome: 'Y', categoriaId: 2 }], total: 1 } }
    const getSpy = vi.spyOn(apiClient, 'get')
    getSpy.mockResolvedValueOnce(first as any)
    getSpy.mockResolvedValueOnce(second as any)
    const res = await store.fetchRecipesPaginated(2, 12)
    expect(res.success).toBe(true)
    expect(store.pagination.page).toBe(1)
    expect(store.recipes[0].id).toBe(4)
  })

  it('fetchMyRecipesPaginated fallback com MockService', async () => {
    const store = useRecipeStore()
    vi.spyOn(apiClient, 'get').mockRejectedValueOnce({ code: 'ERR_NETWORK', message: 'Network Error' })
    vi.spyOn(MockService, 'getRecipesPaginated').mockResolvedValueOnce({ response: [{ id: 5, nome: 'Z', categoriaId: 1 }], total: 1, page: 1, status: true })
    const res = await store.fetchMyRecipesPaginated(1, 12)
    expect(res.success).toBe(true)
    expect(store.pagination.page).toBe(1)
    expect(store.recipes[0].id).toBe(5)
  })

  it('fetchRecipeById sucesso e fallback', async () => {
    const store = useRecipeStore()
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({ data: { response: { id: 6, nome: 'A', categoriaId: 1 } } } as any)
    let res = await store.fetchRecipeById(6)
    expect(res.success).toBe(true)
    vi.spyOn(apiClient, 'get').mockRejectedValueOnce({ code: 'ERR_NETWORK', message: 'Network Error' })
    vi.spyOn(MockService, 'getRecipeById').mockResolvedValueOnce({ response: { id: 7, nome: 'B', categoriaId: 2 }, message: '', status: true })
    res = await store.fetchRecipeById(7)
    expect(res.success).toBe(true)
    expect(store.currentRecipe?.id).toBe(7)
  })

  it('create/update/delete receita', async () => {
    const store = useRecipeStore()
    store.recipes = [{ id: 1, nome: 'R', categoriaId: 1, tempoPreparoMinutos: 10, porcoes: 1, ingredientes: 'a' } as any]
    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({ data: { response: { id: 2, nome: 'Nova', categoriaId: 1 } } } as any)
    const c1 = await store.createRecipe({ nome: 'Nova', categoriaId: 1, tempoPreparoMinutos: 1, porcoes: 1, modoPreparo: 'x', ingredientes: 'y' })
    expect(c1.success).toBe(true)
    expect(store.recipes[0].id).toBe(2)
    vi.spyOn(apiClient, 'put').mockResolvedValueOnce({ data: { response: { id: 2, nome: 'Atual', categoriaId: 1 } } } as any)
    const u1 = await store.updateRecipe(2, { nome: 'Atual' })
    expect(u1.success).toBe(true)
    expect(store.recipes[0].nome).toBe('Atual')
    store.currentRecipe = { id: 2, nome: 'Atual', categoriaId: 1 } as any
    vi.spyOn(apiClient, 'delete').mockResolvedValueOnce({} as any)
    const d1 = await store.deleteRecipe(2)
    expect(d1.success).toBe(true)
    expect(store.recipes.find(r => r.id === 2)).toBeUndefined()
  })

  it('clearError limpa erro', () => {
    const store = useRecipeStore()
    store.error = 'erro'
    store.clearError()
    expect(store.error).toBeNull()
  })
})
