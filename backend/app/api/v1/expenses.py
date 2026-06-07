from fastapi import APIRouter

from app.db.mongodb import mongodb
from app.repositories.category_repository import CategoryRepository
from app.repositories.expense_repository import ExpenseRepository
from app.schemas.expense import ExpenseCreate, ExpenseResponse
from app.services.expense_service import ExpenseService


router = APIRouter()


def get_expense_service() -> ExpenseService:
    """Build the expense service with repository dependencies."""
    database = mongodb.get_database()
    expense_repository = ExpenseRepository(database)
    category_repository = CategoryRepository(database)
    return ExpenseService(expense_repository, category_repository)


@router.post("", response_model=ExpenseResponse, status_code=201)
async def create_expense(expense: ExpenseCreate) -> ExpenseResponse:
    """Create a household expense."""
    service = get_expense_service()
    return await service.create_expense(expense)


@router.get("", response_model=list[ExpenseResponse])
async def list_expenses() -> list[ExpenseResponse]:
    """List recent household expenses."""
    service = get_expense_service()
    return await service.list_expenses()