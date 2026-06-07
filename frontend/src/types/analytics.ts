import type { ExpenseResponse, MaintenanceResponse } from "./domain";

export type { ExpenseResponse, MaintenanceResponse } from "./domain";

export interface ExpenseSummary {
  total_amount: number;
  total_count: number;
}

export interface MaintenanceSummary {
  total_cost: number;
  total_count: number;
}

export interface CategorySpendItem {
  category_name: string;
  total_amount: number;
  count: number;
}

export interface MaintenanceCostByAssetTypeItem {
  asset_type: string;
  total_cost: number;
  count: number;
}

export interface DashboardAnalyticsResponse {
  expenses: ExpenseSummary;
  maintenance: MaintenanceSummary;
  expense_spend_by_category: CategorySpendItem[];
  maintenance_cost_by_asset_type: MaintenanceCostByAssetTypeItem[];
  recent_expenses: ExpenseResponse[];
  recent_maintenance_records: MaintenanceResponse[];
}