export type SeriesBase = "Macroeconômico" | "Regional" | "Social"

export interface SeriesMetadata {
  // [index: string]: string | number | boolean | null;
  SERCODIGO: string;
  SERNOME: string;
  SERCOMENTARIO: string | null;
  SERATUALIZACAO: string;
  BASNOME: SeriesBase;
  FNTID: number;
  FNTSIGLA: string | null;
  FNTNOME: string | null;
  FNTURL: string | null;
  PERNOME: string;
  UNINOME: string | null;
  SERSTATUS: string | null;
  TEMCODIGO: number;
  TEMNOME: string;
  TEMCODIGOPAI: string | null;
  PAICODIGO: string | null;
  SERNUMERICA: boolean;
  SERTEMBR: boolean | null;
  SERTEMEST: boolean | null;
  SERTEMMUN: boolean | null;
  SERTEMAMC: boolean | null;
  SERTEMMET: boolean | null;
  SERMINDATA: string | null;
  SERMAXDATA: string | null;
  FNTEXTURL: null;
  SERPROGRAMAGERADOR: null;
  SERDECIMAIS: number;
  SERQNT: number;
}

export interface SeriesValues {
  VALDATA: string;
  VALVALOR: number;
  TERCODIGO: string;
  TERNOME: string;
}
