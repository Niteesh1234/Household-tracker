from fastapi import HTTPException, status

from app.repositories.category_repository import CategoryRepository
from app.schemas.category import CategoryCreate, CategoryResponse


class CategoryService:
    """Business logic for household categories."""

    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    async def create_category(self, category: CategoryCreate) -> CategoryResponse:
        """Create a category after applying business validation rules."""
        normalized_name = self._normalize_name(category.name)
        existing_category = await self.repository.find_by_normalized_name(normalized_name)

        if existing_category:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A category with this name already exists.",
            )

        document = await self.repository.create(
            {
                "name": category.name.strip(),
                "normalized_name": normalized_name,
                "description": category.description,
                "category_type": category.category_type,
                "color": category.color,
            }
        )

        return CategoryResponse.from_mongo(document)

    async def list_categories(self) -> list[CategoryResponse]:
        """List all active categories."""
        documents = await self.repository.list_active()
        return [CategoryResponse.from_mongo(document) for document in documents]

    @staticmethod
    def _normalize_name(name: str) -> str:
        """Normalize category names so duplicate checks are reliable."""
        return " ".join(name.strip().split()).casefold()