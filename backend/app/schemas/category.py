from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


CategoryType = Literal["expense", "maintenance", "both"]


class CategoryCreate(BaseModel):
    """Request body used when creating a new category."""

    name: str = Field(min_length=2, max_length=80)
    description: str | None = Field(default=None, max_length=300)
    category_type: CategoryType = "both"
    color: str = Field(default="#2563eb", pattern=r"^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$")


class CategoryResponse(BaseModel):
    """Response returned to API clients for category records."""

    id: str
    name: str
    description: str | None = None
    category_type: CategoryType
    color: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_mongo(cls, document: dict) -> "CategoryResponse":
        """Convert a MongoDB document into an API response schema."""
        return cls(
            id=str(document["_id"]),
            name=document["name"],
            description=document.get("description"),
            category_type=document["category_type"],
            color=document["color"],
            is_active=document["is_active"],
            created_at=document["created_at"],
            updated_at=document["updated_at"],
        )