import { getJson, postJson } from "./http";
import type {
  CategoryCreatePayload,
  CategoryResponse,
  ExpenseCreatePayload,
  ExpenseResponse,
  MaintenanceCreatePayload,
  MaintenanceResponse,
} from "../types/domain";

export function listCategories(): Promise<CategoryResponse[]> {
  return getJson<CategoryResponse[]>("/categories");
}

export function createCategory(payload: CategoryCreatePayload): Promise<CategoryResponse> {
  return postJson<CategoryResponse, CategoryCreatePayload>("/categories", payload);
}

export function listExpenses(): Promise<ExpenseResponse[]> {
  return getJson<ExpenseResponse[]>("/expenses");
}

export function createExpense(payload: ExpenseCreatePayload): Promise<ExpenseResponse> {
  return postJson<ExpenseResponse, ExpenseCreatePayload>("/expenses", payload);
}

export function listMaintenanceRecords(): Promise<MaintenanceResponse[]> {
  return getJson<MaintenanceResponse[]>("/maintenance-records");
}

export function createMaintenanceRecord(payload: MaintenanceCreatePayload): Promise<MaintenanceResponse> {
  return postJson<MaintenanceResponse, MaintenanceCreatePayload>("/maintenance-records", payload);
}