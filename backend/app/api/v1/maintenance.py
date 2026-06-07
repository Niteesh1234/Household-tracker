from fastapi import APIRouter

from app.db.mongodb import mongodb
from app.repositories.category_repository import CategoryRepository
from app.repositories.maintenance_repository import MaintenanceRepository
from app.schemas.maintenance import MaintenanceCreate, MaintenanceResponse
from app.services.maintenance_service import MaintenanceService


router = APIRouter()


def get_maintenance_service() -> MaintenanceService:
    """Build the maintenance service with repository dependencies."""
    database = mongodb.get_database()
    maintenance_repository = MaintenanceRepository(database)
    category_repository = CategoryRepository(database)
    return MaintenanceService(maintenance_repository, category_repository)


@router.post("", response_model=MaintenanceResponse, status_code=201)
async def create_maintenance_record(maintenance: MaintenanceCreate) -> MaintenanceResponse:
    """Create a household maintenance record."""
    service = get_maintenance_service()
    return await service.create_maintenance_record(maintenance)


@router.get("", response_model=list[MaintenanceResponse])
async def list_maintenance_records() -> list[MaintenanceResponse]:
    """List recent household maintenance records."""
    service = get_maintenance_service()
    return await service.list_maintenance_records()