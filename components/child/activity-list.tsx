'use client'

import { useState, useMemo } from 'react'
import { SOURCE_LABELS, SOURCE_COLORS } from '@/lib/constants/sources'
import MoneyAmount from '@/components/shared/money-amount'
import type { Transaction, TransactionSource } from '@/types/database'
import type { IncomeSource } from '@/lib/constants/sources'

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = 'date' | 'amount' | 'source'
type SortDir = 'asc' | 'desc'

// ─── Source Badge ─────────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: TransactionSource }) {
  const isSpend = source === 'spend'
  const colors  = !isSpend ? SOURCE_COLORS[source as IncomeSource] : null

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

// ─── Row / Header grid ────────────────────────────────────────────────────────

// Columns: Type | Note | Date | Amount
const ROW_GRID = 'grid grid-cols-[6rem_1fr_4rem_4.5rem] items-center gap-3'

function TransactionRow({ tx }: { tx: Transaction }) {
  return (
    <div className={`${ROW_GRID} py-3`}>
      <div className="min-w-0">
        <SourceBadge source={tx.source} />
      </div>

      <span className="truncate text-sm text-gray-600">
        {tx.note || <span className="text-gray-300">—</span>}
      </span>

      <span className="text-xs text-gray-400">
        {new Date(tx.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day:   'numeric',
        })}
      </span>

      <MoneyAmount
        amount={tx.amount}
        size="sm"
        showSign
        className="text-right tabular-nums"
      />
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ActivityList({ transactions }: { transactions: Transaction[] }) {
  const [sortKey,      setSortKey]      = useState<SortKey>('date')
  const [sortDir,      setSortDir]      = useState<SortDir>('desc')
  const [filterSource, setFilterSource] = useState<TransactionSource | 'all'>('all')

  function handleSortClick(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir(key === 'date' ? 'desc' : 'asc')
    }
  }

  const filteredAndSorted = useMemo(() => {
    let list = [...transactions]

    if (filterSource !== 'all') {
      list = list.filter((t) => t.source === filterSource)
    }

    list.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'date')   cmp = a.created_at.localeCompare(b.created_at)
      if (sortKey === 'amount') cmp = a.amount - b.amount
      if (sortKey === 'source') cmp = a.source.localeCompare(b.source)
      return sortDir === 'asc' ? cmp : -cmp
    })

    return list
  }, [transactions, filterSource, sortKey, sortDir])

  if (transactions.length === 0) {
    return (
      <div className="card-surface py-10 text-center text-sm text-gray-400">
        No transactions yet
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Filter dropdown */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-gray-400 font-medium">
          {filteredAndSorted.length} transaction{filteredAndSorted.length !== 1 ? 's' : ''}
        </p>
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value as TransactionSource | 'all')}
          className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-sprout-200"
        >
          <option value="all">All types</option>
          <option value="allowance">Allowance</option>
          <option value="gift">Gift</option>
          <option value="interest">Interest</option>
          <option value="jobs">Jobs</option>
          <option value="spend">Spending</option>
        </select>
      </div>

      {filteredAndSorted.length === 0 ? (
        <div className="card-surface py-10 text-center text-sm text-gray-400">
          No transactions for this filter
        </div>
      ) : (
        <div className="card-surface px-4">
          {/* Sortable column headers */}
          <div className={`${ROW_GRID} border-b border-gray-100 py-2 text-xs font-semibold uppercase tracking-wide`}>
            {(
              [
                { key: 'source', label: 'Type'   },
                { key: null,     label: 'Note'   },
                { key: 'date',   label: 'Date'   },
                { key: 'amount', label: 'Amount' },
              ] as const
            ).map(({ key, label }) =>
              key ? (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleSortClick(key)}
                  className={[
                    'flex items-center gap-0.5 transition-colors',
                    key === 'amount' ? 'justify-end' : '',
                    sortKey === key ? 'text-sprout-600' : 'text-gray-400 hover:text-gray-600',
                  ].join(' ')}
                >
                  {label}
                  {sortKey === key && <span>{sortDir === 'asc' ? ' ↑' : ' ↓'}</span>}
                </button>
              ) : (
                <span key={label} className="text-gray-400">{label}</span>
              )
            )}
          </div>

          <div className="divide-y divide-gray-50">
            {filteredAndSorted.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
