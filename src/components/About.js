import React from "react";

import { Container, Typography, Link } from "@material-ui/core";

export default function About() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Sobre
      </Typography>

      <Typography paragraph>
        Este site foi desenvolvido por mim,{" "}
        <Link href="https://phelipetls.github.io">Phelipe Teles</Link>, no
        intuito de aprender React. Ele teve como inspiração a versão 3 (beta){" "}
        <Link href="http://ipeadata.gov.br/beta3/">
          do site oficial do Ipeadata
        </Link>
        .
      </Typography>

      <Typography paragraph>
        Aproveitando minha familiaridade com a{" "}
        <Link href="http://ipeadata.gov.br/api/">API do Ipeadata</Link> e do
        IBGE{" "}
        <Link href="https://seriesbr.readthedocs.io">de outros projetos</Link>,
        o desenvolvimento do site envolveu estudar{" "}
        <Link href="https://reactjs.org/docs/getting-started.html">
          como funciona o framework
        </Link>
        , como aproveitar ao máximo o protocolo OData para{" "}
        <Link href="https://docs.oasis-open.org/odata/odata/v4.01/odata-v4.01-part2-url-conventions.html">
          filtrar
        </Link>{" "}
        e{" "}
        <Link href="http://docs.oasis-open.org/odata/odata-data-aggregation-ext/v4.0/cs01/odata-data-aggregation-ext-v4.0-cs01.html#_Toc378326289">
          agregar
        </Link>{" "}
        os dados da API do Ipeadata, estudar uma biblioteca para visualização de
        dados (no caso,{" "}
        <Link href="https://www.chartjs.org/docs/latest/">Chart.js</Link>) e
        como{" "}
        <Link href="https://github.com/sgratzl/chartjs-chart-geo">
          plotar dados geográficos
        </Link>{" "}
        usando TopoJSON da{" "}
        <Link href="https://servicodados.ibge.gov.br/api/docs/malhas?versao=2">
          API de malhas do IBGE
        </Link>
        , que eu já conhecia
        <Link href="http://mapsbr.rtfd.io/"> de outro projeto</Link> também.
      </Typography>

      <Typography paragraph>
        Se por algum motivo for do seu interesse, você pode entrar contato
        comigo pelo meu <Link href="https://github.com/phelipetls">GitHub</Link>{" "}
        ou <Link href="mailto:phelipe_teles@hotmail.com">e-mail</Link>.
      </Typography>

      <Typography paragraph>
        Encorajo o usuário a{" "}
        <Link href="https://github.com/phelipetls/ipeadata-explorer/issues">
          abrir uma issue
        </Link>{" "}
        no GitHub se encontrar algum bug ou se deseja alguma feature.
      </Typography>
    </Container>
  );
}
