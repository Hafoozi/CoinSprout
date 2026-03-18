-- Allow a one-time per-cycle amount override that the cron clears after paying out.
-- When next_amount_override IS NOT NULL the cron uses that value instead of amount.
-- Skip (last_prompted_at set to next occurrence) still takes priority over the override.

ALTER TABLE recurring_allowances
  ADD COLUMN IF NOT EXISTS next_amount_override NUMERIC(10, 2) DEFAULT NULL;
