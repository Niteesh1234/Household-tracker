"""Seed local MongoDB with demo data for visual dashboard testing.

This script is intentionally idempotent for demo records:
- It deletes only documents marked with `seed_batch = local_dashboard_demo_v1`.
- It reuses existing active categories when the same category name already exists.
- It does not delete manually created user records.

Run from the `backend` folder:

    APP_ENV=development .venv/bin/python scripts/seed_demo_data.py
"""

from __future__ import annotations

import asyncio
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

from bson import ObjectId
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.core.config import settings


SEED_BATCH = "local_dashboard_demo_v1"


def normalize_name(name: str) -> str:
    """Match backend category duplicate-check normalization."""
    return " ".join(name.strip().split()).casefold()


def days_ago(days: int) -> datetime:
    """Return a UTC midnight-ish datetime for MongoDB date fields."""
    value = datetime.now(timezone.utc) - timedelta(days=days)
    return value.replace(hour=0, minute=0, second=0, microsecond=0)


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


DEMO_CATEGORIES = [
    {
        "name": "Groceries",
        "description": "Food and household grocery runs.",
        "category_type": "expense",
        "color": "#16a34a",
    },
    {
        "name": "Utilities",
        "description": "Electricity, water, gas, and trash bills.",
        "category_type": "expense",
        "color": "#2563eb",
    },
    {
        "name": "Internet & Phone",
        "description": "Connectivity and communication bills.",
        "category_type": "expense",
        "color": "#7c3aed",
    },
    {
        "name": "Home Supplies",
        "description": "Cleaning supplies, tools, and household basics.",
        "category_type": "expense",
        "color": "#ea580c",
    },
    {
        "name": "Home Repair",
        "description": "General repairs and handyman work.",
        "category_type": "maintenance",
        "color": "#dc2626",
    },
    {
        "name": "HVAC",
        "description": "Heating, ventilation, and air conditioning service.",
        "category_type": "maintenance",
        "color": "#0891b2",
    },
    {
        "name": "Appliances",
        "description": "Kitchen, laundry, and household appliances.",
        "category_type": "maintenance",
        "color": "#9333ea",
    },
    {
        "name": "Landscaping",
        "description": "Yard care, plants, irrigation, and outdoor maintenance.",
        "category_type": "both",
        "color": "#65a30d",
    },
]


DEMO_EXPENSES = [
    {
        "title": "Weekly grocery run",
        "amount": 164.32,
        "category": "Groceries",
        "days_ago": 1,
        "paid_by": "Household",
        "vendor": "Costco",
        "payment_method": "credit_card",
        "notes": "Bulk pantry items and fresh produce.",
    },
    {
        "title": "Electric bill",
        "amount": 218.74,
        "category": "Utilities",
        "days_ago": 2,
        "paid_by": "Household",
        "vendor": "APS",
        "payment_method": "bank_transfer",
        "notes": "Higher usage during hot weather.",
    },
    {
        "title": "Internet service",
        "amount": 89.99,
        "category": "Internet & Phone",
        "days_ago": 4,
        "paid_by": "Household",
        "vendor": "Cox",
        "payment_method": "credit_card",
        "notes": "Monthly fiber internet plan.",
    },
    {
        "title": "Cleaning supplies",
        "amount": 72.18,
        "category": "Home Supplies",
        "days_ago": 5,
        "paid_by": "Household",
        "vendor": "Target",
        "payment_method": "debit_card",
        "notes": "Laundry detergent, paper towels, and cleaners.",
    },
    {
        "title": "Water bill",
        "amount": 64.41,
        "category": "Utilities",
        "days_ago": 7,
        "paid_by": "Household",
        "vendor": "City Water",
        "payment_method": "bank_transfer",
        "notes": "Monthly water service.",
    },
    {
        "title": "Garden mulch and soil",
        "amount": 126.50,
        "category": "Landscaping",
        "days_ago": 9,
        "paid_by": "Household",
        "vendor": "Home Depot",
        "payment_method": "credit_card",
        "notes": "Backyard garden refresh.",
    },
    {
        "title": "Midweek groceries",
        "amount": 94.27,
        "category": "Groceries",
        "days_ago": 11,
        "paid_by": "Household",
        "vendor": "Trader Joe's",
        "payment_method": "debit_card",
        "notes": "Snacks, fruit, and dinner items.",
    },
    {
        "title": "Phone family plan",
        "amount": 142.20,
        "category": "Internet & Phone",
        "days_ago": 13,
        "paid_by": "Household",
        "vendor": "Verizon",
        "payment_method": "credit_card",
        "notes": "Monthly phone plan.",
    },
    {
        "title": "Garage storage bins",
        "amount": 58.86,
        "category": "Home Supplies",
        "days_ago": 15,
        "paid_by": "Household",
        "vendor": "Walmart",
        "payment_method": "credit_card",
        "notes": "Storage organization.",
    },
    {
        "title": "Gas bill",
        "amount": 49.78,
        "category": "Utilities",
        "days_ago": 18,
        "paid_by": "Household",
        "vendor": "Southwest Gas",
        "payment_method": "bank_transfer",
        "notes": "Monthly gas service.",
    },
    {
        "title": "Weekend groceries",
        "amount": 132.64,
        "category": "Groceries",
        "days_ago": 20,
        "paid_by": "Household",
        "vendor": "Fry's",
        "payment_method": "credit_card",
        "notes": "Weekly groceries.",
    },
    {
        "title": "Irrigation parts",
        "amount": 38.95,
        "category": "Landscaping",
        "days_ago": 24,
        "paid_by": "Household",
        "vendor": "Lowe's",
        "payment_method": "debit_card",
        "notes": "Sprinkler heads and couplers.",
    },
]


