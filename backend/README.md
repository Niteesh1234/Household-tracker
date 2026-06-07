# Backend README

This backend is built with **Python FastAPI** and connects to **MongoDB**.

## Backend use case

The backend provides APIs for:

- household categories
- expenses
- maintenance records
- dashboard analytics
- health/readiness checks

## Backend folder structure

```text
backend/
├── app/
│   ├── main.py                       # FastAPI app entry point
│   ├── api/v1/                       # API endpoint files
│   ├── core/config.py                # Environment/config settings
│   ├── db/mongodb.py                 # MongoDB connection manager
│   ├── repositories/                 # Database queries
│   ├── schemas/                      # Request/response models
│   └── services/                     # Business rules
├── requirements.txt                  # Backend dependencies
└── .env.example                      # Example environment variables
```

## Step 1: Start MongoDB

From the project root:

```bash
docker compose up -d mongodb
```

Check MongoDB status:

```bash
docker compose ps mongodb
```

Expected status:

```text
healthy
```

## Step 2: Start backend

From the project root:

```bash
cd backend
.venv/bin/uvicorn app.main:app --reload
```

Backend runs at:

```text
http://127.0.0.1:8000
```

## Environment setup: dev, UAT, and prod

Environment files are used to run the same code with different settings.

In this backend, the main differences are usually:

- `APP_ENV` — tells the app which environment it is running in
- `MONGODB_DATABASE` — lets each environment use a separate MongoDB database
- `MONGODB_URI` — can point to local MongoDB, UAT MongoDB, or production MongoDB
- `BACKEND_CORS_ORIGINS` — controls which frontend URLs can call the backend

### 1. Create local environment files from examples

From the `backend` folder:

```bash
cp .env.dev.example .env.dev
cp .env.uat.example .env.uat
cp .env.prod.example .env.prod
```

The real `.env.dev`, `.env.uat`, and `.env.prod` files are ignored by git so secrets are not committed.

### 2. Start backend in development mode

```bash
APP_ENV=development .venv/bin/uvicorn app.main:app --reload
```

This loads:

```text
backend/.env.dev
```

### 3. Start backend in UAT mode

```bash
APP_ENV=uat .venv/bin/uvicorn app.main:app --reload
```

This loads:

```text
backend/.env.uat
```

### 4. Start backend in production mode

```bash
APP_ENV=production .venv/bin/uvicorn app.main:app
```

This loads:

```text
backend/.env.prod
```

### Alternative: choose the exact env file

You can also tell the backend exactly which file to load:

```bash
ENV_FILE=.env.uat .venv/bin/uvicorn app.main:app --reload
```

### Beginner mental model

Think of it like this:

```text
Same Python code
  + .env.dev  -> local development database/settings
  + .env.uat  -> testing/UAT database/settings
  + .env.prod -> real production database/settings
```

## Step 3: Open API docs

FastAPI automatically gives interactive API docs:

```text
http://127.0.0.1:8000/docs
```

This is very useful for learning because you can test APIs from the browser.

## Step 4: Check health

```bash
curl http://127.0.0.1:8000/api/v1/health
```

Checks if backend is alive.

```bash
curl http://127.0.0.1:8000/api/v1/health/ready
```

Checks if backend can connect to MongoDB.

## Current backend APIs

```text
GET  /api/v1/health
GET  /api/v1/health/ready

POST /api/v1/categories
GET  /api/v1/categories

POST /api/v1/expenses
GET  /api/v1/expenses

POST /api/v1/maintenance-records
GET  /api/v1/maintenance-records

GET  /api/v1/analytics/dashboard
GET  /api/v1/analytics/expense-spend-by-category
GET  /api/v1/analytics/maintenance-cost-by-asset-type
```

## Seed local demo data

To make the dashboard visually useful, you can insert demo data into local MongoDB:

```bash
cd backend
APP_ENV=development .venv/bin/python scripts/seed_demo_data.py
```

The seed script only replaces records marked with:

```text
seed_batch=local_dashboard_demo_v1
```

It does not delete manually created records.

## Stop MongoDB

```bash
docker compose down
```

## Delete MongoDB data and start fresh

Only use this if you want to delete local data:

```bash
docker compose down -v
```

## Frontend status

The React frontend MVP exists in:

```text
frontend/
```

The frontend includes dashboard, categories, expenses, and maintenance pages. It consumes:

```text
GET /api/v1/analytics/dashboard
GET/POST /api/v1/categories
GET/POST /api/v1/expenses
GET/POST /api/v1/maintenance-records
```

Next recommended improvements:

```text
Authentication/login
Edit/delete APIs and UI actions
Automated tests
Deployment pipeline
```

See `../frontend/README.md` for frontend setup and environment commands.