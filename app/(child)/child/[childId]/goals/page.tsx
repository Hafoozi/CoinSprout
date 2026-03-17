import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { requireParent } from '@/lib/auth/require-parent'
import { getGoalsByChildId } from '@/lib/db/queries/goals'
import { getTransactionsByChildId } from '@/lib/db/queries/transactions'
import { toGoalWithProgress, calculateUnallocatedSavings } from '@/lib/calculations/goals'
import { calculateSavingsBalance } from '@/lib/calculations/savings'
import GoalsList from '@/components/child/goals-list'

export const metadata: Metadata = {
  title: 'My Goals — CoinSprout',
}

export default async function ChildGoalsPage({
  params,
}: {
  params: { childId: string }
}) {
  await requireParent()

  const [goals, transactions] = await Promise.all([
    getGoalsByChildId(params.childId),
    getTransactionsByChildId(params.childId),
  ])

  const savingsBalance = calculateSavingsBalance(transactions)
  const freeToUse      = calculateUnallocatedSavings(savingsBalance, goals)

  return (
    <GoalsList
      childId={params.childId}
      goals={goals.map(toGoalWithProgress)}
      freeToUse={freeToUse}
    />
  )
}
