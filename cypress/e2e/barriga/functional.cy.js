describe('Should test at a functional level', () => {
    before(() => {
        cy.visit('https://barrigareact.wcaquino.me/')
        cy.get('.input-group > .form-control').type('andrefmorais@live.com')
        cy.get(':nth-child(2) > .form-control').type('153941')
        cy.get('.btn').click()
        cy.get('.toast-message').should('contain', 'Bem vindo')
    })

    it('Should creat an account', () => {
        cy.get('[data-test="menu-settings"]').click()
        cy.get('[href="/contas"]').click()
        cy.get('[data-test="nome"]').type('Conta de teste')
        cy.get('.btn')
        cy.get('.toast-message').should('contain', 'Conta inserida com sucesso')
    })
})