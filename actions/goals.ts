'use server'

import { revalidatePath } from 'next/cache'
import { requireParent } from '@/lib/auth/require-parent'
import { createGoal as createGoalMutation, allocateToGoal as allocateToGoalMutation, deallocateFromGoal as deallocateFromGoalMutation, deleteGoal as deleteGoalMutation, completeGoal as completeGoalMutation } from '@/lib/db/mutations/goals'
import { getGoalById } from '@/lib/db/queries/goals'
import { getTransactionsByChildId } from '@/lib/db/queries/transactions'
import { getGoalsByChildId } from '@/lib/db/queries/goals'
import { getChildById } from '@/lib/db/queries/children'
import { calculateSavingsBalance } from '@/lib/calculations/savings'
import { calculateTotalAllocated } from '@/lib/calculations/goals'
import { createGoalSchema, allocateGoalSchema } from '@/lib/validators/goal'
import { ROUTES } from '@/lib/constants/routes'
import type { ActionResult } from '@/types/ui'

export async function createGoal(_: unknown, formData: FormData): Promise<ActionResult> {
  await requireParent()

  const parsed = createGoalSchema.safeParse({
    childId:     formData.get('childId'),
    name:        formData.get('name'),
    targetPrice: Number(formData.get('targetPrice')),
  })
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  const child = await getChildById(parsed.data.childId)
  if (!child) return { success: false, error: 'Child not found' }

  const goal = await createGoalMutation({
    childId:     parsed.data.childId,
    name:        parsed.data.name,
    targetPrice: parsed.data.targetPrice,
  })
  if (!goal) return { success: false, error: 'Failed to create goal' }

  revalidatePath(ROUTES.PARENT.CHILD(parsed.data.childId))
  revalidatePath(ROUTES.CHILD.HOME(parsed.data.childId))
  revalidatePath(ROUTES.CHILD.GOALS(parsed.data.childId))
  return { success: true }
}

export async function allocateToGoal(_: unknown, formData: FormData): Promise<ActionResult> {
  await requireParent()

  const parsed = allocateGoalSchema.safeParse({
    goalId: formData.get('goalId'),
    amount: Number(formData.get('amount')),
  })
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0].message }
  }

  // Resolve goal → child so we can validate against that child's finances.
  const goal = await getGoalById(parsed.data.goalId)
  if (!goal) return { success: false, error: 'Goal not found' }

  // Fetch current financial state for the child.
  const [transactions, goals] = await Promise.all([
    getTransactionsByChildId(goal.child_id),
    getGoalsByChildId(goal.child_id),
  ])

  const savingsBalance   = calculateSavingsBalance(transactions)
  const totalAllocated   = calculateTotalAllocated(goals)

  const updated = await allocateToGoalMutation({
    goalId:                parsed.data.goalId,
    amount:                parsed.data.amount,
    currentSavingsBalance: savingsBalance,
    currentTotalAllocated: totalAllocated,
  })

  if (!updated) {
    return {
      success: false,
      error:   'Not enough free savings to allocate that amount',
    }
  }

  revalidatePath(ROUTES.PARENT.CHILD(goal.child_id))
  revalidatePath(ROUTES.PARENT.GOAL(goal.id))
  revalidatePath(ROUTES.CHILD.HOME(goal.child_id))
  revalidatePath(ROUTES.CHILD.GOALS(goal.child_id))
  return { success: true }
}

export async function deleteGoal(_: unknown, formData: FormData): Promise<ActionResult> {
  await requireParent()

  const goalId = formData.get('goalId')?.toString()
  if (!goalId) return { success: false, error: 'Missing goal ID' }

  const goal = await getGoalById(goalId)
  if (!goal) return { success: false, error: 'Goal not found' }

  const ok = await deleteGoalMutation(goalId)
  if (!ok) return { success: false, error: 'Failed to delete goal' }

  revalidatePath(ROUTES.PARENT.CHILD(goal.child_id))
  revalidatePath(ROUTES.CHILD.HOME(goal.child_id))
  revalidatePath(ROUTES.CHILD.GOALS(goal.child_id))
  return { success: true }
}

/**
 * Child-facing allocation — called directly (not via form action).
 * Still requires an authenticated session; the parent is always logged in
 * when a child is viewing the app.
 */
export async function childAllocateToGoal(goalId: string, amount: number): Promise<ActionResult> {
  try {
    await requireParent()

    const goal = await getGoalById(goalId)
    if (!goal) return { success: false, error: 'Goal not found' }

    const [transactions, goals] = await Promise.all([
      getTransactionsByChildId(goal.child_id),
      getGoalsByChildId(goal.child_id),
    ])

    const savingsBalance = calculateSavingsBalance(transactions)
    const totalAllocated = calculateTotalAllocated(goals)

    const updated = await allocateToGoalMutation({
      goalId,
      amount,
      currentSavingsBalance: savingsBalance,
      currentTotalAllocated: totalAllocated,
    })

    if (!updated) return { success: false, error: 'Not enough free savings' }

    revalidatePath(ROUTES.CHILD.HOME(goal.child_id))
    revalidatePath(ROUTES.CHILD.GOALS(goal.child_id))
    revalidatePath(ROUTES.PARENT.CHILD(goal.child_id))
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to allocate' }
  }
}

/**
 * Child-facing deallocation — removes money from a goal back to free savings.
 * Parent session is always present when a child views the app.
 */
export async function childDeallocateFromGoal(goalId: string, amount: number): Promise<ActionResult> {
  try {
    await requireParent()

    const goal = await getGoalById(goalId)
    if (!goal) return { success: false, error: 'Goal not found' }

    const updated = await deallocateFromGoalMutation({ goalId, amount })
    if (!updated) return { success: false, error: 'Amount exceeds what is saved for this goal' }

    revalidatePath(ROUTES.CHILD.HOME(goal.child_id))
    revalidatePath(ROUTES.CHILD.GOALS(goal.child_id))
    revalidatePath(ROUTES.PARENT.CHILD(goal.child_id))
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to remove from goal' }
  }
}

export async function completeGoal(_: unknown, formData: FormData): Promise<ActionResult> {
  await requireParent()

  const goalId = formData.get('goalId')?.toString()
  if (!goalId) return { success: false, error: 'Missing goal ID' }

  const goal = await getGoalById(goalId)
  if (!goal) return { success: false, error: 'Goal not found' }

  const updated = await completeGoalMutation(goalId)
  if (!updated) return { success: false, error: 'Failed to complete goal' }

  revalidatePath(ROUTES.PARENT.CHILD(goal.child_id))
  revalidatePath(ROUTES.PARENT.GOAL(goal.id))
  revalidatePath(ROUTES.CHILD.HOME(goal.child_id))
  revalidatePath(ROUTES.CHILD.GOALS(goal.child_id))
  return { success: true }
}
