# Aria — AI Chat App

A production-oriented AI chat application: a Next.js 15 frontend and a NestJS
API, with Postgres for storage, Redis for caching/rate limiting, and
token-by-token streaming from the OpenAI API over Server-Sent Events.

This is a real, from-scratch codebase, not a wrapper around a template. It is
sized to be a strong starting point for a genuine product, not a finished,
audited SaaS — see **What's intentionally left out** below before shipping it.

---

## 1. Architecture

```
ai-chat-app/
├── apps/
│   ├── web/                     Next.js 15 (App Router) frontend
│   │   ├── app/
│   │   │   ├── (marketing)/     Landing page: hero, features, pricing, FAQ
│   │   │   ├── chat/            Chat shell, sidebar, [chatId] conversation view
│   │   │   ├── settings/        Appearance, AI parameters, shortcuts
│   │   │   ├── profile/         Account details
│   │   │   ├── login/           Email/password sign in + sign up
│   │   │   └── not-found.tsx    404
│   │   ├── components/
│   │   │   ├── ui/              shadcn-style primitives (button, dialog, ...)
│   │   │   └── chat/            Chat-specific components (message, composer, ...)
│   │   ├── hooks/                useStreamingChat, useAutoResizeTextarea
│   │   ├── store/                Zustand stores (chat state, UI state)
│   │   ├── lib/                  API client, TanStack Query provider, utils
│   │   └── types/
│   │
│   └── api/                     NestJS backend
│       ├── prisma/               schema.prisma, seed.ts
│       └── src/
│           ├── auth/              Register/login, JWT strategy & guard
│           ├── users/             Profile + AI settings
│           ├── chats/             CRUD, pin, rename, search (Redis-cached list)
│           ├── messages/          List, edit-and-truncate (branching), delete
│           ├── ai/                OpenAI SDK wrapper + SSE streaming endpoint
│           ├── redis/             Cache + fixed-window rate limiter
│           ├── prisma/            Prisma service/module
│           └── common/            Exception filter, logging interceptor
│
├── docker-compose.yml            Postgres + Redis + API
└── .env.example                  All environment variables, annotated
```

**Data flow for a message:** the browser POSTs to
`/api/v1/chats/:id/stream`. The API persists the user's message, opens an SSE
response, streams tokens from OpenAI as they're generated, and persists the
complete assistant message once the stream ends. The frontend reads the
stream with the Fetch API (not `EventSource`, since it needs a custom
`Authorization` header and a POST body) and appends tokens into a Zustand
store as they arrive.

**Why Redis:** the chat list is cached per user (invalidated on
create/update/delete) and AI requests are rate-limited per user
(20 requests / 60s by default) using a simple fixed-window counter.

---

## 2. Getting started

### Prerequisites
- Node.js 20+
- Docker (for Postgres + Redis), or your own instances of each
- An OpenAI API key

### Setup

```bash
git clone <this-repo>
cd ai-chat-app
npm install --workspaces

# Copy env files and fill in real values
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
# edit apps/api/.env: set OPENAI_API_KEY and a real JWT_SECRET

# Start Postgres + Redis
docker compose up -d postgres redis

# Set up the database
npm run db:migrate --workspace=apps/api
npm run db:seed --workspace=apps/api      # optional demo user + chat

# Run both apps (two terminals)
npm run dev:api      # http://localhost:4000/api/v1
npm run dev:web       # http://localhost:3000
```

Visit `http://localhost:3000`, sign up on `/login`, and start a chat.

### Seeded demo account
If you ran `db:seed`: `demo@example.com` / `demo1234`.

---

## 3. Environment variables

See `.env.example` at the repo root (mirrored into each app). Key ones:

| Variable | App | Purpose |
|---|---|---|
| `DATABASE_URL` | api | Postgres connection string |
| `REDIS_URL` | api | Redis connection string |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | api | Auth token signing |
| `OPENAI_API_KEY` | api | Required for the AI to respond |
| `OPENAI_DEFAULT_MODEL` | api | Fallback model if a chat doesn't specify one |
| `CORS_ORIGIN` | api | Should match the deployed frontend origin |
| `NEXT_PUBLIC_API_URL` | web | Where the frontend sends requests |

