import MoneyAmount from '@/components/shared/money-amount'
import type { ChildFinancialSummary } from '@/types/domain'

function Stat({
  label,
  amount,
  amountClass,
  sub,
}: {
  label:       string
  amount:      number
  amountClass?: string
  sub?:        string
}) {
  return (
    <div className="flex flex-col gap-1 p-4">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</span>
      <MoneyAmount amount={amount} size="lg" className={amountClass} />
      {sub && <span className="text-xs text-gray-400">{sub}</span>}
    </div>
  )
}

export default function SavingsSummary({ summary }: { summary: ChildFinancialSummary }) {
  return (
    <div className="card-surface overflow-hidden">
      {/* Top row — the two most important numbers */}
      <div className="grid grid-cols-2 divide-x divide-sprout-100 border-b border-sprout-100">
        <Stat
          label="Current Savings"
          amount={summary.savingsBalance}
          amountClass="text-sprout-700"
        />
        <Stat
          label="Total Earned"
          amount={summary.lifetimeEarnings}
          amountClass="text-gray-700"
          sub="all time"
        />
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 divide-x divide-sprout-100">
        <Stat
          label="Total Spent"
          amount={summary.totalSpent}
          amountClass="text-red-400"
        />
        <Stat
          label="In Goals"
          amount={summary.allocatedToGoals}
          amountClass="text-blue-500"
          sub={summary.freeToUse > 0 ? `$${summary.freeToUse.toFixed(2)} free to use` : undefined}
        />
      </div>
    </div>
  )
}
