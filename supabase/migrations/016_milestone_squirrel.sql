-- ============================================================
-- CoinSprout — Migration 016: Add squirrel milestone threshold
--
-- Adds a per-child configurable threshold for the squirrel
-- milestone (unlocks at $2,000 by default).
-- NULL means "use the app default".
-- ============================================================

alter table public.child_settings
  add column milestone_squirrel numeric(10, 2) check (milestone_squirrel > 0);
