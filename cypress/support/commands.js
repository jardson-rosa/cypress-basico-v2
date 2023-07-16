Cypress.Commands.add("fillMandatoryFieldsAndSubmit", () => {
  cy.clock();
  cy.get("#firstName").type("Jardson");
  cy.get("#lastName").type("Almeida");
  cy.get("#email").type("teste@teste.com");
  cy.get("#open-text-area").type("teste");
  cy.contains("Enviar")
    .click()
    .then(() => {
      cy.get(".success").should("be.visible");
      cy.tick(3000);
      cy.get(".success").should("not.be.visible");
    });
});
