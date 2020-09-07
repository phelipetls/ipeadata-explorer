const URL = "http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados";

export function buildQueryFromForm(formElements) {
  return (
    URL +
    buildFilter([].map.call(formElements, ({ name, value }) => [name, value]))
  );
}

export function buildQueryFromUrl(searchParams) {
  return URL + buildFilter(searchParams);
}

export function limitQuery(url, limit) {
  return url + `&$top=${limit}`;
}

export function offsetQuery(url, offset) {
  return url + `&$skip=${offset}`;
}

function buildFilter(parameters) {
  const filters = [];
  let helper_query = "";

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
        helper_query = "&$expand=Pais";
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
      case "SERSTATUS":
        filters.push(`${name} eq '${value}'`);
        break;
      case "SERNUMERICA":
        filters.push(`${name} eq ${value}`);
        break;
      default:
      // no default
    }
  }

  if (filters.length > 0) {
    return `?$filter=${filters.join(" and ")}${helper_query}`;
  }

  return "";
}

function formatDate(date) {
  return date + "T00:00:00-00:00";
}
