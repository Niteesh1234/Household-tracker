from app.repositories.analytics_repository import AnalyticsRepository
from app.schemas.analytics import (
    CategorySpendItem,
    DashboardAnalyticsResponse,
    ExpenseSummary,
    MaintenanceCostByAssetTypeItem,
    MaintenanceSummary,
)
from app.schemas.expense import ExpenseResponse
from app.schemas.maintenance import MaintenanceResponse


class AnalyticsService:
    """Business logic for dashboard analytics."""

    def __init__(self, repository: AnalyticsRepository):
        self.repository = repository

    async def get_dashboard_analytics(self) -> DashboardAnalyticsResponse:
        """Return combined analytics data for the dashboard."""
        expense_summary = await self.repository.get_expense_summary()
        maintenance_summary = await self.repository.get_maintenance_summary()
        expense_spend_by_category = await self.repository.get_expense_spend_by_category()
        maintenance_cost_by_asset_type = await self.repository.get_maintenance_cost_by_asset_type()
        recent_expenses = await self.repository.get_recent_expenses()
        recent_maintenance_records = await self.repository.get_recent_maintenance_records()

        return DashboardAnalyticsResponse(
            expenses=ExpenseSummary(
                total_amount=expense_summary["total_amount"],
                total_count=expense_summary["total_count"],
            ),
            maintenance=MaintenanceSummary(
                total_cost=maintenance_summary["total_cost"],
                total_count=maintenance_summary["total_count"],
            ),
            expense_spend_by_category=[
                CategorySpendItem(
                    category_name=item["_id"],
                    total_amount=item["total_amount"],
                    count=item["count"],
                )
                for item in expense_spend_by_category
            ],
            maintenance_cost_by_asset_type=[
                MaintenanceCostByAssetTypeItem(
                    asset_type=item["_id"],
                    total_cost=item["total_cost"],
                    count=item["count"],
                )
                for item in maintenance_cost_by_asset_type
            ],
            recent_expenses=[ExpenseResponse.from_mongo(document) for document in recent_expenses],
            recent_maintenance_records=[
                MaintenanceResponse.from_mongo(document) for document in recent_maintenance_records
            ],
        )

    async def get_expense_spend_by_category(self) -> list[CategorySpendItem]:
        """Return expense spending grouped by category."""
        documents = await self.repository.get_expense_spend_by_category()
        return [
            CategorySpendItem(category_name=item["_id"], total_amount=item["total_amount"], count=item["count"])
            for item in documents
        ]

    async def get_maintenance_cost_by_asset_type(self) -> list[MaintenanceCostByAssetTypeItem]:
        """Return maintenance cost grouped by asset type."""
        documents = await self.repository.get_maintenance_cost_by_asset_type()
        return [
            MaintenanceCostByAssetTypeItem(asset_type=item["_id"], total_cost=item["total_cost"], count=item["count"])
            for item in documents
        ]