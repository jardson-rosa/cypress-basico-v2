/// <reference types="Cypress" />

describe("Central de Atendimento ao Cliente TAT", function () {
  const THREE_SECONDS_IN_MS = 3000;
  beforeEach(() => {
    cy.visit("./src/index.html");
  });

  it("verifica o título da aplicação", function () {
    cy.title().should("eq", "Central de Atendimento ao Cliente TAT");
  });

  it("preenche os campos obrigatórios e envia o formulário", () => {
    const longText =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus tempus est ligula, eget ultricies nunc hendrerit ut. Etiam et scelerisque metus, vel tincidunt turpis. Sed auctor aliquam eleifend. Ut efficitur pretium nibh, at dapibus sem mollis id. Donec et sollicitudin orci. Sed aliquet nisl quis lectus tempor, eu dignissim lorem tempus. Etiam tempus est in nisi faucibus, non molestie nunc hendrerit. Nulla nunc sem, consequat in elit ut, molestie feugiat massa. Nullam molestie efficitur elit a scelerisque. Vivamus vel quam porta, laoreet ipsum in, rutrum massa. Fusce in purus nec ligula sollicitudin mattis.";

    cy.clock();

    cy.get("#firstName").type("Jardson");
    cy.get("#lastName").type("Almeida");
    cy.get("#email").type("teste@teste.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar")
      .click()
      .then(() => {
        cy.get(".success").should("be.visible");
        cy.tick(THREE_SECONDS_IN_MS);
        cy.get(".success").should("not.be.visible");
      });
  });

  it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", () => {
    cy.clock();
    cy.get("#firstName").type("Jardson");
    cy.get("#lastName").type("Almeida");
    cy.get("#email").type("teste");
    cy.get("#open-text-area").type("teste");
    cy.contains("button", "Enviar")
      .click()
      .then(() => {
        cy.get(".error").should("be.visible");
        cy.tick(THREE_SECONDS_IN_MS);
        cy.get(".error").should("not.be.visible");
      });
  });

  it("campo telefone continua vazio quando preenchido com valor não-númerico", () => {
    cy.get("#phone").type("teste").should("have.value", "");
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    cy.clock();
    cy.get("#firstName").type("Jardson");
    cy.get("#lastName").type("Almeida");
    cy.get("#email").type("teste@teste.com");
    cy.get("#open-text-area").type("teste");
    cy.get("#phone-checkbox").check();
    cy.contains("button", "Enviar")
      .click()
      .then(() => {
        cy.get(".error").should("be.visible");
        cy.tick(THREE_SECONDS_IN_MS);
        cy.get(".error").should("not.be.visible");
      });
  });

  it("preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    const name = "Jardson",
      lastName = "Almeida",
      email = "teste@teste.com",
      tel = 999999999;
    cy.get("#firstName")
      .type(name)
      .should("have.value", name)
      .clear()
      .should("have.value", "");
    cy.get("#lastName")
      .type(lastName)
      .should("have.value", lastName)
      .clear()
      .should("have.value", "");
    cy.get("#email")
      .type(email)
      .should("have.value", email)
      .clear()
      .should("have.value", "");
    cy.get("#phone")
      .type(tel)
      .should("have.value", tel)
      .clear()
      .should("have.value", "");
  });

  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
    cy.clock();
    cy.contains("button", "Enviar")
      .click()
      .then(() => {
        cy.get(".error").should("be.visible");
        cy.tick(THREE_SECONDS_IN_MS);
        cy.get(".error").should("not.be.visible");
      });
  });

  it("envia o formuário com sucesso usando um comando customizado", () => {
    cy.fillMandatoryFieldsAndSubmit();
  });

  it("seleciona um produto (YouTube) por seu texto", () => {
    cy.get("#product").select("YouTube").should("have.value", "youtube");
  });

  it("seleciona um produto (Mentoria) por seu valor (value)", () => {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });

  it("seleciona um produto (Blog) por seu índice", () => {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"]')
      .check("feedback")
      .should("have.value", "feedback");
  });

  it("marca cada tipo de atendimento", () => {
    cy.get('input[type="radio"]')
      .should("have.length", 3)
      .each(($radio) => {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });

  it("marca ambos checkboxes, depois desmarca o último", () => {
    cy.get('#check input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("not.be.checked");
  });

  it("seleciona um arquivo da pasta fixtures", () => {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json")
      .should(($input) => {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo simulando um drag-and-drop", () => {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json", { action: "drag-drop" })
      .should(($input) => {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", () => {
    cy.fixture("example.json").as("exampleFile");
    cy.get('input[type="file"]')
      .selectFile("@exampleFile")
      .should(($input) => {
        expect($input[0].files[0].name).to.equal("example.json");
      });
  });

  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
    cy.get('a[href="privacy.html"]').should("have.attr", "target", "_blank");
  });

  it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
    cy.get('a[href="privacy.html"]').invoke("removeAttr", "target").click();
    cy.title().should(
      "eq",
      "Central de Atendimento ao Cliente TAT - Política de privacidade"
    );
  });

  it("exibe e esconde as mensagens de sucesso e erro usando o .invoke", () => {
    cy.get(".success")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Mensagem enviada com sucesso.")
      .invoke("hide")
      .should("not.be.visible");
    cy.get(".error")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Valide os campos obrigatórios!")
      .invoke("hide")
      .should("not.be.visible");
  });

  it("preenche a area de texto usando o comando invoke", () => {
    const longText = Cypress._.repeat("Test with .invoke ", 5);
    cy.get("#open-text-area")
      .invoke("val", longText)
      .should("have.value", longText);
  });

  it("faz uma requisição HTTP", () => {
    cy.request(
      "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html"
    ).should((response) => {
      const { status, statusText, body } = response;
      expect(status).to.equal(200);
      expect(statusText).to.equal("OK");
      expect(body).to.include("CAC TAT");
    });
  });

  it.only("desfaio encontre o gato", () => {
    cy.get("#cat").should("not.be.visible").invoke("show").should("be.visible");
  });
});
