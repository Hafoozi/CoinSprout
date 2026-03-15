# CoinSprout

A family-focused financial education app that helps children understand saving and delayed gratification through a visual growing tree.

## Tech Stack

- **Frontend:** Next.js 14 (App Router, TypeScript)
- **Backend:** Supabase (Postgres + Auth + RLS)
- **Styling:** Tailwind CSS
- **Hosting:** Vercel
- **Version Control:** GitHub

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in your Supabase project URL and keys from [supabase.com/dashboard](https://supabase.com/dashboard).

### 3. Set up the database

Run the migration files in order against your Supabase project:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_rls_policies.sql
supabase/migrations/003_seed_dev_data.sql  (development only)
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/          — Next.js App Router pages and layouts
components/   — React components (auth, layout, parent, child, tree, ui, shared)
lib/          — Supabase clients, db queries/mutations, calculations, constants
actions/      — Next.js Server Actions
types/        — TypeScript type definitions
supabase/     — SQL migrations and seed data
public/       — Static assets (tree SVGs, fruit SVGs, animal SVGs)
```

## Specification Documents

Full product specification is in `/docs/`.
