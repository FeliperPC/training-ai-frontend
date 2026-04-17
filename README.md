# training-ai-frontend

Frontend for FIT.AI — a fitness tracking app with an AI-powered personal trainer chatbot.

**Stack**: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · better-auth · Orval

---

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 10+
- `training-api` running locally (see its README)

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Configure environment variables
# Create a .env.local file:
echo "NEXT_PUBLIC_API_URL=http://localhost:8081" >> .env.local
echo "NEXT_PUBLIC_BASE_URL=http://localhost:3000" >> .env.local

# 3. Start the dev server
pnpm dev
```

The app will be available at `http://localhost:3000`.

---

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start Next.js dev server on port 3000 |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `npx orval` | Regenerate typed API client from backend's `/swagger.json` |

---

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g. `http://localhost:8081`) |
| `NEXT_PUBLIC_BASE_URL` | This app's own origin (e.g. `http://localhost:3000`) — used as OAuth callback URL |

---

## Pages

| Route | Description |
|---|---|
| `/auth` | Google OAuth sign-in screen. Redirects to `/` if already authenticated. |
| `/` | Home screen. Shows workout streak, weekly consistency, and today's workout day card. |
| `/onboarding` | Full-screen AI chatbot for first-time setup. Skipped if user already has an active plan and training data. |
| `/workout-plans/:id` | Workout plan overview — all 7 days sorted by weekday. |
| `/workout-plans/:id/days/:dayId` | Workout day detail — exercises list, session state, start/complete actions. |
| `/stats` | Statistics — streak, consistency heatmap, completed workouts, conclusion rate, total training time. |
| `/profile` | User profile — avatar, name, physical stats (weight, height, body fat %, age), logout. |

All pages redirect unauthenticated users to `/auth`. After authentication, users without an active workout plan or training data are redirected to `/onboarding`.

---

## Architecture

### Data fetching

- **Server Components** (all pages by default) use generated functions from `app/_lib/api/fetch-generated/` with a custom fetch wrapper that forwards cookies automatically.
- **Client Components** are only used where interactivity is required: the auth page, chatbot, and workout session action buttons.
- **Server Actions** handle mutations (start/complete workout session) and call `revalidatePath` to refresh data — no client-side state management needed.

### API client generation (Orval)

`orval.config.ts` fetches `$NEXT_PUBLIC_API_URL/swagger.json` and generates fully typed functions in `app/_lib/api/fetch-generated/index.ts`. This file is the single source of truth for the API contract — **do not edit manually**. Run `npx orval` after any backend schema change.

### AI Chatbot

The `<Chatbot>` component supports two modes:

- **`overlay`** — floating modal available on every page via the root layout, toggled by a floating button.
- **`page`** — full-screen mode used on `/onboarding`.

It uses `useChat` from `@ai-sdk/react` with streaming transport directly to `POST /ai/` on the backend. Markdown is rendered with `streamdown`. Open/closed state and initial messages are stored in URL query params (`chat_open`, `chat_initial_message`) via `nuqs`.

### Authentication

`better-auth` client pointing at the backend API. Used for:
- `authClient.useSession()` — current session on client components
- `authClient.signIn.social({ provider: "google" })` — Google OAuth sign-in

Cookies are managed by the backend and forwarded by the custom fetch wrapper on server components.

### Directory structure

```
app/
├── _lib/
│   ├── auth-client.ts          # better-auth React client
│   ├── fetch.ts                # Custom fetch (cookie forwarding)
│   └── api/fetch-generated/    # Orval-generated typed API client (auto-generated)
├── auth/                       # /auth page
├── onboarding/                 # /onboarding page
├── profile/                    # /profile page
├── stats/                      # /stats page
└── workout-plans/              # /workout-plans/:id and .../days/:dayId

components/
├── ui/                         # shadcn/ui components
├── chatbot.tsx                 # AI chatbot (overlay + page modes)
├── bottom-nav.tsx              # Bottom navigation bar
├── weekly-consistency.tsx      # Weekly workout consistency widget
└── workout-day-card.tsx        # Workout day card component
```

---

## Conventions

- All pages are Server Components by default; use `"use client"` only when required
- Use `dayjs` for all date manipulation
- Use Next.js `<Image>` component for images
- Forms: React Hook Form + Zod + shadcn `Form` component
- Use theme colors from `app/globals.css` — never hardcode Tailwind colors like `text-white` or `bg-black`
- `authClient` errors: destructure `{ error }` from the result, never use try/catch
- One component per file; `kebab-case` filenames
- Arrow functions preferred; early returns over nesting
- Never use `any`; prefer `interface` over `type`; prefer named exports
- No code comments
