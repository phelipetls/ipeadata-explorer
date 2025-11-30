export const REGIONAL_LEVELS = [
  'brazil',
  'regions',
  'states',
  'municipalities',
] as const

export const FILTER_LABELS = {
  regionalDivision: 'Divisão Regional',
  region: 'Região',
  date: 'Período',
}

export const NEGATIVE_SERIES = new Set([
  'DESLIGNC', // Empregados - demissões - Novo Caged sem ajuste
  'ACIDT', // Número de vítimas a óbito em acidente de trânsito
  'ACIDTF', // Número de vítimas a óbito em acidente de trânsito do sexo feminino
  'ACIDTFJ', // Número de vítimas a óbito em acidente de trânsito de jovens de 15 a 29 anos do sexo feminino
  'ACIDTJ', // Número de vítimas a óbito em acidente de trânsito de jovens de 15 a 29 anos
  'ACIDTM', // Número de vítimas a óbito em acidente de trânsito do sexo masculino
  'ACIDTMJ', // Número de vítimas a óbito em acidente de trânsito de jovens de 15 a 29 anos do sexo masculino
  'HOMIC', // Número de homicídios
  'HOMICF', // Número de homicídios do sexo feminino
  'HOMICFJ', // Número de homicídios de jovens de 15 a 29 anos do sexo feminino
  'HOMICJ', // Número de homicídios de jovens de 15 a 29 anos
  'HOMICM', // Número de homicídios do sexo masculino
  'HOMICMJ', // Número de homicídios de jovens de 15 a 29 anos do sexo masculino
  'SUICID', // Número de suicídios
  'SUICIDF', // Número de suicídios do sexo feminino
  'SUICIDFJ', // Número de suicídios de jovens de 15 a 29 anos do sexo feminino
  'SUICIDJ', // Número de suicídios de jovens de 15 a 29 anos
  'SUICIDM', // Número de suicídios do sexo masculino
  'SUICIDMJ', // Número de suicídios de jovens de 15 a 29 anos do sexo masculino
  'TACIDT', // Taxa de vítimas de acidentes de trânsito a óbito (100.000 Habitantes)
  'THOMIC', // Taxa de homicídios (100.000 Habitantes)
  'TSUICID', // Taxa de suicídios (100.000 Habitantes)
  'PNADCA_TXPIUF_BRA', // Taxa de pobreza internacional - brancos (Brasil)
  'PNADCA_TXPIUF_HOM', // Taxa de pobreza internacional - homem (Brasil)
  'PNADCA_TXPIUF_MUL', // Taxa de pobreza internacional - mulher (Brasil)
  'PNADCA_TXPIUF_PRT', // Taxa de pobreza internacional - pretos/pardos (Brasil)
  'PNADCA_TXPIUF_RUR', // Taxa de pobreza internacional - rural (Brasil)
  'PNADCA_TXPIUF_URB', // Taxa de pobreza intenacional - urbano (Brasil)
  'PNADCA_TXPNUF_BRA', // Taxa de pobreza nacional - brancos (Brasil)
  'PNADCA_TXPNUF_HOM', // Taxa de pobreza nacional - homem (Brasil)
  'PNADCA_TXPNUF_MUL', // Taxa de pobreza nacional - mulher (Brasil)
  'PNADCA_TXPNUF_PRT', // Taxa de pobreza nacional - pretos/pardos (Brasil)
  'PNADCA_TXPNUF_RUR', // Taxa de pobreza nacional - rural (Brasil)
  'PNADCA_TXPNUF_URB', // Taxa de pobreza nacional - urbano (Brasil)
  'AVS_IVS', // IVS - Índice de Vulnerabilidade Social
  'AVS_IVSCH', // IVS - subíndice de Capital Humano
  'AVS_IVSIU', // IVS - subíndice de Infraestrutura Urbana
  'AVS_IVSRT', // IVS - subíndice de Renda e Trabalho
  'ADH_MORT1', // Taxa de mortalidade até um ano de idade (Atlas DH - Censo)
  'ADH_MORT5', // Taxa de mortalidade até cinco anos de idade (Atlas DH - Censo)
  'ADH_RAZDEP', // Razão de Dependência (Atlas DH - Censo)
  'ADH_T_ENV', // Taxa de envelhecimento (Atlas DH - Censo)
  'ODS_MORT5UF', // Taxa de mortalidade até cinco anos de idade (Min. Saúde)
  'ODS_MORTNUF', // Taxa de mortalidade neonatal (Min. Saúde)
  'ADH_MORT1_BRA', // Mortalidade até um ano de idade - cor branca (Atlas DH - Censo)
  'ADH_MORT1_NEG', // Mortalidade até um ano de idade - cor negra (Atlas DH - Censo)
  'ADH_MORT5_BRA', // Mortalidade até cinco anos de idade - cor branca (Atlas DH - Censo)
  'ADH_MORT5_NEG', // Mortalidade até cinco anos de idade - cor negra (Atlas DH - Censo)
  'ADH_RAZDEP_BRA', // Razão de Dependência - cor branca (Atlas DH - Censo)
  'ADH_RAZDEP_NEG', // Razão de Dependência - cor negra (Atlas DH - Censo)
  'ADH_T_ENV_BRA', // Taxa de envelhecimento - cor branca (Atlas DH - Censo)
  'ADH_T_ENV_NEG', // Taxa de envelhecimento - cor negra (Atlas DH - Censo)
  'ADH_MORT1_HOM', // Mortalidade até um ano de idade - homens (Atlas DH - Censo)
  'ADH_MORT1_MUL', // Mortalidade até um ano de idade - mulheres (Atlas DH - Censo)
  'ADH_MORT5_HOM', // Mortalidade até cinco anos de idade - homens (Atlas DH - Censo)
  'ADH_MORT5_MUL', // Mortalidade até cinco anos de idade - mulheres (Atlas DH - Censo)
  'ADH_RAZDEP_HOM', // Razão de Dependência - homens (Atlas DH - Censo)
  'ADH_RAZDEP_MUL', // Razão de Dependência - mulheres (Atlas DH - Censo)
  'ADH_T_ENV_HOM', // Taxa de envelhecimento - homens (Atlas DH - Censo)
  'ADH_T_ENV_MUL', // Taxa de envelhecimento - mulheres (Atlas DH - Censo)
  'ADH_MORT1_RUR', // Mortalidade até um ano de idade - áreas rurais (Atlas DH - Censo)
  'ADH_MORT1_URB', // Mortalidade até um ano de idade - áreas urbanas (Atlas DH - Censo)
  'ADH_MORT5_RUR', // Mortalidade até cinco anos de idade - áreas rurais (Atlas DH - Censo)
  'ADH_MORT5_URB', // Mortalidade até cinco anos de idade - áreas urbanas (Atlas DH - Censo)
  'ADH_RAZDEP_RUR', // Razão de Dependência - áreas rurais (Atlas DH - Censo)
  'ADH_RAZDEP_URB', // Razão de Dependência - áreas urbanas (Atlas DH - Censo)
  'ADH_T_ENV_RUR', // Taxa de envelhecimento - áreas rurais (Atlas DH - Censo)
  'ADH_T_ENV_URB', // Taxa de envelhecimento - áreas urbanas (Atlas DH - Censo)
  'ADH_T_ANALF15M', // Taxa de analfabetismo - pessoas com 15 anos ou mais (Atlas DH - Censo)
  'ANALFABET', // População analfabeta - INATIVA
  'PCT03SVGUF', // Crianças de 0 a 3 anos que não frequenta creche ou escola por falta de vaga
  'PNADCA_PCT1529NONFUF', // Jovens não ocupados e não frequentando escola
  'PNADCA_TXA15MUF', // Taxa de analfabetismo - pessoas com 15 anos ou mais
  'ADH_T_ANALF15M_BRA', // Taxa de analfabetismo - brancos (Atlas DH - Censo)
  'ADH_T_ANALF15M_NEG', // Taxa de analfabetismo - pretos (Atlas DH - Censo)
  'PNADCA_PCT1529NONFUF_BRA', // Jovens não ocupados e não frequentando escola - Brancos
  'PNADCA_PCT1529NONFUF_NEG', // Jovens não ocupados e não frequentando escola - Pardos/Pretos
  'PNADCA_TXA15MUF_BRA', // Taxa de analfabetismo - Brancos
  'PNADCA_TXA15MUF_NEG', // Taxa de analfabetismo - Pardos/Pretos
  'ADH_T_ANALF15M_HOM', // Taxa de analfabetismo - homem (Atlas DH - Censo)
  'ADH_T_ANALF15M_MUL', // Taxa de analfabetismo - mulher (Atlas DH - Censo)
  'PNADCA_PCT1529NONFUF_HOM', // Jovens não ocupados e não frequentando escola - homem
  'PNADCA_PCT1529NONFUF_MUL', // Jovens não ocupados e não frequentando escola - mulher
  'PNADCA_TXA15MUF_HOM', // Taxa de analfabetismo - homem
  'PNADCA_TXA15MUF_MUL', // Taxa de analfabetismo - mulher
  'ADH_T_ANALF15M_RUR', // Taxa de analfabetismo - áreas rurais (Atlas DH - Censo)
  'ADH_T_ANALF15M_URB', // Taxa de analfabetismo - áreas urbanas (Atlas DH - Censo)
  'ADH_T_AGUA_ESGOTO', // Pessoas em domicílios com abastecimento de água e esgotamento sanitário inadequados
  'ADH_T_DENS', // População que vive em domicílios com densidade superior a 2 pessoas por dormitório
  'ADH_T_PAREDE', // Pessoas em domicílios com paredes que não sejam de alvenaria ou madeira aparelhada
  'ADH_T_AGUA_ESGOTO_BRA', // Pessoas em domicílios inadequados - cor branca
  'ADH_T_AGUA_ESGOTO_NEG', // Pessoas em domicílios inadequados - cor negra
  'ADH_T_DENS_BRA', // Densidade domiciliar > 2 - cor branca
  'ADH_T_DENS_NEG', // Densidade domiciliar > 2 - cor negra
  'ADH_T_PAREDE_BRA', // Domicílios com paredes inadequadas - cor branca
  'ADH_T_PAREDE_NEG', // Domicílios com paredes inadequadas - cor negra
  'ADH_T_AGUA_ESGOTO_HOM', // Pessoas em domicílios inadequados - homens
  'ADH_T_AGUA_ESGOTO_MUL', // Pessoas em domicílios inadequados - mulheres
  'ADH_T_DENS_HOM', // Densidade domiciliar > 2 - homens
  'ADH_T_DENS_MUL', // Densidade domiciliar > 2 - mulheres
  'ADH_T_PAREDE_HOM', // Domicílios com paredes inadequadas - homens
  'ADH_T_PAREDE_MUL', // Domicílios com paredes inadequadas - mulheres
  'ADH_T_AGUA_ESGOTO_RUR', // Pessoas em domicílios inadequados - áreas rurais
  'ADH_T_AGUA_ESGOTO_URB', // Pessoas em domicílios inadequados - áreas urbanas
  'ADH_T_DENS_RUR', // Densidade domiciliar > 2 - áreas rurais
  'ADH_T_DENS_URB', // Densidade domiciliar > 2 - áreas urbanas
  'ADH_T_PAREDE_RUR', // Domicílios com paredes inadequadas - áreas rurais
  'ADH_T_PAREDE_URB', // Domicílios com paredes inadequadas - áreas urbanas
  'Dese_Pnad', // Taxa de desemprego (IBGE/Pnad)- INATIVA
  'PNADCT_NIVDSCPUF', // Nível da desocupação
  'PNADCT_P14FFTUF', // Fora da força de trabalho (Pessoas > 14 anos)
  'PNADCT_P14MDSCPUF', // População desocupada (Pessoas > 14 anos)
  'PNADCT_PCTOCP_DOMSCTUF', // Porcentagem de trab. domésticos sem carteira entre os ocupados
  'PNADCT_PCTOCP_PRVSCTUF', // Porcentagem de empregados sem carteira entre os ocupados
  'PNADCT_PERDESUF', // Porcentagem de pessoas desocupadas com 1 ano ou mais de procura por trabalho
  'PNADCT_TXDSCUPUF', // Taxa de desemprego (IBGE/Pnad Contínua)
  'PNADCT_TXINFORMUF', // Taxa de Informalidade (IBGE/Pnad Contínua)
  'PNADCT_TXSUBSTUF', // Taxa subutilização da força de trabalho (IBGE/Pnad Contínua)
  'ADH_T_DES1014', // Taxa de desocupação da população de 10 a 14 anos de idade
  'ADH_T_DES1517', // Taxa de desocupação da população de 15 a 17 anos de idade
  'ADH_T_DES18M', // Taxa de desocupação da população de 18 anos ou mais de idade
  'PNADCT_TXDSCUPUF_1417', // Taxa de desemprego - 14 a 17 anos
  'PNADCT_TXDSCUPUF_1824', // Taxa de desemprego - 18 a 24 anos
  'PNADCT_TXDSCUPUF_2539', // Taxa de desemprego - 25 a 39 anos
  'PNADCT_TXDSCUPUF_4059', // Taxa de desemprego - 40 a 59 anos
  'PNADCT_TXDSCUPUF_60M', // Taxa de desemprego - mais de 60 anos
  'PNADCT_TXINFORMUF_1417', // Informalidade - 14 a 17 anos
  'PNADCT_TXINFORMUF_1824', // Informalidade - 18 a 24 anos
  'PNADCT_TXINFORMUF_2539', // Informalidade - 25 a 39 anos
  'PNADCT_TXINFORMUF_4059', // Informalidade - 40 a 59 anos
  'PNADCT_TXINFORMUF_60M', // Informalidade - mais de 60 anos
  'PNADCT_TXSUBUTUF_1417', // Taxa subutilização da força de trabalho - 14 a 17 anos
  'PNADCT_TXSUBUTUF_1824', // Taxa subutilização da força de trabalho - 18 a 24 anos
  'PNADCT_TXSUBUTUF_2539', // Taxa subutilização da força de trabalho - 25 a 39 anos
  'PNADCT_TXSUBUTUF_4059', // Taxa subutilização da força de trabalho - 40 a 59 anos
  'PNADCT_TXSUBUTUF_60M', // Taxa subutilização da força de trabalho - mais de 60 anos
  'ADH_GINI', // Índice de Gini (Atlas DH - Censo)
  'ADH_PIND', // Proporção de pessoas extremamente pobres (Atlas DH - Censo)
  'ADH_PMPOB', // Proporção de pessoas pobres (Atlas DH - Censo)
  'ADH_PPOB', // Proporção de vulneráveis à pobreza (Atlas DH - Censo)
  'ADH_R1040', // Razão 10% mais ricos / 40% mais pobres (Atlas DH - Censo)
  'ADH_THEIL', // Índice de Theil-L (Atlas DH - Censo)
  'P0', // Pobreza - pessoas pobres (P0) - INATIVA
  'PGINI', // Índice de Gini (Pnad/IBGE) - INATIVA
  'PNADCA_GINIUF', // Índice de Gini (Pnad Contínua/A)
  'PNADCA_POPPCC215', // População abaixo da linha de pobreza de PPC$2,15
  'PNADCA_POPPCC365', // População abaixo da linha de pobreza de PPC$3,65
  'PNADCA_POPPCC685', // População abaixo da linha de pobreza de PPC$6,85
  'PNADCA_TXPIUF', // Taxa de pobreza internacional (SIS/IBGE)
  'PNADCA_TXPNUF', // Taxa de pobreza nacional (SIS/IBGE)
  'PNADCA_TXPPCC215', // Proporção de pessoas abaixo da linha de pobreza de PPC$2,15
  'PNADCA_TXPPCC365', // Proporção de pessoas abaixo da linha de pobreza de PPC$3,65
  'PNADCA_TXPPCC685', // Proporção de pessoas abaixo da linha de pobreza de PPC$6,85
  'PNAD_IATOT', // Domicílios com insegurança alimentar
  'PNAD_IAGRV', // Domicílios com insegurança alimentar grave
  'PNAD_IALEV', // Domicílios com insegurança alimentar leve
  'PNAD_IAMOD', // Domicílios com insegurança alimentar moderada
])

