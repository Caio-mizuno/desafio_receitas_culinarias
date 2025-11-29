import { describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import router from '@/router'
import { useAuthStore } from '@/stores/auth.store'

describe('router guards', () => {
  it('redireciona não autenticado para login', async () => {
    setActivePinia(createPinia())
    const auth = useAuthStore()
    auth.token = null
    await router.push('/perfil')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/login')
  })

  it('redireciona autenticado longe de login', async () => {
    setActivePinia(createPinia())
    const auth = useAuthStore()
    auth.token = 'jwt'
    await router.push('/')
    await router.push('/login')
    await router.isReady()
    expect(router.currentRoute.value.path).toBe('/')
  })
})
