# Frontend README

This frontend is built with **React**, **TypeScript**, and **Vite**.

## What it does now

The frontend MVP includes these screens:

- Dashboard
- Categories
- Expenses
- Maintenance Records

The dashboard calls:

```text
GET /api/v1/analytics/dashboard
```

The resource pages call:

```text
GET  /api/v1/categories
POST /api/v1/categories

GET  /api/v1/expenses
POST /api/v1/expenses

GET  /api/v1/maintenance-records
POST /api/v1/maintenance-records
```

The app can now:

- total expense amount and count
- total maintenance cost and count
- spend by category
- maintenance cost by asset type
- recent expenses
- recent maintenance records
- create/list categories
- create/list expenses
- create/list maintenance records

## Environment setup: dev, UAT, and prod

Yes, the frontend also has separate environment configuration.

The same React code can run against different backend URLs:

```text
React frontend
  + .env.development -> local/dev backend
  + .env.uat         -> UAT backend
  + .env.production  -> production backend
```

Create real environment files from the examples:

```bash
cd frontend
cp .env.development.example .env.development
cp .env.uat.example .env.uat
cp .env.production.example .env.production
```

The real `.env.*` files are ignored by git so environment-specific URLs and secrets are not committed.

## Important variables

```text
VITE_APP_ENV=development
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_API_V1_PREFIX=/api/v1
```

For local development, `VITE_API_BASE_URL` should point to the FastAPI backend.

## Install dependencies

```bash
cd frontend
npm install
```

## Run locally

Start the backend first:

```bash
docker compose up -d mongodb
cd backend
APP_ENV=development .venv/bin/uvicorn app.main:app --reload
```

Then start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Frontend URL:

```text
http://127.0.0.1:5173
```

## Run with UAT settings

```bash
cd frontend
npm run dev:uat
```

## Build

Production build:

```bash
npm run build
```

UAT build:

```bash
npm run build:uat
```

Development build:

```bash
npm run build:dev
```

## Environment mental model

You do **not** build three different applications.

You build **one application** and run/deploy it with different config:

| Environment | Frontend points to | Backend uses |
| --- | --- | --- |
| dev | local backend URL | dev MongoDB database |
| UAT | UAT backend URL | UAT MongoDB database |
| prod | production backend URL | production MongoDB database |

The backend CORS setting must allow the matching frontend URL for each environment.