import type { Metadata } from 'next'
import { requireParent } from '@/lib/auth/require-parent'
import { getChildrenByFamilyId } from '@/lib/db/queries/children'
import { getTransactionsByChildId } from '@/lib/db/queries/transactions'
import { calculateSavingsBalance } from '@/lib/calculations/savings'
import ParentDashboard from '@/components/parent/parent-dashboard'

export const metadata: Metadata = {
  title: 'Dashboard — CoinSprout',
}

export default async function DashboardPage() {
  const { family } = await requireParent()
  const children   = await getChildrenByFamilyId(family.id)

  // Fetch each child's transactions in parallel, then compute balances in memory
  const childEntries = await Promise.all(
    children.map(async (child) => {
      const transactions  = await getTransactionsByChildId(child.id)
      const savingsBalance = calculateSavingsBalance(transactions)
      return { child, savingsBalance }
    })
  )

  return <ParentDashboard family={family} childEntries={childEntries} />
}
