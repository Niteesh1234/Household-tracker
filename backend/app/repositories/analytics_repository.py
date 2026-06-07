from motor.motor_asyncio import AsyncIOMotorDatabase


class AnalyticsRepository:
    """MongoDB aggregation queries for dashboard analytics."""

    def __init__(self, database: AsyncIOMotorDatabase):
        self.expenses_collection = database["expenses"]
        self.maintenance_collection = database["maintenance_records"]

    async def get_expense_summary(self) -> dict:
        """Return total expense amount and count."""
        result = await self.expenses_collection.aggregate(
            [
                {
                    "$group": {
                        "_id": None,
                        "total_amount": {"$sum": "$amount"},
                        "total_count": {"$sum": 1},
                    }
                }
            ]
        ).to_list(length=1)

        return result[0] if result else {"total_amount": 0, "total_count": 0}

    async def get_maintenance_summary(self) -> dict:
        """Return total maintenance cost and count."""
        result = await self.maintenance_collection.aggregate(
            [
                {
                    "$group": {
                        "_id": None,
                        "total_cost": {"$sum": "$cost"},
                        "total_count": {"$sum": 1},
                    }
                }
            ]
        ).to_list(length=1)

        return result[0] if result else {"total_cost": 0, "total_count": 0}

    async def get_expense_spend_by_category(self) -> list[dict]:
        """Return expense spending grouped by category."""
        return await self.expenses_collection.aggregate(
            [
                {
                    "$group": {
                        "_id": "$category_name",
                        "total_amount": {"$sum": "$amount"},
                        "count": {"$sum": 1},
                    }
                },
                {"$sort": {"total_amount": -1}},
            ]
        ).to_list(length=100)

    async def get_maintenance_cost_by_asset_type(self) -> list[dict]:
        """Return maintenance cost grouped by asset type."""
        return await self.maintenance_collection.aggregate(
            [
                {
                    "$group": {
                        "_id": "$asset_type",
                        "total_cost": {"$sum": "$cost"},
                        "count": {"$sum": 1},
                    }
                },
                {"$sort": {"total_cost": -1}},
            ]
        ).to_list(length=100)

    async def get_recent_expenses(self, limit: int = 5) -> list[dict]:
        """Return recent expenses for dashboard activity lists."""
        cursor = self.expenses_collection.find({}).sort("expense_date", -1).limit(limit)
        return await cursor.to_list(length=limit)

    async def get_recent_maintenance_records(self, limit: int = 5) -> list[dict]:
        """Return recent maintenance records for dashboard activity lists."""
        cursor = self.maintenance_collection.find({}).sort("maintenance_date", -1).limit(limit)
        return await cursor.to_list(length=limit)