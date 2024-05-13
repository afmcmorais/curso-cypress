describe('Should test at a functional level', () => {
    const dayjs = require('dayjs')
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
        cy.api({
            method: 'GET',
            headers: { Authorization: `JWT ${token}` },
            url: '/saldo',
        }).then(res => {
            let saldoConta = null
            res.body.forEach(c => {
                if (c.conta === 'Conta para saldo') saldoConta = c.saldo
            })
            expect(saldoConta).to.be.equal('534.00')
        })

        cy.api({
            method: 'GET',
            headers: { Authorization: `JWT ${token}` },
            url: '/transacoes',
            qs: { descricao: 'Movimentacao 1, calculo saldo' }
        }).then(res => {
            cy.api({
                method: 'PUT',
                headers: { Authorization: `JWT ${token}` },
                url: `/transacoes/${res.body[0].id}`,
                body: {
                    status: true,
                    data_pagamento: dayjs(res.body[0].data_pagamento).format('DD/MM/YYYY'),
                    data_transacao: dayjs(res.body[0].data_transacao).format('DD/MM/YYYY'),
                    descricao: res.body[0].descricao,
                    envolvido: res.body[0].envolvido,
                    valor: res.body[0].valor,
                    conta_id: res.body[0].conta_id
                }
            }).its('status').should('be.equal', 200)
        })

        cy.api({
            method: 'GET',
            headers: { Authorization: `JWT ${token}` },
            url: '/saldo',
        }).then(res => {
            let saldoConta = null
            res.body.forEach(c => {
                if (c.conta === 'Conta para saldo') saldoConta = c.saldo
            })
            expect(saldoConta).to.be.equal('4034.00')
        })
    })

    it('Should remove a transaction', () => {

    })

})