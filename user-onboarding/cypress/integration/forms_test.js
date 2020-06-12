describe("Forms.js-testing inputs", function() {
    beforeEach(() => {
        cy.visit("http://localhost:3000/")
    })
    it("add text to input fields, check terms box, submit form", function() {
        cy.get("[data-cy=name]")
        .type("jeremy")
        .should("have.value", "jeremy")
    })
})