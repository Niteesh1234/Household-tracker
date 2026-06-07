from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field


MaintenanceStatus = Literal["scheduled", "in_progress", "completed", "cancelled"]
MaintenancePriority = Literal["low", "medium", "high", "urgent"]


class MaintenanceCreate(BaseModel):
    """Request body used when creating a household maintenance record."""

    title: str = Field(min_length=2, max_length=120)
    asset_name: str = Field(min_length=2, max_length=120)
    asset_type: str = Field(min_length=2, max_length=80)
    category_id: str = Field(min_length=24, max_length=24)
    maintenance_date: date
    status: MaintenanceStatus = "scheduled"
    priority: MaintenancePriority = "medium"
    cost: float = Field(default=0, ge=0)
    service_provider: str | None = Field(default=None, max_length=120)
    next_due_date: date | None = None
    notes: str | None = Field(default=None, max_length=500)


class MaintenanceResponse(BaseModel):
    """Response returned to API clients for maintenance records."""

    id: str
    title: str
    asset_name: str
    asset_type: str
    category_id: str
    category_name: str
    maintenance_date: date
    status: MaintenanceStatus
    priority: MaintenancePriority
    cost: float
    service_provider: str | None = None
    next_due_date: date | None = None
    notes: str | None = None
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_mongo(cls, document: dict) -> "MaintenanceResponse":
        """Convert a MongoDB document into an API response schema."""
        maintenance_date = document["maintenance_date"]
        next_due_date = document.get("next_due_date")

        if isinstance(maintenance_date, datetime):
            maintenance_date = maintenance_date.date()

        if isinstance(next_due_date, datetime):
            next_due_date = next_due_date.date()

        return cls(
            id=str(document["_id"]),
            title=document["title"],
            asset_name=document["asset_name"],
            asset_type=document["asset_type"],
            category_id=str(document["category_id"]),
            category_name=document["category_name"],
            maintenance_date=maintenance_date,
            status=document["status"],
            priority=document["priority"],
            cost=document["cost"],
            service_provider=document.get("service_provider"),
            next_due_date=next_due_date,
            notes=document.get("notes"),
            created_at=document["created_at"],
            updated_at=document["updated_at"],
        )