# Household Maintenance Tracker

This project is a learning-focused, enterprise-style application for tracking household expenses, maintenance records, and dashboard analytics.

## Current status

We have completed the first backend MVP.

```text
Backend: Python FastAPI ✅
Database: MongoDB ✅
Local database setup: Docker Compose ✅
Frontend: React MVP ✅
```

## What the app can do right now

The backend can:

- Check backend/database health
- Create and list categories
- Create and list expenses
- Create and list maintenance records
- Return dashboard analytics

The frontend can:

- Show dashboard analytics
- Create and list categories
- Create and list expenses
- Create and list maintenance records

## Project structure

```text
.
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/v1/            # API route files
│   │   ├── core/              # Config and core app setup
│   │   ├── db/                # MongoDB connection
│   │   ├── repositories/      # Database access layer
│   │   ├── schemas/           # Request/response validation
│   │   └── services/          # Business logic layer
│   ├── requirements.txt       # Python dependencies
│   └── .env.example           # Example backend environment variables
├── frontend/                  # React frontend
│   ├── src/                    # Frontend source code
│   ├── package.json            # Frontend dependencies and scripts
│   └── .env.*.example          # Example frontend environment variables
├── docs/                      # Learning documentation
├── docker-compose.yml         # Local MongoDB setup
└── README.md                  # Project overview
```

## Backend architecture pattern

For each feature, we are using this enterprise-style flow:

```text
API Route
   ↓
Service Layer
   ↓
Repository Layer
   ↓
MongoDB
```

Example for expenses:

```text
backend/app/api/v1/expenses.py
   ↓
backend/app/services/expense_service.py
   ↓
backend/app/repositories/expense_repository.py
   ↓
MongoDB
```

## How to run the backend

Start MongoDB:

```bash
docker compose up -d mongodb
```

Start FastAPI backend:

```bash
cd backend
.venv/bin/uvicorn app.main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Interactive FastAPI docs:

```text
http://127.0.0.1:8000/docs
```

## Important docs

- `backend/README.md` — how to run and test the backend
- `docs/execution-plan.md` — beginner application-building plan
- `docs/api-endpoints.md` — API list with file paths and examples

## Frontend status

The React frontend MVP is built with pages for dashboard, categories, expenses, and maintenance records.

The frontend calls:

```text
GET /api/v1/analytics/dashboard
GET/POST /api/v1/categories
GET/POST /api/v1/expenses
GET/POST /api/v1/maintenance-records
```

and shows dashboard cards/charts plus create/list forms for the core resources.

See `frontend/README.md` for frontend setup, environment files, and run commands.

## Demo data

To populate local MongoDB with fake data for the dashboard:

```bash
cd backend
APP_ENV=development .venv/bin/python scripts/seed_demo_data.py
```

Then refresh the frontend dashboard.