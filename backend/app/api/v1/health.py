from datetime import datetime, timezone

from fastapi import APIRouter, status
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.db.mongodb import mongodb


router = APIRouter()


@router.get("")
async def health_check() -> dict[str, str]:
    """Return basic API liveness information for monitoring and smoke tests."""
    return {
        "status": "ok",
        "service": settings.app_name,
        "environment": settings.app_env,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/ready")
async def readiness_check() -> JSONResponse:
    """Return readiness information, including MongoDB connectivity."""
    is_database_ready = await mongodb.ping()
    response_status = status.HTTP_200_OK if is_database_ready else status.HTTP_503_SERVICE_UNAVAILABLE

    return JSONResponse(
        status_code=response_status,
        content={
            "status": "ready" if is_database_ready else "not_ready",
            "service": settings.app_name,
            "environment": settings.app_env,
            "database": "connected" if is_database_ready else "unavailable",
            "timestamp": datetime.now(timezone.utc).isoformat(),
        },
    )