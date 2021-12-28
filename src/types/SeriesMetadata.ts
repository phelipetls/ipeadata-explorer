// Official documentation at http://www.ipeadata.gov.br/api/

export type SeriesBase = 'Macroeconômico' | 'Regional' | 'Social'

export interface SeriesMetadata {
  /**
   * Identifier code
   */
  SERCODIGO: string
  /**
   * Name
   */
  SERNOME: string
  /**
   * Description
   */
  SERCOMENTARIO: string | null
  /**
   * Last update date (ISO 8601)
   */
  SERATUALIZACAO: string
  /**
   * Database name
   */
  BASNOME: SeriesBase
  /**
   * Source identifier code
   */
  FNTID: number
  /**
   * Source initials
   */
  FNTSIGLA: string | null
  /**
   * Source name
   */
  FNTNOME: string | null
  /**
   * Source website URL
   */
  FNTURL: string | null
  /**
   * Periodicity
   */
  PERNOME:
    | 'Anual'
    | 'Decenal'
    | 'Diária'
    | 'Irregular'
    | 'Mensal'
    | 'Não se aplica'
    | 'Quadrienal'
    | 'Quinquenal'
    | 'Trimestral'
  /**
   * Value's unit of measurement
   */
  UNINOME: string | null
  /**
   * status. Inactive (I) or Active (A).
   */
  SERSTATUS: 'A' | 'I' | null
  /**
   * Theme's identifier code
   */
  TEMCODIGO: number
  /**
   * Theme's name
   */
  TEMNOME: string
  /**
   * Parent theme's identifier code
   */
  TEMCODIGOPAI: string | null
  /**
   * Parent theme's name
   */
  PAICODIGO: string | null
  /**
   * Whether series has numerical values or not
   */
  SERNUMERICA: boolean
  /**
   * If series has values for Brazil
   */
  SERTEMBR: boolean | null
  /**
   * If series has values for brazilian state.
   */
  SERTEMEST: boolean | null
  /**
   * If series has values for brazilian municipalities
   */
  SERTEMMUN: boolean | null
  /**
   * If series has values for AMCs
   */
  SERTEMAMC: boolean | null
  /**
   * If series has values for brazilian metropolitan areas
   */
  SERTEMMET: boolean | null
  /**
   * Minimum date
   */
  SERMINDATA: string | null
  /**
   * Maximum date
   */
  SERMAXDATA: string | null
  /**
   * Total number of observations
   */
  SERQNT: number
}
