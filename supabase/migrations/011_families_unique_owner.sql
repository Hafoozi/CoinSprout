-- Remove any duplicate families, keeping the oldest per user
DELETE FROM public.families
WHERE id NOT IN (
  SELECT DISTINCT ON (owner_user_id) id
  FROM public.families
  ORDER BY owner_user_id, created_at ASC
);

-- Prevent duplicate families per user going forward
ALTER TABLE public.families
  ADD CONSTRAINT families_owner_user_id_unique UNIQUE (owner_user_id);
