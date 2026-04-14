import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { requireParent } from '@/lib/auth/require-parent'
import { getGoalById } from '@/lib/db/queries/goals'
import { getChildById } from '@/lib/db/queries/children'
import { getGoalsByChildId } from '@/lib/db/queries/goals'
import { getTransactionsByChildId } from '@/lib/db/queries/transactions'
import { calculateSavingsBalance } from '@/lib/calculations/savings'
import { calculateUnallocatedSavings, toGoalWithProgress } from '@/lib/calculations/goals'
import { ROUTES } from '@/lib/constants/routes'
import GoalActions from '@/components/parent/goal-actions'
import GoalAllocateClient from './goal-allocate-client'

export const metadata: Metadata = {
  title: 'Goal — CoinSprout',
}

export default async function GoalPage({
  params,
}: {
  params: { goalId: string }
}) {
  await requireParent()

  const goal = await getGoalById(params.goalId)
  if (!goal) notFound()

  const [child, transactions, allGoals] = await Promise.all([
    getChildById(goal.child_id),
    getTransactionsByChildId(goal.child_id),
    getGoalsByChildId(goal.child_id),
  ])
  if (!child) notFound()

  const savingsBalance = calculateSavingsBalance(transactions)
  const freeToUse      = calculateUnallocatedSavings(savingsBalance, allGoals)

  const goalWithProgress = toGoalWithProgress(goal)
  const incompleteGoals  = allGoals
    .map(toGoalWithProgress)
    .filter((g) => !g.isComplete)

  return (
    <div className="space-y-6 py-6">
      <Link
        href={ROUTES.PARENT.CHILD(child.id)}
        className="inline-flex items-center gap-1 text-sm text-sprout-600 hover:text-sprout-800 transition-colors"
      >
        ← {child.name}
      </Link>

      <h1 className="text-xl font-bold text-gray-800">{goal.name}</h1>

      <GoalActions goal={goalWithProgress} freeToUse={freeToUse} />

      {!goalWithProgress.isComplete && freeToUse > 0 && incompleteGoals.length > 0 && (
        <div className="card-surface p-5 space-y-3">
          <h2 className="text-sm font-semibold text-gray-700">Allocate Savings</h2>
          <GoalAllocateClient
            goals={incompleteGoals}
            freeToUse={freeToUse}
            redirectTo={ROUTES.PARENT.CHILD(child.id)}
          />
        </div>
      )}

      {goalWithProgress.isComplete && (
        <div className="card-surface p-5 text-center space-y-1">
          <p className="text-2xl">🎉</p>
          <p className="font-semibold text-sprout-700">Goal complete!</p>
          <p className="text-sm text-gray-400">
            {child.name} saved {`$${goal.target_price.toFixed(2)}`} for this goal.
          </p>
        </div>
      )}
    </div>
  )
}
