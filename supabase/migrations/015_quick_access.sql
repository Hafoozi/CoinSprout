-- ============================================================
-- CoinSprout — Migration 015: Quick Access setting
--
-- Adds quick_access_enabled to family_settings.
-- When true, a profile switcher is shown in the child shell
-- header so the parent can jump between profiles without
-- navigating back to the parent dashboard first.
-- ============================================================

alter table public.family_settings
  add column if not exists quick_access_enabled boolean not null default false;
