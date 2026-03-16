import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { requireParent } from '@/lib/auth/require-parent'
import { getChildById } from '@/lib/db/queries/children'
import { ROUTES } from '@/lib/constants/routes'
import AddMoneyClient from './add-money-client'

export const metadata: Metadata = {
  title: 'Add Money — CoinSprout',
}

export default async function NewTransactionPage({
  searchParams,
}: {
  searchParams: { childId?: string }
}) {
  await requireParent()

  const childId = searchParams.childId
  if (!childId) redirect(ROUTES.PARENT.DASHBOARD)

  const child = await getChildById(childId)
  if (!child) redirect(ROUTES.PARENT.DASHBOARD)

  return (
    <div className="space-y-6 py-6">
      <Link
        href={ROUTES.PARENT.CHILD(childId)}
        className="inline-flex items-center gap-1 text-sm text-sprout-600 hover:text-sprout-800 transition-colors"
      >
        ← {child.name}
      </Link>

      <h1 className="text-xl font-bold text-gray-800">Add Money for {child.name}</h1>

      <div className="card-surface p-5">
        <AddMoneyClient childId={childId} redirectTo={ROUTES.PARENT.CHILD(childId)} />
      </div>
    </div>
  )
}
