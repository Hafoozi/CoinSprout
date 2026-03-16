import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

import { requireParent } from '@/lib/auth/require-parent'
import { getTransactionsByChildId } from '@/lib/db/queries/transactions'
import ActivityList from '@/components/child/activity-list'

export const metadata: Metadata = {
  title: 'My Activity — CoinSprout',
}

export default async function ChildActivityPage({
  params,
}: {
  params: { childId: string }
}) {
  await requireParent()

  const transactions = await getTransactionsByChildId(params.childId)

  return (
    <div className="py-4 space-y-4">
      <h1 className="text-xl font-bold text-gray-800">My Activity</h1>
      <ActivityList transactions={transactions} />
    </div>
  )
}
