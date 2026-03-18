import Link from 'next/link'
import MoneyAmount from '@/components/shared/money-amount'
import { ROUTES } from '@/lib/constants/routes'
import type { Child, RecurringAllowance } from '@/lib/db/types'
import { AVATAR_BG } from '@/lib/constants/avatar-colors'

const AVATAR_EMOJI: Record<string, string> = {
  sprout: '🌱',
  sky:    '🔵',
  gold:   '🌟',
  rose:   '🌸',
  violet: '💜',
  orange: '🍊',
}

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function nextOccurrence(dayOfWeek: number): Date {
  const today    = new Date()
  let daysUntil  = (dayOfWeek - today.getDay() + 7) % 7
  if (daysUntil === 0) daysUntil = 7
  const next = new Date(today)
  next.setDate(today.getDate() + daysUntil)
  return next
}

interface Props {
  child:          Child
  savingsBalance: number
  activeGoals:    number
  allowance:      RecurringAllowance | null
}

export default function ChildSummaryCard({ child, savingsBalance, activeGoals, allowance }: Props) {
  const colorClass = AVATAR_BG[child.avatar_color ?? 'sprout'] ?? AVATAR_BG.sprout
  const emoji      = AVATAR_EMOJI[child.avatar_color ?? 'sprout'] ?? '🌱'

  const nextAllowance = allowance?.is_active
    ? { date: nextOccurrence(allowance.day_of_week), amount: allowance.amount, day: DAY_SHORT[allowance.day_of_week] }
    : null

  return (
    <Link
      href={ROUTES.PARENT.CHILD(child.id)}
      className="card-surface flex items-center gap-4 p-4 hover:bg-sprout-50 transition-colors cursor-pointer"
    >
      {/* Avatar */}
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-2xl ${colorClass}`}>
        {emoji}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-base font-semibold text-gray-800 truncate">{child.name}</p>
        <div className="mt-1 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-gray-400">Savings</span>
            <MoneyAmount amount={savingsBalance} size="sm" className="text-sprout-700 font-semibold" />
          </div>
          {activeGoals > 0 && (
            <span className="text-sm text-blue-500">
              🎯 {activeGoals} goal{activeGoals !== 1 ? 's' : ''}
            </span>
          )}
          {nextAllowance && (
            <span className="text-sm text-gray-400">
              💵 ${nextAllowance.amount.toFixed(2)} on {nextAllowance.day}
            </span>
          )}
        </div>
      </div>

      <span className="text-gray-300 text-lg">›</span>
    </Link>
  )
}
