const metadataUrl = /.*\/api\/v1\/Metadados\(.*BM12_TJOVER12.*\)$/;
const valuesUrl = /.*\/api\/v1\/Metadados\(.*BM12_TJOVER12.*\)\/Valores/;

beforeEach(() => {
  cy.intercept(metadataUrl, {
    value: [
      {
        SERCODIGO: "BM12_TJOVER12",
        SERNOME: "Taxa de juros - Over / Selic",
        SERCOMENTARIO: "",
        BASNOME: "Macroeconômico",
        FNTNOME: "BCB",
        FNTURL: "http://www.bcb.gov.br",
        PERNOME: "Mensal",
        UNINOME: "(% a.m.)",
        TEMNOME: "Financeiras",
        SERNUMERICA: true,
        SERMINDATA: "1974-01-01T00:00:00-02:00",
        SERMAXDATA: "2020-12-01T00:00:00-03:00",
        SERQNT: 50,
      },
    ],
  }).as("getMetadata");

  cy.intercept(valuesUrl, {
    value: [
      {
        VALDATA: "2020-12-01T00:00:00-03",
        VALVALOR: 0.15,
      },
    ],
  }).as("getValues");
});

it("should plot a line chart by default", () => {
  cy.visit("/serie/BM12_TJOVER12");

  cy.wait(["@getMetadata", "@getValues"]);

  cy.getChartJs().then(chart => {
    expect(chart.config.type).to.equal("line");
    expect(chart.config.data.labels.length).to.equal(1);
  });

  cy.location("pathname").should("equal", "/serie/BM12_TJOVER12");
  cy.location("search").should("equal", "");
});

describe("filtering last N values", () => {
  beforeEach(() => {
    cy.intercept(
      {
        url: valuesUrl,
        query: {
          $filter: /VALDATA ge 2020-10-01/,
        },
      },
      {
        value: [
          {
            VALDATA: "2020-12-01T00:00:00-03",
            VALVALOR: 1,
          },
          {
            VALDATA: "2020-11-01T00:00:00-03",
            VALVALOR: 2,
          },
          {
            VALDATA: "2020-10-01T00:00:00-03",
            VALVALOR: 3,
          },
        ],
      }
    ).as("getLastNValues");
  });

  it("should work after submitting form", () => {
    cy.visit("/serie/BM12_TJOVER12");

    cy.wait(["@getMetadata", "@getValues"]);

    cy.get("form")
      .within(() => {
        cy.get("[name='lastN']")
          .clear()
          .type("3")
          .blur();
      })
      .submit();

    cy.wait("@getLastNValues");

    cy.getChartJs().then(chart => {
      expect(chart.config.type).to.equal("line");
      expect(chart.data.labels.length).to.equal(3);
    });

    cy.location().should(loc => {
      const searchParams = new URLSearchParams(loc.search);
      expect(+searchParams.get("lastN")).to.eq(3);
    });
  });

  it("should work by passing URL search params", () => {
    cy.visit("/serie/BM12_TJOVER12?lastN=3");

    cy.wait(["@getMetadata", "@getLastNValues"]);

    cy.get("[name='lastN']").should("have.value", "3")

    cy.getChartJs().then(chart => {
      expect(chart.config.type).to.equal("line");
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
          $filter: /VALDATA ge 2019-01-01.* and VALDATA le 2019-02-01/,
        },
      },
      {
        value: [
          {
            VALDATA: "2019-02-01T00:00:00-03",
            VALVALOR: 2,
          },
          {
            VALDATA: "2019-01-01T00:00:00-03",
            VALVALOR: 3,
          },
        ],
      }
    ).as("getDateValues");
  });

  it("should work after submitting form", () => {
    cy.visit("/serie/BM12_TJOVER12");

    cy.wait(["@getMetadata", "@getValues"]);

    cy.get("form")
      .within(() => {
        cy.get("[name='lastN']").clear();

        cy.get("[name='startDate']")
          .clear()
          .type("01/01/2019")
          .blur();

        cy.get("[name='endDate']")
          .clear()
          .type("01/02/2019")
          .blur();
      })
      .submit();

    cy.wait("@getDateValues");

    cy.getChartJs().then(chart => {
      expect(chart.data.labels.length).to.equal(2);
    });

    cy.location().should(loc => {
      const searchParams = new URLSearchParams(loc.search);
      expect(searchParams.get("startDate")).to.eq("01/01/2019");
      expect(searchParams.get("endDate")).to.eq("01/02/2019");
    });
  });

  it("should work by passing URL search params", () => {
    cy.visit("/serie/BM12_TJOVER12?startDate=01/01/2019&endDate=01/02/2019");

    cy.wait(["@getMetadata", "@getDateValues"]);

    cy.get("[name='startDate']").should("have.value", "01/01/2019");
    cy.get("[name='endDate']").should("have.value", "01/02/2019");

    cy.getChartJs().then(chart => {
      expect(chart.config.type).to.equal("line");
      expect(chart.data.labels.length).to.equal(2);
    });
  });
});

describe("error handling", () => {
  it("should handle network errors", () => {
    cy.visit("/serie/BM12_TJOVER12");
    cy.intercept(valuesUrl, {
      forceNetworkError: true,
    });
    cy.contains("Desculpe, ocorreu um erro inesperado");
  });

  it("should handle empty state", () => {
    cy.visit("/serie/BM12_TJOVER12");
    cy.intercept(valuesUrl, { value: [] });
    cy.contains("Sem dados");
  });
});
