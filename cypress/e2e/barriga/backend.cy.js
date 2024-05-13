describe('Should test at a functional level', () => {
    let token

    before(() => {
        // cy.login('andrefmorais@live.com', '153941')
        // cy.resetApp()
        cy.getToken('andrefmorais@live.com', '153941')
            .then(tkn => {
                token = tkn
            })
    })

    beforeEach(() => {
        cy.resetRest('andrefmorais@live.com', '153941', token)
    })

    it('Should creat an account', () => {
        cy.api({
            method: 'POST',
            headers: { Authorization: `JWT ${token}` },
            url: '/contas',
            body: {
                nome: 'Conta via rest'
            }
        }).as('response')

        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(201)
            expect(res.body).to.have.property('id')
            expect(res.body).to.have.property('nome', 'Conta via rest')
        })
    })

    it('Should update an account', () => {
        cy.getContaByName('andrefmorais@live.com', '153941', token, 'Conta para alterar')
            .then(contaId => {
                cy.api({
                    url: `/contas/${contaId}`,
                    method: 'PUT',
                    headers: { Authorization: `JWT ${token}` },
                    body: {
                        nome: 'Conta alterada via rest'
                    }
                }).as('response')

                cy.get('@response').its('status').should('be.equal', 200)
            })
    })

    it('Should not create an account with same name', () => {
        cy.api({
            method: 'POST',
            headers: { Authorization: `JWT ${token}` },
            url: '/contas',
            body: {
                nome: 'Conta mesmo nome'
            },
            failOnStatusCode: false
        }).as('response')

        cy.get('@response').then(res => {
            expect(res.status).to.be.equal(400)
            expect(res.body.error).to.be.equal('Já existe uma conta com esse nome!')
        })
    })

    it('Should create a transaction', () => {
        const dayjs = require('dayjs')

        cy.getContaByName('andrefmorais@live.com', '153941', token, 'Conta para movimentacoes')
            .then(contaId => {
                cy.api({
                    method: 'POST',
                    headers: { Authorization: `JWT ${token}` },
                    url: '/transacoes',
                    body: {
                        conta_id: contaId,
                        data_pagamento: dayjs().add(1, "day").format('DD/MM/YYYY'),
                        data_transacao: dayjs().format('DD/MM/YYYY'),
                        descricao: "desc",
                        envolvido: "inter",
                        status: true,
                        tipo: "REC",
                        valor: "123"
                    }
                }).as('response')
            })
        cy.get('@response').its('status').should('be.equal', 201)
        cy.get('@response').its('body.id').should('exist')
    })

    it('Should get balance', () => {

    })

    it('Should remove a transaction', () => {

    })

})