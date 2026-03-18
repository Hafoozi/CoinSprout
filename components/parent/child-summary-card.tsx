import Link from 'next/link'
import MoneyAmount from '@/components/shared/money-amount'
import { ROUTES } from '@/lib/constants/routes'
import type { Child } from '@/lib/db/types'
import { AVATAR_BG } from '@/lib/constants/avatar-colors'

const AVATAR_EMOJI: Record<string, string> = {
  sprout: '🌱',
  sky:    '🔵',
  gold:   '🌟',
  rose:   '🌸',
  violet: '💜',
  orange: '🍊',
}

interface Props {
  child:          Child
  savingsBalance: number
  activeGoals:    number
}

export default function ChildSummaryCard({ child, savingsBalance, activeGoals }: Props) {
  const colorClass = AVATAR_BG[child.avatar_color ?? 'sprout'] ?? AVATAR_BG.sprout
  const emoji      = AVATAR_EMOJI[child.avatar_color ?? 'sprout'] ?? '🌱'

  return (
    <Link
      href={ROUTES.PARENT.CHILD(child.id)}
      className="card-surface flex items-center gap-4 p-4 hover:bg-sprout-50 transition-colors cursor-pointer"
    >
      {/* Avatar */}
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl ${colorClass}`}
      >
        {emoji}
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">{child.name}</p>
        <div className="mt-0.5 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400">Savings</span>
            <MoneyAmount amount={savingsBalance} size="sm" className="text-sprout-700" />
          </div>
          {activeGoals > 0 && (
            <span className="text-xs text-blue-500">
              🎯 {activeGoals} goal{activeGoals !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <span className="text-gray-300 text-lg">›</span>
    </Link>
  )
}
