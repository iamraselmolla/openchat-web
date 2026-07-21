# AI Chat Web

_Part of the [ai-chat-app](../README.md) monorepo — this doc covers the frontend only._

Next.js (App Router) + Tailwind. No component library, no server-side auth — the JWT lives in `localStorage` and every protected page checks it client-side, since the API is a separate bearer-token service rather than something Next.js sessions directly.

## How login-gating works

- `lib/auth-context.jsx` holds the signed-in user + token in React state, mirrored to `localStorage` (`aichat:token`, `aichat:user`). It exposes `ready` (have we finished checking storage yet?) alongside `user`.
- `app/chat/layout.jsx` wraps every page under `/chat`. While `ready` is false it shows a spinner; once ready, if there's no `user` it redirects to `/login`. **Nothing under `/chat` renders for a logged-out visitor** — the layout returns a loading state instead of `children` until auth is confirmed.
- `app/login` and `app/register` redirect *away* to `/chat` if you're already signed in.
- `lib/api.js` attaches `Authorization: Bearer <token>` to every request automatically. If the token is missing or expired, the API returns 401 and you'll see that surfaced as an error — there's no silent failure.

## Project structure

```
app/
  layout.jsx              # fonts, <AuthProvider>
  page.jsx                # "/" — routes to /chat or /login based on auth state
  login/page.jsx
  register/page.jsx
  chat/
    layout.jsx             # the auth gate + sidebar shell
    page.jsx                # "/chat" — empty state, no chat selected
    [chatId]/page.jsx       # a single conversation
components/
  Sidebar.jsx              # chat list, search, new chat, account/logout
  ChatListItem.jsx          # rename / pin / delete for one chat
  MessageThread.jsx         # scrollable message list
  MessageBubble.jsx          # one message, with edit/delete for user turns
  Composer.jsx               # the input box, streams the reply in
  EmptyState.jsx / Spinner.jsx / ConfirmDialog.jsx
lib/
  api.js                    # fetch wrapper, adds the auth header
  stream.js                  # manual SSE reader (fetch can POST + send headers, EventSource can't)
  auth-context.jsx           # login/register/logout, gates access
  use-chats.js                # chat list: load, create, rename, pin, delete
  use-chat-thread.js           # one chat: load, send (streaming), edit, delete
```

## CRUD coverage

| Entity | Create | Read | Update | Delete |
|---|---|---|---|---|
| **Chat** | "New chat" button in the sidebar | Sidebar list (with search) + chat page on open | Inline rename, pin/unpin (sidebar) | Delete icon → confirm dialog |
| **Message** | Composer → streams the reply in | Loaded when you open a chat | Edit icon on your own messages | Delete icon on any message |

**One thing worth knowing:** editing a message calls the same endpoint the backend always had — it updates that message's content and deletes everything sent after it (that's how the API supports "branching" a conversation from an earlier point). It does **not** automatically ask the model to reply again. After saving an edit, the thread ends at that message; send a new one to continue from there. The composer shows a note about this when you're editing.

## Running it

```bash
npm install
npm run dev   # http://localhost:3000
```

Needs the API running (see [`../api/README.md`](../api/README.md)) and `NEXT_PUBLIC_API_URL` in `.env.local` pointing at it — already set to `http://localhost:4000/api/v1`.
