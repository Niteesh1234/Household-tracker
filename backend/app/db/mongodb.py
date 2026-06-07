from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import PyMongoError

from app.core.config import settings


class MongoDB:
    """Centralized MongoDB connection manager."""

    client: AsyncIOMotorClient | None = None
    database: AsyncIOMotorDatabase | None = None

    def connect(self) -> None:
        """Create the MongoDB client and select the configured database."""
        self.client = AsyncIOMotorClient(
            settings.mongodb_uri,
            uuidRepresentation="standard",
            serverSelectionTimeoutMS=settings.mongodb_server_selection_timeout_ms,
        )
        self.database = self.client[settings.mongodb_database]

    def close(self) -> None:
        """Close the MongoDB client during application shutdown."""
        if self.client is not None:
            self.client.close()

        self.client = None
        self.database = None

    def get_database(self) -> AsyncIOMotorDatabase:
        """Return the active MongoDB database instance."""
        if self.database is None:
            raise RuntimeError("MongoDB is not connected")

        return self.database

    async def ping(self) -> bool:
        """Check whether MongoDB is reachable."""
        if self.client is None:
            return False

        try:
            await self.client.admin.command("ping")
            return True
        except PyMongoError:
            return False


mongodb = MongoDB()