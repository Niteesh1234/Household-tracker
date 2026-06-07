from fastapi import APIRouter

from app.db.mongodb import mongodb
from app.repositories.category_repository import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryResponse
from app.services.category_service import CategoryService


router = APIRouter()


def get_category_service() -> CategoryService:
    """Build the category service with its repository dependency."""
    database = mongodb.get_database()
    repository = CategoryRepository(database)
    return CategoryService(repository)


@router.post("", response_model=CategoryResponse, status_code=201)
async def create_category(category: CategoryCreate) -> CategoryResponse:
    """Create a household category."""
    service = get_category_service()
    return await service.create_category(category)


@router.get("", response_model=list[CategoryResponse])
async def list_categories() -> list[CategoryResponse]:
    """List active household categories."""
    service = get_category_service()
    return await service.list_categories()