DEMO_MAINTENANCE_RECORDS = [
    {
        "title": "HVAC seasonal tune-up",
        "asset_name": "Main HVAC unit",
        "asset_type": "HVAC",
        "category": "HVAC",
        "days_ago": 3,
        "status": "completed",
        "priority": "high",
        "cost": 189.00,
        "service_provider": "Desert Air Services",
        "next_due_in_days": 180,
        "notes": "Changed filters and checked refrigerant levels.",
    },
    {
        "title": "Kitchen sink drain repair",
        "asset_name": "Kitchen sink",
        "asset_type": "Plumbing",
        "category": "Home Repair",
        "days_ago": 6,
        "status": "completed",
        "priority": "medium",
        "cost": 245.50,
        "service_provider": "Local Plumber Co.",
        "next_due_in_days": 365,
        "notes": "Replaced leaking P-trap and cleaned drain line.",
    },
    {
        "title": "Dishwasher inspection",
        "asset_name": "Kitchen dishwasher",
        "asset_type": "Appliance",
        "category": "Appliances",
        "days_ago": 10,
        "status": "completed",
        "priority": "medium",
        "cost": 95.00,
        "service_provider": "Appliance Pros",
        "next_due_in_days": 270,
        "notes": "Cleaned filter and checked drainage.",
    },
    {
        "title": "Tree trimming",
        "asset_name": "Front yard trees",
        "asset_type": "Landscaping",
        "category": "Landscaping",
        "days_ago": 12,
        "status": "completed",
        "priority": "low",
        "cost": 320.00,
        "service_provider": "Green Yard Crew",
        "next_due_in_days": 120,
        "notes": "Trimmed two mesquite trees near driveway.",
    },
    {
        "title": "Garage door sensor alignment",
        "asset_name": "Garage door",
        "asset_type": "Garage",
        "category": "Home Repair",
        "days_ago": 16,
        "status": "completed",
        "priority": "medium",
        "cost": 135.75,
        "service_provider": "Garage Door Experts",
        "next_due_in_days": 365,
        "notes": "Aligned safety sensors and lubricated track.",
    },
    {
        "title": "Washer hose replacement",
        "asset_name": "Laundry washer",
        "asset_type": "Appliance",
        "category": "Appliances",
        "days_ago": 22,
        "status": "completed",
        "priority": "high",
        "cost": 78.25,
        "service_provider": "Household DIY",
        "next_due_in_days": 730,
        "notes": "Replaced hot and cold supply hoses.",
    },
    {
        "title": "Roof flashing check",
        "asset_name": "Main roof",
        "asset_type": "Roofing",
        "category": "Home Repair",
        "days_ago": 28,
        "status": "scheduled",
        "priority": "medium",
        "cost": 0.00,
        "service_provider": "Valley Roofing",
        "next_due_in_days": 14,
        "notes": "Inspection scheduled before monsoon season.",
    },
]


