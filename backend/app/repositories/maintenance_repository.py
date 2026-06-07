from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorDatabase


class MaintenanceRepository:
    """Database operations for household maintenance records."""

    def __init__(self, database: AsyncIOMotorDatabase):
        self.collection = database["maintenance_records"]

    async def create(self, maintenance_data: dict) -> dict:
        """Create a maintenance record and return the saved document."""
        now = datetime.now(timezone.utc)
        document = {
            **maintenance_data,
            "created_at": now,
            "updated_at": now,
        }

        result = await self.collection.insert_one(document)
        saved_document = await self.collection.find_one({"_id": result.inserted_id})
        return saved_document

    async def list_recent(self, limit: int = 100) -> list[dict]:
        """Return recent maintenance records sorted by maintenance date."""
        cursor = self.collection.find({}).sort("maintenance_date", -1).limit(limit)
        return await cursor.to_list(length=limit)