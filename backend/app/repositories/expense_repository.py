from datetime import datetime, timezone

from motor.motor_asyncio import AsyncIOMotorDatabase


class ExpenseRepository:
    """Database operations for household expenses."""

    def __init__(self, database: AsyncIOMotorDatabase):
        self.collection = database["expenses"]

    async def create(self, expense_data: dict) -> dict:
        """Create an expense document and return the saved document."""
        now = datetime.now(timezone.utc)
        document = {
            **expense_data,
            "created_at": now,
            "updated_at": now,
        }

        result = await self.collection.insert_one(document)
        saved_document = await self.collection.find_one({"_id": result.inserted_id})
        return saved_document

    async def list_recent(self, limit: int = 100) -> list[dict]:
        """Return recent expenses sorted by expense date."""
        cursor = self.collection.find({}).sort("expense_date", -1).limit(limit)
        return await cursor.to_list(length=limit)