Cypress.Commands.add("fillMandatoryFieldsAndSubmit", () => {
  cy.get("#firstName").type("Jardson");
  cy.get("#lastName").type("Almeida");
  cy.get("#email").type("teste@teste.com");
  cy.get("#open-text-area").type("teste");
  cy.contains("Enviar")
    .click()
    .then(() => {
      cy.get(".success").should("be.visible");
    });
});
