'use client'

import { useState, useTransition, useMemo } from 'react'
import { removeTransaction } from '@/actions/transactions'
import SourceBreakdown from '@/components/child/source-breakdown'
import Dialog from '@/components/ui/dialog'
import EditTransactionForm from '@/components/parent/edit-transaction-form'
import { SOURCE_LABELS, SOURCE_COLORS } from '@/lib/constants/sources'
import MoneyAmount from '@/components/shared/money-amount'
import type { Transaction, TransactionSource } from '@/types/database'
import type { SourceBreakdown as SourceBreakdownType } from '@/types/domain'
import type { IncomeSource } from '@/lib/constants/sources'

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

// ─── Sort / Filter controls ───────────────────────────────────────────────────

type SortKey = 'date' | 'amount' | 'source'
type SortDir = 'asc' | 'desc'


// ─── Transaction Row ──────────────────────────────────────────────────────────

// Grid template shared by both the header and every data row.
// Columns: Type | Note | Date | Amount | Actions
const ROW_GRID = 'grid grid-cols-[6rem_1fr_4rem_4.5rem_3.75rem] items-center gap-3'

function TransactionRow({
  tx,
  onEdit,
  onDelete,
  isDeleting,
}: {
  tx:         Transaction
  childId:    string
  onEdit:     (tx: Transaction) => void
  onDelete:   (tx: Transaction) => void
  isDeleting: boolean
}) {
  return (
    <div className={`${ROW_GRID} py-3 transition-opacity ${isDeleting ? 'opacity-40' : ''}`}>
      {/* Type */}
      <div className="min-w-0">
        <SourceBadge source={tx.source} />
      </div>

      {/* Note */}
      <span className="truncate text-sm text-gray-600">
        {tx.note || <span className="text-gray-300">—</span>}
      </span>

      {/* Date */}
      <span className="text-xs text-gray-400 text-left">
        {new Date(tx.created_at).toLocaleDateString('en-US', {
          month: 'short',
          day:   'numeric',
        })}
      </span>

      {/* Amount */}
      <MoneyAmount
        amount={tx.amount}
        size="sm"
        showSign
        className="text-right tabular-nums"
      />

      {/* Actions */}
      <div className="flex justify-end gap-1">
        <button
          type="button"
          onClick={() => onEdit(tx)}
          disabled={isDeleting}
          aria-label="Edit transaction"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:pointer-events-none"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onDelete(tx)}
          disabled={isDeleting}
          aria-label="Delete transaction"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors disabled:pointer-events-none"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  transactions: Transaction[]
  breakdown:    SourceBreakdownType
  childId:      string
}

export default function ActivitySection({ transactions, breakdown, childId }: Props) {
  const [activeSource, setActiveSource] = useState<IncomeSource | null>(null)
  const [sortKey,      setSortKey]      = useState<SortKey>('date')
  const [sortDir,      setSortDir]      = useState<SortDir>('desc')
  const [filterSource, setFilterSource] = useState<TransactionSource | 'all'>('all')

  const [editingTx,    setEditingTx]    = useState<Transaction | null>(null)
  const [deletingTx,   setDeletingTx]   = useState<Transaction | null>(null)
  const [deletingId,   setDeletingId]   = useState<string | null>(null)
  const [deleteError,  setDeleteError]  = useState<string | null>(null)

  const [isPending, startTransition] = useTransition()

  // Sync chart segment click → filter
  function handleSegmentClick(key: IncomeSource | null) {
    setActiveSource(key)
    setFilterSource(key ?? 'all')
  }

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

    // Filter
    if (filterSource !== 'all') {
      list = list.filter((t) => t.source === filterSource)
    }

    // Sort
    list.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'date')   cmp = a.created_at.localeCompare(b.created_at)
      if (sortKey === 'amount') cmp = a.amount - b.amount
      if (sortKey === 'source') cmp = a.source.localeCompare(b.source)
      return sortDir === 'asc' ? cmp : -cmp
    })

    return list
  }, [transactions, filterSource, sortKey, sortDir])

  function handleDeleteConfirm() {
    if (!deletingTx) return
    setDeleteError(null)
    setDeletingId(deletingTx.id)
    const fd = new FormData()
    fd.set('transactionId', deletingTx.id)
    fd.set('childId', childId)
    startTransition(async () => {
      const result = await removeTransaction(null, fd)
      if (!result.success) {
        setDeleteError(result.error ?? 'Delete failed')
        setDeletingId(null)
      } else {
        setDeletingTx(null)
        setDeletingId(null)
      }
    })
  }

  return (
    <div className="space-y-4">
      {/* Earnings breakdown chart — clicking segments filters the activity list */}
      <SourceBreakdown
        breakdown={breakdown}
        activeSource={activeSource}
        onSegmentClick={handleSegmentClick}
      />

      {/* Activity section */}
      <section className="space-y-3">

        {/* Title + filter dropdown */}
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Activity{filteredAndSorted.length > 0 && ` (${filteredAndSorted.length})`}
          </h2>

          <select
            value={filterSource}
            onChange={(e) => {
              const v = e.target.value as TransactionSource | 'all'
              setFilterSource(v)
              setActiveSource(v === 'all' ? null : v === 'spend' ? null : v as IncomeSource)
            }}
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
            {filterSource === 'all' ? 'No transactions yet' : 'No transactions for this filter'}
          </div>
        ) : (
          <div className="card-surface px-4">
            {/* Column headers — clickable to sort */}
            <div className={`${ROW_GRID} border-b border-gray-100 py-2 text-xs font-semibold uppercase tracking-wide`}>
              {(
                [
                  { key: 'source', label: 'Type',   className: '' },
                  { key: null,     label: 'Note',   className: '' },
                  { key: 'date',   label: 'Date',   className: '' },
                  { key: 'amount', label: 'Amount', className: 'text-right' },
                ] as const
              ).map(({ key, label, className }) =>
                key ? (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleSortClick(key)}
                    className={[
                      'flex items-center gap-0.5 transition-colors',
                      className,
                      sortKey === key ? 'text-sprout-600' : 'text-gray-400 hover:text-gray-600',
                    ].join(' ')}
                  >
                    {label}
                    {sortKey === key && (
                      <span>{sortDir === 'asc' ? ' ↑' : ' ↓'}</span>
                    )}
                  </button>
                ) : (
                  <span key={label} className={`text-gray-400 ${className}`}>{label}</span>
                )
              )}
              <span />
            </div>

            <div className="divide-y divide-gray-50">
            {filteredAndSorted.map((tx) => (
              <TransactionRow
                key={tx.id}
                tx={tx}
                childId={childId}
                onEdit={setEditingTx}
                onDelete={setDeletingTx}
                isDeleting={deletingId === tx.id}
              />
            ))}
            </div>
          </div>
        )}
      </section>

      {/* Edit dialog */}
      <Dialog
        open={editingTx !== null}
        onClose={() => setEditingTx(null)}
        title="Edit transaction"
      >
        {editingTx && (
          <EditTransactionForm
            transaction={editingTx}
            childId={childId}
            onSuccess={() => setEditingTx(null)}
          />
        )}
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deletingTx !== null}
        onClose={() => { setDeletingTx(null); setDeleteError(null) }}
        title="Delete transaction"
      >
        {deletingTx && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Are you sure you want to delete this transaction?
            </p>
            <div className="rounded-xl bg-gray-50 p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <span className="font-medium">{SOURCE_LABELS[deletingTx.source]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-medium">
                  {deletingTx.amount < 0 ? '-' : '+'}${Math.abs(deletingTx.amount).toFixed(2)}
                </span>
              </div>
              {deletingTx.note && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Note</span>
                  <span className="font-medium truncate max-w-[160px]">{deletingTx.note}</span>
                </div>
              )}
            </div>
            {deleteError && <p className="text-sm text-red-500">{deleteError}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setDeletingTx(null); setDeleteError(null) }}
                className="flex-1 rounded-xl border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isPending}
                className="flex-1 rounded-xl bg-red-500 py-2 text-sm font-semibold text-white hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  )
}
