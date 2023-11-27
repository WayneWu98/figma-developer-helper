/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_PORT: number
  readonly VITE_APP_CDN_HOST: string
  readonly VITE_APP_COMPONENT_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}