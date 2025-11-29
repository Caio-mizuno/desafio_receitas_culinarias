describe('Login', () => {
  it('faz login com fallback mock e volta para home', () => {
    cy.visit('/login')
    cy.get('input[type="text"]').first().type('caio.dev')
    cy.get('input[type="password"]').first().type('admin')
    cy.contains('button', 'Entrar').click()
    cy.location('pathname').should('eq', '/')
    cy.contains('h1', 'Descubra novas receitas')
  })

  it('alternar para cadastro e voltar para login', () => {
    cy.visit('/login')
    cy.contains('button', 'Cadastre-se').click()
    cy.contains('h1', 'Criar sua conta')
    cy.contains('button', 'Entrar').click()
    cy.contains('h1', 'Receitas Culinárias')
  })
})
