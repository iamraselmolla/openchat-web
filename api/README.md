# AI Chat API — Express rewrite

_Part of the [ai-chat-app](../README.md) monorepo — this doc covers the backend only._

Same behavior as the NestJS version, just plain Express + Prisma + Redis (no decorators, no DI container).

## How Nest concepts map to Express here

| NestJS | Express equivalent |
|---|---|
| `@Module` | a folder in `src/modules/*` with `*.routes.js` wiring things together |
| `@Controller` / `@Get()` etc. | `*.routes.js` (defines paths) + `*.controller.js` (handler functions) |
| `@Injectable()` service | plain module exporting functions (`*.service.js`) — no DI, just `require()` |
| `JwtAuthGuard` + Passport `JwtStrategy` | `src/middleware/auth.js` → `requireAuth` middleware, verifies the JWT and sets `req.user` |
| `class-validator` DTOs + `ValidationPipe` | `src/schemas/*.schema.js` (Zod schemas) + `src/middleware/validate.js` → `validateBody()` |
| `HttpExceptionFilter` | `src/middleware/errorHandler.js`, registered last in `app.js` |
| `LoggingInterceptor` | `src/middleware/requestLogger.js` |
| `ThrottlerModule` (global 60 req/min) | `express-rate-limit` in `app.js` |
| `ConfigService` | `src/config/index.js` (plain object read from `.env`) |
| `PrismaService` / `PrismaModule` (`@Global()`) | `src/lib/prisma.js` — one shared `PrismaClient` instance |
| `RedisService` / `RedisModule` | `src/lib/redis.js` — same `get/set/invalidate/checkRateLimit` helpers |
| `main.ts` bootstrap | `src/server.js` (starts the server) + `src/app.js` (builds the Express app) |

Routes, status codes, and response shapes are unchanged — same endpoints, same auth rules, same SSE streaming behavior on `/chats/:chatId/stream`.

**One fix:** the original `ChatsController` had `@UseGuards(JwtAuthGuard)` commented out, which meant `req.user` would've been `undefined` in every chats handler. I re-enabled auth on that router (`chats.routes.js`) so it actually works — that's likely one of the "issues" you were running into.

## Project structure

```
src/
  app.js                 # express app: cors, json, rate limit, routes, error handler
  server.js              # entry point — listens, graceful shutdown
  config/index.js        # env vars
  lib/
    prisma.js            # PrismaClient singleton
    redis.js             # ioredis client + helpers
    errors.js            # AppError + 4xx subclasses
  middleware/
    auth.js              # requireAuth (JWT verification)
    validate.js           # validateBody(zodSchema)
    errorHandler.js       # global error handler + 404
    requestLogger.js
  schemas/                # zod schemas (replace DTO classes)
  modules/
    auth/                 # register, login
    users/                # profile + settings
    chats/                # CRUD
    messages/              # list/edit/delete under a chat
    ai/                    # SSE streaming completion endpoint
prisma/
  schema.prisma           # unchanged
  seed.js                 # same seed data, converted from .ts
```

## Running it

```bash
npm install
npx prisma generate
npx prisma migrate dev   # or: npx prisma db push
npm run prisma:seed      # optional, seeds a demo user + chat
npm run dev              # nodemon src/server.js
```

Make sure Postgres and Redis are running and `.env` points at them (already carried over from your Nest project — same `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `OPENAI_API_KEY`, etc.).

The API listens on `http://localhost:4000/api/v1`, same as before.
