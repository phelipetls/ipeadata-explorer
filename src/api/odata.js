const URL =
  "http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados?$count=true";

export function buildMetadataUrl(code) {
  return `http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados('${code}')`;
}

export function buildSeriesUrl(code) {
  return (
    buildMetadataUrl(code) +
    "/Valores?$select=VALDATA,VALVALOR,TERCODIGO,TERNOME"
  );
}

export function buildQueryFromForm(formElements) {
  return (
    URL +
    buildFilter([].map.call(formElements, ({ name, value }) => [name, value]))
  );
}

export function buildQueryFromUrl(searchParams) {
  if (searchParams.toString() !== "") {
    return URL + buildFilter(searchParams);
  }
}

export function limitQuery(url, limit) {
  return url + `&$top=${limit}`;
}

export function offsetQuery(url, offset) {
  return url + `&$skip=${offset}`;
}

function buildFilter(parameters) {
  const filters = [];
  let helperQuery = "";

  for (const [name, value] of parameters) {
    if (!value) continue;

    switch (name) {
      case "SERNOME":
      case "UNINOME":
      case "PERNOME":
      case "TEMNOME":
        filters.push(`contains(${name},'${value}')`);
        break;
      case "FNTNOME":
        filters.push(
          `(contains(FNTNOME,'${value}') or contains(FNTSIGLA,'${value}'))`
        );
        break;
      case "PAINOME":
        filters.push(
          `(contains(Pais/PAINOME,'${value}') or contains(PAICODIGO,'${value}'))`
        );
        helperQuery = "&$expand=Pais";
        break;
      case "SERMINDATA":
        filters.push(`SERMINDATA ge ${formatDate(value)}`);
        break;
      case "SERMAXDATA":
        filters.push(`SERMAXDATA le ${formatDate(value)}`);
        break;
      case "BASNOME":
        const bases = value
          .split(",")
          .map(base => `BASNOME eq '${base}'`)
          .join(" or ");
        filters.push(`(${bases})`);
        break;
      case "PAICODIGO":
      case "SERSTATUS":
        filters.push(`${name} eq '${value}'`);
        break;
      case "SERNUMERICA":
      case "TEMCODIGO":
        filters.push(`${name} eq ${value}`);
        break;
      default:
        throw new Error("Este parâmetro não é suportado para filtragem.");
    }
  }

  if (filters.length > 0) {
    return `&$filter=${filters.join(" and ")}${helperQuery}`;
  }

  return "";
}

function formatDate(date) {
  return date + "T00:00:00-00:00";
}
