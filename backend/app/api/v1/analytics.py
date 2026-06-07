from fastapi import APIRouter

from app.db.mongodb import mongodb
from app.repositories.analytics_repository import AnalyticsRepository
from app.schemas.analytics import (
    CategorySpendItem,
    DashboardAnalyticsResponse,
    MaintenanceCostByAssetTypeItem,
)
from app.services.analytics_service import AnalyticsService


router = APIRouter()


def get_analytics_service() -> AnalyticsService:
    """Build the analytics service with its repository dependency."""
    database = mongodb.get_database()
    repository = AnalyticsRepository(database)
    return AnalyticsService(repository)


@router.get("/dashboard", response_model=DashboardAnalyticsResponse)
async def get_dashboard_analytics() -> DashboardAnalyticsResponse:
    """Return dashboard analytics for expenses and maintenance."""
    service = get_analytics_service()
    return await service.get_dashboard_analytics()


@router.get("/expense-spend-by-category", response_model=list[CategorySpendItem])
async def get_expense_spend_by_category() -> list[CategorySpendItem]:
    """Return expense spending grouped by category."""
    service = get_analytics_service()
    return await service.get_expense_spend_by_category()


@router.get("/maintenance-cost-by-asset-type", response_model=list[MaintenanceCostByAssetTypeItem])
async def get_maintenance_cost_by_asset_type() -> list[MaintenanceCostByAssetTypeItem]:
    """Return maintenance cost grouped by asset type."""
    service = get_analytics_service()
    return await service.get_maintenance_cost_by_asset_type()