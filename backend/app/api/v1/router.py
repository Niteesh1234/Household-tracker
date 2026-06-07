from fastapi import APIRouter

from app.api.v1.analytics import router as analytics_router
from app.api.v1.categories import router as categories_router
from app.api.v1.expenses import router as expenses_router
from app.api.v1.health import router as health_router
from app.api.v1.maintenance import router as maintenance_router


api_router = APIRouter()
api_router.include_router(health_router, prefix="/health", tags=["health"])
api_router.include_router(categories_router, prefix="/categories", tags=["categories"])
api_router.include_router(expenses_router, prefix="/expenses", tags=["expenses"])
api_router.include_router(maintenance_router, prefix="/maintenance-records", tags=["maintenance"])
api_router.include_router(analytics_router, prefix="/analytics", tags=["analytics"])