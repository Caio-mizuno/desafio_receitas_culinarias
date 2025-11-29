import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RecipesCarousel from '@/components/carousels/RecipesCarousel.vue'
import vuetify from '@/plugins/vuetify'

const items = [
  { id: 1, nome: 'A', tempoPreparoMinutos: 10, porcoes: 1, ingredientes: 'a', categoriaId: 1 },
  { id: 2, nome: 'B', tempoPreparoMinutos: 20, porcoes: 2, ingredientes: 'b', categoriaId: 2 },
]

describe('RecipesCarousel', () => {
  it('renderiza slides e propaga evento open', async () => {
    const wrapper = mount(RecipesCarousel, {
      props: { items, getCategoryName: (id: number) => (id === 1 ? 'Sobremesas' : 'Carnes') },
      global: { plugins: [vuetify] },
    })
    const cards = wrapper.findAllComponents({ name: 'RecipeCard' })
    expect(cards.length).toBe(2)
    await cards[0].trigger('click')
    expect(wrapper.emitted('open')?.[0]).toEqual([1])
  })
})
