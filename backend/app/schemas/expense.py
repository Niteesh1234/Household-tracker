from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field


PaymentMethod = Literal["cash", "credit_card", "debit_card", "bank_transfer", "other"]


class ExpenseCreate(BaseModel):
    """Request body used when creating a new household expense."""

    title: str = Field(min_length=2, max_length=120)
    amount: float = Field(gt=0)
    category_id: str = Field(min_length=24, max_length=24)
    expense_date: date
    paid_by: str = Field(default="Household", min_length=2, max_length=80)
    vendor: str | None = Field(default=None, max_length=120)
    payment_method: PaymentMethod = "other"
    notes: str | None = Field(default=None, max_length=500)


class ExpenseResponse(BaseModel):
    """Response returned to API clients for expense records."""

    id: str
    title: str
    amount: float
    category_id: str
    category_name: str
    expense_date: date
    paid_by: str
    vendor: str | None = None
    payment_method: PaymentMethod
    notes: str | None = None
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_mongo(cls, document: dict) -> "ExpenseResponse":
        """Convert a MongoDB document into an API response schema."""
        expense_date = document["expense_date"]

        if isinstance(expense_date, datetime):
            expense_date = expense_date.date()

        return cls(
            id=str(document["_id"]),
            title=document["title"],
            amount=document["amount"],
            category_id=str(document["category_id"]),
            category_name=document["category_name"],
            expense_date=expense_date,
            paid_by=document["paid_by"],
            vendor=document.get("vendor"),
            payment_method=document["payment_method"],
            notes=document.get("notes"),
            created_at=document["created_at"],
            updated_at=document["updated_at"],
        )