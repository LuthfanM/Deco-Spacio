<h1 align="center">
Deco Spacio
</h1>

<p align="center">
  <a href="https://discord.gg/jxZZuj3">
    <img src="https://img.shields.io/badge/Join%20Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" alt="Join Discord" />
  </a>
  <a href="https://x.com/LuthfanM">
    <img src="https://img.shields.io/badge/Follow%20on%20X-000000?style=for-the-badge&logo=x&logoColor=white" alt="Follow on X" />
  </a>
</p>

AI interior concept generator built with Next.js, TypeScript, Tailwind CSS, Pollinations, and optional Supabase storage.

Core features:
- Anonymous personal workspace created on first visit.
- Recovery key for restoring a previous gallery.
- Interior-specific prompt controls: room type, style, mood, camera angle, and custom prompt.
- Generated images saved server-side.
- Gallery persists after page refresh.
- Saved image can be selected, reused, or used as the base for a variation.
- Supabase-backed persistence for users, galleries, and generated image files.
- Visible loading and error states for slow API, invalid/missing input, missing API key, and broken AI responses.

<img width="1754" height="811" alt="image" src="https://github.com/user-attachments/assets/2df4dde4-755c-47eb-b7f0-993344b7cbf8" />

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

## Supabase

Supabase is required for database records and image storage:

1. Create a Supabase project.
2. Run [migrations/schema.sql](migrations/schema.sql) in the Supabase SQL editor.
3. Add these values to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your_publishable_or_anon_key"
```

Add this into your env as well, the app sends user-specific RLS headers dynamically :

```text
SUPABASE_DECO_SPACIO_USER_ID=x-deco-spacio-user-id
SUPABASE_DECO_SPACIO_RECOVERY_KEY=x-deco-spacio-recovery-key
```

make sure values in key same as inside schema.sql

## Run app

Run the app:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
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
