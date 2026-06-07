from pydantic import BaseModel

from app.schemas.expense import ExpenseResponse
from app.schemas.maintenance import MaintenanceResponse


class ExpenseSummary(BaseModel):
    """High-level expense totals for dashboard cards."""

    total_amount: float
    total_count: int


class MaintenanceSummary(BaseModel):
    """High-level maintenance totals for dashboard cards."""

    total_cost: float
    total_count: int


class CategorySpendItem(BaseModel):
    """Expense spending grouped by category for charts."""

    category_name: str
    total_amount: float
    count: int


class MaintenanceCostByAssetTypeItem(BaseModel):
    """Maintenance cost grouped by asset type for charts."""

    asset_type: str
    total_cost: float
    count: int


class DashboardAnalyticsResponse(BaseModel):
    """Combined dashboard analytics response for the frontend."""

    expenses: ExpenseSummary
    maintenance: MaintenanceSummary
    expense_spend_by_category: list[CategorySpendItem]
    maintenance_cost_by_asset_type: list[MaintenanceCostByAssetTypeItem]
    recent_expenses: list[ExpenseResponse]
    recent_maintenance_records: list[MaintenanceResponse]