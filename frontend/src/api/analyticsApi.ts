import { getJson } from "./http";
import type { DashboardAnalyticsResponse } from "../types/analytics";

export function getDashboardAnalytics(): Promise<DashboardAnalyticsResponse> {
  return getJson<DashboardAnalyticsResponse>("/analytics/dashboard");
}