-- ============================================================
-- CoinSprout — Migration 007: Individual fruit color values
--
-- Replaces the single fruit_base_value with one column per
-- apple color so parents can set each denomination directly.
-- ============================================================

alter table public.child_settings
  drop column if exists fruit_base_value,
  add column fruit_green_value     numeric(10, 2) check (fruit_green_value     > 0),
  add column fruit_red_value       numeric(10, 2) check (fruit_red_value       > 0),
  add column fruit_silver_value    numeric(10, 2) check (fruit_silver_value    > 0),
  add column fruit_gold_value      numeric(10, 2) check (fruit_gold_value      > 0),
  add column fruit_sparkling_value numeric(10, 2) check (fruit_sparkling_value > 0);
