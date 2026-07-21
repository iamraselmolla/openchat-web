# AI Chat App

A small AI chat app: sign up, start conversations, get streamed replies, manage your chat history. Backend is plain Express (converted from NestJS); frontend is Next.js.

```
ai-chat-app/
  api/     Express + Prisma + Redis backend  → see api/README.md
  web/     Next.js frontend                  → see web/README.md
```

## What's here

- **Auth-gated chat.** You can't see or use the chat UI without being logged in — signed out users are redirected to `/login`, and every API route under `/chats`, `/users`, and the streaming endpoint requires a valid JWT.
- **Full chat CRUD.** Create, list (with search), rename, pin/unpin, and delete conversations.
- **Full message CRUD.** Messages are created by sending a prompt (streamed token-by-token from the model), and can be edited or deleted afterward. Editing a message truncates everything that came after it, matching how the backend works — see the note in `web/README.md`.
- **Live streaming replies.** The composer streams the assistant's response in as it's generated, via Server-Sent Events.

## Quick start

You'll need Postgres and Redis running locally (or update the connection strings in `api/.env`).

**1. Backend**
```bash
cd api
npm install
npx prisma generate
npx prisma migrate dev
npm run prisma:seed   # optional — creates a demo user + chat
npm run dev            # → http://localhost:4000/api/v1
```

**2. Frontend** (in a second terminal)
```bash
cd web
npm install
npm run dev             # → http://localhost:3000
```

Open `http://localhost:3000` — you'll land on `/login`. Register a new account (or use the seeded demo user: `raselmolla6336@gmail.com` / `12345678`) and you're in.

## Configuration

- `api/.env` — database, Redis, JWT secret, and the AI provider key. Already filled in with working local defaults.
- `web/.env.local` — just `NEXT_PUBLIC_API_URL`, pointing at the API's `/api/v1` prefix.

If you change the API's port or CORS origin, update both files to match (`CORS_ORIGIN` in `api/.env` should match wherever the frontend actually runs).

## Docs

- [`api/README.md`](./api/README.md) — how the old NestJS modules map onto the Express rewrite (services, guards, DTOs, filters, etc.)
- [`web/README.md`](./web/README.md) — frontend structure, how auth gating works, and how each CRUD action wires up to the API
