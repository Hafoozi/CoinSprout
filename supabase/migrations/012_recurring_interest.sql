CREATE TABLE public.recurring_interest (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id         uuid        NOT NULL UNIQUE REFERENCES public.children(id) ON DELETE CASCADE,
  rate             NUMERIC(8, 4) NOT NULL CHECK (rate >= 0.01),
  day_of_week      INTEGER     NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  is_active        BOOLEAN     NOT NULL DEFAULT true,
  last_prompted_at TIMESTAMPTZ DEFAULT NULL,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.recurring_interest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recurring_interest: family select"
  ON public.recurring_interest FOR SELECT
  USING (public.child_belongs_to_user(child_id));

CREATE POLICY "recurring_interest: family insert"
  ON public.recurring_interest FOR INSERT
  WITH CHECK (public.child_belongs_to_user(child_id));

CREATE POLICY "recurring_interest: family update"
  ON public.recurring_interest FOR UPDATE
  USING    (public.child_belongs_to_user(child_id))
  WITH CHECK (public.child_belongs_to_user(child_id));

CREATE POLICY "recurring_interest: family delete"
  ON public.recurring_interest FOR DELETE
  USING (public.child_belongs_to_user(child_id));
