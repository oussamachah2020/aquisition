# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Node.js (ESM, "type": "module") Express API with path aliases via package.json "imports" (e.g., import logger from '#config/logger.js').
- Persistence: Postgres via Neon (Local for dev, Cloud for prod) using drizzle-orm with @neondatabase/serverless (neon-http driver).
- HTTP: Express app mounts middleware (helmet, cors, cookie-parser, morgan->winston) and routes under /api; health check at /health.
- Security: Arcjet shield/bot-detection + rate-limiting in middleware, limits vary by req.user.role.

Common commands
- Install deps: npm install
- Dev server (file watch): npm run dev
- Start server: npm start
- Lint: npm run lint
- Lint (auto-fix): npm run lint:fix
- Format: npm run format
- Format check: npm run format:check
- Drizzle schema generation: npm run db:generate
- Apply migrations: npm run db:migrate
- Drizzle Studio: npm run db:studio
- Docker (dev, app + Neon Local): docker compose -f docker-compose.dev.yml up --build
- Docker (stop dev): docker compose -f docker-compose.dev.yml down
- Docker (prod): docker compose -f docker-compose.prod.yml up --build -d
- Convenience scripts: npm run dev:docker, npm run prod:docker
- Tests: no test framework or scripts are configured in package.json

Environment and configuration
- Primary env files: .env (generic), .env.development (dev), .env.production (prod).
- Important variables: PORT, NODE_ENV, LOG_LEVEL, DATABASE_URL, JWT_SECRET, ARCJET_KEY.
- Dev DB: DATABASE_URL points at neon-local:5432 with sslmode=require; database.js switches Neon client to http://neon-local:5432/sql in development.

Architecture and module layout
- Entry points: src/index.js loads dotenv then src/server.js; src/server.js starts Express on PORT (default 3000). src/app.js wires middleware and routes.
- Routing: src/routes/
  - auth.routes.js → POST /api/auth/sign-up, /sign-in, /sign-out
  - users.routes.js → GET /api/users/, /:id (stubs for put/delete)
- Controllers: src/controllers/
  - auth.controller.js → Zod validation, delegates to auth.service, signs JWT, manages httpOnly cookie via utils/cookies.
  - users.controller.js → fetchAllUsers through users.services.
- Services: src/services/
  - auth.service.js → bcrypt hashing/compare; queries with drizzle; returns safe user shape.
  - users.services.js → selects public fields from users table.
- Data model: src/models/user.model.js defines users table (id, name, email, password, role, timestamps) using drizzle pg-core.
- Config: src/config/
  - database.js → constructs neon sql client and drizzle db, tweaks neonConfig in dev.
  - logger.js → winston logger (console in non-prod, files under logs/).
  - arcject.js → Arcjet client with shield + detectBot rules.
- Middleware: src/middleware/security.middleware.js applies Arcjet decisioning and slidingWindow rate limits per role (admin/user/guest) and logs outcomes.
- Utilities: src/utils/
  - jwt.js → sign/verify with JWT_SECRET, 1d expiry.
  - cookies.js → httpOnly cookie helpers (secure in production, strict sameSite).
  - format.js → Zod error formatting.
- Validation: src/validations/auth.validation.js with Zod schemas for sign-up/sign-in.

Docker and database flow (from README)
- Development: docker-compose.dev.yml runs Neon Local proxy + app (hot reload). Use .env.development. On startup, dev.sh waits for DB and runs db:migrate against localhost:5432.
- Production: docker-compose.prod.yml runs only the app; it connects to Neon Cloud via DATABASE_URL from .env.production. prod.sh builds, starts, and runs db:migrate.

Conventions and tooling
- ESM with package.json "imports" aliases:
  Example: import { createUser } from '#services/auth.service.js'
- Linting/formatting: ESLint (no custom config committed) and Prettier (.prettierrc present).

Notes for future agents
- No test runner is configured; add tests and scripts in package.json before attempting test commands.
- Drizzle Kit is present but no drizzle config file is committed; db:* scripts assume a standard drizzle-kit setup resolvable by defaults/environment.
