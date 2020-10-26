# Ipeadata explorer

Este é um front-end para o Ipeadata, a base de dados do mantida pelo Ipea reúne
séries temporais de diversas fontes, temas e países.

Tive como inspiração a versão 3 (beta) do site oficial do Ipeadata.

Aproveitando minha familiaridade com a API do Ipeadata e do IBGE de [outros
projetos][seriesbr], o desenvolvimento do site envolveu estudar [React][react],
o protocolo OData para [filtragem][odata-url-conventions] e
[agregação][odata-aggregation] dos dados da [API do Ipeadata][ipea-api],
estudar uma biblioteca para visualização de dados (no caso,
[Chart.js][chartjs]) e como [plotar dados geográficos][chartjs-chart-geo] em
conjunto com a [API de malhas do IBGE][ibge-malhas], que eu já conhecia de
[outro projeto][mapsbr] também.

[ipea-api]: http://ipeadata.gov.br/api/
[seriesbr]: https://seriesbr.readthedocs.io
[react]: https://reactjs.org/docs/getting-started.html
[odata-url-conventions]: https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part2-url-conventions.html
[odata-aggregation]: http://docs.oasis-open.org/odata/odata-data-aggregation-ext/v4.0/cs01/odata-data-aggregation-ext-v4.0-cs01.html#_Toc378326289
[chartjs]: https://www.chartjs.org/docs/latest/
[chartjs-chart-geo]: https://github.com/sgratzl/chartjs-chart-geo
[ibge-malhas]: https://servicodados.ibge.gov.br/api/docs/malhas?versao=2
[mapsbr]: http://mapsbr.rtfd.io/
