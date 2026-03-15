-- ============================================================
-- CoinSprout — Migration 001: Initial Schema
-- Run this first in your Supabase SQL editor.
-- ============================================================

-- ─── families ────────────────────────────────────────────────
-- One row per household. Owned by the parent's Supabase Auth user.
create table public.families (
  id              uuid primary key default gen_random_uuid(),
  owner_user_id   uuid references auth.users(id) on delete cascade not null,
  parent_pin_hash text,                          -- hashed 4-digit parent PIN
  created_at      timestamptz default now() not null
);

-- ─── children ────────────────────────────────────────────────
-- Child profiles within a family. No Supabase Auth account.
create table public.children (
  id           uuid primary key default gen_random_uuid(),
  family_id    uuid references public.families(id) on delete cascade not null,
  name         text not null,
  birthdate    date,
  avatar_color text,                             -- tailwind color name e.g. 'sprout', 'sky'
  pin_hash     text,                             -- hashed 4-digit child PIN
  created_at   timestamptz default now() not null
);

-- ─── transactions ────────────────────────────────────────────
-- Every money event for a child.
-- Positive amount = income (allowance / gift / interest)
-- Negative amount = spending
create table public.transactions (
  id         uuid primary key default gen_random_uuid(),
  child_id   uuid references public.children(id) on delete cascade not null,
  amount     numeric(10, 2) not null,
  source     text not null check (source in ('allowance', 'gift', 'interest', 'spend')),
  note       text,
  created_at timestamptz default now() not null
);

-- ─── goals ───────────────────────────────────────────────────
-- Savings targets for a child.
-- allocated_amount is the running total allocated to this goal.
create table public.goals (
  id               uuid primary key default gen_random_uuid(),
  child_id         uuid references public.children(id) on delete cascade not null,
  name             text not null,
  target_price     numeric(10, 2) not null check (target_price > 0),
  allocated_amount numeric(10, 2) not null default 0 check (allocated_amount >= 0),
  created_at       timestamptz default now() not null
);

-- ─── goal_allocations ────────────────────────────────────────
-- Individual allocation events — audit trail for goal funding.
create table public.goal_allocations (
  id             uuid primary key default gen_random_uuid(),
  goal_id        uuid references public.goals(id) on delete cascade not null,
  transaction_id uuid references public.transactions(id) on delete set null,
  amount         numeric(10, 2) not null check (amount > 0),
  created_at     timestamptz default now() not null
);

-- ─── milestones ──────────────────────────────────────────────
-- Animal milestones unlocked by lifetime earnings thresholds.
create table public.milestones (
  id             uuid primary key default gen_random_uuid(),
  child_id       uuid references public.children(id) on delete cascade not null,
  milestone_type text not null check (milestone_type in ('bunny', 'bird', 'deer', 'owl', 'fox')),
  unlocked_at    timestamptz default now() not null,
  unique(child_id, milestone_type)               -- a milestone can only be unlocked once
);

-- ─── recurring_allowances ────────────────────────────────────
-- Configuration for automatic weekly allowance prompts.
create table public.recurring_allowances (
  id               uuid primary key default gen_random_uuid(),
  child_id         uuid references public.children(id) on delete cascade not null unique,
  amount           numeric(10, 2) not null check (amount > 0),
  frequency        text not null default 'weekly' check (frequency in ('weekly')),
  day_of_week      smallint not null check (day_of_week between 0 and 6),
  is_active        boolean not null default true,
  last_prompted_at timestamptz,
  created_at       timestamptz default now() not null
);

-- ============================================================
-- Indexes
-- Every index below targets a column used in a WHERE clause or
-- JOIN condition that will run on every page load or data fetch.
-- Supabase auto-indexes primary keys; these cover foreign keys
-- and other hot columns that Postgres does NOT index by default.
-- ============================================================

-- families: auth.uid() → owner_user_id lookup runs on every request
create index idx_families_owner_user_id
  on public.families (owner_user_id);

-- children: family ownership check (used in every children query)
create index idx_children_family_id
  on public.children (family_id);

-- transactions: child dashboard fetches all transactions for a child,
-- ordered by created_at desc — cover both columns in one index
create index idx_transactions_child_id_created_at
  on public.transactions (child_id, created_at desc);

-- goals: child goal list and goal progress queries
create index idx_goals_child_id
  on public.goals (child_id);

-- goal_allocations: look up allocations by goal (audit trail queries)
create index idx_goal_allocations_goal_id
  on public.goal_allocations (goal_id);

-- goal_allocations: optional back-reference from a transaction
create index idx_goal_allocations_transaction_id
  on public.goal_allocations (transaction_id);

-- milestones: child milestone display (already has unique constraint on
-- (child_id, milestone_type) but no single-column index on child_id)
create index idx_milestones_child_id
  on public.milestones (child_id);

-- recurring_allowances: child_id is unique (already indexed), and the
-- cron job queries active configs — partial index on is_active = true
create index idx_recurring_allowances_active
  on public.recurring_allowances (child_id)
  where is_active = true;
