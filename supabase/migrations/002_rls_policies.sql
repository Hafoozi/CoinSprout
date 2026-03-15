-- ============================================================
-- CoinSprout — Migration 002: Row Level Security Policies
-- Run after 001_initial_schema.sql
--
-- SECURITY MODEL
-- ──────────────
-- CoinSprout has one type of authenticated user: the parent.
-- Children are NOT Supabase Auth users — they are rows in the
-- `children` table, protected by the parent's session.
--
-- The trust chain for every query is:
--
--   auth.uid()                   (Supabase Auth JWT)
--       ↓
--   families.owner_user_id       (1-to-1: one family per parent)
--       ↓
--   families.id                  (family primary key)
--       ↓
--   children.family_id           (children belong to a family)
--       ↓
--   transactions / goals /       (all child data belongs to a child)
--   milestones / ...
--
-- No data can be read or written unless auth.uid() can be traced
-- back to the row's owning family through this chain.
-- ============================================================


-- ─── Enable RLS on all tables ────────────────────────────────
-- Once RLS is enabled, ALL access is denied by default.
-- Only rows explicitly permitted by a policy are visible.
alter table public.families             enable row level security;
alter table public.children             enable row level security;
alter table public.transactions         enable row level security;
alter table public.goals                enable row level security;
alter table public.goal_allocations     enable row level security;
alter table public.milestones           enable row level security;
alter table public.recurring_allowances enable row level security;


-- ============================================================
-- Helper function: child_belongs_to_user
-- ============================================================
-- Joins children → families to confirm that a given child_id
-- belongs to the currently authenticated parent.
--
-- WHY a function instead of inline subquery?
--   · Avoids repeating the same 3-table join in 20+ policies.
--   · `security definer` means it runs as the function owner
--     (postgres superuser), so it can bypass RLS on `children`
--     and `families` while evaluating the check — preventing
--     infinite recursion in the RLS evaluation chain.
--   · Marking it `security definer` is safe here because the
--     function only returns a boolean and never exposes data.
-- ============================================================
create or replace function public.child_belongs_to_user(p_child_id uuid)
returns boolean language sql security definer as $$
  select exists (
    select 1
    from   public.children c
    join   public.families  f on f.id = c.family_id
    where  c.id            = p_child_id
    and    f.owner_user_id = auth.uid()
  );
$$;


-- ============================================================
-- TABLE: families
-- ============================================================
-- A parent can only see and modify their own family row.
-- The owner_user_id column is compared directly to auth.uid().
--
-- USING  clause = filter on existing rows (SELECT / UPDATE / DELETE)
-- WITH CHECK clause = validate new/modified row before write (INSERT / UPDATE)
-- ============================================================

-- SELECT: parent can read their family's settings (PIN hash, etc.)
create policy "families: owner select"
  on public.families for select
  using (owner_user_id = auth.uid());

-- INSERT: parent can create their family; must set themselves as owner
create policy "families: owner insert"
  on public.families for insert
  with check (owner_user_id = auth.uid());

-- UPDATE: parent can update their family (e.g., change parent PIN)
create policy "families: owner update"
  on public.families for update
  using    (owner_user_id = auth.uid())
  with check (owner_user_id = auth.uid());

-- DELETE: parent can delete their family (cascades to all children/data)
create policy "families: owner delete"
  on public.families for delete
  using (owner_user_id = auth.uid());


-- ============================================================
-- TABLE: children
-- ============================================================
-- A parent can see/manage children whose family_id matches a
-- family they own. The subquery `select id from families where
-- owner_user_id = auth.uid()` resolves to the parent's family ID.
-- ============================================================

-- SELECT: parent sees all their children
create policy "children: family select"
  on public.children for select
  using (family_id in (
    select id from public.families where owner_user_id = auth.uid()
  ));

-- INSERT: parent can add a child to their family only
create policy "children: family insert"
  on public.children for insert
  with check (family_id in (
    select id from public.families where owner_user_id = auth.uid()
  ));

-- UPDATE: parent can edit their children's profiles (name, PIN, avatar)
create policy "children: family update"
  on public.children for update
  using (family_id in (
    select id from public.families where owner_user_id = auth.uid()
  ))
  with check (family_id in (
    select id from public.families where owner_user_id = auth.uid()
  ));

