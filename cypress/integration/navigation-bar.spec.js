beforeEach(() => {
  cy.visit("/");

  cy.get("button[data-testid='search-button']").as("searchButton");
});

describe("search input", () => {
  it("should search for the series name after submission", () => {
    cy.get("@searchButton").type("Spread{enter}");

    cy.location("pathname").should("equal", "/series");
    cy.location("search").should("equal", "?SERNOME=Spread");
  });

  it("should appear when search button is clicked and disappear when back button is clicked", () => {
    cy.get("@searchButton").click();

    cy.get("input[placeholder^='Pesquisar']").as("searchInput");
    cy.get("button[data-testid='search-back-button'").click();
    cy.get("@searchInput").should("not.exist");
  });

  it("should appear when search button is clicked and disappear on Escape", () => {
    cy.get("@searchButton").click();
    cy.get("input[placeholder^='Pesquisar']")
      .focus()
      .type("{esc}")
      .should("not.exist");
  });
});
