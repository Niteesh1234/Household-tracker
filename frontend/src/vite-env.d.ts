/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MODE: string;
  readonly VITE_APP_ENV?: "development" | "uat" | "production" | string;
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_API_V1_PREFIX?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}