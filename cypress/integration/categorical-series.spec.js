const metadataUrl = /.*\/api\/v1\/Metadados\(.*F1PT1.*\)$/;
const valuesUrl = /.*\/api\/v1\/Metadados\(.*F1PT1.*\)\/ValoresStr/;

beforeEach(() => {
  cy.intercept(metadataUrl, {
    value: [
      {
        SERCODIGO: "F1PT1",
        SERNOME:
          "Partido do candidato a prefeito mais votado no primeiro turno",
        SERCOMENTARIO: "",
        BASNOME: "Regional",
        FNTNOME: "TSE",
        FNTURL: "www.tse.gov.br",
        PERNOME: "Quadrienal",
        UNINOME: "(Sigla)",
        TEMNOME: "Prefeito",
        SERNUMERICA: false,
        SERMINDATA: "1974-01-01T00:00:00-03:00",
        SERMAXDATA: "2021-01-01T00:00:00-03:00",
        SERQNT: 2,
      },
    ],
  }).as("getMetadata");

  cy.intercept(valuesUrl, {
    value: [{ VALVALOR: "Categoria 1", count: 1 }],
  }).as("getValues");
});

it("should plot a bar chart by default", () => {
  cy.visit("/serie/F1PT1");

  cy.wait(["@getMetadata", "@getValues"]);

  cy.getChartJs().then((chart) => {
    expect(chart.config.type).to.equal("bar");
  });

  cy.location("pathname").should("equal", "/serie/F1PT1");
  cy.location("search").should("be.empty");
});

describe("filtering by N values", () => {
  beforeEach(() => {
    cy.intercept(
      {
        url: valuesUrl,
        query: {
          $apply: /VALDATA ge 2013-01-01/,
        },
      },
      {
        value: [
          {
            VALVALOR: "Categoria 1",
            count: 1,
          },
          {
            VALVALOR: "Categoria 2",
            count: 1,
          },
          {
            VALVALOR: "Categoria 3",
            count: 1,
          },
        ],
      }
    ).as("getLastNValues");
  });

  it("should work after submitting form", () => {
    cy.visit("/serie/F1PT1");

    cy.wait(["@getMetadata", "@getValues"]);

    cy.get("form")
      .within(() => {
        cy.get("[name='lastN']").clear().type("3").blur();
      })
      .submit();

    cy.wait("@getLastNValues");

    cy.getChartJs().then((chart) => {
      expect(chart.config.type).to.equal("bar");
      expect(chart.data.labels.length).to.equal(3);
    });

    cy.location().should((loc) => {
      const searchParams = new URLSearchParams(loc.search);
      expect(+searchParams.get("lastN")).to.eq(3);
    });
  });

  it("should work by passing URL search params", () => {
    cy.visit("/serie/F1PT1?lastN=3");

    cy.wait(["@getMetadata", "@getLastNValues"]);

    cy.get("[name='lastN']").should("have.value", "3");

    cy.getChartJs().then((chart) => {
      expect(chart.config.type).to.equal("bar");
      expect(chart.data.labels.length).to.equal(3);
    });
  });
});

describe("filtering by date range", () => {
  beforeEach(() => {
    cy.intercept(
      {
        url: valuesUrl,
        query: {
          $apply: /VALDATA ge 2020-01-01.* and VALDATA le 2020-03-01/,
        },
      },
      {
        value: [
          {
            VALVALOR: "Categoria 1",
            count: 1,
          },
          {
            VALVALOR: "Categoria 2",
            count: 1,
          },
        ],
      }
    ).as("getDateValues");
  });

  it("should work after submitting form", () => {
    cy.visit("/serie/F1PT1");

    cy.wait(["@getMetadata", "@getValues"]);

    cy.get("form")
      .within(() => {
        cy.get("[name='startDate']").clear().type("01/01/2020").blur();

        cy.get("[name='endDate']").clear().type("01/03/2020").blur();
      })
      .submit();

    cy.wait("@getDateValues");

    cy.getChartJs().then((chart) => {
      expect(chart.config.type).to.equal("bar");
      expect(chart.data.labels.length).to.equal(2);
    });

    cy.location().should((loc) => {
      const searchParams = new URLSearchParams(loc.search);
      expect(searchParams.get("startDate")).to.eq("01/01/2020");
      expect(searchParams.get("endDate")).to.eq("01/03/2020");
    });
  });

  it("should work by passing URL search params", () => {
    cy.visit("/serie/F1PT1?startDate=01/01/2020&endDate=01/03/2020");

    cy.wait(["@getMetadata", "@getDateValues"]);

    cy.get("[name='startDate']").should("have.value", "01/01/2020");
    cy.get("[name='endDate']").should("have.value", "01/03/2020");

    cy.getChartJs().then((chart) => {
      expect(chart.config.type).to.equal("bar");
      expect(chart.data.labels.length).to.equal(2);
    });
  });
});

describe("error handling", () => {
  it("should handle errors", () => {
    cy.visit("/serie/F1PT1");
    cy.intercept(valuesUrl, {
      forceNetworkError: true,
    });
    cy.contains("Desculpe, ocorreu um erro inesperado");
  });

  it("should handle empty state", () => {
    cy.visit("/serie/F1PT1");
    cy.intercept(valuesUrl, { value: [] });
    cy.contains("Sem dados");
  });
});