---

## 4. Database schema

`User` → `UserSettings` (1:1, theme/model/temperature/system prompt) and
`User` → `Chat` → `Message` (1:many each). See
`apps/api/prisma/schema.prisma` for the full definition, including indexes on
`(userId, pinned)` and `(chatId, createdAt)` for the two hottest queries
(sidebar list, message history).

---

## 5. Deployment guide

**Frontend (Vercel is the path of least resistance for Next.js):**
1. Import `apps/web` as the project root.
2. Set `NEXT_PUBLIC_API_URL` to your deployed API's URL.
3. Deploy.

**Backend + database (Railway, Render, Fly.io, or your own infra):**
1. Provision managed Postgres and Redis.
2. Deploy `apps/api` using the included `Dockerfile`, or run
   `npm run build && npm run start:prod` on a Node 20 host.
3. Run `npx prisma migrate deploy` against the production database once.
4. Set every variable in `apps/api/.env.example` on the host.
5. Set `CORS_ORIGIN` to your frontend's real origin — the API rejects
   cross-origin requests from anywhere else.

**Docker Compose (all-in-one, single host):**
```bash
docker compose up -d --build
```
This runs Postgres, Redis, and the API together. Deploy `apps/web` separately
(Compose is not a substitute for Next.js's own build/CDN pipeline).

---

## 6. Production recommendations

- **Migrations:** never run `prisma migrate dev` against production — use
  `prisma migrate deploy` from a release step.
- **Secrets:** `JWT_SECRET` and `OPENAI_API_KEY` must be real secrets in your
  host's secret manager, not committed `.env` files.
- **Rate limiting:** the current limiter is a single-process-friendly fixed
  window in Redis. It's already shared correctly across API instances since
  it lives in Redis, but consider a sliding-window or token-bucket algorithm
  before this is public-facing at scale.
- **Observability:** `LoggingInterceptor` and `HttpExceptionFilter` are
  starting points — wire them to a real log sink (e.g., Datadog, Axiom) in
  production, and add request IDs.
- **Streaming at scale:** SSE via a raw `Response` works well behind most
  reverse proxies, but confirm your platform doesn't buffer responses
  (`X-Accel-Buffering: no` is already set for nginx-style proxies).
- **File uploads:** the composer's attachment button is UI-only, matching the
  brief. Wiring it up needs an object storage bucket (S3/R2) plus a
  size/MIME allowlist on the API before going further.

---

## 7. What's intentionally left out

To keep this a coherent, readable codebase rather than a wall of
half-finished boilerplate, the following were scoped out — each is a natural
next step:

- **Command menu / context menu** UI components (Radix primitives for both
  are trivial to add following the same pattern as `dropdown-menu.tsx`).
- **Refresh tokens** — the current auth issues a single long-lived JWT.
  Fine for a demo, not for production; add a refresh-token rotation flow.
- **Automated tests.** The architecture (services separated from
  controllers, pure Zustand stores, pure hooks) is deliberately test-friendly
  — Jest for the API and Vitest + React Testing Library for the frontend are
  natural fits.
- **Multi-provider AI support.** `AiService` is already isolated behind an
  async generator specifically so a second provider (Anthropic, etc.) can be
  added without touching the controller or the frontend.

---

## 8. Code quality notes

- **Feature-based structure** on both sides: each domain (auth, chats,
  messages, ai) is a self-contained NestJS module; each frontend feature
  area has its own component/hook grouping.
- **Single responsibility:** controllers only orchestrate; all business
  logic and Prisma access lives in services.
- **Types shared by convention:** `apps/web/types` mirrors the Prisma models
  by hand (no generated client shared across the HTTP boundary), which is a
  deliberate, simple choice for a two-app repo — consider tRPC or a shared
  package if this grows into more services.
