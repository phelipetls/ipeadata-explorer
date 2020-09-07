const URL =
  "http://ipeadata2-homologa.ipea.gov.br/api/v1/Metadados";

export function queryBuilder(formElements) {
  return URL + buildFilter(formElements);
}

export function queryLimit(url, limit) {
  return url + `&$top=${limit}`;
}

export function queryOffset(url, offset) {
  return url + `&$skip=${offset}`;
}

function buildFilter(formElements) {
  const filters = [];
  let helper_query = "";

  const filledElements = Array.from(formElements).filter(elem =>
    Boolean(elem.value)
  );

  for (const elem of filledElements) {
    switch (elem.name) {
      case "SERNOME":
      case "UNINOME":
      case "PERNOME":
      case "TEMNOME":
        filters.push(`contains(${elem.name},'${elem.value}')`);
        break;
      case "FNTNOME":
        filters.push(
          `(contains(FNTNOME,'${elem.value}') or ` +
            `contains(FNTSIGLA,'${elem.value}'))`
        );
        break;
      case "PAINOME":
        filters.push(
          `(contains(Pais/PAINOME,'${elem.value}') or ` +
            `contains(PAICODIGO,'${elem.value}'))`
        );
        helper_query = "&$expand=Pais";
        break;
      case "SERMINDATA":
        filters.push(`SERMINDATA ge ${formatDate(elem.value)}`);
        break;
      case "SERMAXDATA":
        filters.push(`SERMAXDATA le ${formatDate(elem.value)}`);
        break;
      case "BASNOME":
        const bases = elem.value
          .split(",")
          .map(base => `BASNOME eq '${base}'`)
          .join(" or ");
        filters.push(`(${bases})`);
        break;
      case "SERSTATUS":
        filters.push(`${elem.name} eq '${elem.value}'`);
        break;
      case "SERNUMERICA":
        filters.push(`${elem.name} eq ${elem.value}`);
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
