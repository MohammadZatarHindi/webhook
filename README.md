# Webhook Pipeline Service

A **Pipeline Service** built with **TypeScript**, **Express**, and **PostgreSQL**, with input validation via **Zod**.  
This project allows creating and managing pipelines with predefined actions, and receiving webhooks.

---

## Features

- Create and list pipelines (`name` + `action_type`)  
- Predefined pipeline **actions**:
  - `log` → Logs data to console  
  - `uppercase` → Converts strings to uppercase  
  - `reverse` → Reverses strings  
- Receive and store **webhooks**:
  - JSONB payload storage
  - `status` tracking (`pending`, `processed`, `failed`)
  - Optional extras: payload validation, security/authentication, indexing, cleanup
- Strong **TypeScript typing** using interfaces (`Pipeline`, `ActionType`)  
- **Input validation** using Zod  
- Database integration with PostgreSQL (`pipelines` + `webhooks` tables)  

---

## Folder Structure

```text
src/
├── config/
│   └── db.ts          # PostgreSQL connection
├── db/
│   └── schema.sql     # Pipelines & Webhooks tables
├── modules/
│   ├── pipelines/
│   │   ├── pipelines.controller.ts
│   │   ├── pipelines.routes.ts
│   │   ├── pipelines.service.ts
│   │   ├── pipelines.types.ts
│   │   └── pipelines.schema.ts
│   └── webhooks/
│       ├── webhooks.controller.ts
│       ├── webhooks.routes.ts
│       ├── webhooks.service.ts
│       ├── webhooks.types.ts
│       └── webhooks.schema.ts
├── index.ts           # Entry point
package.json
tsconfig.json
```
---

## Environment Variables

Create a .env file in the root folde

```text
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/webhook_db
```

--- 

## Setup Instructions

1. Clone the repo

```text
git clone https://https://github.com/MohammadZatarHindi/webhook
cd webhook-pipeline
```

2. Install dependencies

```text
npm install
```

3. Create .env file based on `.env.example`

4. Setup PostgreSQL database

```text
psql -d webhook_db -f src/db/schema.sql
```

5. Run the server

npm run dev

API will be available at http://localhost:3000

--- 

## POST Body Example:

```text
{
	"name": "Test Pipeline",
	"action": "log"
}
```

---

## Database Table

Pipelines

```SQL
CREATE TABLE pipelines (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	action_type TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Webhooks

```SQL
CREATE TABLE webhooks (
  id SERIAL PRIMARY KEY,
  source_name TEXT NOT NULL,
  payload JSONB NOT NULL,
  received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status TEXT DEFAULT 'pending'
);
```

