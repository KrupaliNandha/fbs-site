# FBS Backend

Standalone auth/API service for FBS Prints. Owns MySQL access so the frontend can stay separate and the database can be hosted independently later.

## Setup

1. Copy `.env.example` to `.env` and fill in MySQL credentials.
2. Apply the schema:

```bash
mysql -u USER -p DATABASE < database/auth-schema.sql
```

3. Install and run:

```bash
npm install
npm run dev
```

API defaults to `http://localhost:4000`.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| POST | `/api/auth/login` | Login + set session cookie |
| POST | `/api/auth/logout` | Clear session cookie |
| GET | `/api/auth/me` | Current user |
| GET/POST | `/api/users` | List / create users |
| PATCH/DELETE | `/api/users/:id` | Update / delete user |
| GET | `/api/roles` | List roles + permissions |
| PATCH | `/api/roles/:role/permissions` | Update role permissions |

## Environment

See `.env.example`. `CORS_ORIGINS` must include the frontend origin(s) when the browser talks to this API directly.
