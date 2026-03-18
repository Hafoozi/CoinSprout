import Link from 'next/link'
import Button from '@/components/ui/button'
import ChildSummaryCard from '@/components/parent/child-summary-card'
import { ROUTES } from '@/lib/constants/routes'
import type { Child, Family, RecurringAllowance } from '@/lib/db/types'

interface ChildEntry {
  child:          Child
  savingsBalance: number
  activeGoals:    number
  allowance:      RecurringAllowance | null
}

interface Props {
  family:       Family
  childEntries: ChildEntry[]
}

export default function ParentDashboard({ family, childEntries }: Props) {
  return (
    <div className="space-y-6 py-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-sprout-800">Parent Dashboard</h1>
        <Link href={ROUTES.PARENT.NEW_CHILD}>
          <Button size="sm">+ Add child</Button>
        </Link>
      </div>

      {/* Children list or empty state */}
      {childEntries.length === 0 ? (
        <div className="card-surface flex flex-col items-center gap-4 py-14 text-center">
          <span className="text-5xl">🌱</span>
          <div>
            <p className="font-semibold text-gray-700">No children yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Add your first child profile to start tracking their savings.
            </p>
          </div>
          <Link href={ROUTES.PARENT.NEW_CHILD}>
            <Button>Add child</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            Children ({childEntries.length})
          </p>
          {childEntries.map(({ child, savingsBalance, activeGoals, allowance }) => (
            <ChildSummaryCard
              key={child.id}
              child={child}
              savingsBalance={savingsBalance}
              activeGoals={activeGoals}
              allowance={allowance}
            />
          ))}
        </div>
      )}

    </div>
  )
}
