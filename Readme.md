# Deco Spacio

AI interior concept generator built with Next.js, TypeScript, Tailwind CSS, Pollinations, and optional Supabase storage.

## Quick Start

Prerequisites:
- Node.js 22 or newer
- npm
- Pollinations image API key

Setup:

```bash
npm install
cp .env.example .env.local
```

Edit `.env.local` and set:

```env
POLLINATIONS_KEY="your_key_here"
```

Run the app:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

That is enough for local usage. User sessions, gallery records, and generated images are stored in Supabase.

## Supabase

Supabase is required for database records and image storage:

1. Create a Supabase project.
2. Run [migrations/schema.sql](migrations/schema.sql) in the Supabase SQL editor.
3. Add these values to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_publishable_or_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

The app sends user-specific RLS headers dynamically:

```text
x-deco-spacio-user-id
x-deco-spacio-recovery-key
```

The fallback env values below are optional and normally left empty:

```env
SUPABASE_DECO_SPACIO_USER_ID=
SUPABASE_DECO_SPACIO_RECOVERY_KEY=
```

## Scripts

```bash
npm run dev        # start local dev server
npm run build      # production build
npm run start      # start production server after build
npm run lint       # eslint
npm run typecheck  # TypeScript check
```

## API Routes

- `POST /api/user` initializes or restores a local workspace session by user id.
- `POST /api/user/restore` restores a user by recovery key.
- `GET /api/images?userId=...` returns completed generated images.
- `POST /api/generate` generates an image and returns a `GenerationImage` record.

## Verification

Before opening a PR:

```bash
npm run lint
npm run typecheck
npm run build
```

## Notes

- Pollinations image API docs: https://gen.pollinations.ai/docs#tag/%EF%B8%8F-image
- `.env.local` is ignored by git; keep API keys out of commits.
