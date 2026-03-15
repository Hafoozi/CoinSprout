import { SOURCE_LABELS, SOURCE_COLORS } from '@/lib/constants/sources'
import MoneyAmount from '@/components/shared/money-amount'
import type { Transaction, TransactionSource } from '@/types/database'

function SourceBadge({ source }: { source: TransactionSource }) {
  const isSpend = source === 'spend'
  const colors  = !isSpend ? SOURCE_COLORS[source as keyof typeof SOURCE_COLORS] : null

  return (
    <span
      className={[
        'shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium',
        isSpend
          ? 'border-red-200 bg-red-50 text-red-600'
          : `${colors?.border} ${colors?.bg} ${colors?.text}`,
      ].join(' ')}
    >
      {SOURCE_LABELS[source]}
    </span>
  )
}

function TransactionRow({ tx }: { tx: Transaction }) {
  return (
    <div className="flex items-center gap-3 py-3">
      <SourceBadge source={tx.source} />

      <span className="flex-1 truncate text-sm text-gray-600">
        {tx.note || <span className="text-gray-300">—</span>}
      </span>

      <span className="shrink-0 text-xs text-gray-400">
        {new Date(tx.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day:   'numeric',
        })}
      </span>

      <MoneyAmount
        amount={tx.amount}
        size="sm"
        showSign
        className="shrink-0 w-16 text-right"
      />
    </div>
  )
}

export default function ActivityList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return (
      <div className="card-surface py-10 text-center text-sm text-gray-400">
        No transactions yet
      </div>
    )
  }

  return (
    <div className="card-surface divide-y divide-gray-50 px-4">
      {transactions.map((tx) => (
        <TransactionRow key={tx.id} tx={tx} />
      ))}
    </div>
  )
}
