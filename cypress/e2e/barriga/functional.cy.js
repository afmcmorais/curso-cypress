import loc from '../../support/locators'
import '../../support/commandsContas'

describe('Should test at a functional level', () => {

    before(() => {
        cy.login('andrefmorais@live.com', '153941')
        cy.resetApp()
    })

    it('Should creat an account', () => {
        cy.acessarMenuConta()
        cy.inserirConta('Conta de teste')       
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
    })

    it('Should update an account', () => {
        cy.login('andrefmorais@live.com', '153941')
        cy.acessarMenuConta()
        cy.xpath(loc.CONTAS.XP_BTN_ALETRAR).click()
        cy.get(loc.CONTAS.NOME)
            .clear()
            .type('Conta alterada')
        cy.get(loc.CONTAS.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'Conta atualizada com sucesso')
    })

    it('Should not create an account with same name', () => {
        cy.login('andrefmorais@live.com', '153941')
        cy.acessarMenuConta()
        cy.inserirConta('Conta alterada')
        cy.get(loc.MESSAGE).should('contain', 'code 400')

    })
})