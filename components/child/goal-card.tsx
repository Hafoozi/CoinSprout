import Progress from '@/components/ui/progress'
import MoneyAmount from '@/components/shared/money-amount'
import type { GoalWithProgress } from '@/types/domain'

export default function GoalCard({ goal }: { goal: GoalWithProgress }) {
  return (
    <div className="card-surface p-4 space-y-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 truncate">{goal.name}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Goal: <MoneyAmount amount={goal.targetPrice} size="sm" className="text-gray-500" />
          </p>
        </div>

        {goal.isComplete ? (
          <span className="shrink-0 rounded-full bg-gold-100 px-2.5 py-0.5 text-xs font-semibold text-gold-700">
            Complete 🎉
          </span>
        ) : (
          <div className="shrink-0 text-right">
            <MoneyAmount amount={goal.allocatedAmount} size="sm" className="text-sprout-700 font-semibold" />
            <p className="text-xs text-gray-400">saved</p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="space-y-1.5">
        <Progress
          value={goal.progressPercent}
          color={goal.isComplete ? 'gold' : 'green'}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{goal.progressPercent.toFixed(0)}% funded</span>
          {!goal.isComplete && (
            <span>
              <MoneyAmount
                amount={goal.targetPrice - goal.allocatedAmount}
                size="sm"
                className="text-gray-400"
              />
              {' '}to go
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
