import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '../App.vue'
import vuetify from '@/plugins/vuetify'
import { createPinia } from 'pinia'

const routes = [
  { path: '/', component: { template: '<div>Home</div>' } },
  { path: '/login', component: { template: '<div>Login</div>' }, meta: { hideAppBar: true } },
]

describe('App', () => {
  it('renderiza AppBar quando rota não oculta', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    await router.push('/')
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [vuetify, router, createPinia()] } })
    expect(wrapper.findComponent({ name: 'VAppBar' }).exists()).toBe(true)
  })

  it('não renderiza AppBar na rota de login', async () => {
    const router = createRouter({ history: createMemoryHistory(), routes })
    await router.push('/login')
    await router.isReady()
    const wrapper = mount(App, { global: { plugins: [vuetify, router, createPinia()] } })
    expect(wrapper.findComponent({ name: 'VAppBar' }).exists()).toBe(false)
  })
})
