# Fastify Application Template

POC / starter template for building production Fastify APIs. Not production-ready as-is — use it as a structural baseline and harden per project.

## Stack

- Node.js 20+
- Fastify 5
- TypeScript (strict, NodeNext)
- MongoDB (native driver)
- Zod env validation
- JWT auth (`@fastify/jwt`)
- Vitest + ESLint

## Quick start

```bash
cp .env.example .env
docker compose up -d
npm install
npm run dev
```

Health check: `GET http://localhost:3000/health`

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Watch mode (`tsx`) |
| `npm run build` | Compile to `dist/` |
| `npm start` | Run compiled server |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Vitest |
| `npm run test:unit` | Unit tests only |

## Environment

See [`.env.example`](.env.example). Required:

- `MONGODB_URI`
- `JWT_SECRET` (min 32 chars)

Optional:

- `MONGODB_DB_NAME`, `CORS_ORIGIN`, rate-limit and log overrides
- `REDIS_URI` — enables Redis plugin (`fastify.redis`)
- `POSTGRES_URI` — enables `getPgPool()` in `infrastructure/database/postgres.ts`
- Storage vars — scaffolds in `infrastructure/storage` (`local` works; S3/Azure need SDKs)

## Layout

```
src/
  config/          # env + logger
  plugins/         # MongoDB, JWT, optional Redis
  hooks/           # auth, errors, rate-limit, request logger
  modules/         # auth, user, orders (route → controller → service → repository)
  infrastructure/
    database/      # mongo helpers, indexes, optional postgres pool
    cache/         # Redis cache helpers
    storage/       # local + S3/Azure scaffolds
  errors/          # AppError hierarchy
```

## Optional infra

```bash
# Mongo only (default)
npm run docker:up

# Also Redis + Postgres
npm run docker:extras
```

Then set `REDIS_URI` / `POSTGRES_URI` in `.env`. Storage: import from `src/infrastructure/storage` when a feature needs files. S3/Azure functions are stubs until you add AWS/Azure SDKs.

## Adding a module

1. Create `src/modules/<name>/` with schema, repository, service, controller, route, `index.ts`
2. Register the route plugin in `src/app.ts` under `/api`
3. Add indexes in `src/infrastructure/database/indexes.ts` when you introduce new query patterns

## Demo API surface

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET|PATCH /api/users/me` (auth)
- `POST|GET /api/orders` (auth)
- `GET /api/orders/:id` (auth)

## Scope note

Core path is Mongo + JWT. Redis, Postgres, and object storage are kept as optional scaffolds — enable them when a project needs them; do not treat the stubs as production-complete.
