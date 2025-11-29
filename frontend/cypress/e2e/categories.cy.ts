describe('Categorias', () => {
  it('lista categorias e navega para home ao clicar', () => {
    cy.visit('/categorias')
    cy.contains('h1', 'Categorias')
    cy.contains('.v-card-title', 'Massas').should('exist')
    cy.contains('.v-card', 'Massas').click()
    cy.location('pathname').should('eq', '/')
  })
})
