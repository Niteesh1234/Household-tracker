# API Endpoints

Base backend URL:

```text
http://127.0.0.1:8000
```

API prefix:

```text
/api/v1
```

Interactive API docs:

```text
http://127.0.0.1:8000/docs
```

## API files summary

```text
backend/app/api/v1/health.py       -> health APIs
backend/app/api/v1/categories.py   -> category APIs
backend/app/api/v1/expenses.py     -> expense APIs
backend/app/api/v1/maintenance.py  -> maintenance APIs
backend/app/api/v1/analytics.py    -> analytics APIs
backend/app/api/v1/router.py       -> connects all APIs
```

---

## Health API

File:

```text
backend/app/api/v1/health.py
```

### Check backend liveness

```http
GET /api/v1/health
```

Example:

```bash
curl http://127.0.0.1:8000/api/v1/health
```

### Check backend readiness

```http
GET /api/v1/health/ready
```

Example:

```bash
curl http://127.0.0.1:8000/api/v1/health/ready
```

---

## Categories API

File:

```text
backend/app/api/v1/categories.py
```

### Create category

```http
POST /api/v1/categories
```

Example:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/categories \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Groceries",
    "description": "Food and household grocery spending",
    "category_type": "expense",
    "color": "#16a34a"
  }'
```

### List categories

```http
GET /api/v1/categories
```

Example:

```bash
curl http://127.0.0.1:8000/api/v1/categories
```

---

## Expenses API

File:

```text
backend/app/api/v1/expenses.py
```

### Create expense

```http
POST /api/v1/expenses
```

Example:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/expenses \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Weekly grocery bill",
    "amount": 145.75,
    "category_id": "PUT_CATEGORY_ID_HERE",
    "expense_date": "2026-06-05",
    "paid_by": "Household",
    "vendor": "Costco",
    "payment_method": "credit_card",
    "notes": "Vegetables, rice, milk, snacks"
  }'
```

### List expenses

```http
GET /api/v1/expenses
```

Example:

```bash
curl http://127.0.0.1:8000/api/v1/expenses
```

---

## Maintenance Records API

File:

```text
backend/app/api/v1/maintenance.py
```

### Create maintenance record

```http
POST /api/v1/maintenance-records
```

Example:

```bash
curl -X POST http://127.0.0.1:8000/api/v1/maintenance-records \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Kitchen faucet repair",
    "asset_name": "Kitchen faucet",
    "asset_type": "plumbing",
    "category_id": "PUT_MAINTENANCE_CATEGORY_ID_HERE",
    "maintenance_date": "2026-06-05",
    "status": "completed",
    "priority": "medium",
    "cost": 185.0,
    "service_provider": "Local plumber",
    "next_due_date": "2027-06-05",
    "notes": "Fixed leak and replaced washer"
  }'
```

### List maintenance records

```http
GET /api/v1/maintenance-records
```

Example:

```bash
curl http://127.0.0.1:8000/api/v1/maintenance-records
```

---

## Analytics API

File:

```text
backend/app/api/v1/analytics.py
```

### Dashboard analytics

```http
GET /api/v1/analytics/dashboard
```

Example:

```bash
curl http://127.0.0.1:8000/api/v1/analytics/dashboard
```

Returns:

```text
Total expenses
Expense count
Total maintenance cost
Maintenance count
Spend by category
Maintenance cost by asset type
Recent expenses
Recent maintenance records
```

### Expense spend by category

```http
GET /api/v1/analytics/expense-spend-by-category
```

Example:

```bash
curl http://127.0.0.1:8000/api/v1/analytics/expense-spend-by-category
```

### Maintenance cost by asset type

```http
GET /api/v1/analytics/maintenance-cost-by-asset-type
```

Example:

```bash
curl http://127.0.0.1:8000/api/v1/analytics/maintenance-cost-by-asset-type
```

---

## Recommended beginner testing order

Use this order when testing manually:

```text
1. GET  /api/v1/health/ready
2. POST /api/v1/categories
3. GET  /api/v1/categories
4. POST /api/v1/expenses
5. GET  /api/v1/expenses
6. POST /api/v1/maintenance-records
7. GET  /api/v1/maintenance-records
8. GET  /api/v1/analytics/dashboard
```