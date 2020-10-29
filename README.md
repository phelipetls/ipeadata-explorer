# [Ipeadata Explorer](http://ipeadata-explorer.surge.sh/)

Este é um front-end para o Ipeadata, a base de dados do mantida pelo Ipea que
reúne séries temporais de diversas fontes, temas e países.

O site tem como objetivo ajudar pesquisadores, estudantes e a quem mais
interesse, a descobrir e visualizar as séries disponíveis.

Tive como inspiração a versão 3 (beta) do [site oficial do
Ipeadata](http://ipeadata.gov.br/beta3/).

Tecnologias utilizadas:

- [React](https://reactjs.org/).
- [Material-UI](https://material-ui.com/).
- OData (Open Data Protocol) para interagir com o backend do Ipeadata (queries
  para [filtrar](odata-url-conventions) e [agregar](odata-aggregation) os dados
  etc.).
- [Chart.js](https://chartjs.org/) para visualizações de dados simples.
- [chartjs-chart-geo](https://github.com/sgratzl/chartjs-chart-geo), plugin do
  Chart.js para plotar dados distribuídos geograficamente, como um mapa
  choropleth, utilizado topoJSON, por exemplo.
- APIs de [malhas](https://servicodados.ibge.gov.br/api/docs/malhas?versao=2) e
  de
  [localidades](https://servicodados.ibge.gov.br/api/docs/localidades?versao=1)
  para obter o TopoJSON de regiões geográficas do Brasil e listas de todas as
  regiões, respectivamente.

# Demo

![Ipeadata Explorer Demo](./ipeadata-explorer-demo.gif)
