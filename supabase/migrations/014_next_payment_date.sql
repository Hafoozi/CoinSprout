-- Add explicit next_payment_date to both recurring tables.
-- The cron uses this date to know exactly when to pay, replacing the fragile
-- day_of_week exact-match logic. day_of_week is kept for UI display and for
-- calculating the initial/recalculated payment date.

ALTER TABLE public.recurring_allowances
  ADD COLUMN IF NOT EXISTS next_payment_date date DEFAULT NULL;

ALTER TABLE public.recurring_interest
  ADD COLUMN IF NOT EXISTS next_payment_date date DEFAULT NULL;
