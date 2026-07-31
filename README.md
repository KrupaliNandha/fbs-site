# FBS Prints

Monorepo split so the UI and API/database can be developed and hosted independently.

```
fbs-site/
├── frontend/   # Next.js website + dashboards (no MySQL)
├── backend/    # Express auth API + MySQL schema
└── package.json
```

## Why this layout

- **Frontend** only serves pages and calls the API.
- **Backend** owns auth, users/roles, and the MySQL connection.
- If you later host the DB (or the whole API) on a different server, only `backend/` needs that deploy.

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env   # fill AUTH_DB_* and AUTH_SESSION_SECRET
# apply schema once:
# mysql -u USER -p DATABASE < database/auth-schema.sql
npm install
npm run dev            # http://localhost:4000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env   # AUTH_API_URL=http://localhost:4000
npm install
npm run dev            # http://localhost:3000
```

From the repo root you can also run:

```bash
npm run install:all
npm run dev:backend    # terminal 1
npm run dev:frontend   # terminal 2
```

## How they connect

| Layer | Role |
|--------|------|
| Browser → `/api/*` on port 3000 | Next.js **rewrites** to the backend (`AUTH_API_URL`) so the session cookie stays on the site origin |
| Server components (dashboards) | Call `AUTH_API_URL/api/auth/me` with the session cookie |
| Backend | Talks to MySQL via `AUTH_DB_*` env vars |

Later, for separate hosting:

1. Deploy `backend/` next to (or near) MySQL.
2. Point frontend `AUTH_API_URL` (and optionally `NEXT_PUBLIC_API_URL` + CORS) at that API host.
3. Adjust cookie `domain` / HTTPS as needed for cross-subdomain auth.

## Environment

- **Backend**: see `backend/.env.example` (`AUTH_DB_*`, `AUTH_SESSION_SECRET`, `CORS_ORIGINS`, `PORT`)
- **Frontend**: see `frontend/.env.example` (`AUTH_API_URL`, optional `NEXT_PUBLIC_API_URL`)
