ALTER TABLE public.child_settings
  ADD COLUMN IF NOT EXISTS tree_progress_reset_at      TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS milestone_progress_reset_at TIMESTAMPTZ DEFAULT NULL;
