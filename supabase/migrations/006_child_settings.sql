-- ============================================================
-- CoinSprout — Migration 006: Per-child visual settings
--
-- Allows parents to customise tree growth thresholds, animal
-- milestone thresholds, and fruit base denomination per child.
-- All columns are nullable — NULL means "use the app default".
-- ============================================================

-- ─── Table ───────────────────────────────────────────────────
create table public.child_settings (
  id         uuid primary key default gen_random_uuid(),
  child_id   uuid references public.children(id) on delete cascade not null unique,

  -- Tree stage thresholds (lifetime earnings required, $ amount)
  tree_young   numeric(10, 2) check (tree_young   > 0),
  tree_growing numeric(10, 2) check (tree_growing > 0),
  tree_mature  numeric(10, 2) check (tree_mature  > 0),
  tree_ancient numeric(10, 2) check (tree_ancient > 0),

  -- Animal milestone thresholds (lifetime earnings required, $ amount)
  milestone_bunny numeric(10, 2) check (milestone_bunny > 0),
  milestone_bird  numeric(10, 2) check (milestone_bird  > 0),
  milestone_deer  numeric(10, 2) check (milestone_deer  > 0),
  milestone_owl   numeric(10, 2) check (milestone_owl   > 0),
  milestone_fox   numeric(10, 2) check (milestone_fox   > 0),

  -- Fruit base denomination ($, smallest apple value)
  fruit_base_value numeric(10, 2) check (fruit_base_value > 0),

  created_at timestamptz default now() not null
);

-- ─── RLS ─────────────────────────────────────────────────────
alter table public.child_settings enable row level security;

-- Parents can read settings for their own children
create policy "Parents can read own child settings"
  on public.child_settings for select
  using (
    exists (
      select 1 from public.children c
      join public.families f on f.id = c.family_id
      where c.id = child_settings.child_id
        and f.owner_user_id = auth.uid()
    )
  );

-- Parents can insert settings for their own children
create policy "Parents can insert own child settings"
  on public.child_settings for insert
  with check (
    exists (
      select 1 from public.children c
      join public.families f on f.id = c.family_id
      where c.id = child_settings.child_id
        and f.owner_user_id = auth.uid()
    )
  );

-- Parents can update settings for their own children
create policy "Parents can update own child settings"
  on public.child_settings for update
  using (
    exists (
      select 1 from public.children c
      join public.families f on f.id = c.family_id
      where c.id = child_settings.child_id
        and f.owner_user_id = auth.uid()
    )
  );
