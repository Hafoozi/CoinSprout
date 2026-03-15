import Link from 'next/link'
import Button from '@/components/ui/button'
import MoneyAmount from '@/components/shared/money-amount'
import { ROUTES } from '@/lib/constants/routes'
import type { Child } from '@/lib/db/types'

const AVATAR_BG: Record<string, string> = {
  sprout: 'bg-sprout-200 text-sprout-800',
  sky:    'bg-sky-200    text-sky-800',
  gold:   'bg-yellow-200 text-yellow-800',
  rose:   'bg-pink-200   text-pink-800',
  violet: 'bg-violet-200 text-violet-800',
  orange: 'bg-orange-200 text-orange-800',
}

interface Props {
  child:          Child
  savingsBalance: number
}

export default function ChildSummaryCard({ child, savingsBalance }: Props) {
  const colorClass = AVATAR_BG[child.avatar_color ?? 'sprout'] ?? AVATAR_BG.sprout

  return (
    <div className="card-surface flex items-center gap-4 p-4">
      {/* Avatar initial */}
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-bold ${colorClass}`}
      >
        {child.name.charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{child.name}</p>
        <div className="mt-0.5 flex items-center gap-1.5">
          <span className="text-xs text-gray-400">Savings</span>
          <MoneyAmount amount={savingsBalance} size="sm" className="text-sprout-700" />
        </div>
      </div>

      <Link href={ROUTES.PARENT.CHILD(child.id)}>
        <Button variant="secondary" size="sm">
          View
        </Button>
      </Link>
    </div>
  )
}
