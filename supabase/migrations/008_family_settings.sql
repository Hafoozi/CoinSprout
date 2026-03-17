-- ============================================================
-- CoinSprout — Migration 008: Family settings
--
-- Global per-family configuration.
-- Currently stores currency_symbol; expandable for future
-- family-level preferences.
-- ============================================================

create table public.family_settings (
  id              uuid primary key default gen_random_uuid(),
  family_id       uuid not null unique references public.families(id) on delete cascade,
  currency_symbol text not null default '$',
  created_at      timestamptz not null default now()
);

-- Only the family owner can read or write their own settings
alter table public.family_settings enable row level security;

create policy "Family owner can read their settings"
  on public.family_settings for select
  using (
    family_id in (
      select id from public.families where owner_user_id = auth.uid()
    )
  );

create policy "Family owner can insert their settings"
  on public.family_settings for insert
  with check (
    family_id in (
      select id from public.families where owner_user_id = auth.uid()
    )
  );

create policy "Family owner can update their settings"
  on public.family_settings for update
  using (
    family_id in (
      select id from public.families where owner_user_id = auth.uid()
    )
  );
