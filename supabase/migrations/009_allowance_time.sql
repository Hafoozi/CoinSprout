-- Add hour_of_day to recurring_allowances
-- Stores the UTC hour (0-23) at which the allowance should be posted
ALTER TABLE recurring_allowances
  ADD COLUMN IF NOT EXISTS hour_of_day INTEGER NOT NULL DEFAULT 9
    CHECK (hour_of_day >= 0 AND hour_of_day <= 23);
