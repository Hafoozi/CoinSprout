import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { requireParent } from '@/lib/auth/require-parent'
import { getTransactionsByChildId } from '@/lib/db/queries/transactions'
import { getFamilySettings } from '@/lib/db/queries/family-settings'
import { DEFAULT_CURRENCY } from '@/lib/constants/currencies'
import { CurrencyProvider } from '@/components/providers/currency-provider'
import ActivityList from '@/components/child/activity-list'

export const metadata: Metadata = {
  title: 'My Activity — CoinSprout',
}

export default async function ChildActivityPage({
  params,
}: {
  params: { childId: string }
}) {
  const { family } = await requireParent()

  const [transactions, familySettings] = await Promise.all([
    getTransactionsByChildId(params.childId),
    getFamilySettings(family.id),
  ])

  const currency = familySettings?.currency_symbol ?? DEFAULT_CURRENCY

  return (
    <CurrencyProvider symbol={currency}>
      <div className="py-4 space-y-4">
        <h1 className="text-xl font-bold text-gray-800">My Activity</h1>
        <ActivityList transactions={transactions} />
      </div>
    </CurrencyProvider>
  )
}