export const DIVERGENT_SERIES = new Set([
  'ADH_IDHM',
  'ADH_IDHM_E',
  'ADH_IDHM_L',
  'ADH_IDHM_R',
  'ADH_IDHM_E_HOM',
  'ADH_IDHM_E_MUL',
  'ADH_IDHM_HOM',
  'ADH_IDHM_L_HOM',
  'ADH_IDHM_L_MUL',
  'ADH_IDHM_MUL',
  'ADH_IDHM_R_HOM',
  'ADH_IDHM_R_MUL',
  'ADH_IDHM_BRA',
  'ADH_IDHM_E_BRA',
  'ADH_IDHM_E_NEG',
  'ADH_IDHM_L_BRA',
  'ADH_IDHM_L_NEG',
  'ADH_IDHM_NEG',
  'ADH_IDHM_R_BRA',
  'ADH_IDHM_R_NEG',
  'ADH_IDHM_E_RUR',
  'ADH_IDHM_E_URB',
  'ADH_IDHM_L_RUR',
  'ADH_IDHM_L_URB',
  'ADH_IDHM_R_RUR',
  'ADH_IDHM_R_URB',
  'ADH_IDHM_RUR',
  'ADH_IDHM_URB',
  'IDHM',
  'IDHMED',
  'IDHMLO',
  'IDHMRE',
  'PNUD_IDH',
  'FIRJAN_IFDM',
  'IFDM2018',
  'AVS_IVS',
  'AVS_IVSCH',
  'AVS_IVSIU',
  'AVS_IVSRT',
  'PIBVRAE',
  'ADH_GINI',
  'ADH_GINI_BRA',
  'ADH_GINI_NEG',
  'ADH_GINI_HOM',
  'ADH_GINI_MUL',
  'ADH_GINI_RUR',
  'ADH_GINI_URB',
  'ADH_R1040',
  'ADH_THEIL',
  'ADH_THEIL_BRA',
  'ADH_THEIL_NEG',
  'ADH_THEIL_HOM',
  'ADH_THEIL_MUL',
  'ADH_THEIL_RUR',
  'ADH_THEIL_URB',
  'PGINI',
  'PNADCA_GINIUF',
])
