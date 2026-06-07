# Testing APIs with Postman

Postman is a tool used by developers and QA engineers to manually test APIs.

In enterprise projects, APIs are usually checked with:

```text
1. Swagger/OpenAPI docs
2. Postman collections
3. Automated tests
4. CI/CD pipeline checks
```

For now, Postman is a good next learning step because you can visually send API requests and inspect responses.

## Files created

```text
postman/household-tracker-api.postman_collection.json
postman/local.postman_environment.json
```

## What each file does

### `postman/household-tracker-api.postman_collection.json`

This is the Postman collection.

It contains requests for:

```text
Health APIs
Categories APIs
Expenses APIs
Maintenance APIs
Analytics APIs
```

### `postman/local.postman_environment.json`

This is the local Postman environment.

It stores variables like:

```text
baseUrl = http://localhost:8000
categoryId = created automatically by Postman
maintenanceCategoryId = created automatically by Postman
```

## Step 1: Make sure backend is running

MongoDB should be running:

```bash
docker compose ps mongodb
```

Backend should be running:

```bash
cd backend
.venv/bin/uvicorn app.main:app --reload
```

Backend URL:

```text
http://localhost:8000
```

## Step 2: Import files into Postman

Open Postman.

Import the collection:

```text
postman/household-tracker-api.postman_collection.json
```

Import the environment:

```text
postman/local.postman_environment.json
```

Select environment:

```text
Household Tracker Local
```

## Step 3: Run requests in this order

Run these folders/requests in order:

```text
01 Health
02 Categories
03 Expenses
04 Maintenance Records
05 Analytics
```

Why this order?

```text
Health confirms backend/database works.
Categories must exist before expenses/maintenance records.
Expenses and maintenance create data.
Analytics reads and summarizes that data.
```

## Important variables

The collection automatically saves IDs:

```text
categoryId
maintenanceCategoryId
```

These IDs are then reused when creating expenses and maintenance records.

## How to know API is working

Successful responses usually show:

```text
200 OK      -> read/list successful
201 Created -> create successful
```

Example failed response:

```text
404 Not Found -> resource does not exist
409 Conflict  -> duplicate category
```

## Enterprise meaning

Postman collection helps teams:

```text
Test APIs manually
Share API examples
Debug request/response data
Onboard new developers
Document API behavior
```

Later, we will also add automated backend tests so APIs can be checked automatically in CI/CD.