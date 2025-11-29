describe('Detalhe da Receita', () => {
  it('carrega dados da receita e permite voltar', () => {
    cy.visit('/receitas/1')
    cy.contains('.v-card-title', 'Bolo de Chocolate Fofo').should('exist')
    cy.contains('span', 'Ingredientes').should('exist')
    cy.contains('span', 'Modo de Preparo').should('exist')
    cy.contains('button', 'Voltar').click()
    cy.location('pathname').should('eq', '/')
  })
})
