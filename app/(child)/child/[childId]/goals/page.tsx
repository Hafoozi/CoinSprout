import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { requireParent } from '@/lib/auth/require-parent'
import { getGoalsByChildId } from '@/lib/db/queries/goals'
import { getTransactionsByChildId } from '@/lib/db/queries/transactions'
import { getFamilySettings } from '@/lib/db/queries/family-settings'
import { toGoalWithProgress, calculateUnallocatedSavings } from '@/lib/calculations/goals'
import { calculateSavingsBalance } from '@/lib/calculations/savings'
import { DEFAULT_CURRENCY } from '@/lib/constants/currencies'
import { CurrencyProvider } from '@/components/providers/currency-provider'
import GoalsList from '@/components/child/goals-list'

export const metadata: Metadata = {
  title: 'My Goals — CoinSprout',
}

export default async function ChildGoalsPage({
  params,
}: {
  params: { childId: string }
}) {
  const { family } = await requireParent()

  const [goals, transactions, familySettings] = await Promise.all([
    getGoalsByChildId(params.childId),
    getTransactionsByChildId(params.childId),
    getFamilySettings(family.id),
  ])

  const savingsBalance = calculateSavingsBalance(transactions)
  const freeToUse      = calculateUnallocatedSavings(savingsBalance, goals)
  const currency       = familySettings?.currency_symbol ?? DEFAULT_CURRENCY

  return (
    <CurrencyProvider symbol={currency}>
      <GoalsList
        childId={params.childId}
        goals={goals.map(toGoalWithProgress)}
        freeToUse={freeToUse}
      />
    </CurrencyProvider>
  )
}
