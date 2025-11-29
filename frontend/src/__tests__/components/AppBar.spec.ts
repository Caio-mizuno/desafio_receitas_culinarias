import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia, setActivePinia } from 'pinia'
import AppBar from '@/components/AppBar.vue'
import vuetify from '@/plugins/vuetify'
import { useAuthStore } from '@/stores/auth.store'

const routes = [
  { path: '/', component: { template: '<div>Home</div>' } },
  { path: '/login', component: { template: '<div>Login</div>' } },
  { path: '/minhas-receitas', component: { template: '<div>Minhas</div>' } },
  { path: '/perfil', component: { template: '<div>Perfil</div>' } },
]

const Root = { components: { AppBar }, template: '<v-app><AppBar /></v-app>' }

describe('AppBar', () => {
  it('exibe botão Entrar quando não autenticado', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    const pinia = createPinia()
    await router.push('/')
    await router.isReady()
    const wrapper = mount(Root, { global: { plugins: [vuetify, router, pinia] } })
    const loginBtn = wrapper.findAll('button').find(b => b.text().includes('Entrar'))!
    expect(loginBtn).toBeTruthy()
  })

  it('exibe tabs e menu quando autenticado', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    const pinia = createPinia()
    setActivePinia(pinia)
    const auth = useAuthStore()
    auth.token = 'token'
    auth.user = { id: 1, login: 'tester' } as any
    await router.push('/')
    await router.isReady()
    const wrapper = mount(Root, { global: { plugins: [vuetify, router, pinia] } })
    const myRecipesTab = wrapper.findAll('button').find(b => b.text().includes('Minhas Receitas'))!
    expect(myRecipesTab).toBeTruthy()
  })
})
