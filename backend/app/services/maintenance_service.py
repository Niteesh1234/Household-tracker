from datetime import datetime, time, timezone

from fastapi import HTTPException, status

from app.repositories.category_repository import CategoryRepository
from app.repositories.maintenance_repository import MaintenanceRepository
from app.schemas.maintenance import MaintenanceCreate, MaintenanceResponse


class MaintenanceService:
    """Business logic for household maintenance records."""

    def __init__(self, maintenance_repository: MaintenanceRepository, category_repository: CategoryRepository):
        self.maintenance_repository = maintenance_repository
        self.category_repository = category_repository

    async def create_maintenance_record(self, maintenance: MaintenanceCreate) -> MaintenanceResponse:
        """Create a maintenance record after validating the selected category."""
        category = await self.category_repository.find_by_id(maintenance.category_id)

        if category is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found. Create the category before adding maintenance records.",
            )

        if category["category_type"] not in ["maintenance", "both"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Selected category is not allowed for maintenance records.",
            )

        maintenance_date = datetime.combine(maintenance.maintenance_date, time.min, tzinfo=timezone.utc)
        next_due_date = (
            datetime.combine(maintenance.next_due_date, time.min, tzinfo=timezone.utc)
            if maintenance.next_due_date
            else None
        )

        document = await self.maintenance_repository.create(
            {
                "title": maintenance.title.strip(),
                "asset_name": maintenance.asset_name.strip(),
                "asset_type": maintenance.asset_type.strip(),
                "category_id": category["_id"],
                "category_name": category["name"],
                "maintenance_date": maintenance_date,
                "status": maintenance.status,
                "priority": maintenance.priority,
                "cost": maintenance.cost,
                "service_provider": maintenance.service_provider,
                "next_due_date": next_due_date,
                "notes": maintenance.notes,
            }
        )

        return MaintenanceResponse.from_mongo(document)

    async def list_maintenance_records(self) -> list[MaintenanceResponse]:
        """List recent household maintenance records."""
        documents = await self.maintenance_repository.list_recent()
        return [MaintenanceResponse.from_mongo(document) for document in documents]