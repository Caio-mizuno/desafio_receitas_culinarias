describe('Home', () => {
  it('exibe hero e navega para receitas', () => {
    cy.visit('/')
    cy.contains('h1', 'Descubra novas receitas')
    cy.contains('button', 'Ver todas as receitas').click()
    cy.location('pathname').should('eq', '/receitas')
  })

  it('mostra botão Criar receita quando autenticado', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'e2e')
      },
    })
    cy.contains('button', 'Criar receita').click()
    cy.location('pathname').should('eq', '/minhas-receitas/nova')
  })
})
