import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyRecipeCard from '@/components/cards/MyRecipeCard.vue'
import vuetify from '@/plugins/vuetify'

const recipe = {
  id: 5,
  nome: 'Minha Receita',
  tempoPreparoMinutos: 30,
  porcoes: 4,
  ingredientes: 'X, Y, Z',
  categoriaId: 2,
}

describe('MyRecipeCard', () => {
  it('emite eventos edit e delete', async () => {
    const wrapper = mount(MyRecipeCard, {
      props: { recipe, categoryName: 'Carnes' },
      global: { plugins: [vuetify] },
    })
    const editBtn = wrapper.findAll('button')[0]
    await editBtn.trigger('click')
    expect(wrapper.emitted('edit')?.[0]).toEqual([5])
    const deleteBtn = wrapper.findAll('button')[1]
    await deleteBtn.trigger('click')
    expect(wrapper.emitted('delete')?.[0]).toEqual([recipe])
  })
})
