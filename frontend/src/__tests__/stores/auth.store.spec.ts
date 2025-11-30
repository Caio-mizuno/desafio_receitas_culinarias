/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth.store'
import apiClient from '@/plugins/axios'

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
})

describe('auth.store', () => {
  it('login sucesso e carrega perfil', async () => {
    const auth = useAuthStore()
    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      data: { response: { access_token: 'jwt', expires_in: 3600 } },
    } as any)
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: { response: { id: 1, login: 'user' } },
    } as any)
    const res = await auth.login({ login: 'user', senha: 'pass' })
    expect(res.success).toBe(true)
    expect(auth.token).toBe('jwt')
    expect(auth.user?.login).toBe('user')
    expect(localStorage.getItem('auth_token')).toBe('jwt')
  })

  it('login fallback em erro de rede', async () => {
    const auth = useAuthStore()
    vi.spyOn(apiClient, 'post').mockRejectedValueOnce({
      code: 'ERR_NETWORK',
      message: 'Network Error',
    })
    const res = await auth.login({ login: 'demo', senha: 'demo' })
    expect(res.success).toBe(true)
    expect(auth.token).toMatch(/mock_jwt_token_/)
    expect(auth.user?.login).toBe('demo')
  })

  it('logout zera token e usuário mesmo com erro', async () => {
    const auth = useAuthStore()
    auth.token = 'jwt'
    auth.user = { id: 1, login: 'user' } as any
    localStorage.setItem('auth_token', 'jwt')
    vi.spyOn(apiClient, 'post').mockRejectedValueOnce({
      code: 'ERR_NETWORK',
      message: 'Network Error',
    })
    await auth.logout()
    expect(auth.token).toBeNull()
    expect(auth.user).toBeNull()
    expect(localStorage.getItem('auth_token')).toBeNull()
  })

  it('register sucesso chama login', async () => {
    const auth = useAuthStore()
    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      data: { response: { id: 1, login: 'new' } },
    } as any)
    vi.spyOn(apiClient, 'post').mockResolvedValueOnce({
      data: { response: { access_token: 'jwt', expires_in: 3600 } },
    } as any)
    vi.spyOn(apiClient, 'get').mockResolvedValueOnce({
      data: { response: { id: 1, login: 'new' } },
    } as any)
    const res = await auth.register({ nome: 'Nome', login: 'new', senha: '123' })
    expect(res.success).toBe(true)
    expect(auth.token).toBe('jwt')
  })

  it('fetchProfile retorna null em erro de rede', async () => {
    const auth = useAuthStore()
    vi.spyOn(apiClient, 'get').mockRejectedValueOnce({
      code: 'ERR_NETWORK',
      message: 'Network Error',
    })
    const profile = await auth.fetchProfile()
    expect(profile).toBeNull()
  })

  it('clearError limpa mensagem de erro', () => {
    const auth = useAuthStore()
    auth.error = 'erro'
    auth.clearError()
    expect(auth.error).toBeNull()
  })
})
