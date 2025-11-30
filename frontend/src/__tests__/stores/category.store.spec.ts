/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useCategoryStore } from '@/stores/category.store'
import apiClient from '@/plugins/axios'
import { MockService } from '@/services/mock.service'

beforeEach(() => {
  setActivePinia(createPinia())
})

describe('category.store', () => {
  it('fetchCategories sucesso', async () => {
    const store = useCategoryStore()
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: { response: [{ id: 1, nome: 'Sobremesas' }] },
    } as any)
    const res = await store.fetchCategories()
    expect(res.success).toBe(true)
    expect(store.categories.length).toBe(1)
    expect(store.categoryOptions[0].text).toBe('Sobremesas')
  })

  it('fetchCategories fallback mock', async () => {
    const store = useCategoryStore()
    vi.spyOn(apiClient, 'get').mockRejectedValueOnce({
      code: 'ERR_NETWORK',
      message: 'Network Error',
    })
    vi.spyOn(MockService, 'getCategories').mockResolvedValueOnce({
      response: [{ id: 2, nome: 'Carnes' }],
      message: '',
      status: true,
    })
    const res = await store.fetchCategories()
    expect(res.success).toBe(true)
    expect(store.categories[0].id).toBe(2)
  })

  it('create/update/delete categoria', async () => {
    const store = useCategoryStore()
    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      data: { response: { id: 3, nome: 'Massas' } },
    } as any)
    const c1 = await store.createCategory({ nome: 'Massas' })
    expect(c1.success).toBe(true)
    vi.spyOn(apiClient, 'put').mockResolvedValueOnce({
      data: { response: { id: 3, nome: 'Massas Atualizada' } },
    } as any)
    const u1 = await store.updateCategory(3, { nome: 'Massas Atualizada' })
    expect(u1.success).toBe(true)
    expect(store.categories.find((c) => c.id === 3)?.nome).toBe('Massas Atualizada')
    vi.spyOn(apiClient, 'delete').mockResolvedValueOnce({} as any)
    const d1 = await store.deleteCategory(3)
    expect(d1.success).toBe(true)
    expect(store.categories.find((c) => c.id === 3)).toBeUndefined()
  })

  it('clearError limpa mensagem de erro', () => {
    const store = useCategoryStore()
    store.error = 'erro'
    store.clearError()
    expect(store.error).toBeNull()
  })
})
