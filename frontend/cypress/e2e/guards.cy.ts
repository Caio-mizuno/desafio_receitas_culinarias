describe('Guards de Rotas', () => {
  it('redireciona para login quando não autenticado', () => {
    cy.visit('/minhas-receitas')
    cy.location('pathname').should('eq', '/login')
  })

  it('redireciona para home se tentar acessar login autenticado', () => {
    cy.visit('/login', {
      onBeforeLoad(win) {
        win.localStorage.setItem('auth_token', 'e2e')
      },
    })
    cy.location('pathname').should('eq', '/')
  })
})
