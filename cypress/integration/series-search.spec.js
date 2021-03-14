const url = "**/api/v1/Metadados*";

it("should show most recently updated series by default", () => {
  cy.intercept(url, {
    "@odata.count": 1,
    value: [
      {
        SERNOME: "Spread",
        PERNOME: "Mensal",
        UNINOME: "(% a.m.)",
        SERMINDATA: "2020-01-01T00:00:00",
        SERMAXDATA: "2021-12-01T00:00:00",
      },
    ],
  }).as("getSearchResults");

  cy.visit("/series");

  cy.wait("@getSearchResults");

  cy.contains("table tbody tr", "Spread").within(() => {
    cy.get("td")
      .eq(0)
      .contains("Spread");

    cy.get("td")
      .eq(1)
      .contains("Mensal");

    cy.get("td")
      .eq(2)
      .contains("(% a.m.)");

    cy.get("td")
      .eq(3)
      .contains("2020");

    cy.get("td")
      .eq(4)
      .contains("2021");
  });
});

it("should handle pagination", () => {
  cy.intercept(url, {
    fixture: "search-results-first-page.json",
  }).as("getFirstPage");

  cy.visit("/series");

  cy.wait("@getFirstPage")
    .its("request.url")
    .should("have.string", "$top=10")
    .should("have.string", "$skip=0");

  cy.intercept(url, {
    fixture: "search-results-second-page.json",
  }).as("getSecondPage");

  cy.contains("1-10 de 8874");

  cy.get("button[aria-label='Próxima página']").click();

  cy.wait("@getSecondPage")
    .its("request.url")
    .should("have.string", "$top=10")
    .should("have.string", "$skip=10");

  cy.contains("11-20 de 8874");
});

it("should sync state with url query string", () => {
  cy.intercept(url, {});

  cy.visit("/series");
  cy.get("[data-testid='show-filters']").click();

  cy.get("input[name='SERNOME']").type("spread{enter}");
  cy.url().should("include", "SERNOME=spread");
});

it("should get state from url", () => {
  cy.intercept(url, {});

  cy.visit("/series?SERNOME=spread");
  cy.get("[data-testid='show-filters']").click();

  cy.get("input[name='SERNOME']").should("have.value", "spread");
});

it("should handle empty responses", () => {
  cy.intercept(url, { value: [] });

  cy.visit("/series");

  cy.contains("Nenhum resultado para essa pesquisa");
});
