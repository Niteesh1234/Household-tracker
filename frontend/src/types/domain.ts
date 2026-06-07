export type CategoryType = "expense" | "maintenance" | "both";
export type PaymentMethod = "cash" | "credit_card" | "debit_card" | "bank_transfer" | "other";
export type MaintenanceStatus = "scheduled" | "in_progress" | "completed" | "cancelled";
export type MaintenancePriority = "low" | "medium" | "high" | "urgent";

export interface CategoryResponse {
  id: string;
  name: string;
  description?: string | null;
  category_type: CategoryType;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoryCreatePayload {
  name: string;
  description?: string | null;
  category_type: CategoryType;
  color: string;
}

export interface ExpenseResponse {
  id: string;
  title: string;
  amount: number;
  category_id: string;
  category_name: string;
  expense_date: string;
  paid_by: string;
  vendor?: string | null;
  payment_method: PaymentMethod;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseCreatePayload {
  title: string;
  amount: number;
  category_id: string;
  expense_date: string;
  paid_by: string;
  vendor?: string | null;
  payment_method: PaymentMethod;
  notes?: string | null;
}

export interface MaintenanceResponse {
  id: string;
  title: string;
  asset_name: string;
  asset_type: string;
  category_id: string;
  category_name: string;
  maintenance_date: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  cost: number;
  service_provider?: string | null;
  next_due_date?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface MaintenanceCreatePayload {
  title: string;
  asset_name: string;
  asset_type: string;
  category_id: string;
  maintenance_date: string;
  status: MaintenanceStatus;
  priority: MaintenancePriority;
  cost: number;
  service_provider?: string | null;
  next_due_date?: string | null;
  notes?: string | null;
}

export const CATEGORY_TYPE_OPTIONS: CategoryType[] = ["both", "expense", "maintenance"];
export const PAYMENT_METHOD_OPTIONS: PaymentMethod[] = [
  "other",
  "cash",
  "credit_card",
  "debit_card",
  "bank_transfer",
];
export const MAINTENANCE_STATUS_OPTIONS: MaintenanceStatus[] = [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
];
export const MAINTENANCE_PRIORITY_OPTIONS: MaintenancePriority[] = ["low", "medium", "high", "urgent"];