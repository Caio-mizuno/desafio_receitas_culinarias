describe('Categorias', () => {
  it('lista categorias e navega para receitas filtradas ao clicar', () => {
    cy.visit('/categorias')
    cy.contains('h1', 'Categorias')
    cy.contains('.v-card-title', 'Massas').should('exist')
    cy.contains('.v-card', 'Massas').click()
    cy.location('pathname').should('eq', '/receitas')
    cy.location('search').should('include', 'categoriaId')
  })
})
