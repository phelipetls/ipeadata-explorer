interface ViteTypeOptions {
  strictImportMetaEnv: true
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_BASENAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
