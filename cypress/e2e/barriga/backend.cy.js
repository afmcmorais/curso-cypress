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

    it.only('Should creat an account', () => {
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

        it('Should update an account', () => {
            cy.api({})
        })

        it('Should not create an account with same name', () => {

        })

        it('Should create a transaction', () => {

        })

        it('Should get balance', () => {

        })

        it('Should remove a transaction', () => {

        })
    })
})