async def seed_categories(database: AsyncIOMotorDatabase) -> dict[str, dict]:
    categories_collection = database["categories"]
    await categories_collection.delete_many({"seed_batch": SEED_BATCH})

    categories_by_name: dict[str, dict] = {}

    for category in DEMO_CATEGORIES:
        normalized_name = normalize_name(category["name"])
        existing_category = await categories_collection.find_one(
            {"normalized_name": normalized_name, "is_active": True}
        )

        if existing_category:
            categories_by_name[category["name"]] = existing_category
            continue

        created_at = now_utc()
        document = {
            "_id": ObjectId(),
            "name": category["name"],
            "normalized_name": normalized_name,
            "description": category["description"],
            "category_type": category["category_type"],
            "color": category["color"],
            "is_active": True,
            "created_at": created_at,
            "updated_at": created_at,
            "seed_batch": SEED_BATCH,
        }
        await categories_collection.insert_one(document)
        categories_by_name[category["name"]] = document

    return categories_by_name


async def seed_expenses(database: AsyncIOMotorDatabase, categories_by_name: dict[str, dict]) -> int:
    expenses_collection = database["expenses"]
    await expenses_collection.delete_many({"seed_batch": SEED_BATCH})

    documents = []
    for expense in DEMO_EXPENSES:
        category = categories_by_name[expense["category"]]
        created_at = now_utc()
        documents.append(
            {
                "title": expense["title"],
                "amount": expense["amount"],
                "category_id": category["_id"],
                "category_name": category["name"],
                "expense_date": days_ago(expense["days_ago"]),
                "paid_by": expense["paid_by"],
                "vendor": expense["vendor"],
                "payment_method": expense["payment_method"],
                "notes": expense["notes"],
                "created_at": created_at,
                "updated_at": created_at,
                "seed_batch": SEED_BATCH,
            }
        )

    result = await expenses_collection.insert_many(documents)
    return len(result.inserted_ids)


async def seed_maintenance_records(database: AsyncIOMotorDatabase, categories_by_name: dict[str, dict]) -> int:
    maintenance_collection = database["maintenance_records"]
    await maintenance_collection.delete_many({"seed_batch": SEED_BATCH})

    documents = []
    for record in DEMO_MAINTENANCE_RECORDS:
        category = categories_by_name[record["category"]]
        maintenance_date = days_ago(record["days_ago"])
        created_at = now_utc()
        documents.append(
            {
                "title": record["title"],
                "asset_name": record["asset_name"],
                "asset_type": record["asset_type"],
                "category_id": category["_id"],
                "category_name": category["name"],
                "maintenance_date": maintenance_date,
                "status": record["status"],
                "priority": record["priority"],
                "cost": record["cost"],
                "service_provider": record["service_provider"],
                "next_due_date": maintenance_date + timedelta(days=record["next_due_in_days"]),
                "notes": record["notes"],
                "created_at": created_at,
                "updated_at": created_at,
                "seed_batch": SEED_BATCH,
            }
        )

    result = await maintenance_collection.insert_many(documents)
    return len(result.inserted_ids)


async def main() -> None:
    client = AsyncIOMotorClient(
        settings.mongodb_uri,
        serverSelectionTimeoutMS=settings.mongodb_server_selection_timeout_ms,
    )

    try:
        await client.admin.command("ping")
        database = client[settings.mongodb_database]

        categories_by_name = await seed_categories(database)
        expense_count = await seed_expenses(database, categories_by_name)
        maintenance_count = await seed_maintenance_records(database, categories_by_name)

        print("Demo data seeded successfully.")
        print(f"Database: {settings.mongodb_database}")
        print(f"Categories available: {len(categories_by_name)}")
        print(f"Demo expenses inserted: {expense_count}")
        print(f"Demo maintenance records inserted: {maintenance_count}")
        print(f"Seed batch marker: {SEED_BATCH}")
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(main())