-- DELETE: parent can remove a child (cascades all transactions, goals, etc.)
create policy "children: family delete"
  on public.children for delete
  using (family_id in (
    select id from public.families where owner_user_id = auth.uid()
  ));


-- ============================================================
-- TABLE: transactions
-- ============================================================
-- Transactions belong to a child. Access is granted when
-- child_belongs_to_user(child_id) returns true — i.e., when
-- the child's family is owned by the authenticated parent.
--
-- NOTE: There is intentionally no UPDATE policy on transactions.
-- Money records are append-only; corrections are made by adding
-- a new offsetting transaction. This preserves audit integrity.
-- ============================================================

create policy "transactions: family select"
  on public.transactions for select
  using (public.child_belongs_to_user(child_id));

create policy "transactions: family insert"
  on public.transactions for insert
  with check (public.child_belongs_to_user(child_id));

-- No UPDATE policy — transactions are immutable once recorded.

create policy "transactions: family delete"
  on public.transactions for delete
  using (public.child_belongs_to_user(child_id));


-- ============================================================
-- TABLE: goals
-- ============================================================
-- Goals belong to a child. Same pattern as transactions.
-- Goals can be updated (to change the target price or flush
-- allocated_amount after an allocation mutation).
-- ============================================================

create policy "goals: family select"
  on public.goals for select
  using (public.child_belongs_to_user(child_id));

create policy "goals: family insert"
  on public.goals for insert
  with check (public.child_belongs_to_user(child_id));

create policy "goals: family update"
  on public.goals for update
  using    (public.child_belongs_to_user(child_id))
  with check (public.child_belongs_to_user(child_id));

create policy "goals: family delete"
  on public.goals for delete
  using (public.child_belongs_to_user(child_id));


-- ============================================================
-- TABLE: goal_allocations
-- ============================================================
-- Goal allocations are one level removed from children:
--   goal_allocations.goal_id → goals.child_id → children.family_id
-- We resolve access by checking that the parent goal is
-- accessible via child_belongs_to_user.
--
-- NOTE: No UPDATE or DELETE policy. Allocations are also
-- append-only (audit trail). To undo an allocation, insert a
-- negative correction transaction and a corresponding record.
-- ============================================================

create policy "goal_allocations: family select"
  on public.goal_allocations for select
  using (goal_id in (
    select id from public.goals where public.child_belongs_to_user(child_id)
  ));

create policy "goal_allocations: family insert"
  on public.goal_allocations for insert
  with check (goal_id in (
    select id from public.goals where public.child_belongs_to_user(child_id)
  ));

-- No UPDATE or DELETE — allocation records are immutable.


-- ============================================================
-- TABLE: milestones
-- ============================================================
-- Milestones are unlocked once per child per type (enforced by
-- unique constraint). Only insert and select are needed — a
-- milestone once unlocked is never modified or deleted.
-- ============================================================

create policy "milestones: family select"
  on public.milestones for select
  using (public.child_belongs_to_user(child_id));

-- INSERT only: milestones are created by the server when a threshold
-- is crossed; they are never updated or deleted.
create policy "milestones: family insert"
  on public.milestones for insert
  with check (public.child_belongs_to_user(child_id));

-- No UPDATE or DELETE — milestones are permanent once earned.


-- ============================================================
-- TABLE: recurring_allowances
-- ============================================================
-- Full CRUD: parents configure and adjust recurring allowances.
-- Each child has at most one recurring_allowance row (enforced
-- by the unique constraint on child_id in the schema).
-- ============================================================

create policy "recurring_allowances: family select"
  on public.recurring_allowances for select
  using (public.child_belongs_to_user(child_id));

create policy "recurring_allowances: family insert"
  on public.recurring_allowances for insert
  with check (public.child_belongs_to_user(child_id));

-- UPDATE: parent adjusts amount, pauses/resumes, or updates last_prompted_at
create policy "recurring_allowances: family update"
  on public.recurring_allowances for update
  using    (public.child_belongs_to_user(child_id))
  with check (public.child_belongs_to_user(child_id));

create policy "recurring_allowances: family delete"
  on public.recurring_allowances for delete
  using (public.child_belongs_to_user(child_id));
