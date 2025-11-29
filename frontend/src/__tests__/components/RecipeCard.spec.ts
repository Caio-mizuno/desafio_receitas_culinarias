import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RecipeCard from '@/components/cards/RecipeCard.vue'
import vuetify from '@/plugins/vuetify'

const recipe = {
  id: 10,
  nome: 'Teste',
  tempoPreparoMinutos: 20,
  porcoes: 2,
  ingredientes: 'A, B, C',
  categoriaId: 1,
}

describe('RecipeCard', () => {
  it('emite evento view ao clicar no card e botão', async () => {
    const wrapper = mount(RecipeCard, {
      props: { recipe, categoryName: 'Sobremesas' },
      global: { plugins: [vuetify] },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('view')?.[0]).toEqual([10])
    const btn = wrapper.find('button')
    await btn.trigger('click')
    expect(wrapper.emitted('view')?.[1]).toEqual([10])
  })
})
