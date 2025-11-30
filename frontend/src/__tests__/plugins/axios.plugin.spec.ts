/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import apiClient from '@/plugins/axios'

beforeEach(() => {
  localStorage.clear()
  ;(window.location as any).pathname = '/'
  ;(window.location as any).replace = vi.fn()
})

describe('axios plugin', () => {
  it('adiciona Authorization no request quando há token', async () => {
    localStorage.setItem('auth_token', 'jwt')
    const cfg = { headers: {} as any }
    const fulfilled = (apiClient.interceptors.request as any).handlers[0].fulfilled
    const newCfg = await fulfilled(cfg)
    expect(newCfg.headers.Authorization).toBe('Bearer jwt')
  })

  it('remove token e redireciona em 401', async () => {
    localStorage.setItem('auth_token', 'jwt')
    const rejected = (apiClient.interceptors.response as any).handlers[0].rejected
    const error = { response: { status: 401 }, config: { url: '/users' } }
    try {
      await rejected(error)
    } catch {}
    expect(localStorage.getItem('auth_token')).toBeNull()
    expect((window.location as any).replace).toHaveBeenCalledWith('/login')
  })

  it('não redireciona quando já está na rota de login', async () => {
    ;(window.location as any).pathname = '/login'
    const rejected = (apiClient.interceptors.response as any).handlers[0].rejected
    const error = { response: { status: 401 }, config: { url: '/auth/login' } }
    try {
      await rejected(error)
    } catch {}
    expect((window.location as any).replace).not.toHaveBeenCalled()
  })
})
