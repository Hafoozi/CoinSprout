import { createClient } from '@/lib/supabase/server'
import { roundMoney } from '@/lib/utils/math'
import type { Goal } from '@/lib/db/types'

export async function createGoal(data: {
  childId: string
  name: string
  targetPrice: number
}): Promise<Goal | null> {
  const supabase = await createClient()
  const { data: goal } = await supabase
    .from('goals')
    .insert({
      child_id:    data.childId,
      name:        data.name,
      target_price: data.targetPrice,
    })
    .select()
    .single()
  return goal ?? null
}

/**
 * Allocate money toward a goal.
 *
 * The caller must pass the current savings balance and total already allocated
 * (computed from all transactions and goals for the child). This lets the
 * mutation enforce the invariant without re-fetching those values itself.
 *
 * Invariant: currentTotalAllocated + amount ≤ currentSavingsBalance
 *
 * Returns the updated goal, or null if the allocation would exceed free savings.
 * Two writes are made (goal_allocations insert + goals update). They are not
 * wrapped in a DB transaction — for this app's scale that is acceptable. If one
 * fails, the discrepancy will be visible in the audit trail.
 */
export async function allocateToGoal(data: {
  goalId: string
  amount: number
  currentSavingsBalance: number
  currentTotalAllocated: number
}): Promise<Goal | null> {
  const { goalId, amount, currentSavingsBalance, currentTotalAllocated } = data

  // Server-side guard — never skip this check.
  const freeToUse = roundMoney(currentSavingsBalance - currentTotalAllocated)
  if (amount > freeToUse) return null

  const supabase = await createClient()

  // Fetch goal to get current allocated_amount.
  const { data: goal } = await supabase
    .from('goals')
    .select('*')
    .eq('id', goalId)
    .single()
  if (!goal) return null

  const newAllocated = roundMoney(goal.allocated_amount + amount)

  // 1. Append to the allocation audit trail.
  await supabase
    .from('goal_allocations')
    .insert({ goal_id: goalId, amount })

  // 2. Update the cached total on the goal row.
  const { data: updated } = await supabase
    .from('goals')
    .update({ allocated_amount: newAllocated })
    .eq('id', goalId)
    .select()
    .single()

  return updated ?? null
}

/** Hard-delete a goal and its allocation audit rows. */
export async function deleteGoal(goalId: string): Promise<boolean> {
  const supabase = await createClient()

  // Delete allocations first (avoids FK violations if no cascade is set)
  await supabase.from('goal_allocations').delete().eq('goal_id', goalId)

  const { error } = await supabase.from('goals').delete().eq('id', goalId)
  return !error
}

/**
 * Remove money from a goal, returning it to the child's free savings.
 *
 * Invariant: amount ≤ goal.allocated_amount (can't remove more than what's there).
 * Inserts a negative goal_allocations row for audit trail, then reduces the cached total.
 *
 * Returns the updated goal, or null if the amount exceeds what's allocated.
 */
export async function deallocateFromGoal(data: {
  goalId: string
  amount: number
}): Promise<Goal | null> {
  const { goalId, amount } = data

  const supabase = await createClient()

  const { data: goal } = await supabase
    .from('goals')
    .select('*')
    .eq('id', goalId)
    .single()
  if (!goal) return null

  if (amount > goal.allocated_amount) return null

  const newAllocated = roundMoney(goal.allocated_amount - amount)

  await supabase
    .from('goal_allocations')
    .insert({ goal_id: goalId, amount: -amount })

  const { data: updated } = await supabase
    .from('goals')
    .update({ allocated_amount: newAllocated })
    .eq('id', goalId)
    .select()
    .single()

  return updated ?? null
}

/**
 * Mark a goal as complete by setting allocated_amount = target_price.
 * Used when a parent wants to close a goal the child has physically achieved.
 */
export async function completeGoal(goalId: string): Promise<Goal | null> {
  const supabase = await createClient()

  const { data: goal } = await supabase
    .from('goals')
    .select('target_price')
    .eq('id', goalId)
    .single()
  if (!goal) return null

  const { data: updated } = await supabase
    .from('goals')
    .update({ allocated_amount: goal.target_price })
    .eq('id', goalId)
    .select()
    .single()

  return updated ?? null
}
