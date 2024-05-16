import loc from '../../support/locators'
import '../../support/commandsContas'

describe('Should test at a functional level', () => {

    after(() => {
        cy.clearLocalStorage()
    })

    before(() => {
        cy.intercept({
            method: 'POST',
            url: '/signin'
        }, {
            id: 1000,
            nome: 'Usuario falso',
            token: 'Uma string muito grande que nao deveria ser aceito, mas na verdade vai'
        }).as('signin')

        cy.intercept({
            method: 'GET',
            url: '/saldo'
        }, [
            {
                conta_id: 999,
                conta: "Carteira",
                saldo: "100.00"
            },
            {
                conta_id: 9909,
                conta: "Banco",
                saldo: "100000.00"
            }
        ]).as('saldo')

        cy.login('andrefmorais@live.com', 'senha errada')
        
    })

    beforeEach(() => {
        cy.get(loc.MENU.HOME).click()
        // cy.resetApp()
    })

    it.only('Should creat an account', () => {
        cy.intercept({
            method: 'GET',
            url: '/contas'
        },[
            {
                id: 1,
                nome: 'Carteira',
                visivel: true,
                usuario_id: 1
            },
            {
                id: 2,
                nome: 'Banco',
                visivel: true,
                usuario_id: 1
            }
        ]).as('contas')

        cy.intercept({
            method: 'POST',
            url: '/contas'
        }, {
            id: '3',
            nome: 'Conta de teste',
            visivel: true,
            usuario_id: 1
        }).as('saveConta')

        cy.acessarMenuConta()

        cy.intercept({
            method: 'GET',
            url: '/contas'
        },[
            {
                id: 1,
                nome: 'Carteira',
                visivel: true,
                usuario_id: 1
            },
            {
                id: 2,
                nome: 'Banco',
                visivel: true,
                usuario_id: 1
            },
            {
                id: 3,
                nome: 'Conta de teste',
                visivel: true,
                usuario_id: 1
            }
        ]).as('contasSave')

        cy.inserirConta('Conta de teste')
        cy.get(loc.MESSAGE).should('contain', 'Conta inserida com sucesso')
    })

    it('Should update an account', () => {
        cy.login('andrefmorais@live.com', '153941')
        cy.acessarMenuConta()
        cy.xpath(loc.CONTAS.FN_XP_BTN_ALETRAR('Conta de teste')).click()
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

    it('Should create a transaction', () => {
        cy.login('andrefmorais@live.com', '153941')
        cy.get(loc.MENU.MOVIMENTACAO).click()

        cy.get(loc.MOVIMENTACAO.DESCRICAO).type('Desc')
        cy.get(loc.MOVIMENTACAO.VALOR).type('123')
        cy.get(loc.MOVIMENTACAO.INTERESSADO).type('Inter')
        cy.get(loc.MOVIMENTACAO.CONTA).select('Conta alterada')
        cy.get(loc.MOVIMENTACAO.STATUS).click()
        cy.get(loc.MOVIMENTACAO.BTN_SALVAR).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')

        cy.get(loc.EXTRATO.LINHAS).should('have.length', 7)
        cy.xpath(loc.EXTRATO.FN_XP_BUSCA_ELEMENTO('Desc', '123')).should('exist')
    })

    it('Should get balance', () => {
        cy.login('andrefmorais@live.com', '153941')
        cy.get(loc.MENU.HOME).click()
        cy.xpath(loc.SALDO.FN_XP_SALDO_CONTA('Conta alterada')).should('contain', '123,00')
    })

    it('Should remove a transaction', () => {
        cy.login('andrefmorais@live.com', '153941')
        cy.get(loc.MENU.EXTRATO).click()
        cy.xpath(loc.EXTRATO.FN_XP_REMOVER_ELEMENTO('Desc')).click()
        cy.get(loc.MESSAGE).should('contain', 'sucesso')
    })
})