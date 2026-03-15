-- ─── Add 'jobs' as a valid transaction source ─────────────────────────────────
-- Drops the old check constraint and replaces it with one that includes 'jobs'.

ALTER TABLE transactions
  DROP CONSTRAINT IF EXISTS transactions_source_check;

ALTER TABLE transactions
  ADD CONSTRAINT transactions_source_check
  CHECK (source IN ('allowance', 'gift', 'interest', 'jobs', 'spend'));
