from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from motor.motor_asyncio import AsyncIOMotorDatabase


class CategoryRepository:
    """Database operations for household categories."""

    def __init__(self, database: AsyncIOMotorDatabase):
        self.collection = database["categories"]

    async def find_by_normalized_name(self, normalized_name: str) -> dict | None:
        """Find one category by normalized name."""
        return await self.collection.find_one({"normalized_name": normalized_name})

    async def find_by_id(self, category_id: str) -> dict | None:
        """Find one active category by MongoDB object id."""
        try:
            object_id = ObjectId(category_id)
        except InvalidId:
            return None

        return await self.collection.find_one({"_id": object_id, "is_active": True})

    async def create(self, category_data: dict) -> dict:
        """Create a category document and return the saved document."""
        now = datetime.now(timezone.utc)
        document = {
            **category_data,
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        }

        result = await self.collection.insert_one(document)
        saved_document = await self.collection.find_one({"_id": result.inserted_id})
        return saved_document

    async def list_active(self) -> list[dict]:
        """Return active categories sorted by name."""
        cursor = self.collection.find({"is_active": True}).sort("name", 1)
        return await cursor.to_list(length=100)