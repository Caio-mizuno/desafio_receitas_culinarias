describe('Receitas', () => {
  it('abre detalhe ao clicar em Ver Receita', () => {
    cy.visit('/receitas')
    cy.get('.recipe-card', { timeout: 10000 }).first().find('button').contains('Ver Receita').click()
    cy.location('pathname').should('match', /\/receitas\/\d+/)
    cy.contains('span', 'Ingredientes').should('exist')
  })
})
