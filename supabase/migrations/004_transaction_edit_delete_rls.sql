-- ─── Transaction edit & delete policies ──────────────────────────────────────
-- By default transactions were append-only. We now allow parents to edit or
-- delete transactions that belong to their own children.

-- UPDATE: parent can edit any transaction that belongs to their child
CREATE POLICY "Parents can update their children's transactions"
  ON transactions FOR UPDATE
  USING (child_belongs_to_user(child_id));

-- DELETE: parent can delete any transaction that belongs to their child
CREATE POLICY "Parents can delete their children's transactions"
  ON transactions FOR DELETE
  USING (child_belongs_to_user(child_id));
