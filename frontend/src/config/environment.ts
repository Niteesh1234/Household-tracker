export type AppEnvironment = "development" | "uat" | "production" | string;

export interface FrontendConfig {
  appEnvironment: AppEnvironment;
  apiBaseUrl: string;
  apiV1Prefix: string;
}

const trimTrailingSlash = (value: string): string => value.replace(/\/+$/, "");
const ensureLeadingSlash = (value: string): string => (value.startsWith("/") ? value : `/${value}`);

export const frontendConfig: FrontendConfig = {
  appEnvironment: import.meta.env.VITE_APP_ENV ?? import.meta.env.MODE ?? "development",
  apiBaseUrl: trimTrailingSlash(import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000"),
  apiV1Prefix: ensureLeadingSlash(import.meta.env.VITE_API_V1_PREFIX ?? "/api/v1"),
};

export const apiV1Url = `${frontendConfig.apiBaseUrl}${frontendConfig.apiV1Prefix}`;