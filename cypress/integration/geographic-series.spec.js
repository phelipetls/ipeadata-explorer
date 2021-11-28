const metadataUrl = /.*\/api\/v1\/Metadados\(.*ACIDT.*\)$/;
const valuesUrl = /.*\/api\/v1\/Metadados\(.*ACIDT.*\)\/Valores/;

beforeEach(() => {
  cy.intercept(metadataUrl, {
    value: [
      {
        SERCODIGO: "ACIDT",
        SERNOME: "Número de vítimas de acidentes de trânsito",
        SERCOMENTARIO: "",
        BASNOME: "Regional",
        FNTNOME: "Datasus - Site SUS (Sistema Único de Saúde)",
        FNTURL: "www.datasus.gov.br",
        PERNOME: "Anual",
        UNINOME: "Unidade",
        TEMNOME: "Segurança Pública",
        SERNUMERICA: true,
        SERMINDATA: "1980-01-01T00:00:00-02:00",
        SERMAXDATA: "2018-01-01T00:00:00-03:00",
        SERQNT: 50,
      },
    ],
  }).as("getMetadata");

  cy.intercept(
    {
      url: valuesUrl,
      query: {
        $filter: /NIVNOME eq 'Brasil'/,
      },
    },
    { fixture: "geographic-values.json" }
  ).as("getBrazilValues");

  cy.intercept(
    {
      url: /.*\/api\/v1\/Metadados\(.*ACIDT.*\)\/Valores/,
      query: {
        // group by geographic division
        $apply: /groupby\(\(NIVNOME\),aggregate\(\$count as count\)\)/,
        // and sort by count in ascending order
        $orderby: "count asc",
      },
    },
    { fixture: "geographic-divisions.json" }
  ).as("getGeographicDivisions");
});

describe("line chart visualization", () => {
  it("should plot a line to visualize a time series for brazil", () => {
    cy.visit("/serie/ACIDT");

    cy.wait(["@getMetadata", "@getGeographicDivisions", "@getBrazilValues"]);

    cy.getChartJs().then((chart) => {
      expect(chart.config.type).to.equal("line");
      expect(chart.config.data.labels.length).to.equal(5);
    });

    cy.location("pathname").should("equal", "/serie/ACIDT");
    cy.location("search").should("equal", "?division=Brasil");
  });
});

describe("choropleth map visualizations", () => {
  beforeEach(() => {
    cy.intercept(
      {
        url: valuesUrl,
        query: {
          $filter: /NIVNOME eq 'Estados'/,
        },
      },
      { fixture: "geographic-values-by-state.json" }
    ).as("getStatesValues");

    cy.intercept(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados",
      { fixture: "states.json" }
    ).as("getStatesNames");
  });

  describe("visualizing time series values by state", () => {
    beforeEach(() => {
      cy.intercept(
        `https://servicodados.ibge.gov.br/api/v2/malhas/BR?formato=${encodeURIComponent(
          "application/vnd.geo+json"
        )}`,
        { fixture: "brazil-geojson.json" }
      ).as("getBrazilMap");

      cy.intercept(
        `https://servicodados.ibge.gov.br/api/v2/malhas/BR?formato=${encodeURIComponent(
          "application/json"
        )}&resolucao=2`,
        { fixture: "brazil-divided-by-state-geojson.json" }
      ).as("getBrazilDividedByStateMap");
    });

    it("should work by submitting form", () => {
      cy.visit("/serie/ACIDT");

      cy.wait(["@getMetadata", "@getGeographicDivisions", "@getBrazilValues"]);

      cy.get("[name='division']").select("Estados").closest("form").submit();

      cy.wait([
        "@getStatesValues",
        "@getStatesNames",
        "@getBrazilMap",
        "@getBrazilDividedByStateMap",
      ]);

      cy.location().should((loc) => {
        const searchParams = new URLSearchParams(loc.search);
        expect(searchParams.get("division")).to.eq("Estados");
        expect(searchParams.get("boundaryDivision")).to.eq("Brasil");
      });

      cy.get("svg.rsm-svg");
    });

    it("should work by passing URL search params", () => {
      cy.visit("/serie/ACIDT?division=Estados&boundaryDivision=Brasil");

      cy.wait([
        "@getMetadata",
        "@getGeographicDivisions",
        "@getStatesValues",
        "@getStatesNames",
        "@getBrazilMap",
        "@getBrazilDividedByStateMap",
      ]);

      cy.get("[name='division']").should("have.value", "Estados");
      cy.get("[name='boundaryDivision']").should("have.value", "Brasil");

      cy.get("svg.rsm-svg");
    });
  });

  describe("visualizing time series values by state within Brazil's northern region", () => {
    beforeEach(() => {
      cy.intercept(
        "https://servicodados.ibge.gov.br/api/v1/localidades/regioes",
        { fixture: "regions.json" }
      ).as("getRegionsNames");

      cy.intercept(
        `https://servicodados.ibge.gov.br/api/v2/malhas/1?formato=${encodeURIComponent(
          "application/vnd.geo+json"
        )}`,
        { fixture: "brazil-northern-region-geojson.json" }
      ).as("getNorthernRegionMap");

      cy.intercept(
        `https://servicodados.ibge.gov.br/api/v2/malhas/1?formato=${encodeURIComponent(
          "application/json"
        )}&resolucao=2`,
        { fixture: "brazil-northern-region-divided-by-state-geojson.json" }
      ).as("getNorthernRegionDividedByStateMap");
    });

    it("should work by submitting form", () => {
      cy.visit("/serie/ACIDT");

      cy.wait(["@getMetadata", "@getGeographicDivisions", "@getBrazilValues"]);

      cy.get("form")
        .within(() => {
          cy.get("[name='division']").select("Estados");
          cy.get("[name='boundaryDivision']").select("Regiões");

          cy.wait(["@getRegionsNames"]);
          cy.get("[name='boundaryId']").select("Norte");
        })
        .submit();

      cy.wait([
        "@getStatesValues",
        "@getStatesNames",
        "@getNorthernRegionMap",
        "@getNorthernRegionDividedByStateMap",
      ]);

      cy.location().should((loc) => {
        const searchParams = new URLSearchParams(loc.search);
        expect(searchParams.get("division")).to.eq("Estados");
        expect(searchParams.get("boundaryDivision")).to.eq("Regiões");
        expect(searchParams.get("boundaryId")).to.eq("1");
      });

      cy.get("svg.rsm-svg");
    });

    it("should work by passing URL search params", () => {
      cy.visit(
        "/serie/ACIDT?division=Estados&boundaryDivision=Regiões&boundaryId=1"
      );

      cy.wait([
        "@getMetadata",
        "@getGeographicDivisions",
        "@getStatesValues",
        "@getStatesNames",
        "@getNorthernRegionMap",
        "@getNorthernRegionDividedByStateMap",
      ]);

      cy.get("[name='division']").should("have.value", "Estados");
      cy.get("[name='boundaryDivision']").should("have.value", "Regiões");
      cy.get("[name='boundaryId']").should("have.value", "1");

      cy.get("svg.rsm-svg");
    });
  });
});

describe("error handling", () => {
  it("should handle errors", () => {
    cy.visit("/serie/ACIDT");
    cy.intercept(valuesUrl, {
      forceNetworkError: true,
    });
    cy.contains("Desculpe, ocorreu um erro inesperado");
  });

  it("should handle empty state", () => {
    cy.visit("/serie/ACIDT");
    cy.intercept(valuesUrl, { value: [] });
    cy.contains("Sem dados");
  });
});
