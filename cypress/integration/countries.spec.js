it("should show a table of countries", () => {
  cy.intercept("**/Paises*", {
    value: [
      {
        PAINOME: "Brasil",
        "Metadados@odata.count": 5,
      },
    ],
  }).as("getCountries");

  cy.visit("/paises");

  cy.wait("@getCountries");

  cy.get("table")
    .get("tbody tr")
    .should("have.length", 1);

  cy.get("table tbody tr").within(() => {
    cy.get("td")
      .eq(0)
      .contains("Brasil");

    cy.get("td")
      .eq(1)
      .contains("5");
  });
});
