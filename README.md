# Neon Local + Neon Cloud Docker Setup

This repository is configured to use Neon Local for development and Neon Cloud for production.

- Development: docker-compose.dev.yml runs both the app and Neon Local, creating an ephemeral branch on startup and deleting it on shutdown.
- Production: docker-compose.prod.yml runs only the app; it connects to your Neon Cloud DATABASE_URL.

Prerequisites
- Docker and Docker Compose v2
- A Neon account, API key, Project ID, and parent branch ID (for ephemeral branches)

Files
- Dockerfile: Multi-stage Node.js image with dev and prod targets.
- docker-compose.dev.yml: App + Neon Local proxy.
- docker-compose.prod.yml: App only, connects to Neon Cloud.
- .env.development: Local env (Neon Local creds/URL, dev command, optional TLS flag).
- .env.production: Production env (Neon Cloud DATABASE_URL and secrets).

Development (Neon Local)
1) Fill .env.development
   - NEON_API_KEY: Your Neon API key
   - NEON_PROJECT_ID: Your Neon Project ID
   - PARENT_BRANCH_ID: The parent branch ID to fork from (for ephemeral branches)
   - DATABASE_URL: postgres://neon:npg@neon-local:5432/<db>?sslmode=require
   - Optional (JS apps): NODE_TLS_REJECT_UNAUTHORIZED=0 for self-signed certs in dev
2) Start: docker compose -f docker-compose.dev.yml up --build
3) Connect at DATABASE_URL (service host is neon-local inside the compose network)
4) Stop: docker compose -f docker-compose.dev.yml down (ephemeral branch is deleted)

Notes
- Neon Local default Postgres credentials: user neon, password npg
- Uses SSL by default; keep ?sslmode=require in your URL
- For JS (pg/postgres) you may need to trust the Neon Local cert. Prefer trusting the CA; NODE_TLS_REJECT_UNAUTHORIZED=0 is dev-only.

Production (Neon Cloud)
1) Fill .env.production
   - DATABASE_URL from Neon Console (includes sslmode=require)
   - JWT_SECRET and any other required secrets
2) Start: docker compose -f docker-compose.prod.yml up --build -d
3) No Neon Local is used in production; the app connects directly to Neon Cloud.

Switching environments
- Dev: docker compose -f docker-compose.dev.yml ...
- Prod: docker compose -f docker-compose.prod.yml ...

Customizing the app image
- Dockerfile defaults to Node.js.
- Dev target uses DEV_COMMAND (e.g., npm run dev) for hot reload.
- If your app is not Node.js, adapt the Dockerfile base image and commands accordingly.