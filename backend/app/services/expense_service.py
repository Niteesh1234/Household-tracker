from datetime import datetime, time, timezone

from fastapi import HTTPException, status

from app.repositories.category_repository import CategoryRepository
from app.repositories.expense_repository import ExpenseRepository
from app.schemas.expense import ExpenseCreate, ExpenseResponse


class ExpenseService:
    """Business logic for household expenses."""

    def __init__(self, expense_repository: ExpenseRepository, category_repository: CategoryRepository):
        self.expense_repository = expense_repository
        self.category_repository = category_repository

    async def create_expense(self, expense: ExpenseCreate) -> ExpenseResponse:
        """Create an expense after validating the selected category exists."""
        category = await self.category_repository.find_by_id(expense.category_id)

        if category is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found. Create the category before adding expenses.",
            )

        expense_date = datetime.combine(expense.expense_date, time.min, tzinfo=timezone.utc)
        document = await self.expense_repository.create(
            {
                "title": expense.title.strip(),
                "amount": expense.amount,
                "category_id": category["_id"],
                "category_name": category["name"],
                "expense_date": expense_date,
                "paid_by": expense.paid_by.strip(),
                "vendor": expense.vendor,
                "payment_method": expense.payment_method,
                "notes": expense.notes,
            }
        )

        return ExpenseResponse.from_mongo(document)

    async def list_expenses(self) -> list[ExpenseResponse]:
        """List recent household expenses."""
        documents = await self.expense_repository.list_recent()
        return [ExpenseResponse.from_mongo(document) for document in documents]